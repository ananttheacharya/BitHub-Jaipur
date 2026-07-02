import os
import re
import fitz  # PyMuPDF, fast for reading text
from pathlib import Path

STUDY_MAT_DIR = Path(r"c:\Users\anant\Downloads\BITHUBV2\BitHuB\Study Material")

def extract_info_from_text(text):
    text = text.upper()
    
    # Defaults
    season = "XX"
    year = "XX"
    exam_type = "UNKNOWN"
    
    # Detect Season
    if "SPRING" in text or "SP" in text:
        season = "SP"
    elif "MONSOON" in text or "MO" in text:
        season = "MO"
        
    # Detect Year (e.g. 2022, 2023)
    year_match = re.search(r'20(\d{2})', text)
    if year_match:
        year = year_match.group(1)
        
    # Detect Exam Type
    if "MID" in text:
        exam_type = "MID"
    elif "END" in text:
        exam_type = "END"
        
    return season, year, exam_type

def process_qpa_files():
    for subject_dir in STUDY_MAT_DIR.iterdir():
        if not subject_dir.is_dir():
            continue
            
        qpa_dir = subject_dir / "QPA"
        if not qpa_dir.exists():
            continue
            
        print(f"Processing QPA in {subject_dir.name}...")
        
        for pdf_file in qpa_dir.glob("*.pdf"):
            filename = pdf_file.stem.upper()
            
            # Try to extract from filename first (e.g. END_SP22 or MID_MO19)
            season = "XX"
            year = "XX"
            exam_type = "UNKNOWN"
            
            # Regex for END_SP22, MID_MO23, etc.
            match = re.search(r'(MID|END)_(SP|MO)(\d{2})', filename)
            if match:
                exam_type = match.group(1)
                season = match.group(2)
                year = match.group(3)
            else:
                match2 = re.search(r'(SP|MO)(\d{2}).*(MID|END)', filename)
                if match2:
                    season = match2.group(1)
                    year = match2.group(2)
                    exam_type = match2.group(3)
                else:
                    match3 = re.search(r'(MID|END).*(SP|MO)(\d{2})', filename)
                    if match3:
                        exam_type = match3.group(1)
                        season = match3.group(2)
                        year = match3.group(3)
                        
            # If filename doesn't have it, try reading PDF text
            if season == "XX" or year == "XX" or exam_type == "UNKNOWN":
                try:
                    doc = fitz.open(pdf_file)
                    text = ""
                    for page in doc[:2]: # Check first 2 pages
                        text += page.get_text()
                    
                    s, y, e = extract_info_from_text(text)
                    if season == "XX": season = s
                    if year == "XX": year = y
                    if exam_type == "UNKNOWN": exam_type = e
                    doc.close()
                except Exception as e:
                    print(f"  Could not read text from {pdf_file.name}: {e}")
            
            # Formulate new name
            if season != "XX" and year != "XX" and exam_type != "UNKNOWN":
                new_name = f"{season}-{year}_{exam_type}.pdf"
            else:
                # Fallback if missing some info
                new_name = f"{season}-{year}_{exam_type}_{pdf_file.name}"
                
            new_path = qpa_dir / new_name
            
            # Handle duplicates
            counter = 1
            while new_path.exists() and new_path != pdf_file:
                new_name_dup = new_name.replace(".pdf", f"_{counter}.pdf")
                new_path = qpa_dir / new_name_dup
                counter += 1
                
            if new_path != pdf_file:
                print(f"  Renaming: {pdf_file.name} -> {new_path.name}")
                pdf_file.rename(new_path)

if __name__ == "__main__":
    process_qpa_files()

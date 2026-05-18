import os
import fitz
from docx2pdf import convert
from pathlib import Path

SUBJECT_DIR = Path(r"c:\Users\anant\Downloads\BITHUBV2\BitHuB\Study Material\CS24101")
DOCX_PATH = SUBJECT_DIR / "C PROG NOTES.docx"
PDF_PATH = SUBJECT_DIR / "C_PROG_NOTES_FULL.pdf"

# 1. Convert docx to pdf using MS Word COM
print("Converting DOCX to PDF...")
try:
    convert(str(DOCX_PATH), str(PDF_PATH))
except Exception as e:
    print("Failed to convert DOCX to PDF. Make sure MS Word is installed.", e)
    exit(1)

# 2. Split the PDF
print("Reading PDF to find UNITs...")
doc = fitz.open(str(PDF_PATH))

units = ["UNIT I", "UNIT II", "UNIT III", "UNIT IV", "UNIT V"]
unit_pages = {}

for page_num in range(len(doc)):
    page = doc[page_num]
    text = page.get_text().upper()
    
    for u in units:
        if u not in unit_pages and u in text:
            # Check if it's mostly a heading (e.g. at the top or isolated)
            # A simple heuristic: if it appears, we mark the first occurrence
            unit_pages[u] = page_num

print("Detected Units at pages:", unit_pages)

# Ensure all 5 units are found, if not fallback to equally dividing or warning
sorted_units = sorted(unit_pages.items(), key=lambda x: x[1])
pages_list = [p for _, p in sorted_units]

if len(pages_list) == 0:
    print("Could not find any UNITs in the PDF!")
    exit(1)

pages_list.append(len(doc)) # End of document

# 3. Save each split
for i in range(len(sorted_units)):
    unit_name = sorted_units[i][0] # e.g. UNIT I
    start_page = sorted_units[i][1]
    end_page = pages_list[i+1] - 1
    
    if end_page < start_page:
        end_page = start_page # Edge case
        
    mod_num = i + 1
    mod_dir = SUBJECT_DIR / f"MOD{mod_num}"
    mod_dir.mkdir(exist_ok=True)
    
    output_pdf = mod_dir / f"CS24101_Module_{mod_num}_Notes.pdf"
    
    new_doc = fitz.open()
    new_doc.insert_pdf(doc, from_page=start_page, to_page=end_page)
    new_doc.save(str(output_pdf))
    new_doc.close()
    
    print(f"Saved {unit_name} (pages {start_page}-{end_page}) to {output_pdf.name}")

doc.close()
print("Done!")

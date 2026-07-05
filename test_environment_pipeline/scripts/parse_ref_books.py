import os
import json
import re
import fitz  # PyMuPDF
from pathlib import Path

STUDY_MAT_DIR = Path(r"c:\Users\anant\Downloads\BITHUBV2\BitHuB\Study Material")
OUTPUT_JSON = Path(r"c:\Users\anant\Downloads\BITHUBV2\BitHuB\Backend\reference_books_meta.json")

# Heuristics mapping for the exact books in our workspace for absolute precision
KNOW_BOOKS = {
    "197-advanced-engineering-mathematics KA Stroud.pdf": {
        "title": "Advanced Engineering Mathematics",
        "author": "K.A. Stroud",
        "tags": ["Mathematics", "Engineering Math", "Differential Equations", "Fourier Analysis"]
    },
    "Advanced Engineering Mathematics 9th Edition by ERWIN KREYSZIG.pdf": {
        "title": "Advanced Engineering Mathematics",
        "author": "Erwin Kreyszig",
        "tags": ["Mathematics", "Advanced Calculus", "Linear Algebra", "Complex Analysis"]
    },
    "Complex Variables and Applications.pdf": {
        "title": "Complex Variables and Applications",
        "author": "James Ward Brown & Ruel V. Churchill",
        "tags": ["Complex Variables", "Mathematics", "Analytic Functions", "Integration"]
    },
    "NumericalMethods.pdf": {
        "title": "Numerical Methods for Engineers",
        "author": "Steven C. Chapra & Raymond P. Canale",
        "tags": ["Numerical Methods", "Mathematics", "Root Finding", "Interpolation"]
    },
    "Probability and Statistics for Engineers.pdf": {
        "title": "Probability and Statistics for Engineers & Scientists",
        "author": "Ronald E. Walpole & Raymond H. Myers",
        "tags": ["Probability", "Statistics", "Random Variables", "Distributions"]
    },
    "Concepts of Modern Physics by Arthur Beiser.pdf": {
        "title": "Concepts of Modern Physics",
        "author": "Arthur Beiser",
        "tags": ["Physics", "Modern Physics", "Quantum Theory", "Relativity"]
    },
    "OPTICS A GHATAK.pdf": {
        "title": "Optics",
        "author": "Ajoy Ghatak",
        "tags": ["Physics", "Optics", "Interference", "Diffraction", "Lasers"]
    },
    "emft_sadiku.pdf": {
        "title": "Elements of Electromagnetics",
        "author": "Matthew N.O. Sadiku",
        "tags": ["Physics", "Electromagnetic Theory", "Maxwell Equations", "Vector Calculus"]
    },
    "A Textbook of Electrical Engineering B.L Theraja.pdf": {
        "title": "A Textbook of Electrical Technology",
        "author": "B.L. Theraja & A.K. Theraja",
        "tags": ["Electrical Engineering", "DC Circuits", "AC Circuits", "Magnetic Circuits"]
    },
    "Basics of Electrical Engineering Edward Hughes.pdf": {
        "title": "Electrical and Electronic Technology",
        "author": "Edward Hughes",
        "tags": ["Electrical Engineering", "AC Circuits", "Transformers", "DC Machines"]
    },
    "Hayt Engineering Circuit Analysis 8th txtbk.pdf": {
        "title": "Engineering Circuit Analysis",
        "author": "William H. Hayt, Jack E. Kemmerly & Steven M. Durbin",
        "tags": ["Electrical Engineering", "Circuit Analysis", "Network Theorems", "AC Steady State"]
    },
    "Let us c - Yashwant Kanetkar.pdf": {
        "title": "Let Us C",
        "author": "Yashavant Kanetkar",
        "tags": ["Programming", "C Language", "Control Statements", "Arrays & Pointers"]
    },
    "Programming-with-C-Byron-Gottfried.pdf": {
        "title": "Programming with C (Schaum's Outlines)",
        "author": "Byron S. Gottfried",
        "tags": ["Programming", "C Language", "Functions", "Structures & Unions"]
    },
    "The.C.Programming.Language.2Nd.Ed Prentice.Hall.Brian.W.Kernighan.and.Dennis.M.Ritchie.pdf": {
        "title": "The C Programming Language",
        "author": "Brian W. Kernighan & Dennis M. Ritchie",
        "tags": ["Programming", "C Language", "Standard Library", "Pointers & Arrays"]
    },
    "Biochemistry 5th Edition, Jeremy M. Berg.pdf": {
        "title": "Biochemistry",
        "author": "Jeremy M. Berg, John L. Tymoczko & Lubert Stryer",
        "tags": ["Biology", "Biochemistry", "Metabolism", "Biomolecules"]
    },
    "Lehninger Principles of Biochemistry Fourth Edition.pdf": {
        "title": "Principles of Biochemistry",
        "author": "Albert L. Lehninger, David L. Nelson & Michael M. Cox",
        "tags": ["Biology", "Biochemistry", "Enzymes & Catalysis", "Cell Metabolism"]
    }
}

def parse_pdf_metadata(pdf_path):
    filename = pdf_path.name
    
    # Check if we have pre-mapped high-fidelity information
    if filename in KNOW_BOOKS:
        return KNOW_BOOKS[filename]
        
    # Heuristics using filename text
    title = filename.replace(".pdf", "").replace("_", " ")
    author = "Unknown Author"
    tags = ["Reference Book"]
    
    # Try reading the first 2 pages
    try:
        doc = fitz.open(pdf_path)
        first_pages_text = ""
        for i in range(min(2, len(doc))):
            first_pages_text += doc[i].get_text()
        doc.close()
        
        # Heuristics: Search for "By " or "author" or copyright
        # Let's clean the text lines
        lines = [line.strip() for line in first_pages_text.split("\n") if line.strip()]
        
        # Common patterns for authors
        # "by [Author Name]"
        for line in lines[:30]:
            match = re.search(r'\b(?:by|author|written by)\b\s+([A-Z][a-zA-Z.\s]{3,30})', line, re.IGNORECASE)
            if match:
                author = match.group(1).strip()
                break
                
    except Exception as e:
        print(f"Error reading PDF {filename}: {e}")
        
    return {
        "title": title,
        "author": author,
        "tags": tags
    }

def build_metadata():
    metadata = {}
    print("Building reference books metadata...")
    
    for subject_dir in STUDY_MAT_DIR.iterdir():
        if not subject_dir.is_dir():
            continue
            
        subject_code = subject_dir.name
        metadata[subject_code] = {}
        
        # Traverse subject root for PDFs (excluding syllabus)
        for pdf_file in subject_dir.glob("*.pdf"):
            if "syllabus" in pdf_file.name.lower():
                continue
                
            info = parse_pdf_metadata(pdf_file)
            metadata[subject_code][pdf_file.name] = info
            print(f"  [{subject_code}] Parsed: {pdf_file.name} -> Title: {info['title']}, Author: {info['author']}")
            
    # Save to JSON
    with open(OUTPUT_JSON, "w", encoding="utf-8") as f:
        json.dump(metadata, f, indent=4, ensure_ascii=False)
        
    print(f"Metadata built successfully at {OUTPUT_JSON}")

if __name__ == "__main__":
    build_metadata()

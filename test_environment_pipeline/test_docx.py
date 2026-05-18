from docx import Document

doc = Document(r"c:\Users\anant\Downloads\BITHUBV2\BitHuB\Study Material\CS24101\C PROG NOTES.docx")

for i, p in enumerate(doc.paragraphs[:20]):
    print(f"{i}: {p.text.strip()}")

import json
import re
import sys
import hashlib
from pathlib import Path

BASE_DIR = Path(__file__).parent
RAW_DIR = BASE_DIR / "raw_questions"

# ------------------------------------------------------------------
# TAG TAXONOMY (Sync with normalization.py)
# ------------------------------------------------------------------
TAG_RULES = [
    # Mathematics 2
    (["fourier"],                                            "Fourier Series"),
    (["legendre", "p_n"],                                   "Legendre Polynomials"),
    (["bessel", "j_", "j'"],                                "Bessel Functions"),
    (["wave equation", "vibration of a string"],            "Wave Equation"),
    (["probability", "binomial", "poisson",
      "random variable", "pdf"],                            "Probability"),
    (["wronskian"],                                         "Wronskian"),
    (["harmonic", "analytic", "contour", "\\oint", "dz"],   "Complex Analysis"),
    (["differential equation", "y''", "d^2y",
      "dy/dx", "complementary function",
      "particular integral"],                               "Differential Equations"),
    (["variation of parameter"],                            "Variation of Parameters"),
    # Physics
    (["interference", "thin film", "path difference"],      "Interference"),
    (["newton's ring", "newton rings"],                     "Newton's Rings"),
    (["diffraction", "fraunhofer", "fringe"],               "Diffraction"),
    (["wedge", "wedge film"],                               "Wedge Film"),
    (["gauss", "maxwell", "ampere", "faraday"],             "Maxwell's Equations"),
    (["electrostatic", "electric field",
      "potential", "coulomb"],                              "Electrostatics"),
    (["boundary condition", "dielectric"],                  "Boundary Conditions"),
    (["lorentz", "special theory of relativity",
      "postulate", "inertial frame"],                       "Special Theory of Relativity"),
    (["compton", "x-ray scatter"],                          "Compton Effect"),
    (["schrödinger", "schrodinger", "wave function",
      "time independent"],                                  "Schrödinger Equation"),
    (["particle in a box", "infinite potential well",
      "energy level"],                                      "Particle in a Box"),
    (["quantum", "de broglie", "uncertainty"],              "Quantum Mechanics"),
    (["velocity addition", "time dilation", "length contraction",
      "invariant", "invariance"],                           "Relativistic Mechanics"),
    # Chemistry
    (["thermodynamics", "enthalpy", "entropy", "gibbs"],    "Thermodynamics"),
    (["chemical equilibrium", "le chatelier"],              "Chemical Equilibrium"),
    (["electrochemical", "electrode", "nernst"],            "Electrochemistry"),
    # ECE / EEE
    (["transistor", "mosfet", "bjt", "amplifier"],          "Semiconductor Devices"),
    (["circuit", "kirchhoff", "thevenin", "norton"],        "Circuit Analysis"),
    (["diode", "rectifier", "zener"],                       "Diodes"),
    # Environmental Sciences
    (["pollution", "effluent", "wastewater"],               "Pollution Control"),
    (["ecosystem", "biodiversity"],                         "Ecology"),
    # CS / PPS
    (["algorithm", "sorting", "searching", "complexity"],   "Algorithms"),
    (["array", "pointer", "function", "recursion"],         "Programming Concepts"),
    # Mechanical
    (["stress", "strain", "bending", "torsion"],            "Strength of Materials"),
    (["thermodynamic", "carnot", "heat engine"],            "Engineering Thermodynamics"),
]

def generate_tags(question_text: str, question_latex: str) -> list[str]:
    tags = set()
    combined = (str(question_text) + " " + str(question_latex)).lower()
    for keywords, tag in TAG_RULES:
        if any(kw in combined for kw in keywords):
            tags.add(tag)
    return sorted(tags)

def generate_uid(subject_code: str, question_text: str) -> str:
    key = f"{subject_code}::{question_text.lower().strip()}"
    key = re.sub(r"\s+", " ", key)
    return hashlib.sha256(key.encode("utf-8")).hexdigest()

def load_json_safely(filepath: Path):
    if not filepath.exists():
        return None
    
    content = filepath.read_text(encoding="utf-8").strip()
    if not content:
        print(f"[ERROR] File is empty: {filepath.name}")
        return None

    try:
        return json.loads(content)
    except json.JSONDecodeError:
        try:
            # Attempt to fix unescaped single backslashes (common OCR artefact)
            fixed_content = content.replace("\\", "\\\\")
            return json.loads(fixed_content)
        except json.JSONDecodeError as e:
            print(f"[ERROR] Failed to parse JSON in {filepath.name}: {e}")
            return None

def main():
    print("=" * 55)
    print("BitHub V2 — Raw Question Refactor (Modules & Tags)")
    print("=" * 55)

    subject_name = input("\nWhich file to be named for modules? (e.g. EC24101): ").strip()
    if not subject_name:
        print("[ERROR] Subject name cannot be empty.")
        return

    target_file = RAW_DIR / f"{subject_name}.json"
    mn_file = RAW_DIR / f"{subject_name}_MN.json"

    if not target_file.exists():
        print(f"[ERROR] Target file not found: {target_file}")
        return
    if not mn_file.exists():
        print(f"[ERROR] Mapping file not found: {mn_file}")
        return

    print(f"\n  Loading target: {target_file.name}")
    target_questions = load_json_safely(target_file)
    if target_questions is None:
        return

    print(f"  Loading mapping: {mn_file.name}")
    mn_questions = load_json_safely(mn_file)
    if mn_questions is None:
        return

    # Build mapping UID -> module_number
    uid_to_module = {}
    for q in mn_questions:
        uid = q.get("question_uid")
        mod = q.get("module_number")
        if uid and mod is not None:
            uid_to_module[uid] = mod

    print(f"\n  Found {len(uid_to_module)} module mappings.")

    # Refactor
    updated_count = 0
    tag_updated_count = 0
    
    for q in target_questions:
        uid = q.get("question_uid")
        
        # 1. Update Module Number
        if uid in uid_to_module:
            if q.get("module_number") != uid_to_module[uid]:
                q["module_number"] = uid_to_module[uid]
                updated_count += 1
        
        # 2. Update Tags
        existing_tags = q.get("tags") or []
        auto_tags = generate_tags(q.get("question_text", ""), q.get("question_latex", ""))
        merged_tags = sorted(set(existing_tags) | set(auto_tags))
        
        if merged_tags != existing_tags:
            q["tags"] = merged_tags
            tag_updated_count += 1

    # Save
    with open(target_file, "w", encoding="utf-8") as f:
        json.dump(target_questions, f, indent=4, ensure_ascii=False)

    print(f"\n  [OK] Updated module_number for {updated_count} questions.")
    print(f"  [OK] Updated tags for {tag_updated_count} questions.")
    print(f"  [OK] Refactored file saved to {target_file}\n")

if __name__ == "__main__":
    main()

"""
BitHub V2 — db_cleanup_derivations.py
Removes duplicate derivation questions that were accidentally ingested
from the main subject files (e.g. EC24101_normalized.json) when they
already existed in the derivation files (e.g. EC24101_Derivations_normalized.json).

Logic:
  For each affected subject, compare the main normalized file against
  the derivation normalized file. A question is considered a duplicate
  if it shares the same (question_number, source_exam, source_year) AND
  the question text is similar enough (substring match or high overlap).
  The duplicate's question_uid (from the main file) is used to build
  DELETE statements.

  Generates a .sql file and optionally executes it via SSH → sudo mysql,
  mirroring the db_ingest.py workflow.
"""

import json
import re
import time
import os
import sys
from pathlib import Path
import paramiko
from dotenv import load_dotenv

# ------------------------------------------------------------------
# CONFIGURATION
# ------------------------------------------------------------------
BASE_DIR    = Path(__file__).parent
NORM_DIR    = BASE_DIR / "normalized_questions"

load_dotenv(BASE_DIR.parent / ".env")
SSH_HOST        = os.getenv("DB_SSH_HOST")
SSH_USER        = os.getenv("DB_SSH_USER")
SSH_PASS        = os.getenv("DB_SSH_PASS")
DB_NAME         = os.getenv("DB_NAME", "questions")
REMOTE_SQL_PATH = "/tmp/bithub_cleanup.sql"

if not all([SSH_HOST, SSH_USER, SSH_PASS]):
    raise ValueError(
        "Missing required environment variables. "
        "Check your .env file (see .env.example)."
    )

# Subjects affected by the accidental double-copy
AFFECTED_SUBJECTS = ["ME24101", "CH24101", "EC24101"]

# ------------------------------------------------------------------
# SQL HELPERS
# ------------------------------------------------------------------

def esc(val) -> str:
    """Escape a Python value to a MySQL string literal or NULL."""
    if val is None:
        return "NULL"
    s = str(val)
    s = s.replace("\\", "\\\\")
    s = s.replace("'",  "\\'")
    s = s.replace("\0", "\\0")
    s = s.replace("\n", "\\n")
    s = s.replace("\r", "\\r")
    return f"'{s}'"


def shell_send(shell, cmd: str, wait: float = 1.5) -> str:
    shell.send(cmd + "\n")
    time.sleep(wait)
    out = ""
    while shell.recv_ready():
        out += shell.recv(65536).decode("utf-8", errors="replace")
    return out


def load_json_safely(filepath: Path):
    if not filepath.exists():
        return None
    content = filepath.read_text(encoding="utf-8").strip()
    if not content:
        return None
    try:
        return json.loads(content)
    except json.JSONDecodeError:
        try:
            fixed = content.replace("\\", "\\\\")
            return json.loads(fixed)
        except json.JSONDecodeError:
            return None

# ------------------------------------------------------------------
# TEXT SIMILARITY
# ------------------------------------------------------------------

def normalize_for_compare(text: str) -> str:
    """Reduce text to lowercase alpha-numeric for fuzzy matching."""
    if not text:
        return ""
    text = text.lower().strip()
    text = re.sub(r"[^a-z0-9 ]", "", text)
    text = re.sub(r"\s+", " ", text)
    return text


def texts_match(main_text: str, deriv_text: str) -> bool:
    """
    Check if the derivation question text substantially overlaps with
    the main question text (the main file often has a longer version
    that includes the derivation's core question).
    """
    norm_main = normalize_for_compare(main_text)
    norm_deriv = normalize_for_compare(deriv_text)

    if not norm_main or not norm_deriv:
        return False

    # Exact match
    if norm_main == norm_deriv:
        return True

    # One contains the other
    if norm_deriv in norm_main or norm_main in norm_deriv:
        return True

    # Word-set overlap: if 60%+ of derivation words are in the main text
    deriv_words = set(norm_deriv.split())
    main_words = set(norm_main.split())
    if len(deriv_words) > 0:
        overlap = len(deriv_words & main_words) / len(deriv_words)
        if overlap >= 0.7:
            return True

    return False

# ------------------------------------------------------------------
# FIND DUPLICATES
# ------------------------------------------------------------------

def find_duplicate_uids(subject_code: str) -> list[dict]:
    """
    Compare the main normalized file against the derivation normalized
    file for a subject. Returns a list of dicts with info about each
    duplicate found in the main file.
    """
    # Find main normalized file
    main_path = NORM_DIR / f"{subject_code}_normalized.json"
    if not main_path.exists():
        print(f"  [SKIP] Main file not found: {main_path.name}")
        return []

    # Find derivation normalized file (handle both _Derivations and _Derivation)
    deriv_path = None
    for suffix in ["_Derivations_normalized.json", "_Derivation_normalized.json"]:
        candidate = NORM_DIR / f"{subject_code}{suffix}"
        if candidate.exists():
            deriv_path = candidate
            break

    if deriv_path is None:
        print(f"  [SKIP] No derivation file found for {subject_code}")
        return []

    main_questions = load_json_safely(main_path)
    deriv_questions = load_json_safely(deriv_path)

    if not main_questions or not deriv_questions:
        print(f"  [SKIP] Could not load JSON for {subject_code}")
        return []

    print(f"  Main file      : {main_path.name} ({len(main_questions)} questions)")
    print(f"  Derivation file: {deriv_path.name} ({len(deriv_questions)} questions)")

    # Build lookup from derivation file: (qnum, exam, year) -> list of question texts
    deriv_lookup: dict[tuple, list[str]] = {}
    for dq in deriv_questions:
        key = (
            dq.get("question_number", "").strip(),
            dq.get("source_exam", "").strip(),
            str(dq.get("source_year", "")).strip(),
        )
        deriv_lookup.setdefault(key, []).append(dq.get("question_text", ""))

    # Find matches in main file
    duplicates = []
    for mq in main_questions:
        key = (
            mq.get("question_number", "").strip(),
            mq.get("source_exam", "").strip(),
            str(mq.get("source_year", "")).strip(),
        )
        if key not in deriv_lookup:
            continue

        # Check if any derivation question text matches this main question
        main_text = mq.get("question_text", "")
        for deriv_text in deriv_lookup[key]:
            if texts_match(main_text, deriv_text):
                duplicates.append({
                    "question_uid": mq.get("question_uid"),
                    "question_number": mq.get("question_number"),
                    "source_exam": mq.get("source_exam"),
                    "source_year": mq.get("source_year"),
                    "question_text": main_text[:80],
                    "subject_code": subject_code,
                })
                break  # Don't double-count

    return duplicates

# ------------------------------------------------------------------
# MAIN
# ------------------------------------------------------------------

def main():
    print("=" * 60)
    print("BitHub V2 — Derivation Duplicate Cleanup")
    print("=" * 60)

    all_duplicates = []

    for code in AFFECTED_SUBJECTS:
        print(f"\n--- {code} ---")
        dupes = find_duplicate_uids(code)
        if dupes:
            print(f"  Found {len(dupes)} duplicate(s):")
            for d in dupes:
                print(f"    • {d['question_number']} | {d['source_exam']} {d['source_year']} | {d['question_text']}...")
            all_duplicates.extend(dupes)
        else:
            print("  No duplicates found.")

    if not all_duplicates:
        print("\n  No duplicates to remove. Exiting.")
        return

    print(f"\n{'=' * 60}")
    print(f"  Total duplicates to remove: {len(all_duplicates)}")
    print(f"{'=' * 60}")

    # --- Build SQL ---
    sql_path = BASE_DIR / "cleanup_derivation_duplicates.sql"
    lines = [
        "-- BitHub V2 — Derivation Duplicate Cleanup",
        "-- Auto-generated by db_cleanup_derivations.py",
        f"-- Removing {len(all_duplicates)} accidental duplicate(s)",
        "",
    ]

    for d in all_duplicates:
        uid = d["question_uid"]
        lines.append(
            f"DELETE FROM questions WHERE question_uid = {esc(uid)}; "
            f"-- {d['subject_code']} {d['question_number']} "
            f"{d['source_exam']} {d['source_year']}"
        )

    lines.append("")
    sql_path.write_text("\n".join(lines), encoding="utf-8")
    size_kb = sql_path.stat().st_size / 1024
    print(f"\n  ✓ SQL file: {sql_path.name} ({size_kb:.1f} KB, {len(all_duplicates)} deletes)")

    # --- Confirm execution ---
    print("\n  Review the SQL file before executing.")
    confirm = input("  Execute on the database now? (yes/no): ").strip().lower()
    if confirm != "yes":
        print("  Aborted. SQL file saved for manual review.")
        return

    # --- SSH connection ---
    print(f"\n  SSH → {SSH_HOST} ...")
    ssh = paramiko.SSHClient()
    ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    ssh.connect(SSH_HOST, username=SSH_USER, password=SSH_PASS, timeout=15)
    print("  Connected.\n")

    # Upload SQL
    print(f"  Uploading SQL to {REMOTE_SQL_PATH} ...")
    sftp = ssh.open_sftp()
    sftp.put(str(sql_path), REMOTE_SQL_PATH)
    sftp.close()
    print("  Uploaded.\n")

    # Interactive shell
    shell = ssh.invoke_shell()
    time.sleep(1)
    shell.recv(65536)

    print("  Entering sudo mysql session ...")
    shell_send(shell, f"sudo mysql {DB_NAME}", wait=1.5)
    shell_send(shell, SSH_PASS, wait=3)

    # Verify mysql> prompt
    probe = shell_send(shell, "", wait=1)
    if "mysql>" not in probe:
        print(f"  [ERROR] Could not reach mysql> prompt. Output:\n{probe}")
        ssh.close()
        sys.exit(1)

    print("  mysql shell active.\n")

    # --- Count before ---
    for code in AFFECTED_SUBJECTS:
        out = shell_send(
            shell,
            f"SELECT COUNT(*) AS total FROM questions WHERE subject_code='{code}';",
            wait=2,
        )
        clean = "\n".join(
            l for l in out.splitlines()
            if l.strip() and "password" not in l.lower()
        )
        if clean.strip():
            print(f"  [BEFORE] {code}:")
            print(clean)

    # --- Execute DELETEs ---
    print("\n  Sourcing DELETE statements ...")
    out = shell_send(shell, f"source {REMOTE_SQL_PATH};", wait=15)
    out_lines = [l for l in out.splitlines() if l.strip() and "password" not in l.lower()]
    print("\n".join(out_lines[-20:]) if out_lines else "  (silent)")

    # --- Count after ---
    print("\n  Validating ...")
    for code in AFFECTED_SUBJECTS:
        out = shell_send(
            shell,
            f"SELECT COUNT(*) AS total FROM questions WHERE subject_code='{code}';",
            wait=2,
        )
        clean = "\n".join(
            l for l in out.splitlines()
            if l.strip() and "password" not in l.lower()
        )
        if clean.strip():
            print(f"  [AFTER] {code}:")
            print(clean)

    # --- Cleanup ---
    shell_send(shell, "exit;", wait=1)
    shell_send(shell, f"rm -f {REMOTE_SQL_PATH}", wait=1)
    shell.close()
    ssh.close()

    print(f"\n  ✓ Cleanup complete. Removed {len(all_duplicates)} duplicate(s).")
    print("  Done.\n")


if __name__ == "__main__":
    main()

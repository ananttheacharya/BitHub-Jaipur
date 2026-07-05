# Test Environment Pipeline (formerly MA24103)

This directory contains the full, universal data pipeline for importing and processing course materials in BitHub V2. Used originally as a testbed for the **MA24103 (Mathematics 2)** course, it has been updated to be subject-agnostic.

## What's in here

| File / Folder | Purpose |
|---|---|
| `normalization.py` | Cleans raw OCR-scanned JSON, enforces LaTeX formatting, generates semantic tags |
| `answer_generator.py` | Main script to generate step-by-step solutions for questions (replaces `solution_generator.py`) |
| `db_ingest.py` | Ingests normalized questions + solutions into the MySQL database via SSH |
| `db_cleanup_derivations.py` | Removes accidental derivation duplicates from the database |
| `refactor_modules.py` | Maps module numbers from mapping files to raw question data |
| `raw_questions/` | Contains unprocessed OCR-scanned JSON data and module mapping files |
| `normalized_questions/` | Contains cleaned, structured JSON data ready for ingestion |
| `answers/` | Contains generated solutions, failed generation logs, and malformed data logs |
| `ingest_logs/` | History of generated SQL statements used for database ingestion |
| `backups_and_prototypes/` | Legacy test files and UI prototypes |
| `.env.example` | Template for required environment variables |

## Setup

```bash
pip install google-generativeai python-dotenv tqdm paramiko
cp .env.example .env
# Fill in your values in .env
```

## Running the pipeline

```bash
# Step 1: Normalize the raw JSON
python normalization.py

# Step 2: Generate solutions via Gemini API
python solution_generator.py

# Step 3: Ingest into the database
python db_ingest.py
```

## Database Method

MySQL on the server uses `auth_socket` (no TCP password). The ingestion script works by:
1. Building a complete SQL file locally
2. Uploading it via SFTP to `/tmp/` on the server
3. Opening an interactive PTY shell via `paramiko.invoke_shell()`
4. Running `sudo mysql <dbname>` and sending the password to the PTY stdin
5. Using MySQL's `source /tmp/file.sql` command to execute all statements

See the walkthrough documentation for full details on what was tried and why this method works.

## Environment Variables

All credentials must be set in a `.env` file (see `.env.example`). **Never commit `.env` to git.**

```
GEMINI_API_KEY=...
DB_SSH_HOST=...
DB_SSH_USER=...
DB_SSH_PASS=...
DB_NAME=questions
```

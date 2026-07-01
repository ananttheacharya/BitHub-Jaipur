# BitHub V2 - Agent Architecture & Guide

This document serves as the primary system architecture guide and instruction manual for agents working on the **BitHub V2** codebase. It outlines the structure, design system, and key scripts needed to maintain and extend the application.

---

## 1. Directory Structure & Key Sections
The BitHub V2 repository consists of four primary domains:

1. **`Front-End New/`**: The main user-facing React application. Built with Vite.
2. **`test_environment_pipeline/`**: The universal Python data pipeline for processing course materials, interacting with the LLM for solutions, and ingesting data to the production database.
3. **`Admin-Dashboard/`**: The backend React application used by administrators to manage content.
4. **`Study Material/`**: A static directory containing all PDFs, zip files, and images served by the frontend.

---

## 2. Front-End New (The UI System)

### 2.1 State-Based Routing (`App.jsx`)
The frontend does not use a standard URL router (like react-router). Instead, navigation is handled via state in `App.jsx` using the `view` variable:
- **`landing`**: Renders the campus selection screen (`CampusCard`).
- **`subject-selector`**: Renders the `SubjectSelector` component, displaying courses grouped by semester.
- **`subject-dashboard`**: Renders the detailed view for a selected subject. It conditionally renders `LabDashboard` if the code starts with `"LAB-"`, otherwise it renders `JaipurDashboard`.

### 2.2 Theming & Dark Mode
- **Mechanism**: The theme is strictly controlled by a `data-theme` attribute applied to the `<html>` tag (`document.documentElement`).
- **CSS Variables**: All colors must use predefined CSS variables located in `index.css`. 
  - *Light Mode*: Default variable declarations at the top of `:root`.
  - *Dark Mode*: Overridden under `[data-theme="dark"]`.
- **Key Variables to Use**: 
  - Backgrounds: `var(--dash-bg)`, `var(--dash-panel-bg)`, `var(--dash-active-module-bg)`
  - Text: `var(--dash-text-color)`, `var(--dash-text-muted)`
  - Borders: `var(--dash-panel-border)`

### 2.3 Core UI Components & Design Rules
Agents must adhere to the established design system. **Do not use Tailwind or inline random hex colors.**

- **`.subject-selection-btn`**: The universal button class used for course cards, file links, and lab options. It automatically handles padding, borders, hover animations (lifting and border coloring), and dark mode transitions. 
  - *Agent Rule*: When creating a new list of clickable items, wrap them in this button class. Use a flex row inside (`display: 'flex', alignItems: 'center', gap: '1.2rem'`) to align the icon on the left and the text (`.btn-primary-title`) on the right.
- **Typography**: 
  - `var(--font-display)` (Advercase): Used **only** for massive page titles (e.g., "Labs", "Mathematics 2").
  - `var(--font-body)`: Used for standard UI elements, cards, and buttons.
- **Modals (Pop-ups)**: 
  - *Overlay*: Use `.lab-modal-overlay` with `background-color: rgba(0,0,0,0.5)` and `backdrop-filter: blur(4px)`.
  - *Content*: Use `.lab-modal-content` with a solid background (`var(--dash-panel-bg)`). Never make the inner content container transparent or blurred.
- **Aesthetics**: The app relies heavily on SVG illustrations (like the hills at the top of dashboards) and glowing background radial gradients (`.glow-bg`) for a premium feel. Reuse existing `.math-logo-box` and `.circle-pink` wrappers for icons.

### 2.4 Important Files
- `src/App.jsx`: Entry point, global state, theming, and routing.
- `src/index.css`: The source of truth for the design system.
- `src/components/JaipurDashboard.jsx`: The standard template for rendering course materials (Notes, PYQs, Syllabus).
- `src/components/LabDashboard.jsx`: The specialized template for lab materials and visual layouts.

---

## 3. Test Environment Pipeline

This directory contains scripts that process OCR data, generate AI solutions, and upload them to the remote database via SSH.

### 3.1 Script Breakdown
- **`normalization.py`**: The first step. Cleans raw OCR-scanned JSON files, enforces LaTeX math formatting, and generates semantic tags.
- **`answer_generator.py`**: The second step. Uses the Gemini API to read normalized questions and generate detailed, step-by-step solutions. (This replaced the older `solution_generator.py`).
- **`db_ingest.py`**: The final step. Reads the generated solutions and questions, builds a complete SQL payload locally, uploads it to the remote server (`/tmp/`) via SFTP, and executes it interactively via a PTY shell using `paramiko`.
- **`db_cleanup_derivations.py`**: A utility script to remove accidental derivation duplicates from the MySQL database.
- **`refactor_modules.py`**: Maps module numbers from external mapping files directly into the raw question data JSON.

### 3.2 Agent Workflow for Pipeline
When asked to process new subjects:
1. Ensure `.env` is populated with `GEMINI_API_KEY` and `DB_SSH_*` credentials.
2. Place raw JSON in `raw_questions/`.
3. Run `normalization.py` -> `answer_generator.py` -> `db_ingest.py`.

---

## 4. Admin Dashboard
A separate Vite/React application meant for managing backend database content. 
- It has its own `package.json` and runs independently of the Front-End New.
- Code resides in `src/`.
- Styling is independent but visually related to the main frontend.

---

## 5. General Agent Instructions

1. **Tool Usage**: Always use the most specific tool for the task. Use `view_file` to read, `grep_search` to find text, and `replace_file_content` / `multi_replace_file_content` to edit. 
2. **Bash Restrictions**: NEVER use `cat` inside a bash command to create or append to files. Use the native `write_to_file` tool. DO NOT use `sed` or `grep` inside `run_command` if native tools exist.
3. **Check Your Layouts**: When adding new buttons with icons, always verify that flex directions don't accidentally stack the icon and text vertically. `.btn-content-left` has a column layout, so place icons *outside* of it.
4. **Maintain Consistency**: If you aren't sure what a component should look like, look at `JaipurDashboard.jsx` or `SubjectSelector.jsx` and copy the class structures exactly. Do not invent new UI patterns unless explicitly requested.

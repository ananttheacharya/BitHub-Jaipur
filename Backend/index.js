const express = require('express');
const cors = require('cors');
const fs = require('fs/promises');
const path = require('path');
const { queryDB } = require('./db');

const app = express();
app.use(cors());
app.use(express.json());

const STUDY_MATERIAL_DIR = path.resolve(__dirname, '../Study Material');
app.use('/study-material', express.static(STUDY_MATERIAL_DIR));

// API 1: Get list of subjects
app.get('/api/subjects', async (req, res) => {
    try {
        const items = await fs.readdir(STUDY_MATERIAL_DIR, { withFileTypes: true });
        const subjects = items.filter(item => item.isDirectory()).map(item => item.name);
        res.json({ subjects });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// API 2: Get materials for a specific subject
app.get('/api/subjects/:code/materials', async (req, res) => {
    const { code } = req.params;
    const subjectDir = path.join(STUDY_MATERIAL_DIR, code);

    try {
        // Check if subject exists
        await fs.access(subjectDir);
        
        // Load reference books metadata
        let booksMeta = {};
        try {
            const metaData = await fs.readFile(path.join(__dirname, 'reference_books_meta.json'), 'utf8');
            booksMeta = JSON.parse(metaData);
        } catch (e) {
            console.error("Could not load reference_books_meta.json:", e.message);
        }
        
        const structure = {
            code,
            syllabus: null,
            notes: {},
            referenceBooks: [],
            qpa: []
        };

        const items = await fs.readdir(subjectDir, { withFileTypes: true });

        for (const item of items) {
            const ext = path.extname(item.name).toLowerCase();
            const lowerName = item.name.toLowerCase();

            if (item.isFile()) {
                if (lowerName.includes('syllabus') && ext === '.pdf') {
                    structure.syllabus = item.name;
                } else if (ext === '.pdf') {
                    // Get metadata for the reference book if it exists
                    const subjectMeta = booksMeta[code] || {};
                    const bookInfo = subjectMeta[item.name] || {
                        title: item.name.replace('.pdf', '').replace(/_/g, ' '),
                        author: "Unknown Author",
                        tags: ["Reference Book"]
                    };
                    structure.referenceBooks.push({
                        filename: item.name,
                        title: bookInfo.title,
                        author: bookInfo.author,
                        tags: bookInfo.tags || ["Reference Book"]
                    });
                }
            } else if (item.isDirectory()) {
                if (lowerName.startsWith('mod')) {
                    // Module notes
                    const modDir = path.join(subjectDir, item.name);
                    const modFiles = await fs.readdir(modDir);
                    const pdfs = modFiles.filter(f => f.toLowerCase().endsWith('.pdf'));
                    structure.notes[item.name] = pdfs;
                } else if (lowerName === 'qpa') {
                    // QPA folder
                    const qpaDir = path.join(subjectDir, item.name);
                    const qpaFiles = await fs.readdir(qpaDir);
                    structure.qpa = qpaFiles.filter(f => f.toLowerCase().endsWith('.pdf'));
                }
            }
        }

        res.json(structure);
    } catch (err) {
        res.status(404).json({ error: 'Subject not found or error reading directory' });
    }
});

// Practice Mode Config
app.get('/api/practice/config', async (req, res) => {
    try {
        const sql = `SELECT JSON_OBJECT(
            'subjects', (SELECT JSON_ARRAYAGG(sub) FROM (SELECT DISTINCT subject_code AS sub FROM questions WHERE subject_code IS NOT NULL) t1),
            'modules', (SELECT JSON_ARRAYAGG(mo) FROM (SELECT DISTINCT module AS mo FROM questions WHERE module IS NOT NULL) t2),
            'years', (SELECT JSON_ARRAYAGG(yr) FROM (SELECT DISTINCT year AS yr FROM questions WHERE year IS NOT NULL) t3),
            'difficulties', (SELECT JSON_ARRAYAGG(diff) FROM (SELECT DISTINCT difficulty AS diff FROM questions WHERE difficulty IS NOT NULL) t4)
        );`;
        const result = await queryDB(sql);
        res.json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Practice Mode Questions
app.get('/api/practice/questions', async (req, res) => {
    try {
        const { subject, module, year, difficulty, marks } = req.query;
        let whereClauses = [];
        if (subject) whereClauses.push(`subject_code = '${subject}'`);
        if (module) whereClauses.push(`module = '${module}'`);
        
        if (year) {
            const yearsList = year.split(',').map(y => `'${y.trim()}'`).join(',');
            if (yearsList) whereClauses.push(`year IN (${yearsList})`);
        }
        if (difficulty) {
            const diffsList = difficulty.split(',').map(d => `'${d.trim().toLowerCase()}'`).join(',');
            if (diffsList) whereClauses.push(`difficulty IN (${diffsList})`);
        }
        if (marks) {
            const marksList = marks.split(',').map(m => parseInt(m.trim())).filter(Number).join(',');
            if (marksList) whereClauses.push(`marks IN (${marksList})`);
        }

        const where = whereClauses.length > 0 ? 'WHERE ' + whereClauses.join(' AND ') : '';
        
        // We do not send solution text/latex to prevent cheating on frontend
        const sql = `SELECT JSON_ARRAYAGG(JSON_OBJECT(
            'uid', question_uid,
            'exam', exam,
            'year', year,
            'module', module,
            'question_number', question_number,
            'question_text', question_text,
            'question_latex', question_latex,
            'tags', tags,
            'question_type', question_type,
            'marks', marks,
            'difficulty', difficulty,
            'final_answer', final_answer
        )) FROM questions ${where} LIMIT 50;`;
        
        const result = await queryDB(sql);
        res.json({ questions: result || [] });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Practice Mode Solution & Check
app.post('/api/practice/check', async (req, res) => {
    try {
        const { uid, answer } = req.body;
        
        const sql = `SELECT JSON_OBJECT(
            'uid', question_uid,
            'final_answer', final_answer,
            'solution_latex', solution_latex,
            'solution_text', solution_text,
            'question_type', question_type
        ) FROM questions WHERE question_uid = '${uid}';`;
        
        const result = await queryDB(sql);
        
        if (!result) {
            return res.status(404).json({ error: 'Question not found' });
        }
        
        const dbAnswer = result.final_answer;
        let isCorrect = false;
        
        if (answer !== undefined && dbAnswer !== null && dbAnswer !== undefined) {
            // Check if numerical
            const ansNum = parseFloat(answer);
            const dbNum = parseFloat(dbAnswer);
            
            if (!isNaN(ansNum) && !isNaN(dbNum)) {
                // 1% tolerance for decimal
                if (Math.abs(ansNum - dbNum) <= Math.abs(dbNum * 0.01) + 0.01) {
                    isCorrect = true;
                }
            } else {
                // String comparison
                isCorrect = String(answer).trim().toLowerCase() === String(dbAnswer).trim().toLowerCase();
            }
        }
        
        res.json({
            isCorrect,
            correctAnswer: result.final_answer,
            solutionLatex: result.solution_latex,
            solutionText: result.solution_text
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Start the server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Backend server running on http://localhost:${PORT}`);
});

const fs = require('fs');
const indexCode = fs.readFileSync('./index.js', 'utf8');

// Extract normalizeLatex and normalizeQuestionLatex
const normalizeLatexMatch = indexCode.match(/function normalizeLatex[\s\S]*?return result;\n}/);
const normalizeQuestionLatexMatch = indexCode.match(/function normalizeQuestionLatex[\s\S]*?return q;\n}/);

if (!normalizeLatexMatch || !normalizeQuestionLatexMatch) {
  console.log("Could not extract functions");
  process.exit(1);
}

eval(normalizeLatexMatch[0]);
eval(normalizeQuestionLatexMatch[0]);

const q = {
  question_latex: "\\\\text{Solve Legendre's linear equation given as } (x+a)^{2}\\\\frac{d^{2}y}{dx^{2}}-4(x+a)\\\\frac{dy}{dx}+6y=x"
};

console.log("Original question_latex:", q.question_latex);
const normalized = normalizeQuestionLatex(q);
console.log("Normalized:", normalized.question_latex);

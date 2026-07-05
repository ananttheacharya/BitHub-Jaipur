import React from 'react';
import { renderToString } from 'react-dom/server';
import { InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';

// Emulate backend JSON parsing
const jsonStr = `"\\\\text{Hello}"`;
const parsed = JSON.parse(jsonStr);

console.log("Parsed string length:", parsed.length);
console.log("Parsed string char 0:", parsed.charCodeAt(0)); // 92 is backslash

const html = renderToString(<InlineMath math={parsed} />);
console.log("HTML:", html);

// Emulate what happens if parsed is just "text{Hello}"
const parsed2 = "text{Hello}";
const html2 = renderToString(<InlineMath math={parsed2} />);
console.log("\nHTML 2 (no backslash):", html2);

// Emulate what happens if parsed is "\\\\text{Hello}"
const parsed3 = "\\text{Hello}";
const html3 = renderToString(<InlineMath math={parsed3} />);
console.log("\nHTML 3 (double backslash in JS literal = single backslash in memory):", html3);

const parsed4 = "\\\\text{Hello}";
const html4 = renderToString(<InlineMath math={parsed4} />);
console.log("\nHTML 4 (quad backslash in JS literal = double backslash in memory):", html4);


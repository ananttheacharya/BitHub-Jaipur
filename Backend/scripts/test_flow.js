const data = [
  {
    "question_latex": "\\\\text{Solve Legendre's linear equation given as } (x+a)^{2}\\\\frac{d^{2}y}{dx^{2}}-4(x+a)\\\\frac{dy}{dx}+6y=x"
  }
];

function normalizeLatex(str) {
    if (!str || typeof str !== 'string') return str;
    let result = str;
    result = result.replace(/\\\\\\\\/g, '\\\\');
    result = result.replace(/\\\\(text|frac|begin|end|sin|cos|tan|sec|csc|cot|log|ln|exp|lim|sum|prod|int|oint|iint|iiint|left|right|pi|alpha|beta|gamma|delta|epsilon|zeta|eta|theta|iota|kappa|lambda|mu|nu|xi|rho|sigma|tau|upsilon|phi|chi|psi|omega|Gamma|Delta|Theta|Lambda|Xi|Pi|Sigma|Upsilon|Phi|Psi|Omega|infty|partial|nabla|forall|exists|in|notin|subset|supset|cup|cap|vee|wedge|neg|implies|iff|to|rightarrow|leftarrow|Rightarrow|Leftarrow|uparrow|downarrow|mapsto|sqrt|cbrt|overline|underline|hat|tilde|bar|vec|dot|ddot|prime|circ|times|div|pm|mp|cdot|cdots|ldots|vdots|ddots|dots|quad|qquad|hspace|vspace|space|newline|displaystyle|textstyle|scriptstyle|mathrm|mathbf|mathit|mathcal|mathbb|mathfrak|operatorname|binom|choose|pmod|equiv|approx|sim|simeq|cong|neq|leq|geq|le|ge|ll|gg|prec|succ|perp|parallel|angle|triangle|square|langle|rangle|lceil|rceil|lfloor|rfloor|mod|gcd|det|ker|dim|hom|arg|deg|max|min|sup|inf|limsup|liminf|Pr|exp)/g, '\\$1');
    return result;
}

const original = data[0].question_latex;
const normalized = normalizeLatex(original);

console.log("Original Length:", original.length);
console.log("Original String:", original);

console.log("\nNormalized Length:", normalized.length);
console.log("Normalized String:", normalized);

// Now simulate the HTTP JSON transport
const httpTransport = JSON.stringify(normalized);
console.log("\nJSON stringified over HTTP:", httpTransport);

const receivedFrontend = JSON.parse(httpTransport);
console.log("\nReceived frontend length:", receivedFrontend.length);
console.log("Received frontend string:", receivedFrontend);

// Now simulate passing it to Katex
console.log("\nFirst 6 chars of frontend string:", receivedFrontend.substring(0, 6));
console.log("Does it start with backslash t? :", receivedFrontend.startsWith("\\t"));


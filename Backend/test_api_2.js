const http = require('http');

function normalizeLatex(str) {
    if (!str || typeof str !== 'string') return str;
    let result = str;
    result = result.replace(/\\\\\\\\/g, '\\\\');
    result = result.replace(/\\\\(text|frac|begin|end|sin|cos|tan|sec|csc|cot|log|ln|exp|lim|sum|prod|int|oint|iint|iiint|left|right|pi|alpha|beta|gamma|delta|epsilon|zeta|eta|theta|iota|kappa|lambda|mu|nu|xi|rho|sigma|tau|upsilon|phi|chi|psi|omega|Gamma|Delta|Theta|Lambda|Xi|Pi|Sigma|Upsilon|Phi|Psi|Omega|infty|partial|nabla|forall|exists|in|notin|subset|supset|cup|cap|vee|wedge|neg|implies|iff|to|rightarrow|leftarrow|Rightarrow|Leftarrow|uparrow|downarrow|mapsto|sqrt|cbrt|overline|underline|hat|tilde|bar|vec|dot|ddot|prime|circ|times|div|pm|mp|cdot|cdots|ldots|vdots|ddots|dots|quad|qquad|hspace|vspace|space|newline|displaystyle|textstyle|scriptstyle|mathrm|mathbf|mathit|mathcal|mathbb|mathfrak|operatorname|binom|choose|pmod|equiv|approx|sim|simeq|cong|neq|leq|geq|le|ge|ll|gg|prec|succ|perp|parallel|angle|triangle|square|langle|rangle|lceil|rceil|lfloor|rfloor|mod|gcd|det|ker|dim|hom|arg|deg|max|min|sup|inf|limsup|liminf|Pr|exp)/g, '\\$1');
    return result;
}

http.get('http://localhost:3001/api/practice/questions?subject=MA24101', (res) => {
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  res.on('end', () => {
    const parsed = JSON.parse(data);
    const questions = parsed.questions || [];
    const qWithText = questions.find(q => q.question_latex && q.question_latex.includes('text{'));
    
    if (qWithText) {
      console.log("From API:");
      console.log(qWithText.question_latex);
      
      console.log("\nIf I run normalizeLatex on it again:");
      console.log(normalizeLatex(qWithText.question_latex));
    }
  });
}).on("error", (err) => {
  console.log("Error: " + err.message);
});

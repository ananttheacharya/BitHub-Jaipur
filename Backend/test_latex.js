const { queryDB } = require('./db');

async function check() {
  const result = await queryDB(`SELECT JSON_ARRAYAGG(JSON_OBJECT('latex', question_latex)) FROM questions WHERE question_latex LIKE '%Legendre%' LIMIT 1`);
  console.log("From DB:");
  const val = result[0].latex;
  console.log("String representation:", val);
  console.log("JSON representation:", JSON.stringify(val));
  
  // Test backend normalizer
  let str = val;
  str = str.replace(/\\\\\\\\/g, '\\\\');
  str = str.replace(/\\\\(text|frac|begin|end|sin|cos|tan|sec|csc|cot|log|ln|exp|lim|sum|prod|int|oint|iint|iiint|left|right|pi|alpha|beta|gamma|delta|epsilon|zeta|eta|theta|iota|kappa|lambda|mu|nu|xi|rho|sigma|tau|upsilon|phi|chi|psi|omega|Gamma|Delta|Theta|Lambda|Xi|Pi|Sigma|Upsilon|Phi|Psi|Omega|infty|partial|nabla|forall|exists|in|notin|subset|supset|cup|cap|vee|wedge|neg|implies|iff|to|rightarrow|leftarrow|Rightarrow|Leftarrow|uparrow|downarrow|mapsto|sqrt|cbrt|overline|underline|hat|tilde|bar|vec|dot|ddot|prime|circ|times|div|pm|mp|cdot|cdots|ldots|vdots|ddots|dots|quad|qquad|hspace|vspace|space|newline|displaystyle|textstyle|scriptstyle|mathrm|mathbf|mathit|mathcal|mathbb|mathfrak|operatorname|binom|choose|pmod|equiv|approx|sim|simeq|cong|neq|leq|geq|le|ge|ll|gg|prec|succ|perp|parallel|angle|triangle|square|langle|rangle|lceil|rceil|lfloor|rfloor|mod|gcd|det|ker|dim|hom|arg|deg|max|min|sup|inf|limsup|liminf|Pr|exp)/g, '\\$1');
  console.log("\nAfter backend normalizer:");
  console.log("String representation:", str);
  console.log("JSON representation:", JSON.stringify(str));
  
  process.exit(0);
}
check();

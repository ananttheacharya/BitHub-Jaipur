const katex = require('katex');

try {
  // Test 1: string with one backslash
  let str1 = "\\text{Hello} \\frac{1}{2}";
  console.log("Test 1 (one backslash):", str1);
  console.log(katex.renderToString(str1));
} catch (e) {
  console.error(e);
}

try {
  // Test 2: string with two backslashes
  let str2 = "\\\\text{Hello} \\\\frac{1}{2}";
  console.log("\nTest 2 (two backslashes):", str2);
  console.log(katex.renderToString(str2));
} catch (e) {
  console.error(e);
}

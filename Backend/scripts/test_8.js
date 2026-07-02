const str = "\\\\\\\\\\\\\\\\text"; // 8 backslashes
let result = str;
result = result.replace(/\\\\\\\\/g, '\\\\');
result = result.replace(/\\\\(text|frac)/g, '\\$1');
console.log("Input:", str, str.length);
console.log("Output:", result, result.length);

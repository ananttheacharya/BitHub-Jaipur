const str = '\\\\text';
console.log("Original string:", str, "length:", str.length);

// Try replacing 2 backslashes with 1 backslash
const res1 = str.replace(/\\\\(text)/g, '\\$1');
console.log("Replace with '\\\\$1':", res1, "length:", res1.length);

const res2 = str.replace(/\\\\(text)/g, '\\\\$1');
console.log("Replace with '\\\\\\\\$1':", res2, "length:", res2.length);

const res3 = str.replace(/\\\\(text)/g, '\\\\\\$1');
console.log("Replace with '\\\\\\\\\\$1':", res3, "length:", res3.length);


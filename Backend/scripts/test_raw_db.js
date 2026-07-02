const { queryDB } = require('./db');
const sql = "SELECT question_latex FROM questions WHERE question_latex LIKE '%Legendre%' LIMIT 1;";
queryDB(sql).then(r => {
  const str = r[0].question_latex;
  console.log('Raw string from DB:', str);
  console.log('Length:', str.length);
  console.log('Char 0:', str.charCodeAt(0), "('", str[0], "')");
  console.log('Char 1:', str.charCodeAt(1), "('", str[1], "')");
}).catch(console.error).finally(()=>process.exit(0));

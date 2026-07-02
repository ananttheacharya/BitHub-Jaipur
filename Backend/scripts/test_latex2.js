const { queryDB } = require('./db');
async function check() {
  const result = await queryDB(`SELECT JSON_ARRAYAGG(JSON_OBJECT('latex', question_latex)) FROM questions WHERE question_latex LIKE '%Legendre%' LIMIT 1`);
  console.log(result[0].latex);
  process.exit(0);
}
check();

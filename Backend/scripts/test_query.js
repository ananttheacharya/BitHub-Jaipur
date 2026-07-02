const { queryDB } = require('./db');
const sql = "SELECT JSON_ARRAYAGG(JSON_OBJECT('uid', question_uid, 'question_latex', question_latex)) AS data FROM questions WHERE question_latex LIKE '%Legendre%' LIMIT 1;";
queryDB(sql).then(r => console.log(JSON.stringify(r))).catch(console.error).finally(()=>process.exit(0));

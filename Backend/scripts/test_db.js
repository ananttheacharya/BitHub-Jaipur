const { queryDB } = require('../db.js');

async function test() {
    try {
        const res = await queryDB("SELECT JSON_OBJECT('id', question_uid) FROM questions WHERE question_uid = 'nonexistent';");
        console.log("Empty result:");
        console.log(res);
        const res2 = await queryDB("SELECT JSON_OBJECT('id', question_uid) FROM questions LIMIT 1;");
        console.log("Valid result:");
        console.log(res2);
    } catch (e) {
        console.error(e);
    } finally {
        process.exit(0);
    }
}
test();

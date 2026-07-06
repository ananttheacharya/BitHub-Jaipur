const mysql = require('mysql2/promise');
async function test() {
    const pool = mysql.createPool({
        host: 'hayabusa.proxy.rlwy.net',
        port: 33968,
        user: 'root',
        password: 'IQcKGgDgoShBXKQRjzWzVNAsTXZGczjL',
        database: 'railway'
    });
    const [rows] = await pool.query("SELECT JSON_ARRAYAGG(JSON_OBJECT('id', question_uid)) FROM questions LIMIT 2;");
    const val = rows[0][Object.keys(rows[0])[0]];
    console.log(typeof val);
    console.log(val.substring(0, 50));
    process.exit(0);
}
test();

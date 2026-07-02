const { Client } = require('ssh2');
const mysql = require('mysql2/promise');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../test_environment_pipeline/.env') });

const sshConfig = {
    host: process.env.DB_SSH_HOST,
    port: 22,
    username: process.env.DB_SSH_USER,
    password: process.env.DB_SSH_PASS
};

const sshClient = new Client();

sshClient.on('ready', () => {
    console.log('SSH Client :: ready');
    sshClient.forwardOut(
        '127.0.0.1',
        12345,
        '127.0.0.1',
        3306,
        async (err, stream) => {
            if (err) {
                console.error('Port forwarding failed:', err);
                sshClient.end();
                return;
            }

            console.log('Port forwarded successfully. Trying to connect to MySQL...');
            try {
                // Try different common users
                const pool = mysql.createPool({
                    user: 'root',
                    password: process.env.DB_SSH_PASS, // Maybe same pass?
                    database: process.env.DB_NAME,
                    stream: stream
                });

                const [rows] = await pool.query('SHOW TABLES');
                console.log('Tables:', rows);
                pool.end();
            } catch (mysqlErr) {
                console.error('MySQL root with ssh pass failed:', mysqlErr.message);
                
                try {
                     const pool2 = mysql.createPool({
                        user: 'root',
                        password: '', // Maybe no pass?
                        database: process.env.DB_NAME,
                        stream: stream
                    });
                    const [rows2] = await pool2.query('SHOW TABLES');
                    console.log('Tables (no pass):', rows2);
                    pool2.end();
                } catch (mysqlErr2) {
                     console.error('MySQL root with no pass failed:', mysqlErr2.message);
                }
            } finally {
                sshClient.end();
            }
        }
    );
}).on('error', (err) => {
    console.error('SSH Error:', err);
}).connect(sshConfig);

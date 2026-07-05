const { Client } = require('ssh2');
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
    sshClient.exec(`echo "${process.env.DB_SSH_PASS}" | sudo -S mysql ${process.env.DB_NAME} -B -N -e "SELECT JSON_ARRAYAGG(JSON_OBJECT('uid', question_uid, 'subject_code', subject_code)) FROM questions LIMIT 2;"`, (err, stream) => {
        if (err) throw err;
        let data = '';
        stream.on('close', (code, signal) => {
            console.log('Stream :: close :: code: ' + code + ', signal: ' + signal);
            console.log('DATA:', data);
            sshClient.end();
        }).on('data', (d) => {
            data += d;
        }).stderr.on('data', (d) => {
            console.error('STDERR: ' + d);
        });
        
        // sudo needs password sometimes, let's see if we get a prompt.
        // Wait, in db_ingest.py they used invoke_shell and sent the password.
        // If sudo requires a tty and password, exec might fail with "sudo: no tty present and no askpass program specified".
        // Let's test it.
    });
}).on('error', (err) => {
    console.error('SSH Error:', err);
}).connect(sshConfig);

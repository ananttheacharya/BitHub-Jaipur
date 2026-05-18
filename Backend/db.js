const { Client } = require('ssh2');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../test_environment_pipeline/.env') });

const sshConfig = {
    host: process.env.DB_SSH_HOST,
    port: 22,
    username: process.env.DB_SSH_USER,
    password: process.env.DB_SSH_PASS
};

/**
 * Execute a MySQL query via SSH returning JSON.
 * The query should be formatted to return a single JSON string using JSON_ARRAYAGG.
 */
function queryDB(sqlQuery) {
    return new Promise((resolve, reject) => {
        const sshClient = new Client();
        
        sshClient.on('ready', () => {
            // We use -B (batch), -N (no column names), and -e (execute)
            // The query must select a JSON string.
            const command = `echo "${process.env.DB_SSH_PASS}" | sudo -S mysql ${process.env.DB_NAME} -B -N -e "${sqlQuery.replace(/"/g, '\\"')}"`;
            
            sshClient.exec(command, (err, stream) => {
                if (err) {
                    sshClient.end();
                    return reject(err);
                }
                
                let data = '';
                let stderrData = '';
                
                stream.on('close', (code, signal) => {
                    sshClient.end();
                    if (code !== 0) {
                        return reject(new Error(`MySQL process exited with code ${code}. Stderr: ${stderrData}`));
                    }
                    try {
                        // The output might have a password prompt from sudo, e.g. "[sudo] password for megahacker:"
                        // We extract the JSON part which starts with [ or {
                        const jsonStart = data.indexOf('[');
                        const jsonObjectStart = data.indexOf('{');
                        const startIdx = (jsonStart !== -1 && jsonObjectStart !== -1) ? Math.min(jsonStart, jsonObjectStart) : Math.max(jsonStart, jsonObjectStart);
                        
                        if (startIdx === -1) {
                            return resolve([]); // Empty result or no JSON returned
                        }
                        const cleanData = data.slice(startIdx).trim();
                        const result = JSON.parse(cleanData);
                        resolve(result);
                    } catch (e) {
                        reject(new Error(`Failed to parse DB output as JSON: ${e.message}\nRaw Data: ${data}`));
                    }
                }).on('data', (d) => {
                    data += d.toString('utf8');
                }).stderr.on('data', (d) => {
                    stderrData += d.toString('utf8');
                });
            });
        }).on('error', (err) => {
            reject(err);
        }).connect(sshConfig);
    });
}

module.exports = { queryDB };

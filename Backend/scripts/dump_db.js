const { Client } = require('ssh2');
const fs = require('fs');

const sshConfig = {
    host: '100.125.3.111',
    port: 22,
    username: 'megahacker',
    password: '20075568'
};

const sshClient = new Client();

sshClient.on('ready', () => {
    console.log('SSH Client :: ready');
    // Using mysqldump to dump the questions database
    const command = `echo "20075568" | sudo -S mysqldump questions`;
    
    sshClient.exec(command, (err, stream) => {
        if (err) throw err;
        
        let dumpData = '';
        stream.on('close', (code, signal) => {
            console.log('Stream :: close :: code: ' + code + ', signal: ' + signal);
            sshClient.end();
            
            // Clean up any sudo password prompt from the output
            const sudoPrompt = "[sudo] password for megahacker:";
            if (dumpData.startsWith(sudoPrompt)) {
                dumpData = dumpData.substring(sudoPrompt.length).trimStart();
            }
            
            fs.writeFileSync('dump.sql', dumpData);
            console.log('Database dumped to dump.sql');
        }).on('data', (data) => {
            dumpData += data.toString('utf8');
        }).stderr.on('data', (data) => {
            // stderr will likely contain the sudo prompt, we can ignore it
        });
    });
}).connect(sshConfig);

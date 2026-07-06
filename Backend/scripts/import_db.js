const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

async function runImport(config, name) {
    console.log(`Starting import to ${name}...`);
    try {
        const connection = await mysql.createConnection(config);
        
        // Read the dump file
        const dumpPath = path.join(__dirname, '../dump.sql');
        const dumpSql = fs.readFileSync(dumpPath, 'utf8');
        
        console.log(`Executing dump file for ${name} (Length: ${dumpSql.length} bytes)...`);
        
        // Wait, mysql2 multipleStatements: true can sometimes fail with large dumps due to max_allowed_packet.
        // Let's try it first.
        await connection.query(dumpSql);
        
        console.log(`✅ Import to ${name} successful!`);
        await connection.end();
    } catch (err) {
        console.error(`❌ Error importing to ${name}:`, err.message);
    }
}

async function main() {
    const railwayConfig = {
        host: process.env.DB_HOST || 'hayabusa.proxy.rlwy.net',
        port: process.env.DB_PORT || 33968,
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASS || '',
        database: process.env.DB_NAME || 'railway',
        multipleStatements: true
    };

    const aivenConfig = {
        host: process.env.AIVEN_DB_HOST || 'bithub-bithub.e.aivencloud.com',
        port: process.env.AIVEN_DB_PORT || 13295,
        user: process.env.AIVEN_DB_USER || 'avnadmin',
        password: process.env.AIVEN_DB_PASS || '',
        database: process.env.AIVEN_DB_NAME || 'defaultdb',
        ssl: { rejectUnauthorized: false }, // required for aiven
        multipleStatements: true
    };

    await runImport(railwayConfig, 'Railway');
    await runImport(aivenConfig, 'Aiven');
}

main();

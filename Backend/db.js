const mysql = require('mysql2/promise');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });

const railwayConfig = {
    host: process.env.DB_HOST || 'hayabusa.proxy.rlwy.net',
    port: process.env.DB_PORT || 33968,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASS || '',
    database: process.env.DB_NAME || 'railway',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
};

const aivenConfig = {
    host: process.env.AIVEN_DB_HOST || 'bithub-bithub.e.aivencloud.com',
    port: process.env.AIVEN_DB_PORT || 13295,
    user: process.env.AIVEN_DB_USER || 'avnadmin',
    password: process.env.AIVEN_DB_PASS || '',
    database: process.env.AIVEN_DB_NAME || 'defaultdb',
    ssl: { rejectUnauthorized: false },
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
};

const primaryPool = mysql.createPool(railwayConfig);
const fallbackPool = mysql.createPool(aivenConfig);

async function executeWithPool(pool, sqlQuery) {
    const [rows] = await pool.query(sqlQuery);
    
    if (!rows || rows.length === 0) return null;
    
    const firstRow = rows[0];
    const keys = Object.keys(firstRow);
    
    if (keys.length === 1) {
        const val = firstRow[keys[0]];
        if (typeof val === 'string') {
            try {
                return JSON.parse(val);
            } catch (e) {
                return val;
            }
        }
        return val;
    }
    
    return rows;
}

/**
 * Execute a MySQL query returning JSON, with fallback logic.
 */
async function queryDB(sqlQuery) {
    try {
        return await executeWithPool(primaryPool, sqlQuery);
    } catch (err) {
        console.warn("⚠️ Primary DB (Railway) failed, falling back to Aiven:", err.message);
        try {
            return await executeWithPool(fallbackPool, sqlQuery);
        } catch (fallbackErr) {
            console.error("❌ Both Primary and Fallback DBs failed!");
            throw fallbackErr;
        }
    }
}

// Test connection on startup to verify for the user
(async () => {
    try {
        const connection = await primaryPool.getConnection();
        console.log(`\n✅ VERIFIED: Backend successfully connected to Primary Cloud DB (Railway at ${railwayConfig.host})`);
        connection.release();
    } catch (err) {
        console.warn(`\n⚠️ Primary DB Connection Failed on startup: ${err.message}`);
        try {
            const fbConnection = await fallbackPool.getConnection();
            console.log(`✅ VERIFIED: Backend successfully connected to Fallback Cloud DB (Aiven at ${aivenConfig.host})`);
            fbConnection.release();
        } catch (fbErr) {
            console.error(`❌ CRITICAL: Could not connect to either Railway or Aiven cloud databases!`);
        }
    }
})();

module.exports = { queryDB, primaryPool, fallbackPool };

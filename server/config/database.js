require('dotenv').config();
const { Pool } = require('pg');

/**
 * Connect to PostgreSQL database
 * @function connectDB
 * @returns {Promise<void>} - Resolves if the connection is successful, rejects if there is an error
 */
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

/**
 * Connect to PostgreSQL database
 * @function connect
 * @returns {Promise<void>} - Resolves if the connection is successful, rejects if there is an error
 */
const connectDB = async () => {
    try {
        await pool.connect();
        console.log('Connected to PostgreSQL database');
    } catch (error) {
        console.error('Failed to connect to PostgreSQL database:', error);
        // Exit with error code 1 if the connection fails
        process.exit(1);
    }
};

/**
 * Export pool and connectDB functions
 * @exports {Object} - Object with pool and connectDB functions
 */
module.exports = { pool, connectDB };
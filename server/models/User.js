const { pool } = require('../config/database');

/**
 * Creates the users table in PostgreSQL database
 * @function createUserTable
 * @returns {Promise<void>} - Resolves if the table is created successfully, rejects if there is an error
 */
const createUserTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      email VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      role VARCHAR(50) NOT NULL
    )
  `;

  try {
    await pool.query(query);
    console.log('Users table created successfully');
  } catch (error) {
    console.error('Error creating users table:', error);
  }
};

/**
 * Exports the createUserTable function
 * @exports {Object} - with createUserTable function
 */
module.exports = { createUserTable };
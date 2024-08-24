const { pool } = require('../config/database');

/**
 * Creates the products table in PostgreSQL database
 * @function createProductTable
 * @returns {Promise<void>} - Resolves if the table is created successfully, rejects if there is an error
 */
const createProductTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS products (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      category VARCHAR(100) NOT NULL,
      description TEXT,
      price DECIMAL(10, 2) NOT NULL,
      discount DECIMAL(5, 2),
      seller_id INTEGER REFERENCES users(id)
    )
  `;

  try {
    await pool.query(query);
    console.log('Products table created successfully');
  } catch (error) {
    console.error('Error creating products table:', error);
  }
};

module.exports = { createProductTable };
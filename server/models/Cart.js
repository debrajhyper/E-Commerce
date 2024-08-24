const { pool } = require('../config/database');

/**
 * Creates the cart table in PostgreSQL database
 * @function createCartTable
 * @returns {Promise<void>} - Resolves if the table is created successfully, rejects if there is an error
 */
const createCartTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS cart (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id),
      product_id INTEGER REFERENCES products(id),
      quantity INTEGER NOT NULL,
      UNIQUE(user_id, product_id)
    )
  `;

  try {
    await pool.query(query);
    console.log('Cart table created successfully');
  } catch (error) {
    console.error('Error creating cart table:', error);
  }
};

module.exports = { createCartTable };
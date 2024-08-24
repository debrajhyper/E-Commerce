const { pool } = require('../config/database');

/**
 * POST /products
 * @function addProduct
 * @param {object} req.body - Product object with required values
 * @param {string} req.body.name - Product name
 * @param {string} req.body.category - Product category
 * @param {number} req.body.price - Product price
 * @param {number} req.body.discount - Product discount (optional)
 * @param {object} req.user - User object with role and ID
 * @returns {object} - Success message
 */
exports.addProduct = async (req, res) => {
    const { name, category, description, price, discount } = req.body;
    const sellerId = req.user.id;

    // Validate product details
    if (!name || !category || price === undefined || discount === undefined) {
        return res.status(400).json({ error: 'Name, category, price, and discount are required' });
    }
    if (typeof price !== 'number' || price < 0) {
        return res.status(400).json({ error: 'Price must be a positive number' });
    }
    if (typeof discount !== 'number' || discount < 0 || discount > 100) {
        return res.status(400).json({ error: 'Discount must be between 0 and 100' });
    }

    try {
        // Insert new product into the database
        const result = await pool.query(
            'INSERT INTO products (name, category, description, price, discount, seller_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
            [name, category, description || '', price, discount, sellerId]
        );

        if (result.rows.length === 0) {
            return res.status(500).json({ error: 'Failed to add product' });
        }

        // Return success message
        res.status(201).json({ message: 'Product added successfully' });
    } catch (error) {
        // Handle specific database errors
        if (error.code === '23505') { // Unique violation error code in PostgreSQL
            return res.status(409).json({ error: 'Product with the same name already exists' });
        }
        // Other possible errors
        return res.status(500).json({ error: 'Error adding product! Please try again' });
    }
};

/**
 * PUT /products/:id
 * @function editProduct
 * @param {integer} req.params.id - Product ID
 * @param {object} req.body - Product object with updated values
 * @param {string} req.body.name - Product name
 * @param {string} req.body.category - Product category
 * @param {string} req.body.description - Product description (optional)
 * @param {number} req.body.price - Product price
 * @param {number} req.body.discount - Product discount (optional)
 * @param {object} req.user - User object with role and ID
 * @returns {object} - Success message
 */
exports.editProduct = async (req, res) => {
    const { id } = req.params;
    const { name, category, description, price, discount } = req.body;
    const sellerId = req.user.id;

    // Validate product ID
    if (!id || isNaN(parseInt(id))) {
        return res.status(400).json({ error: 'Invalid product ID' });
    }

    // Validate product details
    if (!name || !category || price === undefined || discount === undefined) {
        return res.status(400).json({ error: 'Name, category, price, and discount are required' });
    }
    if (typeof price !== 'number' || price < 0) {
        return res.status(400).json({ error: 'Price must be a valid number' });
    }
    if (typeof discount !== 'number' || discount < 0 || discount > 100) {
        return res.status(400).json({ error: 'Discount must be a valid number between 0 and 100' });
    }

    try {
        // Update product in database
        const result = await pool.query(
            'UPDATE products SET name = $1, category = $2, description = $3, price = $4, discount = $5 WHERE id = $6 AND seller_id = $7 RETURNING *',
            [name, category, description || '', price, discount, id, sellerId]
        );

        // Handle not found
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Product not found or unauthorized' });
        }

        // Return success message
        res.json({ message: 'Product updated successfully' });
    } catch (error) {
        // Handle unexpected error
        res.status(500).json({ error: 'Error updating product! Please try again' });
    }
};

/**
 * DELETE /products/:id
 * @function deleteProduct
 * @param {integer} req.params.id - Product ID
 * @param {object} req.user - User object with role and ID
 * @returns {object} - Product object
 */
exports.deleteProduct = async (req, res) => {
    const { id } = req.params;
    const sellerId = req.user.id;

    /* Validate product ID */
    if (!id || isNaN(parseInt(id))) {
        return res.status(400).json({ error: 'Invalid product ID' });
    }

    try {
        /* Fetch product by ID and delete it */
        const result = await pool.query(
            'DELETE FROM products WHERE id = $1 AND seller_id = $2 RETURNING *',
            [id, sellerId]
        );

        /* Handle not found */
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Product not found or unauthorized' });
        }

        /* Return success message */
        res.json({ message: 'Product deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error deleting product' });
    }
};

/**
 * GET /products
 * @function getProducts
 * @param {object} req.query - Query parameters
 * @param {string} req.query.search - Search term
 * @param {object} req.user - User object with role and ID
 * @returns {array} - Array of products
 */
exports.getProducts = async (req, res) => {
    const { search } = req.query;
    const { role, id: userId } = req.user;
    try {
        let query = 'SELECT * FROM products';
        const queryParams = [];
        if (search && typeof search !== 'string') {
            return res.status(400).json({ error: 'Invalid search parameter' });
        }

        // Add seller filter if the user is a seller
        if (role === 'seller') {
            query += ' WHERE seller_id = $1';
            queryParams.push(userId);
        }

        // Add search filter if search parameter is present
        if (search) {
            query += role === 'seller' ? ' AND' : ' WHERE';
            query += ` (name ILIKE $${queryParams.length + 1} OR category ILIKE $${queryParams.length + 1})`;
            queryParams.push(`%${search}%`);
        }

        const result = await pool.query(query, queryParams);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'No products found!' });
        }
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching products! Please try again' });
    }
};

/**
 * GET /products/:id
 * @function getProduct
 * @param {integer} req.params.id - Product ID
 * @param {object} req.user - User object with role and ID
 * @returns {object} - Product object
 */
exports.getProduct = async (req, res) => {
    const { id } = req.params;
    const { role, id: sellerId } = req.user;

    /* Validate product ID */
    if (!id || isNaN(parseInt(id))) {
        return res.status(400).json({ error: 'Invalid product ID' });
    }

    try {
        /* Fetch product by ID */
        const result = role === 'seller'
            ? await pool.query('SELECT * FROM products WHERE id = $1 AND seller_id = $2', [id, sellerId])
            : await pool.query('SELECT * FROM products WHERE id = $1', [id]);

        /* Handle not found */
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Product not found or unauthorized' });
        }

        /* Return product object */
        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching product! Please try again' });
    }
};
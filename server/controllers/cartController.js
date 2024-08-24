const { pool } = require('../config/database');

/**
 * POST /cart
 * @function addToCart
 * @param {object} req.body - Product details
 * @param {integer} req.body.productId - Product ID
 * @param {integer} req.body.quantity - Quantity of product
 * @param {object} req.user - User object with role and ID
 * @returns {object} - Success message
 */
exports.addToCart = async (req, res) => {
    const { productId, quantity } = req.body;
    const { id: userId } = req.user;

    // Validate product ID and quantity
    if (!productId || isNaN(parseInt(productId))) {
        return res.status(400).json({ error: 'Invalid product ID' });
    }
    if (!quantity || isNaN(parseInt(quantity)) || quantity <= 0) {
        return res.status(400).json({ error: 'Invalid quantity' });
    }

    try {
        // Fetch product by ID
        const productResult = await pool.query('SELECT * FROM products WHERE id = $1', [productId]);

        // Handle not found
        if (productResult.rows.length === 0) {
            return res.status(404).json({ error: 'Product not found' });
        }

        // Insert new cart item or update existing one
        const result = await pool.query(
            `INSERT INTO cart (user_id, product_id, quantity) 
            VALUES ($1, $2, $3) 
            ON CONFLICT (user_id, product_id) 
            DO UPDATE SET quantity = cart.quantity + EXCLUDED.quantity 
            RETURNING *`,
            [userId, productId, quantity]
        );

        // Return success message
        res.status(201).json({ message: 'Item added to cart successfully' });
    } catch (error) {
        // Handle unexpected error
        res.status(500).json({ error: 'Error adding to cart' });
    }
};

/**
 * DELETE /cart/:id
 * @function removeFromCart
 * @param {integer} req.params.id - Item ID
 * @param {object} req.user - User object with role and ID
 * @returns {object} - Success message
 */
exports.removeFromCart = async (req, res) => {
    const { id } = req.params;
    const { id: userId } = req.user;
    if (!id || isNaN(parseInt(id))) {
        // Invalid item ID
        return res.status(400).json({ error: 'Invalid item ID' });
    }

    try {
        // Delete item from cart
        const result = await pool.query(
            'DELETE FROM cart WHERE product_id = $1 AND user_id = $2 RETURNING *',
            [id, userId]
        );

        // Handle not found
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Cart item not found or unauthorized' });
        }

        // Return success message
        res.json({ message: 'Item removed from cart successfully' });
    } catch (error) {
        // Handle unexpected error
        res.status(500).json({ error: 'Error removing from cart' });
    }
};

/**
 * GET /cart
 * @function getCart
 * @param {object} req.user - User object with role and ID
 * @returns {array} - Array of cart items
 */
exports.getCart = async (req, res) => {
    const { id: userId } = req.user;

    /* Validate user ID */
    if (!userId || isNaN(parseInt(userId))) {
        return res.status(400).json({ error: 'Invalid user ID' });
    }

    try {
        /* Fetch cart items by user ID */
        const result = await pool.query(
            'SELECT c.id, c.quantity, p.* FROM cart c JOIN products p ON c.product_id = p.id WHERE c.user_id = $1',
            [userId]
        );

        /* Handle empty cart */
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Cart is empty' });
        }

        /* Return cart items */
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching cart' });
    }
};
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { pool } = require('../config/database');

/**
 * Signup route
 * @function signup
 * @param {object} req.body - User object with required values
 * @param {string} req.body.email - User email
 * @param {string} req.body.password - User password
 * @param {string} req.body.role - User role
 * @returns {object} - Success message
 */
exports.signup = async (req, res) => {
    const { email, password, role } = req.body;

    // Check for missing fields
    if (!email || !password || !role) {
        return res.status(400).json({ error: 'Email, password, and role are required' });
    }

    try {
        // Check if user already exists
        const userExists = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
        if (userExists.rows.length > 0) {
            return res.status(409).json({ error: 'User already exists with this email' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert new user into the database
        const result = await pool.query(
            'INSERT INTO users (email, password, role) VALUES ($1, $2, $3) RETURNING id',
            [email, hashedPassword, role]
        );

        // Check if user was created successfully
        if (result.rows.length > 0) {
            return res.status(201).json({ message: 'User created successfully' });
        } else {
            return res.status(500).json({ error: 'Error creating user' });
        }

    } catch (error) {
        // Handle specific database errors
        if (error.code === '23505') {
            return res.status(409).json({ error: 'User already exists' });
        }

        // Other possible errors
        return res.status(500).json({ error: 'Internal server error, please try again' });
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;

    // Check for missing fields
    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required.' });
    }

    try {
        // Find user by email
        const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

        // Handle user not found
        if (result.rows.length === 0) {
            return res.status(401).json({ error: 'No user is registered with this email' });
        }

        const user = result.rows[0];

        // Compare password hash with the provided password
        const isMatch = await bcrypt.compare(password, user.password);

        // Handle incorrect password
        if (!isMatch) {
            return res.status(401).json({ error: 'Password is incorrect' });
        }

        // Generate JWT token
        const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '24h' });

        // Return success response
        res.json({ message: 'User logged in successfully', token: token });
    } catch (error) {
        // Handle internal server error
        res.status(500).json({ error: 'Internal server error' });
    }
};
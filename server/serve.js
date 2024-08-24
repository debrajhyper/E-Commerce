// Initialize dotenv to load environment variables from .env file
require('dotenv').config();

// Import dependencies
const express = require('express');
const cors = require('cors');
const { connectDB } = require('./config/database');
const { createUserTable } = require('./models/User');
const { createProductTable } = require('./models/Product');
const { createCartTable } = require('./models/Cart');
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const cartRoutes = require('./routes/cart');

// Create express app
const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS and JSON parsing
app.use(cors());
app.use(express.json());

/**
 * Initialize database by connecting to PostgreSQL and creating tables if they don't exist
 */
const initializeDatabase = async () => {
    try {
        // Connect to PostgreSQL database
        await connectDB();
        // Create User table
        await createUserTable();
        // Create Product table
        await createProductTable();
        // Create Cart table
        await createCartTable();
        console.log('Database initialized and tables created');
    } catch (error) {
        console.error('Failed to initialize database:', error);
        process.exit(1);
    }
};

// Define API routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);

/**
 * Start server and listen on specified port
 */
const startServer = async () => {
    // Initialize database
    await initializeDatabase();
    // Start server
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
};

// Start server
startServer();
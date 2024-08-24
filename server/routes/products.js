const express = require('express');
const {
    addProduct, // add a new product to the store
    editProduct, // edit an existing product in the store
    deleteProduct, // delete a product from the store
    getProducts, // get all products
    getProduct // get a single product by ID
} = require('../controllers/productController');
const authorizeMiddleware = require('../middleware/auth'); // middleware to authorize requests

const router = express.Router();

// add a new product to the store
router.post('/', authorizeMiddleware(process.env.AUTH_ROLE_SELLER), addProduct);
// edit an existing product in the store
router.put('/:id', authorizeMiddleware(process.env.AUTH_ROLE_SELLER), editProduct);
// delete a product from the store
router.delete('/:id', authorizeMiddleware(process.env.AUTH_ROLE_SELLER), deleteProduct);
// get a single product by ID
router.get('/:id', authorizeMiddleware([process.env.AUTH_ROLE_SELLER, process.env.AUTH_ROLE_BUYER]), getProduct);
// get all products
router.get('/', authorizeMiddleware([process.env.AUTH_ROLE_SELLER, process.env.AUTH_ROLE_BUYER]), getProducts);

module.exports = router;
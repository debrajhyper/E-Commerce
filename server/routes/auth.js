/**
 * Auth routes
 * 
 * @module routes/auth
 * @requires express
 * @requires ../controllers/authController
*/
const express = require('express');
const { signup, login } = require('../controllers/authController');

/**
 * Express router to mount auth related functions on.
 * 
 * @type {object}
 * @const
 * @namespace router
 */
const router = express.Router();

/**
 * Route serving the signup form
 * 
 * @function
 * @name router.post#signup
 * @param {string} path - Express path
 * @param {function} middleware - authController.signup
 */
router.post('/signup', signup);
/**
 * Route serving the login form
 * 
 * @function
 * @name router.post#login
 * @param {string} path - Express path
 * @param {function} middleware - authController.login
 */
router.post('/login', login);

/**
 * Export express router
 * 
 * @type {object}
 * @const
 * @default
 */
module.exports = router;
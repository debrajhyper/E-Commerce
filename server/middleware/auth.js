const jwt = require('jsonwebtoken');

/**
 * authorizeMiddleware
 * @param {string|array} roles - roles to check against, can be a single role string or an array of roles
 * @returns {function} - middleware function to check if user has required role
 */
const authorizeMiddleware = (roles = []) => {
    // roles param can be a single role string (e.g., 'Admin') or an array of roles (e.g., ['Admin', 'User'])
    if (typeof roles === 'string') {
        roles = [roles];
    }

    /**
     * middleware function to check if user has required role
     * @param {object} req - express request object
     * @param {object} res - express response object
     * @param {function} next - express next middleware function
     */
    return (req, res, next) => {
        const token = req.header('Authorization');
        if (!token) {
            return res.status(401).json({ error: 'User authorization denied' });
        }
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decoded;
            if (roles.length && !roles.includes(req.user.role)) {
                return res.status(403).json({ error: 'Access denied' });
            }
            next();
        } catch (error) {
            res.status(401).json({ error: 'Token is not valid' });
        }
    };
};

module.exports = authorizeMiddleware;
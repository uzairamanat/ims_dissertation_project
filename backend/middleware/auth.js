// Authentican middleware for security

const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
    const token = req.header('x-auth-token');
    if (!token) {
        return res.status(401).json({ msg: 'No token, authorisation denied' }); // Error message when a user is not logged in
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verifies a valid token
        req.user = decoded.user;
        next();
    } catch (err) {
        res.status(401).json({ msg: 'Token is not valid' });
    }
};

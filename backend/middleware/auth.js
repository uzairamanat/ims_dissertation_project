// Authentication middleware
const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
    const token = req.header('x-auth-token'); // Get the token from the request header
    if (!token) {
        return res.status(401).json({ msg: 'No token, authorization denied' }); // If no token, deny access
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify and decode the token
        req.user = decoded.user; // Attach the user information to the request object
        next(); // Proceed to the next middleware or route handler
    } catch (err) {
        res.status(401).json({ msg: 'Token is not valid' }); // If token verification fails, deny access
    }
};

// User authentication routes
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator'); // Validation middleware
const User = require('../models/user');
const router = express.Router();
const auth = require('../middleware/auth'); // JWT auth middleware

// Register a new user
router.post(
    '/register',
    [
        check('username', 'Username is required').not().isEmpty(), // Validate that username is not empty
        check('password', 'Password is required').exists(), // Validate that password exists
    ],
    async (req, res) => {
        const errors = validationResult(req); // Check for validation errors
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() }); // Return validation errors if any
        }

        const { username, password } = req.body;

        try {
            let user = await User.findOne({ username }); // Check if user with this username exists
            if (user) {
                return res.status(400).json({ msg: 'User already exists' }); // If user already exists, return error
            }

            // Create a new user
            user = new User({
                username,  
                password,
            });

            const salt = await bcrypt.genSalt(10); 
            user.password = await bcrypt.hash(password, salt); // Hash the password

            await user.save(); // Save the user to the database

            // Create JWT payload
            const payload = {
                user: { id: user.id },
            };

            // Sign and return JWT token
            jwt.sign(
                payload,
                process.env.JWT_SECRET,
                { expiresIn: '3h' }, // Token expiration time, user is then logged out
                (err, token) => {
                    if (err) throw err;
                    res.json({ token }); 
                }
            );
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server error'); // Internal server error
        }
    }
);

// Route to login user
router.post(
    '/login',
    [
        check('username', 'Username is required').not().isEmpty(), // Validate username
        check('password', 'Password is required').exists(), // Validate password
    ],
    async (req, res) => {
        const errors = validationResult(req); // Check for validation errors
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() }); // Return errors if validation fails
        }

        const { username, password } = req.body;

        try {
            let user = await User.findOne({ username }); // Find user by username
            if (!user) {
                return res.status(400).json({ msg: 'Invalid credentials' }); // If user not found, return error
            }

            const isMatch = await bcrypt.compare(password, user.password); // Compare the provided password with the hashed one
            if (!isMatch) {
                return res.status(400).json({ msg: 'Invalid credentials' }); // If password does not match, return error
            }

            
            const payload = {
                user: { id: user.id },
            };

            // Sign and return JWT token
            jwt.sign(
                payload,
                process.env.JWT_SECRET,
                { expiresIn: '3h' }, 
                (err, token) => {
                    if (err) throw err;
                    res.json({ token }); 
                }
            );
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server error'); 
        }
    }
);

// Update username route
router.put(
    '/update-username',
    [
        auth, // Protect route with JWT middleware
        check('newUsername', 'New username is required').not().isEmpty(), // Validate new username
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() }); // Return validation errors
        }

        const { newUsername } = req.body;

        try {
            const user = await User.findById(req.user.id); // Get the authenticated user by ID
            if (!user) {
                return res.status(404).json({ msg: 'User not found' }); // If user not found, return error
            }

            user.username = newUsername; // Update the username
            await user.save(); // Save the updated user
            res.json({ msg: 'Username updated successfully' }); // Send success message
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server error'); // Internal server error
        }
    }
);

// Update password route
router.put(
    '/update-password',
    [
        auth, // Protect route with JWT middleware
        check('currentPassword', 'Current password is required').exists(), // Validate current password
        check('newPassword', 'New password is required').exists(), // Validate new password
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() }); // Return validation errors
        }

        const { currentPassword, newPassword } = req.body;

        try {
            const user = await User.findById(req.user.id); // Get the authenticated user by ID
            if (!user) {
                return res.status(404).json({ msg: 'User not found' }); // If user not found, return error
            }

            const isMatch = await bcrypt.compare(currentPassword, user.password); // Compare the provided current password
            if (!isMatch) {
                return res.status(400).json({ msg: 'Current password is incorrect' }); // If password doesn't match, return error
            }

            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(newPassword, salt); // Hash the new password

            await user.save(); // Save the updated user
            res.json({ msg: 'Password updated successfully' }); // Send success message
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server error'); // Internal server error
        }
    }
);

module.exports = router;

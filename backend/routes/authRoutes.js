// All the routes related to authentication

const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');
const path = require('path');
const auth = require(path.resolve(__dirname, '../middleware/auth'));
const User = require(path.resolve(__dirname, '../models/user'));
const router = express.Router();

// Register a new user
router.post(
    '/register',
    [
        check('username', 'Username is required').not().isEmpty(),  // Validates an entry
        check('password', 'Password is required').exists(),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { username, password } = req.body;

        try {
            let user = await User.findOne({ username });  // Check if user with this username exists

            if (user) {
                return res.status(400).json({ msg: 'User already exists' });
            }

            user = new User({
                username,  // Saves the username
                password,
            });

            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt);

            await user.save();

            const payload = {
                user: { id: user.id },
            };

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

// Login user
router.post(
    '/login',
    [
        check('username', 'Username is required').not().isEmpty(),  
        check('password', 'Password is required').exists(),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { username, password } = req.body; 

        try {
            let user = await User.findOne({ username });  // Find the user by username

            if (!user) {
                return res.status(400).json({ msg: 'Invalid credentials' });
            }

            const isMatch = await bcrypt.compare(password, user.password);

            if (!isMatch) {
                return res.status(400).json({ msg: 'Invalid credentials' });
            }

            const payload = {
                user: { id: user.id },
            };

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
        auth,
        check('newUsername', 'New username is required').not().isEmpty(),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { newUsername } = req.body;

        try {
            const user = await User.findById(req.user.id);

            if (!user) {
                return res.status(404).json({ msg: 'User not found' });
            }

            user.username = newUsername;

            await user.save();
            res.json({ msg: 'Username updated successfully' });
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server error');
        }
    }
);

// Update password route
router.put(
    '/update-password',
    [
        auth,
        check('currentPassword', 'Current password is required').exists(),
        check('newPassword', 'New password is required').exists(),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { currentPassword, newPassword } = req.body;

        try {
            const user = await User.findById(req.user.id);

            if (!user) {
                return res.status(404).json({ msg: 'User not found' });
            }

            const isMatch = await bcrypt.compare(currentPassword, user.password);

            if (!isMatch) {
                return res.status(400).json({ msg: 'Current password is incorrect' });  // Error when current password doesn't match
            }

            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(newPassword, salt);

            await user.save();
            res.json({ msg: 'Password updated successfully' });
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server error');
        }
    }
);

module.exports = router;

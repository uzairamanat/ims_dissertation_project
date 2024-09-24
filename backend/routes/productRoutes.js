const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const auth = require('../middleware/auth');

// Create a new product
router.post('/', auth, async (req, res) => {
    try {
        const newItem = new Product(req.body);
        const savedItem = await newItem.save();
        res.status(201).json(savedItem);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Get all products
router.get('/', auth, async (req, res) => {
    try {
        const items = await Product.find();
        res.status(200).json(items);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get a specific product by ID
router.get('/:id', auth, async (req, res) => {
    try {
        const item = await Product.findById(req.params.id);
        if (item) {
            res.status(200).json(item);
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Update a product by ID
router.put('/:id', auth, async (req, res) => {
    try {
        const updatedItem = await Product.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        res.status(200).json(updatedItem);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Delete a product by ID
router.delete('/:id', auth, async (req, res) => {
    try {
        const deletedItem = await Product.findByIdAndDelete(req.params.id);
        if (deletedItem) {
            res.status(200).json({ message: 'Product deleted' });
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

//Low stock alert route
router.get('/alerts/low-stock', auth, async (req, res) => {
    try {
        const products = await Product.find({ quantity: { $lt: 10 } }); // Threshold set to 10 for low stock
        res.status(200).json(products);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;

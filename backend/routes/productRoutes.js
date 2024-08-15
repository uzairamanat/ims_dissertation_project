const express = require('express');
const router = express.Router();
const Product = require('../models/product');

// Create a new inventory item
router.post('/', async (req, res) => {
    try {
        const newItem = new Product(req.body);
        const savedItem = await newItem.save();
        res.status(201).json(savedItem);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Get all inventory items
router.get('/', async (req, res) => {
    try {
        const items = await Product.find();
        res.status(200).json(items);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get a specific inventory item by ID
router.get('/:id', async (req, res) => {
    try {
        const item = await Product.findById(req.params.id);
        if (item) {
            res.status(200).json(item);
        } else {
            res.status(404).json({ message: 'Item not found' });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Update an inventory item by ID
router.put('/:id', async (req, res) => {
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

// Delete an inventory item by ID
router.delete('/:id', async (req, res) => {
    try {
        const deletedItem = await Product.findByIdAndDelete(req.params.id);
        if (deletedItem) {
            res.status(200).json({ message: 'Item deleted' });
        } else {
            res.status(404).json({ message: 'Item not found' });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;

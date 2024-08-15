const express = require('express');
const router = express.Router();
const Customer = require('../models/Customer');

// Create a new customer
router.post('/', async (req, res) => {
    try {
        const newCustomer = new Customer(req.body);
        const savedCustomer = await newCustomer.save();
        res.status(201).json(savedCustomer);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Get all customers
router.get('/', async (req, res) => {
    try {
        const customers = await Customer.find();
        res.status(200).json(customers);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Search customers by name
router.get('/search', async (req, res) => {
    try {
        const { name } = req.query;
        if (!name) {
            return res.status(400).json({ message: 'Name query parameter is required' });
        }

        const customers = await Customer.find({ name: { $regex: name, $options: 'i' } });
        res.status(200).json(customers);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Search customers by city
router.get('/city', async (req, res) => {
    try {
        const { city } = req.query;
        if (!city) {
            return res.status(400).json({ message: 'City query parameter is required' });
        }

        const customers = await Customer.find({ city: { $regex: city, $options: 'i' } });
        res.status(200).json(customers);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get a specific customer by ID
router.get('/:id', async (req, res) => {
    try {
        const customer = await Customer.findById(req.params.id);
        if (customer) {
            res.status(200).json(customer);
        } else {
            res.status(404).json({ message: 'Customer not found' });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Update a customer by ID
router.put('/:id', async (req, res) => {
    try {
        const updatedCustomer = await Customer.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        res.status(200).json(updatedCustomer);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Delete a customer by ID
router.delete('/:id', async (req, res) => {
    try {
        const deletedCustomer = await Customer.findByIdAndDelete(req.params.id);
        if (deletedCustomer) {
            res.status(200).json({ message: 'Customer deleted' });
        } else {
            res.status(404).json({ message: 'Customer not found' });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;


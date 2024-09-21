// Customer management routes
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth'); // JWT authentication middleware
const Customer = require('../models/Customer');

// Create a new customer
router.post('/', auth, async (req, res) => {
    try {
        const newCustomer = new Customer(req.body); // Create a new customer instance with the request body
        const savedCustomer = await newCustomer.save(); // Save the new customer to the database
        res.status(201).json(savedCustomer); 
    } catch (err) {
        res.status(400).json({ message: err.message }); // If there's an error, return a 400 with the error message
    }
});

// Get all customers
router.get('/', auth, async (req, res) => {
    try {
        const customers = await Customer.find(); // Find all customers in the database
        res.status(200).json(customers); 
    } catch (err) {
        res.status(500).json({ message: err.message }); // If there's a server error, return a 500
    }
});

// Get a specific customer by ID
router.get('/:id', auth, async (req, res) => {
    try {
        const customer = await Customer.findById(req.params.id); // Find the customer by ID
        if (customer) {
            res.status(200).json(customer); // If found, return the customer
        } else {
            res.status(404).json({ message: 'Customer not found' });
        }
    } catch (err) {
        res.status(500).json({ message: err.message }); 
    }
});

// Update a customer by ID
router.put('/:id', auth, async (req, res) => {
    try {
        const updatedCustomer = await Customer.findByIdAndUpdate(
            req.params.id,
            req.body, // Update the customer with the new data
            { new: true } // Return the updated customer object
        );
        res.status(200).json(updatedCustomer); 
    } catch (err) {
        res.status(400).json({ message: err.message }); 
    }
});

// Delete a customer by ID
router.delete('/:id', auth, async (req, res) => {
    try {
        const deletedCustomer = await Customer.findByIdAndDelete(req.params.id); // Delete the customer by ID
        if (deletedCustomer) {
            res.status(200).json({ message: 'Customer deleted' }); // If successful, return with a success message
        } else {
            res.status(404).json({ message: 'Customer not found' }); // If not found, return 404
        }
    } catch (err) {
        res.status(500).json({ message: err.message }); // If there's a server error, return 500
    }
});

module.exports = router;

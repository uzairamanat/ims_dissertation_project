const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Customer = require('../models/Customer');
const Product = require('../models/product');

// Create a new order using customer name and product name or SKU
router.post('/', async (req, res) => {
    try {
        const { customerName, items } = req.body;

        // Find the customer by name
        const customer = await Customer.findOne({ name: customerName });
        if (!customer) {
            return res.status(404).json({ message: 'Customer not found' });
        }

        let totalAmount = 0; // Initialize total amount for the order
        const orderItems = [];

        for (let item of items) {
            const { productName, SKU, quantity } = item;

            // Find the product by name or SKU
            let product;
            if (productName) {
                product = await Product.findOne({ name: productName });
            } else if (SKU) {
                product = await Product.findOne({ SKU: SKU });
            }

            if (!product) {
                return res.status(404).json({ message: `Product not found: ${productName || SKU}` });
            }

            const priceAtPurchase = product.price; // Retrieve the current price of the product
            const itemTotal = priceAtPurchase * quantity; // Calculate total price for this item
            totalAmount += itemTotal; // Add to the total amount for the order

            // Add item to orderItems array with the product ID, quantity, and price at purchase
            orderItems.push({
                product: product._id, // Use product's ObjectId
                quantity: quantity,
                priceAtPurchase: priceAtPurchase
            });
        }

        // Create the order with the total amount calculated
        const newOrder = new Order({
            customer: customer._id,
            items: orderItems,
            totalAmount: totalAmount, // Store the calculated total amount
        });

        const savedOrder = await newOrder.save();
        res.status(201).json(savedOrder);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Get all orders
router.get('/', async (req, res) => {
    try {
        const orders = await Order.find().populate('customer').populate('items.product');
        res.status(200).json(orders);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get a specific order by ID
router.get('/:id', async (req, res) => {
    try {
        const order = await Order.findById(req.params.id).populate('customer').populate('items.product');
        if (order) {
            res.status(200).json(order);
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


// Update an order by ID
router.put('/:id', async (req, res) => {
    try {
        const updatedOrder = await Order.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        res.status(200).json(updatedOrder);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Delete an order by ID
router.delete('/:id', async (req, res) => {
    try {
        const deletedOrder = await Order.findByIdAndDelete(req.params.id);
        if (deletedOrder) {
            res.status(200).json({ message: 'Order deleted' });
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;

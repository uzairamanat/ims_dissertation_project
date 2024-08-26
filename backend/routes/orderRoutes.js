const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Customer = require('../models/Customer');
const Product = require('../models/product');

// Create a new order using customer name and product name/SKU
router.post('/', async (req, res) => {
    try {
        const { customerName, items } = req.body;

        // Find the customer by ID
        const customer = await Customer.findById(customerName);
        if (!customer) {
            return res.status(404).json({ message: 'Customer not found' });
        }

        let totalAmount = 0;
        const orderItems = [];

        for (let item of items) {
            const { product, quantity, priceAtPurchase } = item;

            // Find the product by ID
            const productRecord = await Product.findById(product);
            if (!productRecord) {
                return res.status(404).json({ message: `Product not found: ${product}` });
            }

            const itemTotal = priceAtPurchase * quantity;
            totalAmount += itemTotal;

            orderItems.push({
                product: productRecord._id,
                quantity: quantity,
                priceAtPurchase: priceAtPurchase
            });
        }

        const newOrder = new Order({
            customer: customer._id,
            items: orderItems,
            totalAmount: totalAmount,
        });

        const savedOrder = await newOrder.save();
        res.status(201).json(savedOrder);
    } catch (err) {
        console.error('Error:', err.message); // Detailed error message
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

router.put('/:id', async (req, res) => {
    try {
        const updatedOrder = await Order.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedOrder) {
            return res.status(404).json({ message: 'Order not found' });
        }
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

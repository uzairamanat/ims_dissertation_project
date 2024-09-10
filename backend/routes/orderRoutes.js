const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Product = require('../models/Product');
const Customer = require('../models/Customer');
const SalesData = require('../models/SalesData');

// Create a new order using customer name and product name/SKU
router.post('/', async (req, res) => {
    const session = await Order.startSession();
    session.startTransaction();

    try {
        const { customerName, items } = req.body;

        // Find the customer by ID
        const customer = await Customer.findById(customerName);
        if (!customer) {
            await session.abortTransaction();
            session.endSession();
            return res.status(404).json({ message: 'Customer not found' });
        }

        let totalAmount = 0;
        const orderItems = [];

        for (let item of items) {
            const { product, quantity, priceAtPurchase } = item;

            // Find the product by ID
            const productRecord = await Product.findById(product);
            if (!productRecord) {
                await session.abortTransaction();
                session.endSession();
                return res.status(404).json({ message: `Product not found: ${product}` });
            }

            // Check if there is enough quantity
            if (productRecord.quantity < quantity) {
                await session.abortTransaction();
                session.endSession();
                return res.status(400).json({ message: `Insufficient stock for product: ${productRecord.name}` });
            }

            // Deduct the quantity from the product's stock
            productRecord.quantity -= quantity;
            await productRecord.save({ session });

            const itemTotal = priceAtPurchase * quantity;
            totalAmount += itemTotal;

            orderItems.push({
                product: productRecord._id,
                quantity: quantity,
                priceAtPurchase: priceAtPurchase
            });

            // Update sales data
            const salesData = await SalesData.findOne({
                product: productRecord._id,
                date: new Date().toISOString().split('T')[0] // YYYY-MM-DD format
            });

            if (salesData) {
                salesData.totalQuantitySold += quantity;
                salesData.totalRevenue += itemTotal;
            } else {
                const newSalesData = new SalesData({
                    product: productRecord._id,
                    date: new Date().toISOString().split('T')[0],
                    totalQuantitySold: quantity,
                    totalRevenue: itemTotal
                });
                await newSalesData.save({ session });
            }
        }

        const newOrder = new Order({
            customer: customer._id,
            items: orderItems,
            totalAmount: totalAmount,
        });

        const savedOrder = await newOrder.save({ session });
        await session.commitTransaction();
        session.endSession();
        res.status(201).json(savedOrder);

    } catch (err) {
        await session.abortTransaction();
        session.endSession();
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

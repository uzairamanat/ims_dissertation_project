// Sales data routes
const express = require('express');
const router = express.Router();
//Import schemas
const salesData = require('../models/salesData'); 
const Product = require('../models/Product'); 

// Get total sales between two dates
router.get('/sales/total', async (req, res) => {
    try {
        const { startDate, endDate } = req.query; // Get start and end dates from query parameters
        const orders = await Order.find({
            date: { $gte: new Date(startDate), $lte: new Date(endDate) }, // Find orders between the dates
        });
        const totalSales = orders.reduce((acc, order) => acc + order.totalAmount, 0); // Calculate total sales amount
        res.status(200).json({ totalSales }); 
    } catch (err) {
        res.status(500).json({ message: err.message }); // If there's an error, return 500 with the error message
    }
});

// Get sales data for a specific product
router.get('/sales/product/:productId', async (req, res) => {
    try {
        const { productId } = req.params; // Get product ID from route parameters
        const salesData = await SalesData.find({ product: productId }); // Find sales data for the specific product
        res.status(200).json(salesData); 
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get sales data grouped by category
router.get('/category', async (req, res) => {
    try {
        const salesByCategory = await SalesData.aggregate([
            {
                $lookup: {
                    from: 'products', // Lookup product details from the 'products' collection
                    localField: 'product',
                    foreignField: '_id',
                    as: 'productDetails',
                },
            },
            { $unwind: '$productDetails' }, 
            {
                $group: {
                    _id: '$productDetails.category', // Group by product category
                    totalRevenue: { $sum: '$totalRevenue' }, // Sum up total revenue
                    totalQuantitySold: { $sum: '$totalQuantitySold' }, // Sum up total quantity sold
                },
            },
        ]);

        res.status(200).json(salesByCategory); 
    } catch (err) {
        res.status(500).json({ message: err.message }); 
    }
});

module.exports = router;

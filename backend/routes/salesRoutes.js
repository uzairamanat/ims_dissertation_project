const express = require('express');
const router = express.Router();
const salesData = require('../models/salesData');
const Product = require('../models/Product');

router.get('/sales/total', async (req, res) => {
    try {
        const { startDate, endDate } = req.query;
        const orders = await Order.find({
            date: { $gte: new Date(startDate), $lte: new Date(endDate) }
        });
        const totalSales = orders.reduce((acc, order) => acc + order.totalAmount, 0);
        res.status(200).json({ totalSales });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.get('/sales/product/:productId', async (req, res) => {
    try {
        const { productId } = req.params;
        const salesData = await SalesData.find({ product: productId });
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
                    from: 'products',
                    localField: 'product',
                    foreignField: '_id',
                    as: 'productDetails',
                },
            },
            { $unwind: '$productDetails' },
            {
                $group: {
                    _id: '$productDetails.category',
                    totalRevenue: { $sum: '$totalRevenue' },
                    totalQuantitySold: { $sum: '$totalQuantitySold' },
                },
            },
        ]);

        res.status(200).json(salesByCategory);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;


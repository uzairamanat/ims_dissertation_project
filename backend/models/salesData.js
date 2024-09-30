// Mongoose schema to store data for sales data, that could be integrated in future iterations

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const salesDataSchema = new Schema({
    product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    date: { type: Date, required: true },
    totalQuantitySold: { type: Number, required: true },
    totalRevenue: { type: Number, required: true }
});

const SalesData = mongoose.models.SalesData || mongoose.model('SalesData', salesDataSchema);

module.exports = SalesData;
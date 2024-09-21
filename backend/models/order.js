// Mongoose database schema to store data for orders

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orderItemSchema = new Schema({
    product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, required: true },
    priceAtPurchase: { type: Number, required: true },
});

const orderSchema = new Schema({
    customer: { type: Schema.Types.ObjectId, ref: 'Customer', required: true },
    items: [orderItemSchema],
    totalAmount: { type: Number, required: true },
    date: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Order', orderSchema);

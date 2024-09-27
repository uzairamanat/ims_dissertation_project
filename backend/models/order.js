const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// The order schema consists of two schemas in one, one to manage all the items and one for the customer and price
const orderItemSchema = new Schema({  
    product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },  // References product schema
    quantity: { type: Number, required: true },
    priceAtPurchase: { type: Number, required: true },      
});

const orderSchema = new Schema({
    customer: { type: Schema.Types.ObjectId, ref: 'Customer', required: true }, // References customer schema
    items: [orderItemSchema],                                    // Stores all the items in any single order
    totalAmount: { type: Number, required: true },               // The total price of the order
    date: { type: Date, default: Date.now },                     // Date of the order  
});

module.exports = mongoose.model('Order', orderSchema);

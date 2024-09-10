const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    brand: { type: String, required: true},
    name: { type: String, required: true },
    SKU: {type: String, required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
    amountPerUnit: { type: Number, required: true},
    unitMeasurement: { 
        type: String,
        enum: ['grams', 'kilograms', 'litres']
    },
    category: {
        type: String,
        enum: ['Rice', 'Spices', 'Drinks', 'Snacks', 'Air Fresheners', 'Pulses'],
        required: true
    },
    dateAdded: { type: Date, default: Date.now }
});

const Product = mongoose.models.Product || mongoose.model('Product', productSchema);

module.exports = Product;
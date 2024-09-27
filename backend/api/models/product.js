const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    brand: { type: String, required: true, minlength: 2, maxlength: 100 }, 
    name: { type: String, required: true, minlength: 2, maxlength: 100 }, 
    SKU: { type: String, required: true, unique: true, minlength: 3, maxlength: 50 }, 
    quantity: { type: Number, required: true, min: 0 }, // Quantity must be non-negative
    price: { type: Number, required: true, min: 0 }, // Price must be non-negative
    amountPerUnit: { type: Number, required: true, min: 0 }, // Amount per unit must be non-negative
    unitMeasurement: { 
        type: String,
        enum: ['grams', 'kilograms', 'litres'],
        required: true
    },
    category: {
        type: String,
        enum: ['Rice', 'Spices', 'Drinks', 'Snacks', 'Air Fresheners', 'Pulses'],
        required: true
    },
    dateAdded: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Product', productSchema);

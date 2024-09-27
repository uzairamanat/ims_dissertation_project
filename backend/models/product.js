const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    brand: { type: String, required: true, minlength: 2, maxlength: 100 }, // Constraints on text length
    name: { type: String, required: true, minlength: 2, maxlength: 100 }, 
    SKU: { type: String, required: true, unique: true, minlength: 3, maxlength: 50 }, 
    quantity: { type: Number, required: true, min: 0 }, // Quantity must be non-negative
    price: { type: Number, required: true, min: 0 }, // Price must be non-negative
    amountPerUnit: { type: Number, required: true, min: 0 }, // Amount per unit must be non-negative
    unitMeasurement: { 
        type: String,
        enum: ['grams', 'kilograms', 'litres'],           // Products' size can only be measured in 3 ways
        required: true
    },
    category: {
        type: String,                                      // All the categories of products available
        enum: ['Rice', 'Spices', 'Drinks', 'Snacks', 'Air Fresheners', 'Pulses'],     
        required: true
    },
    dateAdded: { type: Date, default: Date.now }         // Keeps track of when a product was added
});

module.exports = mongoose.model('Product', productSchema);

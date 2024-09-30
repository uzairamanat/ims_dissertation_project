// Mongoose schema to store data for customers

const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
    name: { type: String, required: true, minlength: 2, maxlength: 100 }, 
    email: { type: String, required: true, unique: true, match: /^\S+@\S+\.\S+$/ }, // Regex ensures valid email format
    phone: { type: String, required: true, minlength: 7, maxlength: 15 }, // Phone number length constraints
    streetAddress: { type: String, required: true, minlength: 5, maxlength: 150 }, 
    city: { type: String, required: true, minlength: 2, maxlength: 50 }, 
    dateAdded: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Customer', customerSchema);

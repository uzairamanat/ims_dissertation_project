// Mongoose database schema to store data for customers

const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    streetAddress: { type: String, required: true },
    city: { type: String, required: true},
    dateAdded: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Customer', customerSchema);

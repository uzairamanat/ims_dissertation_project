// Mongoose schema to store data for users

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },  // username must be unique
    password: { type: String, required: true }, 
});

module.exports = mongoose.model('User', userSchema);

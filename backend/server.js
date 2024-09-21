// Main server setup
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const auth = require('./middleware/auth'); // Middleware for authentication (JWT verification)
require('dotenv').config(); // Load environment variables from .env file

const app = express();
const PORT = process.env.PORT || 5000; // Defines the port and it's server number

// Middleware
app.use(cors()); // Enable Cross-Origin Resource Sharing (allow requests from different domains)
app.use(express.json()); // Parse incoming JSON requests
app.use('/api/auth', require('./routes/authRoutes')); // Authentication routes

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected')) // Log successful connection
.catch((err) => console.log(err)); // Log errors

// Protected routes (JWT token/login required)
app.use('/api/products', auth, require('./routes/productRoutes')); 
app.use('/api/customers', auth, require('./routes/customerRoutes')); 
app.use('/api/orders', auth, require('./routes/orderRoutes')); 
app.use('/api/salesData', require('./routes/salesRoutes')); // Sales data route (not protected)

// Root route
app.get('/', (req, res) => {
    res.send('API is running...'); // Health check endpoint
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`); // Logs if server is running
});

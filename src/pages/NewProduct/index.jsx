// Form page for creating a new product

import React, { useState } from 'react';
import { Box, Button, TextField, MenuItem, Alert, Snackbar } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';


const categories = ['Rice', 'Spices', 'Drinks', 'Snacks', 'Air Fresheners', 'Pulses'];

const NewProduct = () => {
    const [product, setProduct] = useState({
        brand: '',
        name: '',
        SKU: '',
        quantity: '',
        price: '',
        amountPerUnit: '',
        unitMeasurement: 'grams',
        category: ''
    });
    const [successMessage, setSuccessMessage] = useState(''); // State for success message
    const [showSnackbar, setShowSnackbar] = useState(false); // State to control Snackbar visibility
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProduct({ ...product, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token'); // Get JWT token from localStorage

        if (!token) {
            // If token is missing, redirect to login
            navigate('/login');
            return;
        }   
        try {
            await axios.post('http://localhost:5000/api/products', product, {
                headers: {'x-auth-token': token}
            });
            // Show success message and Snackbar
            setSuccessMessage('Product created successfully!');
            setShowSnackbar(true);
            setTimeout(() => {
                navigate('/products'); // Navigate to the products list page
            }, 2000); 
        } catch (error) {
            console.error('Error creating product:', error);
        }
    };

    return (
        <Box component="form" onSubmit={handleSubmit} sx={{ padding: 1, maxWidth: 400}}>
            <TextField
                label="Brand"
                name="brand"
                value={product.brand}
                onChange={handleChange}
                required
                fullWidth
                margin="normal"
            />
            <TextField
                label="Name"
                name="name"
                value={product.name}
                onChange={handleChange}
                required
                fullWidth
                margin="normal"
            />
            <TextField
                label="SKU"
                name="SKU"
                value={product.SKU}
                onChange={handleChange}
                required
                fullWidth
                margin="normal"
            />
            <TextField
                label="Quantity"
                name="quantity"
                value={product.quantity}
                onChange={handleChange}
                type="number"
                required
                fullWidth
                margin="normal"
            />
            <TextField
                label="Price"
                name="price"
                value={product.price}
                onChange={handleChange}
                type="number"
                required
                fullWidth
                margin="normal"
            />
            <TextField
                label="Amount Per Unit"
                name="amountPerUnit"
                value={product.amountPerUnit}
                onChange={handleChange}
                type="number"
                required
                fullWidth
                margin="normal"
            />
            <TextField
                select
                label="Unit Measurement"
                name="unitMeasurement"
                value={product.unitMeasurement}
                onChange={handleChange}
                required
                fullWidth
                margin="normal"
            >
                <MenuItem value="grams">Grams</MenuItem>
                <MenuItem value="kilograms">Kilograms</MenuItem>
                <MenuItem value="litres">Litres</MenuItem>
            </TextField>
            <TextField
                select
                label="Category"
                name="category"
                value={product.category}
                onChange={handleChange}
                required
                fullWidth
                margin="normal"
            >
                {categories.map((category) => (
                    <MenuItem key={category} value={category}>
                        {category}
                    </MenuItem>
                ))}
            </TextField>
            <Button variant="contained" color="primary" type="submit">
                Create Product
            </Button>

            {/* Snackbar for success notification */}
            <Snackbar
                open={showSnackbar}
                autoHideDuration={6000}
                onClose={() => setShowSnackbar(false)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert onClose={() => setShowSnackbar(false)} severity="success" sx={{ width: '100%' }}>
                    {successMessage}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default NewProduct;

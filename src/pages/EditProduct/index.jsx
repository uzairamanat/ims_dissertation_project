// Form to edit selected product

import React, { useState, useEffect } from 'react';
import { Box, Button, TextField, Alert, Snackbar } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const EditProduct = () => {
    const { id } = useParams(); // Get the product ID from the URL
    const [successMessage, setSuccessMessage] = useState(''); // State for success message
    const [showSnackbar, setShowSnackbar] = useState(false);
    const navigate = useNavigate();

    const [product, setProduct] = useState({
        brand: '',
        name: '',
        SKU: '',
        quantity: '',
        price: '',
        amountPerUnit: '',
        unitMeasurement: '',
        category: ''
    });

    useEffect(() => {
        const fetchProduct = async () => {
            const token = localStorage.getItem('token'); // Get JWT token from localStorage

            if (!token) {
                // If token is missing, redirect to login
                navigate('/login');
                return;
            }
            try {
                const response = await axios.get(`http://localhost:5000/api/products/${id}`, {
                    headers: {
                        'x-auth-token': token
                    }
                });
                setProduct(response.data);
            } catch (error) {
                console.error('Error fetching product:', error);
            }
        };

        fetchProduct(); // Fetch product details when the component mounts
    }, [id]);

    const handleChange = (e) => {
        setProduct({ ...product, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');

        if (!token) {
            navigate('/login');
            return;
        } 
        try {
            await axios.put(`http://localhost:5000/api/products/${id}`, product, {
                headers: {
                    'x-auth-token': token
                }
            });
            // Show success message and Snackbar
            setSuccessMessage('Product updated successfully!');
            setShowSnackbar(true);
            setTimeout(() => {
                navigate('/products'); // Navigate to the products list page
            }, 2000); // 2-second delay before navigating
        } catch (error) {
            console.error('Error updating product:', error);
        }
    };

    return (
        // Main form
        <Box component="form" onSubmit={handleSubmit} sx={{ padding: 1, maxWidth: 400}}>
            <TextField
                label="Brand"
                name="brand"
                value={product.brand}
                onChange={handleChange}
                fullWidth
                margin="normal"
            />
            <TextField
                label="Name"
                name="name"
                value={product.name}
                onChange={handleChange}
                fullWidth
                margin="normal"
            />
            <TextField
                label="SKU"
                name="SKU"
                value={product.SKU}
                onChange={handleChange}
                fullWidth
                margin="normal"
            />
            <TextField
                label="Quantity"
                name="quantity"
                value={product.quantity}
                onChange={handleChange}
                type="number"
                fullWidth
                margin="normal"
            />
            <TextField
                label="Price"
                name="price"
                value={product.price}
                onChange={handleChange}
                type="number"
                fullWidth
                margin="normal"
            />
            <TextField
                label="Amount Per Unit"
                name="amountPerUnit"
                value={product.amountPerUnit}
                onChange={handleChange}
                type="number"
                fullWidth
                margin="normal"
            />
            <TextField
                label="Unit Measurement"
                name="unitMeasurement"
                value={product.unitMeasurement}
                onChange={handleChange}
                select
                SelectProps={{ native: true }}
                fullWidth
                margin="normal"
            >
                <option value="grams">Grams</option>
                <option value="kilograms">Kilograms</option>
                <option value="litres">Litres</option>
            </TextField>
            <TextField
                label="Category"
                name="category"
                value={product.category}
                onChange={handleChange}
                select
                SelectProps={{ native: true }}
                fullWidth
                margin="normal"
            >
                <option value="Rice">Rice</option>
                <option value="Spices">Spices</option>
                <option value="Drinks">Drinks</option>
                <option value="Snacks">Snacks</option>
                <option value="Air Fresheners">Air Fresheners</option>
                <option value="Pulses">Pulses</option>
            </TextField>
            <Button type="submit" variant="contained" color="primary">
                Update Product
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

export default EditProduct;

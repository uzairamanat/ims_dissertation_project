import React, { useState } from 'react';
import { Box, Button, TextField } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const NewCustomer = () => {
    const [customer, setCustomer] = useState({
        name: '',
        email: '',
        phone: '',
        city: '',
        streetAddress: ''
    });
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCustomer({ ...customer, [name]: value });
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
            await axios.post('http://localhost:5000/api/customers', customer, {
                headers: {
                    'x-auth-token': token // Add the token to the request header
                }
            });
            navigate('/customers');
        } catch (error) {
            console.error('Error creating customer:', error);
        }
    };

    return (
        <Box component="form" onSubmit={handleSubmit} sx={{ padding: 1, maxWidth: 400 }}>
            <TextField
                label="Name"
                name="name"
                value={customer.name}
                onChange={handleChange}
                required
                fullWidth
                margin="normal"
            />
            <TextField
                label="Email"
                name="email"
                value={customer.email}
                onChange={handleChange}
                required
                fullWidth
                margin="normal"
            />
            <TextField
                label="Phone"
                name="phone"
                value={customer.phone}
                onChange={handleChange}
                required
                fullWidth
                margin="normal"
            />
            <TextField
                label="City/Town"
                name="city"
                value={customer.city}
                onChange={handleChange}
                required
                fullWidth
                margin="normal"
            />
            <TextField
                label="Address"
                name="streetAddress"
                value={customer.streetAddress}
                onChange={handleChange}
                required
                fullWidth
                margin="normal"
            />
            <Button variant="contained" color="primary" type="submit">
                Create Customer
            </Button>
        </Box>
    );
};

export default NewCustomer;

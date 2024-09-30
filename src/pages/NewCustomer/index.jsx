// Form to create a new customer

import React, { useState } from 'react';
import { Box, Button, TextField, Snackbar, Alert } from '@mui/material';
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
    const [successMessage, setSuccessMessage] = useState(''); // State for success message
    const [showSnackbar, setShowSnackbar] = useState(false); // State to control Snackbar visibility
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCustomer({ ...customer, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token'); 

        if (!token) {
            navigate('/login'); 
            return;
        }

        try {
            await axios.post('http://localhost:5000/api/customers', customer, {
                headers: {
                    'x-auth-token': token 
                }
            });

            // Show success message and Snackbar
            setSuccessMessage('Customer created successfully!');
            setShowSnackbar(true); 

            
            setTimeout(() => {
                navigate('/customers'); // Navigate to the customers list page
            }, 2000); // 2-second delay before navigating

            
            setCustomer({
                name: '',
                email: '',
                phone: '',
                city: '',
                streetAddress: ''
            });
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

export default NewCustomer;

// Form to edit selected customer data

import React, { useState, useEffect } from 'react';
import { Box, Button, TextField, Alert, Snackbar } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
const EditCustomer = () => {
    const { id } = useParams(); // Get the customer ID from the URL
    const [successMessage, setSuccessMessage] = useState(''); // State for success message
    const [showSnackbar, setShowSnackbar] = useState(false);
    const navigate = useNavigate();

    const [customer, setCustomer] = useState({
        name: '',
        email: '',
        phone: '',
        city: '',
        streetAddress: ''
    });

    useEffect(() => {
        const fetchCustomer = async () => {
            const token = localStorage.getItem('token'); // Get JWT token from localStorage

            if (!token) {
                // If token is missing, redirect to login
                navigate('/login');
                return;
            }

            try {
                const response = await axios.get(`http://localhost:5000/api/customers/${id}`, {
                    headers: {
                        'x-auth-token': token
                    }
                });
                setCustomer(response.data);
            } catch (error) {
                console.error('Error fetching customer:', error);
            }
        };

        fetchCustomer(); // Fetch customer details when the component mounts
    }, [id]);

    const handleChange = (e) => {
        setCustomer({ ...customer, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');

        if (!token) {
            
            navigate('/login');
            return;
        }

        try {
            await axios.put(`http://localhost:5000/api/customers/${id}`, customer, {
                headers: {
                    'x-auth-token': token
                }
            });
            // Show success message and Snackbar
            setSuccessMessage('Customer updated successfully!');
            setShowSnackbar(true);

            setTimeout(() => {
                navigate('/customers'); // Navigate to the customers list page on succesful completion
            }, 2000); // 2-second delay before navigating
        } catch (error) {
            console.error('Error updating customer:', error);
        }
    };

    return (
        // Main form
        <Box component="form" onSubmit={handleSubmit} sx={{ padding: 1, maxWidth: 400 }}>
            <TextField
                label="Name"
                name="name"
                value={customer.name}
                onChange={handleChange}
                fullWidth
                margin="normal"
            />
            <TextField
                label="Email"
                name="email"
                value={customer.email}
                onChange={handleChange}
                fullWidth
                margin="normal"
            />
            <TextField
                label="Phone"
                name="phone"
                value={customer.phone}
                onChange={handleChange}
                fullWidth
                margin="normal"
            />
            <TextField
                label="City/Town"
                name="city"
                value={customer.city}
                onChange={handleChange}
                fullWidth
                margin="normal"
            />
            <TextField
                label="Address"
                name="streetAddress"
                value={customer.streetAddress}
                onChange={handleChange}
                fullWidth
                margin="normal"
            />
            <Button type="submit" variant="contained" color="primary">
                Update Customer
            </Button>

            {/* Snackbar for success notification */}
            <Snackbar
                open={showSnackbar}
                autoHideDuration={6000} 
                onClose={() => setShowSnackbar(false)} // Close after auto-hide or manually
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert onClose={() => setShowSnackbar(false)} severity="success" sx={{ width: '100%' }}>
                    {successMessage}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default EditCustomer;

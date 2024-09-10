import React, { useState, useEffect } from 'react';
import { Box, Button, TextField } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const EditCustomer = () => {
    const { id } = useParams(); // Get the customer ID from the URL
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
            try {
                const response = await axios.get(`http://localhost:5000/api/customers/${id}`);
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
        try {
            await axios.put(`http://localhost:5000/api/customers/${id}`, customer);
            navigate('/customers');
        } catch (error) {
            console.error('Error updating customer:', error);
        }
    };

    return (
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
        </Box>
    );
};

export default EditCustomer;

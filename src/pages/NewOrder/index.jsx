import React, { useState, useEffect } from 'react';
import { Box, Button, TextField, MenuItem, Typography, Select, FormControl, InputLabel } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const NewOrder = () => {
    const [order, setOrder] = useState({
        customer: '',
        products: [],
        totalPrice: 0,
    });
    const [customers, setCustomers] = useState([]);
    const [products, setProducts] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState('');
    const [quantity, setQuantity] = useState(1);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCustomers = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/customers');
                setCustomers(response.data);
            } catch (error) {
                console.error('Error fetching customers:', error);
            }
        };

        const fetchProducts = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/products');
                setProducts(response.data);
            } catch (error) {
                console.error('Error fetching products:', error);
            }
        };

        fetchCustomers();
        fetchProducts();
    }, []);

    const handleCustomerChange = (e) => {
        setOrder({ ...order, customer: e.target.value });
    };

    const handleAddProduct = () => {
        const product = products.find(p => p._id === selectedProduct);
        const productTotal = product.price * quantity;
        setOrder(prevOrder => ({
            ...prevOrder,
            products: [
                ...prevOrder.products,
                {
                    ...product,
                    quantity,
                    totalPrice: productTotal
                }
            ],
            totalPrice: prevOrder.totalPrice + productTotal
        }));
        setSelectedProduct('');
        setQuantity(1);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('/api/orders', order);
            navigate('/orders');
        } catch (error) {
            console.error('Error creating order:', error);
        }
    };

    return (
        <Box component="form" onSubmit={handleSubmit} sx={{ padding: 1, maxWidth: 600 }}>
            <FormControl fullWidth margin="normal">
                <InputLabel>Customer</InputLabel>
                <Select
                    value={order.customer}
                    onChange={handleCustomerChange}
                    required
                >
                    {customers.map(customer => (
                        <MenuItem key={customer._id} value={customer._id}>
                            {customer.name} ({customer.email})
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <FormControl sx={{ minWidth: 200, mr: 2 }}>
                    <InputLabel>Product</InputLabel>
                    <Select
                        value={selectedProduct}
                        onChange={(e) => setSelectedProduct(e.target.value)}
                        required
                    >
                        {products.map(product => (
                            <MenuItem key={product._id} value={product._id}>
                                {product.name}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <TextField
                    label="Quantity"
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    sx={{ width: 80 }}
                />
                <Button variant="contained" color="primary" onClick={handleAddProduct} sx={{ ml: 2 }}>
                    Add Product
                </Button>
            </Box>
            <Typography variant="h6" sx={{ mb: 2 }}>Order Summary</Typography>
            <ul>
                {order.products.map((product, index) => (
                    <li key={index}>
                        {product.name} - {product.quantity} x {product.price} = {product.totalPrice}
                    </li>
                ))}
            </ul>
            <Typography variant="h6">Total Price: ${order.totalPrice.toFixed(2)}</Typography>
            <Button variant="contained" color="primary" type="submit" sx={{ mt: 2 }}>
                Create Order
            </Button>
        </Box>
    );
};

export default NewOrder;

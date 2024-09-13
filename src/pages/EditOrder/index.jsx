import React, { useState, useEffect } from 'react';
import { Box, Button, Select, MenuItem, Typography, FormControl, InputLabel, TextField } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const EditOrder = () => {
    const { id } = useParams();
    const [order, setOrder] = useState({
        customer: '',
        items: [],
        totalAmount: 0,
    });
    const [customers, setCustomers] = useState([]);
    const [products, setProducts] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState('');
    const [quantity, setQuantity] = useState(1);  // State for the quantity
    const navigate = useNavigate();

    useEffect(() => {
        const fetchOrder = async () => {
            const token = localStorage.getItem('token'); // Get JWT token from localStorage

            if (!token) {
                // If token is missing, redirect to login
                navigate('/login');
                return;
            }
            try {
                const response = await axios.get(`http://localhost:5000/api/orders/${id}`, {
                    headers: {
                        'x-auth-token': token,
                    },
                });
                setOrder(response.data);
            } catch (error) {
                console.error('Error fetching order:', error);
            }
        };

        const fetchCustomers = async () => {
            const token = localStorage.getItem('token'); // Get JWT token from localStorage

            if (!token) {
                // If token is missing, redirect to login
                navigate('/login');
                return;
            }

            try {
                const response = await axios.get('http://localhost:5000/api/customers', {
                    headers: {
                        'x-auth-token': token,
                    },
                });
                setCustomers(response.data);
            } catch (error) {
                console.error('Error fetching customers:', error);
            }
        };

        const fetchProducts = async () => {
            const token = localStorage.getItem('token'); // Get JWT token from localStorage

            if (!token) {
                // If token is missing, redirect to login
                navigate('/login');
                return;
            }

            try {
                const response = await axios.get('http://localhost:5000/api/products', {
                    headers: {
                        'x-auth-token': token,
                    },
                });
                setProducts(response.data);
            } catch (error) {
                console.error('Error fetching products:', error);
            }
        };

        fetchOrder();
        fetchCustomers();
        fetchProducts();
    }, [id]);

    const handleCustomerChange = (e) => {
        setOrder({ ...order, customer: e.target.value });
    };

    const handleAddProduct = () => {
        const product = products.find(p => p._id === selectedProduct);
        if (!product) return;

        const productTotal = product.price * quantity;

        const existingItemIndex = order.items.findIndex(item => item.product._id === product._id);
        if (existingItemIndex !== -1) {
            // Update the quantity and total price of the existing item
            const updatedItems = [...order.items];
            updatedItems[existingItemIndex].quantity += quantity;
            updatedItems[existingItemIndex].priceAtPurchase += productTotal;
            setOrder(prevOrder => ({
                ...prevOrder,
                items: updatedItems,
                totalAmount: prevOrder.totalAmount + productTotal
            }));
        } else {
            // Add a new item
            setOrder(prevOrder => ({
                ...prevOrder,
                items: [
                    ...prevOrder.items,
                    {
                        product,
                        quantity,
                        priceAtPurchase: productTotal
                    }
                ],
                totalAmount: prevOrder.totalAmount + productTotal
            }));
        }
        setSelectedProduct('');
        setQuantity(1);
    };

    const handleRemoveProduct = (indexToRemove) => {
        const removedItem = order.items[indexToRemove];
        const updatedItems = order.items.filter((_, index) => index !== indexToRemove);
        const updatedTotalAmount = order.totalAmount - removedItem.priceAtPurchase;

        setOrder(prevOrder => ({
            ...prevOrder,
            items: updatedItems,
            totalAmount: updatedTotalAmount
        }));
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
            await axios.put(`http://localhost:5000/api/orders/${id}`, order, {
                headers: {
                    'x-auth-token': token,
                },
            });
            navigate('/orders');
        } catch (error) {
            console.error('Error updating order:', error);
        }
    };

    return (
        <Box component="form" onSubmit={handleSubmit} sx={{ padding: 2, maxWidth: 600 }}>
            <FormControl fullWidth margin="normal">
                <InputLabel>Customer</InputLabel>
                <Select
                    value={order.customer._id || ''}
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
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    inputProps={{ min: 1 }}
                    sx={{ width: 100, mr: 2 }}
                />
                <Button variant="contained" color="primary" onClick={handleAddProduct} sx={{ ml: 2 }}>
                    Add Product
                </Button>
            </Box>
            <Typography variant="h6" sx={{ mb: 2 }}>Order Summary</Typography>
            <ul>
                {order.items.map((item, index) => (
                    <li key={index}>
                        {item.product.name} - Quantity: {item.quantity}
                        <Button 
                            color="secondary" 
                            onClick={() => handleRemoveProduct(index)} 
                            sx={{ ml: 2 }}
                        >
                            Remove
                        </Button>
                    </li>
                ))}
            </ul>
            <Typography variant="h6">
                Total Price: ${order.totalAmount.toFixed(2)}
            </Typography>
            <Button variant="contained" color="primary" type="submit" sx={{ mt: 2 }}>
                Update Order
            </Button>
        </Box>
    );
};

export default EditOrder;

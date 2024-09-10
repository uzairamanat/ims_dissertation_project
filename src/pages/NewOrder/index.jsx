import React, { useState, useEffect } from 'react';
import { Box, Button, TextField, MenuItem, Typography, Select, FormControl, InputLabel } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const NewOrder = () => {
    const [order, setOrder] = useState({
        customer: '',
        items: [],
        totalAmount: 0,
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
        if (!product) return;

        const productTotal = product.price * quantity;

        // Check if product is already in the order
        const existingItemIndex = order.items.findIndex(item => item.product._id === product._id);
        if (existingItemIndex !== -1) {
            // Update the quantity and total price of the existing item
            const updatedItems = [...order.items];
            updatedItems[existingItemIndex].quantity += quantity;
            updatedItems[existingItemIndex].totalPrice += productTotal;
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
                        product: product,
                        quantity: quantity,
                        priceAtPurchase: product.price,
                        totalPrice: productTotal
                    }
                ],
                totalAmount: prevOrder.totalAmount + productTotal
            }));
        }
        setSelectedProduct('');
        setQuantity(1);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            console.log('Order data being sent:', order); // Add this line to see the payload
            await axios.post('http://localhost:5000/api/orders', { 
                customerName: order.customer,
                items: order.items,
                totalAmount: order.totalAmount 
            });
            navigate('/orders');
        } catch (error) {
            console.error('Error creating order:', error.response ? error.response.data : error);
        }
    };
    
    
    
    return (
        <Box component="form" onSubmit={handleSubmit} sx={{ padding: 2, maxWidth: 600 }}>
            <FormControl fullWidth margin="normal">
                <InputLabel>Customer</InputLabel>
                <Select
                    value={order.customer}
                    onChange={handleCustomerChange}
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
                    sx={{ width: 80 }}
                />
                <Button variant="contained" color="primary" onClick={handleAddProduct} sx={{ ml: 2 }}>
                    Add Product
                </Button>
            </Box>
            <Typography variant="h6" sx={{ mb: 2 }}>Order Summary</Typography>
            <ul>
                {order.items.map((item, index) => (
                    <li key={index}>
                        {item.product.name} - {item.quantity} x {item.priceAtPurchase} = ${item.totalPrice.toFixed(2)}
                    </li>
                ))}
            </ul>
            <Typography variant="h6">Total Price: ${order.totalAmount.toFixed(2)}</Typography>
            <Button variant="contained" color="primary" type="submit" sx={{ mt: 2 }}>
                Create Order
            </Button>
        </Box>
    );
};

export default NewOrder;

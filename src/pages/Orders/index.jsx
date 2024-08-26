import React, { useEffect, useState } from 'react';
import {
    Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, 
    Button, IconButton, Paper, TextField
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Header from 'components/Header';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [searchTerm, setSearchTerm] = useState(''); // State for search term
    const navigate = useNavigate();

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/orders');
                console.log('Fetched Orders:', response.data);
                setOrders(response.data);
            } catch (error) {
                console.error('Error fetching orders:', error);
            }
        };

        fetchOrders();
    }, []);

    const handleEdit = (id) => {
        navigate(`/orders/edit/${id}`);
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/api/orders/${id}`);
            setOrders(orders.filter(order => order._id !== id));
        } catch (error) {
            console.error('Error deleting order:', error);
        }
    };

    const handleExport = async (orderId) => {
        try {
            const response = await axios.get(`http://localhost:5000/api/orders/${orderId}`);
            const order = response.data;

            const doc = new jsPDF();
            doc.text('Customer Details', 14, 22);

            // Customer Details
            doc.text(`Customer Name: ${order.customer.name}`, 14, 30);
            doc.text(`Email: ${order.customer.email}`, 14, 36);
            doc.text(`Phone: ${order.customer.phone}`, 14, 42);
            doc.text(`Address: ${order.customer.streetAddress}`, 14, 48);
            doc.text(`City: ${order.customer.city}`, 14, 54);

            // Order Details
            doc.text('Order Details:', 14, 62);
            doc.autoTable({
                startY: 68,
                head: [['Product', 'Quantity', 'Price Per Unit (£)', 'Total Price (£)']],
                body: order.items.map(item => [
                    item.product.name,
                    item.quantity,
                    item.priceAtPurchase.toFixed(2), // Price per unit formatted to 2 decimal places
                    (item.priceAtPurchase * item.quantity).toFixed(2) // Total price formatted to 2 decimal places
                ])
            });

            // Total Order Price
            const formattedTotalPrice = `£${order.totalAmount.toFixed(2)}`; // Format the total price to pounds and 2 decimal places
            doc.text(`Total Order Price: ${formattedTotalPrice}`, 14, doc.previousAutoTable.finalY + 10);
            
            doc.save(`Order_${order._id}.pdf`);
        } catch (error) {
            console.error('Error exporting order:', error);
        }
    };

    // Filter orders based on the search term
    const filteredOrders = orders.filter(order => 
        order.customer.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <Box sx={{ ml: 1 }}>
            <Header title="ORDERS" subtitle="All current orders in the system." />

            {/* Search Bar */}
            <TextField
                label="Search by Customer Name"
                variant="outlined"
                size="small"
                fullWidth
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                sx={{ mb: 2, mt: 1 }}
            />

            <Button variant="contained" color="primary" onClick={() => navigate('/orders/new')}>
                New Order
            </Button>

            <TableContainer component={Paper} sx={{ maxHeight: 500, backgroundColor: 'transparent', mt: 2 }}>
                <Table size="small" stickyHeader>
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ fontWeight: 'bold' }}>Order ID</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Customer</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Date</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredOrders.map((order) => (
                            <TableRow key={order._id}>
                                <TableCell>{order._id}</TableCell>
                                <TableCell>{order.customer.name}</TableCell>
                                <TableCell>{new Date(order.date).toLocaleDateString()}</TableCell>
                                <TableCell>
                                    <IconButton onClick={() => handleEdit(order._id)} size="small">
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton onClick={() => handleDelete(order._id)} size="small">
                                        <DeleteIcon />
                                    </IconButton>
                                    <Button onClick={() => handleExport(order._id)} size="small">
                                        Export
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};

export default Orders;

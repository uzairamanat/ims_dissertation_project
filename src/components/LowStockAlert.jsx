// Component to keep track of items that are low in stock (less than 10)

import React, { useState, useEffect } from "react";
import { Box, Typography, CircularProgress, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";
import { useNavigate } from "react-router-dom"; 
import axios from "axios";

const LowStockAlert = () => {
    const [lowStockProducts, setLowStockProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate(); 

    // Fetch low-stock products
    useEffect(() => {
        const fetchLowStockProducts = async () => {
            const token = localStorage.getItem('token'); // Get JWT token from localStorage

            if (!token) {
                // If token is missing, redirect to login
                navigate('/login');
                return;
            }

            try {
                const response = await axios.get('http://localhost:5000/api/products/alerts/low-stock', {
                    headers: { 'x-auth-token': token } // Pass the token in the headers
                });

                setLowStockProducts(response.data);
                setLoading(false);
            } catch (error) {
                setLoading(false);
                if (error.response && error.response.status === 401) {
                    // If unauthorised, redirect to login
                    navigate('/login');
                } else {
                    setError(error.message || 'Error fetching low-stock products');
                }
            }
        };

        fetchLowStockProducts();
    }, [navigate]);

    if (loading) return <CircularProgress />;
    if (error) return <Typography color="error">{error}</Typography>;

    return (
        <Box sx={{ mt: 1, p: 2, border: '1px solid', borderColor: 'grey.500', borderRadius: 2 }}>
            
            <Typography variant="h3" gutterBottom sx={{ color: '#FF9800' }}>
                Low Stock Alerts
            </Typography>

            {lowStockProducts.length === 0 ? (
                <Typography>No products are running low on stock.</Typography>
            ) : (
                <TableContainer component={Paper}>
                    <Table size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 'bold' }}>Product Name</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>Quantity</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {lowStockProducts.map(product => (
                                <TableRow key={product._id}>
                                    <TableCell>{product.name}</TableCell>
                                    <TableCell>{product.quantity}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
        </Box>
    );
};

export default LowStockAlert;

import React, { useState, useEffect } from "react";
import { Box, Typography, CircularProgress, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";

const LowStockAlert = () => {
    const [lowStockProducts, setLowStockProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch low-stock products
    useEffect(() => {
        const fetchLowStockProducts = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/products/alerts/low-stock');
                const data = await response.json();
                
                if (!response.ok) {
                    throw new Error(data.message || 'Error fetching low-stock products');
                }

                setLowStockProducts(data);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchLowStockProducts();
    }, []);

    if (loading) return <CircularProgress />;
    if (error) return <Typography color="error">{error}</Typography>;

    return (
        <Box sx={{ mt: 3, p: 2, border: '1px solid', borderColor: 'grey.500', borderRadius: 2 }}>
            {/* Title with orangeish color */}
            <Typography variant="h5" gutterBottom sx={{ color: '#FF9800' }}>
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

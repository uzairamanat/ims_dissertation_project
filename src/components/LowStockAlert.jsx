import React, { useState, useEffect } from "react";
import { Box, Typography, CircularProgress } from "@mui/material";

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
            <Typography variant="h5" gutterBottom>
                Low Stock Alerts
            </Typography>
            {lowStockProducts.length === 0 ? (
                <Typography>No products are running low on stock.</Typography>
            ) : (
                <ul>
                    {lowStockProducts.map(product => (
                        <li key={product._id}>
                            {product.name} (Quantity: {product.quantity})
                        </li>
                    ))}
                </ul>
            )}
        </Box>
    );
};

export default LowStockAlert;

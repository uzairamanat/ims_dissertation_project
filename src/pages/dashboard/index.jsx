import React, { useState, useEffect } from 'react';
import SalesByCategoryChart from "components/SalesByCategoryChart";
import SalesOverTimeChart from "components/SalesOverTimeChart"; 
import LowStockAlert from "components/LowStockAlert";
import DashboardCard from "components/DashboardCard";
import axios from "axios";
import Header from "components/Header";
import { Box, Grid } from "@mui/material";

const Dashboard = () => {
    const [productCount, setProductCount] = useState(0);
    const [customerCount, setCustomerCount] = useState(0);
    const [orderCount, setOrderCount] = useState(0);

    useEffect(() => {
        const fetchCounts = async () => {
            try {
                const productResponse = await axios.get('http://localhost:5000/api/products');
                const customerResponse = await axios.get('http://localhost:5000/api/customers');
                const orderResponse = await axios.get('http://localhost:5000/api/orders');

                setProductCount(productResponse.data.length);
                setCustomerCount(customerResponse.data.length);
                setOrderCount(orderResponse.data.length);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchCounts();
    }, []);

    return (
        <Box sx={{ ml: 1, mt: 2 }}>
            {/* Header */}
            <Header title="DASHBOARD" subtitle="Manage your inventory." />

            {/* First Row: Low Stock Alert and Cards */}
            <Grid container spacing={2} sx={{ mt: 2 }}>
                {/* Low Stock Alert covering half the screen width */}
                <Grid item xs={12} md={6}>
                    <LowStockAlert />
                </Grid>

                {/* Cards splitting the remaining half */}
                <Grid item xs={12} md={5} sx={{ml:2}}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={4}>
                            <DashboardCard title="Products" number={productCount} color="#1e88e5" />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <DashboardCard title="Customers" number={customerCount} color="#43a047" />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <DashboardCard title="Orders" number={orderCount} color="#f4511e" />
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>

            {/* Second Row: Charts */}
            <Grid container spacing={2} sx={{ mt: 2 }}>
                {/* Sales by Category Chart */}
                <Grid item xs={12} md={6}>
                    <Box>
                        <h2>Sales by Category</h2>
                        <SalesByCategoryChart />
                    </Box>
                </Grid>

                {/* Sales Over Time Chart */}
                <Grid item xs={12} md={6}>
                    <Box>
                        <h2>Sales Over Time</h2>
                        <SalesOverTimeChart />
                    </Box>
                </Grid>
            </Grid>
        </Box>
    );
};

export default Dashboard;

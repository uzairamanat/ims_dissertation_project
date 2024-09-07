import React from "react";
import SalesByCategoryChart from "components/SalesByCategoryChart";
import SalesOverTimeChart from "components/SalesOverTimeChart"; 
import Header from "components/Header";
import { Box, Grid } from "@mui/material";

const Dashboard = () => {
    return (
        <Box sx={{ ml: 1 }}>
            <Header title="DASHBOARD" subtitle="Manage your inventory." />
            {/* Using MUI Grid for layout */}
            <Grid container spacing={1}>
                <Grid item xs={12} sm={6}>
                    <Box>
                        <h2>Sales by Category</h2>
                        <SalesByCategoryChart />
                    </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Box sx={{ mr: 10}}>
                        <h2>Yearly Sales</h2>
                        <SalesOverTimeChart />
                    </Box>
                </Grid>
            </Grid>
        </Box>
    );
};

export default Dashboard;


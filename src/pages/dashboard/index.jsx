import React from "react";
import SalesByCategoryChart from "components/SalesByCategoryChart";
import SalesOverTimeChart from "components/SalesOverTimeChart"; 
import LowStockAlert from "components/LowStockAlert";
import Header from "components/Header";
import { Box, Grid } from "@mui/material";

const Dashboard = () => {
    return (
        <Box sx={{ ml: 1 }}>
            {/* Header */}
            <Header title="DASHBOARD" subtitle="Manage your inventory." />

            {/* Low Stock Alert Component at the Top */}
            <Box sx={{ mt: 2, width: { xs: '100%', md: '50%'} }}>                
                <LowStockAlert />
            </Box>

            {/* Use Grid or Flexbox for the Two Charts */}
            <Grid container spacing={2} sx={{ mt: 0.5 }}>
                {/* First Chart: Sales by Category */}
                <Grid item xs={12} md={6}>
                    <Box>
                        <h2>Sales by Category</h2>
                        <SalesByCategoryChart />
                    </Box>
                </Grid>

                {/* Second Chart: Yearly Sales */}
                <Grid item xs={12} md={6}>
                    <Box>
                        <h2>Yearly Sales</h2>
                        <SalesOverTimeChart />
                    </Box>
                </Grid>
            </Grid>
        </Box>
    );
};

export default Dashboard;

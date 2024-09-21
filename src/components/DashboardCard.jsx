// Card component to display the 3 categories and their total count on the dashboard

import React from 'react';
import {Typography, Card, CardContent } from '@mui/material';

const DashboardCard = ({ title, number, color }) => {
    return (
        <Card 
            sx={{ 
                minWidth: 100,                 
                textAlign: 'center', 
                backgroundColor: color || '#f5f5f5', 
                mb: 1 
            }}
        >   
            {/* Card will just be the title of products/customers/order with the total amount of each currently available */}
            <CardContent>
                <Typography variant="h6" component="div">
                    {title}
                </Typography>
                <Typography variant="h4" component="div" sx={{ mt: 2, fontWeight: 'bold' }}>
                    {number}
                </Typography>
            </CardContent>
        </Card>
    );
};

export default DashboardCard;

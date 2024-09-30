// Simple carc domponent, with a title and then how many items are in that section

import React from 'react';
import { Typography, Card, CardContent } from '@mui/material';

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

// Line graph to display sales over the last year

import React from 'react';
import { ResponsiveLine } from '@nivo/line';
import { useTheme } from '@mui/material/styles'; 
import { tokensDark, tokensLight } from '../theme'; 

const SalesOverTimeChart = () => {
    const theme = useTheme();
    const mode = theme.palette.mode;
    
    // Use dark or light tokens based on the mode
    const tokens = mode === "dark" ? tokensDark : tokensLight;

    // Dummy data representing sales over the last year (monthly sales)
    const data = [
        {
            id: 'Sales',
            color: tokens.primary[400], // Use primary color from theme
            data: [
                { x: 'JAN', y: 1500 },
                { x: 'FEB', y: 1800 },
                { x: 'MAR', y: 2000 },
                { x: 'APR', y: 2500 },
                { x: 'MAY', y: 3000 },
                { x: 'JUN', y: 3200 },
                { x: 'JUL', y: 2800 },
                { x: 'AUG', y: 3500 },
                { x: 'SEP', y: 2700 },
                { x: 'OCT', y: 4000 },
                { x: 'NOV', y: 3800 },
                { x: 'DEC', y: 4500 },
            ],
        },
    ];

    return (
        <div style={{ height: '50vh', width: '40vw' }}>
            <ResponsiveLine
                data={data}
                margin={{ top: 10, right: 110, bottom: 50, left: 60 }}
                xScale={{ type: 'point' }}
                yScale={{
                    type: 'linear',
                    min: '0',
                    max: '5000',
                    stacked: true,
                    reverse: false,
                }}
                axisTop={null}
                axisRight={null}
                axisBottom={{
                    orient: 'bottom',
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: 0,
                    legend: 'Month',
                    legendOffset: 36,
                    legendPosition: 'middle',
                    tickColor: tokens.grey[100], 
                    legendTextColor: tokens.grey[100], 
                }}
                axisLeft={{
                    orient: 'left',
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: 0,
                    legend: 'Sales (£)',
                    legendOffset: -50,
                    legendPosition: 'middle',
                    tickColor: tokens.grey[100], 
                    legendTextColor: tokens.grey[100], 
                    tickValues: [0, 1000, 2000, 3000, 4000, 5000],
                }}
                colors={{ scheme: mode === "dark" ? "nivo" : "set1" }} // Dynamic color scheme based on mode
                pointSize={10}
                pointColor={{ theme: 'background' }}
                pointBorderWidth={2}
                pointBorderColor={{ from: 'serieColor' }}
                pointLabelYOffset={-12}
                enableGridX={false}
                enableGridY={true}
                gridYValues={[0, 1000, 2000, 3000, 4000, 5000]}
                useMesh={true}
                theme={{
                    axis: {
                        ticks: {
                            line: {
                                stroke: tokens.grey[100], 
                            },
                            text: {
                                fill: tokens.grey[100], 
                            },
                        },
                        legend: {
                            text: {
                                fill: tokens.grey[100], 
                            },
                        },
                    },
                    legends: {
                        text: {
                            fill: tokens.grey[100], 
                        },
                    },
                    grid: {
                        line: {
                            stroke: tokens.grey[500], 
                        },
                    },
                    crosshair: {
                        line: {
                            stroke: tokens.grey[300], 
                            strokeWidth: 1,
                            strokeOpacity: 0.75,
                        },
                    },
                    tooltip: {
                        container: {
                            background: tokens.primary[700], 
                            color: tokens.grey[50], 
                        },
                    },
                }}
                legends={[]}
                tooltip={({ point }) => (
                    <div
                        style={{
                            background: tokensDark.primary[700],
                            color: tokensDark.grey[50],
                            padding: '5px 10px',
                            borderRadius: '3px',
                        }}
                    >
                        <strong>Month:</strong> {point.data.xFormatted}<br />
                        <strong>Sales:</strong> £{point.data.yFormatted}
                    </div>
                )}
                animate="true"
                motionConfig="default"
            />
        </div>
    );
};

export default SalesOverTimeChart;
import React from 'react';
import { ResponsiveLine } from '@nivo/line';
import { useTheme } from '@mui/material/styles'; // To access the theme
import { tokensDark, tokensLight } from '../theme'; // Import your tokens

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
                { x: 'January', y: 1500 },
                { x: 'February', y: 1800 },
                { x: 'March', y: 2000 },
                { x: 'April', y: 2500 },
                { x: 'May', y: 3000 },
                { x: 'June', y: 3200 },
                { x: 'July', y: 2800 },
                { x: 'August', y: 3500 },
                { x: 'September', y: 2700 },
                { x: 'October', y: 4000 },
                { x: 'November', y: 3800 },
                { x: 'December', y: 4500 },
            ],
        },
    ];

    return (
        <div style={{ height: '50vh', width: '50vw' }}>
            <ResponsiveLine
                data={data}
                margin={{ top: 10, right: 110, bottom: 50, left: 60 }}
                xScale={{ type: 'point' }}
                yScale={{
                    type: 'linear',
                    min: 'auto',
                    max: 'auto',
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
                    tickColor: tokens.grey[100], // Use theme color for ticks
                    legendTextColor: tokens.grey[100], // Use theme color for legend text
                }}
                axisLeft={{
                    orient: 'left',
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: 0,
                    legend: 'Sales ($)',
                    legendOffset: -50,
                    legendPosition: 'middle',
                    tickColor: tokens.grey[100], // Use theme color for ticks
                    legendTextColor: tokens.grey[100], // Use theme color for legend text
                }}
                colors={{ scheme: mode === "dark" ? "nivo" : "set1" }} // Dynamic color scheme based on mode
                pointSize={10}
                pointColor={{ theme: 'background' }}
                pointBorderWidth={2}
                pointBorderColor={{ from: 'serieColor' }}
                pointLabelYOffset={-12}
                enableGridX={false}
                enableGridY={true}
                gridYValues={5}
                useMesh={true}
                theme={{
                    axis: {
                        ticks: {
                            line: {
                                stroke: tokens.grey[100], // Dynamic tick line color
                            },
                            text: {
                                fill: tokens.grey[100], // Dynamic tick text color
                            },
                        },
                        legend: {
                            text: {
                                fill: tokens.grey[100], // Dynamic legend text color
                            },
                        },
                    },
                    legends: {
                        text: {
                            fill: tokens.grey[100], // Dynamic legend color
                        },
                    },
                    grid: {
                        line: {
                            stroke: tokens.grey[500], // Dynamic grid line color
                        },
                    },
                    crosshair: {
                        line: {
                            stroke: tokens.grey[300], // Crosshair color
                            strokeWidth: 1,
                            strokeOpacity: 0.75,
                        },
                    },
                    tooltip: {
                        container: {
                            background: tokens.primary[700], // Tooltip background in dark mode
                            color: tokens.grey[50], // Tooltip text color in dark mode
                        },
                    },
                }}
                legends={[
                    {
                        anchor: 'bottom-right',
                        direction: 'column',
                        justify: false,
                        translateX: 100,
                        translateY: 0,
                        itemsSpacing: 0,
                        itemDirection: 'left-to-right',
                        itemWidth: 80,
                        itemHeight: 20,
                        itemOpacity: 0.75,
                        symbolSize: 12,
                        symbolShape: 'circle',
                        symbolBorderColor: 'rgba(0, 0, 0, .5)',
                        effects: [
                            {
                                on: 'hover',
                                style: {
                                    itemBackground: 'rgba(0, 0, 0, .03)',
                                    itemOpacity: 1,
                                },
                            },
                        ],
                    },
                ]}
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
                        <strong>Sales:</strong> ${point.data.yFormatted}
                    </div>
                )}
            />
        </div>
    );
};

export default SalesOverTimeChart;

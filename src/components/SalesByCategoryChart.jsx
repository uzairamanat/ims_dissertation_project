import React from 'react';
import { ResponsivePie } from '@nivo/pie';

const SalesByCategoryChart = () => {
    // Dummy data
    const data = [
        { id: 'Rice', label: 'Rice', value: 1200 },
        { id: 'Spices', label: 'Spices', value: 600 },
        { id: 'Drinks', label: 'Drinks', value: 800 },
        { id: 'Snacks', label: 'Snacks', value: 900 },
        { id: 'Air Fresheners', label: 'Air Fresheners', value: 300 },
        { id: 'Pulses', label: 'Pulses', value: 400 },
    ];

    // Calculate total sales
    const totalSales = data.reduce((acc, category) => acc + category.value, 0);

    return (
        <div style={{ height: '40vh', width: '31vw', position: 'relative'}}>
            <ResponsivePie
                data={data}
                margin={{ top: 30, right: 0, bottom: 30, left: 0 }}
                innerRadius={0.5}
                padAngle={0.7}
                cornerRadius={3}
                activeOuterRadiusOffset={8}
                borderWidth={1}
                borderColor={{
                    from: 'color',
                    modifiers: [['darker', 0.2]],
                }}
                arcLinkLabelsSkipAngle={10}
                arcLinkLabelsThickness={2}
                arcLinkLabelsColor={{ from: 'color' }}
                arcLinkLabelsTextColor={(d) => d.color}
                arcLabelsSkipAngle={10}
                arcLabelsTextColor={(d) =>
                    d.color === '#ffffff' || d.color === '#ffff00'
                        ? 'black'
                        : 'white'
                }
                arcLabelsRadiusOffset={0.6}
                defs={[]}
                fill={[]}
                legends={[]}
                tooltip={() => null}
                animate={true}
                motionStiffness={90}
                motionDamping={15}
            />

            {/* Centered Total Sales Text */}
            <div
                style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    textAlign: 'center',
                    fontSize: '13px',
                    color: '#ffffff', // You can adjust this color based on your background
                    pointerEvents: 'none',
                }}
            >
                <strong>Total Sales</strong>
                <br />
                £{totalSales}
            </div>
        </div>
    );
};

export default SalesByCategoryChart;

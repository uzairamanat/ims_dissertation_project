import React, { useEffect, useState } from 'react';
import {
    Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, 
    Button, IconButton, Paper, TextField, MenuItem, Select, FormControl, 
    InputLabel
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Header from 'components/Header';

const Products = () => {
    const [products, setProducts] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('');
    const [brandFilter, setBrandFilter] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/products');
                setProducts(response.data);
            } catch (error) {
                console.error('Error fetching products:', error);
            }
        };

        fetchProducts();
    }, []);

    const handleEdit = (id) => {
        navigate(`/products/edit/${id}`);
    };

    const handleDelete = (id) => {
        // Add your delete functionality here
    };

    const filteredProducts = products.filter(product => {
        return (
            (product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.SKU.toLowerCase().includes(searchTerm.toLowerCase())) &&
            (categoryFilter ? product.category === categoryFilter : true) &&
            (brandFilter ? product.brand === brandFilter : true)
        );
    });

    return (
        <Box sx={{ ml: "3px"}}>
            <Header title="PRODUCTS" subtitle="All current products available in the inventory." />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Button variant="contained" color="primary" onClick={() => navigate('/products/new')}>
                    Add New Product
                </Button>
                <Box sx={{ display: 'flex', gap: 2 }}>
                    <TextField
                        label="Search"
                        variant="outlined"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        sx={{ minWidth: 200 }}
                    />
                    <FormControl variant="outlined" sx={{ minWidth: 150 }}>
                        <InputLabel>Category</InputLabel>
                        <Select
                            value={categoryFilter}
                            onChange={(e) => setCategoryFilter(e.target.value)}
                            label="Category"
                        >
                            <MenuItem value="">All Categories</MenuItem>
                            <MenuItem value="Rice">Rice</MenuItem>
                            <MenuItem value="Spices">Spices</MenuItem>
                            <MenuItem value="Drinks">Drinks</MenuItem>
                            <MenuItem value="Snacks">Snacks</MenuItem>
                            <MenuItem value="Air Fresheners">Air Fresheners</MenuItem>
                            <MenuItem value="Pulses">Pulses</MenuItem>
                        </Select>
                    </FormControl>
                    <FormControl variant="outlined" sx={{ minWidth: 150 }}>
                        <InputLabel>Brand</InputLabel>
                        <Select
                            value={brandFilter}
                            onChange={(e) => setBrandFilter(e.target.value)}
                            label="Brand"
                        >
                            <MenuItem value="">All Brands</MenuItem>
                            {/* Add your brand options here */}
                            <MenuItem value="King Of Rice">King Of Rice</MenuItem>
                            <MenuItem value="Pepsi">Pepsi</MenuItem>
                            <MenuItem value="King Of Spice">King Of Spice</MenuItem>
                            <MenuItem value="Koka">Koka</MenuItem>
                            <MenuItem value="Delta">Delta</MenuItem>
                            <MenuItem value="Rozee">Rozee</MenuItem>
                        </Select>
                    </FormControl>
                </Box>
            </Box>
            <TableContainer component={Paper} sx={{backgroundColor: 'transparent'}}>
                <Table size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ fontWeight: 'bold' }}>Brand</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Name</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>SKU</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Quantity</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Price</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Amount Per Unit</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Unit Measurement</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Category</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredProducts.map((product) => (
                            <TableRow key={product._id}>
                                <TableCell>{product.brand}</TableCell>
                                <TableCell>{product.name}</TableCell>
                                <TableCell>{product.SKU}</TableCell>
                                <TableCell>{product.quantity}</TableCell>
                                <TableCell>{product.price}</TableCell>
                                <TableCell>{product.amountPerUnit}</TableCell>
                                <TableCell>{product.unitMeasurement}</TableCell>
                                <TableCell>{product.category}</TableCell>
                                <TableCell>
                                    <IconButton onClick={() => handleEdit(product._id)} size="small">
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton onClick={() => handleDelete(product._id)} size="small">
                                        <DeleteIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};

export default Products;

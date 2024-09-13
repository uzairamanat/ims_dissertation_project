import React, { useEffect, useState } from 'react';
import {
    Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, 
    Button, IconButton, Paper, TextField, MenuItem, Select, FormControl, 
    InputLabel, Slider, Typography, Pagination
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
    const [priceRange, setPriceRange] = useState([0, 100]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;

    const navigate = useNavigate();

    useEffect(() => {
        const fetchProducts = async () => {
            const token = localStorage.getItem('token'); // Get JWT token from localStorage

            if (!token) {
                // If token is missing, redirect to login
                navigate('/login');
                return;
            }
            try {
                const response = await axios.get('http://localhost:5000/api/products', {
                    headers: { 'x-auth-token': token }
                });
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

    const handleDelete = async (id) => {
        const token = localStorage.getItem('token'); // Get JWT token from localStorage

        if (!token) {
            // If token is missing, redirect to login
            navigate('/login');
            return;
        }
        try {
            await axios.delete(`http://localhost:5000/api/products/${id}`, {
                headers: { 'x-auth-token': token }
            });
            setProducts(products.filter(product => product._id !== id));
        } catch (error) {
            console.error('Error deleting product:', error);
        }
    };

    const handlePriceRangeChange = (event, newValue) => {
        setPriceRange(newValue);
    };

    const filteredProducts = products.filter(product => {
        return (
            (product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.SKU.toLowerCase().includes(searchTerm.toLowerCase())) &&
            (categoryFilter ? product.category === categoryFilter : true) &&
            (brandFilter ? product.brand === brandFilter : true) &&
            product.price >= priceRange[0] && product.price <= priceRange[1]
        );
    });

    const indexOfLastProduct = currentPage * itemsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - itemsPerPage;
    const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

    const handlePageChange = (event, value) => {
        setCurrentPage(value);
    };

    return (
        <Box sx={{ml: 1}}>
            <Header title="PRODUCTS" subtitle="All current products available in the inventory." />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, mt: 1 }}>
                <Button variant="contained" color="primary" onClick={() => navigate('/products/new')}>
                    New Product
                </Button>
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                    <TextField
                        label="Search..."
                        variant="outlined"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        sx={{ width: 150, maxWidth: '100%', height: 40}}
                    />
                    <FormControl variant="outlined" sx={{ minWidth: 120, maxWidth: 150 }}>
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
                    <FormControl variant="outlined" sx={{ minWidth: 120, maxWidth: 150 }}>
                        <InputLabel>Brand</InputLabel>
                        <Select
                            value={brandFilter}
                            onChange={(e) => setBrandFilter(e.target.value)}
                            label="Brand"
                        >
                            <MenuItem value="">All Brands</MenuItem>
                            <MenuItem value="King Of Rice">King Of Rice</MenuItem>
                            <MenuItem value="Pepsi">Pepsi</MenuItem>
                            <MenuItem value="King Of Spice">King Of Spice</MenuItem>
                            <MenuItem value="Koka">Koka</MenuItem>
                            <MenuItem value="Delta">Delta</MenuItem>
                            <MenuItem value="Rozee">Rozee</MenuItem>
                        </Select>
                    </FormControl>
                    <Box sx={{ width: 250, paddingLeft: 2 }}>
                        <Typography gutterBottom>Price Range</Typography>
                        <Slider
                            value={priceRange}
                            onChange={handlePriceRangeChange}
                            valueLabelDisplay="auto"
                            min={0}
                            max={100}
                            step={1}
                            sx={{ width: '90%' }}
                        />
                    </Box>
                </Box>
            </Box>
            <TableContainer component={Paper} sx={{ maxHeight: 500, backgroundColor: 'transparent' }}>
                <Table size="small" stickyHeader>
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
                        {currentProducts.map((product) => (
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
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                <Pagination
                    count={totalPages}
                    page={currentPage}
                    onChange={handlePageChange}
                    color="primary"
                />
            </Box>
        </Box>
    );
};

export default Products;

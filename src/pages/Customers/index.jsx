// Main customers page with data table

import React, { useEffect, useState } from 'react';
import {
    Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, 
    Button, IconButton, Paper, TextField, MenuItem, Select, FormControl, 
    InputLabel, Pagination
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Header from 'components/Header';

const Customers = () => {
    const [customers, setCustomers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [cityFilter, setCityFilter] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;  // Maximum of 8 items per page

    const navigate = useNavigate();

    useEffect(() => {
        const fetchCustomers = async () => {
            const token = localStorage.getItem('token'); 

            if (!token) {
                
                navigate('/login');
                return;
            }
            try {                
                const response = await axios.get('http://localhost:5000/api/customers', {
                    headers: { 'x-auth-token': token }
                });
                setCustomers(response.data);
            } catch (error) {
                console.error('Error fetching customers:', error);
            }
        };
        fetchCustomers();
    }, []);

    const handleEdit = (id) => {
        navigate(`/customers/edit/${id}`);
    };

    const handleDelete = async (id) => {
        const isConfirmed = window.confirm('Are you sure you want to delete this customer?'); // Confirmation step
        if (!isConfirmed) return; // If the user clicks "Cancel", do nothing

        const token = localStorage.getItem('token'); 

        if (!token) {
            
            navigate('/login');
            return;
        }

        try {            
            await axios.delete(`http://localhost:5000/api/customers/${id}`, {
                headers: { 'x-auth-token': token }
            });
            setCustomers(customers.filter(customer => customer._id !== id));
        } catch (error) {
            console.error('Error deleting customer:', error);
        }
    };

    const filteredCustomers = customers.filter(customer => {
        return (
            (customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            customer.email.toLowerCase().includes(searchTerm.toLowerCase())) &&
            (cityFilter ? customer.city === cityFilter : true)
        );
    });

    // Get unique cities from the customers data
    const uniqueCities = [...new Set(customers.map(customer => customer.city))];

    const indexOfLastCustomer = currentPage * itemsPerPage;
    const indexOfFirstCustomer = indexOfLastCustomer - itemsPerPage;
    const currentCustomers = filteredCustomers.slice(indexOfFirstCustomer, indexOfLastCustomer);
    const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage);

    const handlePageChange = (event, value) => {
        setCurrentPage(value);
    };

    return (
        <Box sx={{ ml: 1 }}>
            <Header title="CUSTOMERS" subtitle="All current customers in the system." />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, mt: 1, mr: 4 }}>
                <Button variant="contained" color="primary" onClick={() => navigate('/customers/new')}>
                    New Customer
                </Button>
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                    <TextField
                        label="Search..."
                        variant="outlined"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        sx={{ width: 150, maxWidth: '100%', height: 40 }}
                    />
                    <FormControl variant="outlined" sx={{ minWidth: 120, maxWidth: 150 }}>
                        <InputLabel>City</InputLabel>
                        <Select
                            value={cityFilter}
                            onChange={(e) => setCityFilter(e.target.value)}
                            label="City"
                        >
                            <MenuItem value="">All Cities</MenuItem>
                            {uniqueCities.map(city => (
                                <MenuItem key={city} value={city}>
                                    {city}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Box>
            </Box>
            <TableContainer component={Paper} sx={{ maxHeight: 500, backgroundColor: 'transparent' }}>
                <Table size="small" stickyHeader>
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ fontWeight: 'bold' }}>Name</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Email</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Phone</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>City</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Address</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {currentCustomers.map((customer) => (
                            <TableRow key={customer._id}>
                                <TableCell>{customer.name}</TableCell>
                                <TableCell>{customer.email}</TableCell>
                                <TableCell>{customer.phone}</TableCell>
                                <TableCell>{customer.city}</TableCell>
                                <TableCell>{customer.streetAddress}</TableCell>
                                <TableCell>
                                    <IconButton onClick={() => handleEdit(customer._id)} size="small">
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton onClick={() => handleDelete(customer._id)} size="small">
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

export default Customers;

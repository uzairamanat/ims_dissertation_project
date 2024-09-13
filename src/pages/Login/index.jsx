import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Avatar, Box, Button, Container, Paper, TextField, Typography } from '@mui/material';
import { LockOutlined } from '@mui/icons-material';

const Login = () => {
  const [username, setUsername] = useState('');  
  const [password, setPassword] = useState('');  
  const [error, setError] = useState('');        
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();  // prevent form default submission
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', { username, password });
      localStorage.setItem('token', res.data.token);  // Store the token in localStorage
      navigate('/dashboard');  // Redirect to the dashboard after successful login
    } catch (err) {
      setError('Invalid Credentials');  // set error message if login fails
    }
  };

  return (
    <Container 
        maxWidth='false'
        sx={{
            height: '100vh',
            display:'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundImage: 'url(https://i.imgur.com/GhPQ3Kl.jpeg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center'

        }}    
    
    >
      <Paper elevation={10} sx={{ padding: 2, width:310, backgroundColor: '#000330', borderRadius: 4}}>
        <Avatar sx={{ mx: 'auto', bgcolor: 'secondary.main', textAlign: 'center', mb: 1 }}>
          <LockOutlined />
        </Avatar>
        <Typography component="h1" sx={{ textAlign: 'center' }}>
          Login
        </Typography>
        {error && (
          <Typography color="error" sx={{ textAlign: 'center', mb: 2 }}>
            {error}
          </Typography>
        )}
        <Box component="form" sx={{ mt: 1 }} onSubmit={handleSubmit}>
          <TextField
            label='Username'
            placeholder='Enter username'
            fullWidth
            required
            autoFocus
            sx={{ mb: 2 }}
            value={username}
            onChange={(e) => setUsername(e.target.value)}  // update username state on input change
          />
          <TextField
            label='Password'
            placeholder='Enter password'
            type='password'
            fullWidth
            required
            sx={{ mb: 2 }}
            value={password}
            onChange={(e) => setPassword(e.target.value)}  // update password state on input change
          />
          <Button type='submit' variant='contained' color='secondary' fullWidth>
            Log In
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default Login;


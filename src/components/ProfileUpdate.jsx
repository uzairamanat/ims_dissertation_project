import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Paper, Avatar, Typography, TextField, Button, Box, Alert } from '@mui/material';
import { LockOutlined } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles'; // Import useTheme hook
import axios from 'axios';

const ProfileUpdate = () => {
  const [newUsername, setNewUsername] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const navigate = useNavigate();
  const theme = useTheme(); // Access the theme

  const handleUsernameSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token'); // Get JWT token from localStorage

    if (!token) {
        // If token is missing, redirect to login
        navigate('/login');
        return;
    }
    try {
      await axios.put(
        'http://localhost:5000/api/auth/update-username',
        { newUsername },
        {
            headers: { 'x-auth-token': token },
        }
      );
      setSuccessMessage('Username updated successfully');
      setUsernameError('');
      setShowSuccess(true);
    } catch (error) {
      setUsernameError(error.response?.data?.msg || 'Error updating username');
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        'http://localhost:5000/api/auth/update-password',
        { currentPassword, newPassword },
        {
          headers: {
            'x-auth-token': localStorage.getItem('token'),
          },
        }
      );
      setSuccessMessage('Password updated successfully');
      setPasswordError('');
      setShowSuccess(true); // Show success message on successful update
    } catch (error) {
      setPasswordError(error.response?.data?.msg || 'Error updating password');
    }
  };

  return (
    <div>
      <Paper
        elevation={10}
        sx={{
          padding: 2,
          width: 310,
          backgroundColor: theme.palette.background.alt, // Dynamic background color
          color: theme.palette.text.primary, // Dynamic text color
          borderRadius: 4,
          marginBottom: 4,
          marginLeft: 1,
        }}
      >
        <Avatar sx={{ mx: 'auto', bgcolor: theme.palette.secondary.main, textAlign: 'center', mb: 1 }}>
          <LockOutlined />
        </Avatar>
        <Typography component="h1" sx={{ textAlign: 'center' }}>
          Update Profile
        </Typography>

        {showSuccess && (
          <Alert severity="success" sx={{ textAlign: 'center', mb: 2 }}>
            {successMessage}
          </Alert>
        )}

        {/* Update Username Form */}
        <Box component="form" sx={{ mt: 1 }} onSubmit={handleUsernameSubmit}>
          <Typography component="h2" sx={{ mb: 1 }}>
            Update Username
          </Typography>
          {usernameError && (
            <Typography color="error" sx={{ textAlign: 'center', mb: 2 }}>
              {usernameError}
            </Typography>
          )}
          <TextField
            label="New Username"
            placeholder="Enter new username"
            fullWidth
            required
            autoFocus
            sx={{
              mb: 2,
              '& .MuiInputBase-root': {
                backgroundColor: theme.palette.background.default, // Dynamic input background
              },
            }}
            value={newUsername}
            onChange={(e) => setNewUsername(e.target.value)} // Update username state on input change
          />
          <Button type="submit" variant="contained" color="secondary" fullWidth>
            Update Username
          </Button>
        </Box>
      </Paper>

      <Paper
        elevation={10}
        sx={{
          padding: 2,
          width: 310,
          backgroundColor: theme.palette.background.alt, // Dynamic background color
          color: theme.palette.text.primary, // Dynamic text color
          borderRadius: 4,
          marginLeft: 1,
        }}
      >
        {/* Update Password Form */}
        <Box component="form" sx={{ mt: 1 }} onSubmit={handlePasswordSubmit}>
          <Typography component="h2" sx={{ mb: 1 }}>
            Update Password
          </Typography>
          {passwordError && (
            <Typography color="error" sx={{ textAlign: 'center', mb: 2 }}>
              {passwordError}
            </Typography>
          )}
          <TextField
            label="Current Password"
            placeholder="Enter current password"
            type="password"
            fullWidth
            required
            sx={{
              mb: 2,
              '& .MuiInputBase-root': {
                backgroundColor: theme.palette.background.default, // Dynamic input background
              },
            }}
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)} // Update current password state on input change
          />
          <TextField
            label="New Password"
            placeholder="Enter new password"
            type="password"
            fullWidth
            required
            sx={{
              mb: 2,
              '& .MuiInputBase-root': {
                backgroundColor: theme.palette.background.default, // Dynamic input background
              },
            }}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)} // Update new password state on input change
          />
          <Button type="submit" variant="contained" color="secondary" fullWidth>
            Update Password
          </Button>
        </Box>
      </Paper>
    </div>
  );
};

export default ProfileUpdate;

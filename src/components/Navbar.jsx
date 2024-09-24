import React, { useState } from 'react';
import { LightModeOutlined, DarkModeOutlined, SettingsOutlined } from '@mui/icons-material';
import FlexBetween from './FlexBetween';
import { useDispatch } from 'react-redux';
import { setMode } from 'state';
import { useTheme } from '@mui/material/styles';
import { AppBar, IconButton, Toolbar, Menu, MenuItem, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const navigate = useNavigate();
  
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  //Function to handle logout event
  const handleLogout = () => {
    localStorage.removeItem('x-auth-token'); // Clears the authentication token
    navigate('/login'); // Redirect to login page
    handleClose(); // Closes the menu
  };

  
  const handleProfile = () => {
    navigate('/profileupdate'); // Redirect to profile management page when button is clicked
    handleClose(); // Closes the menu
  };

  return (
    <AppBar
      sx={{
        position: "static",
        background: "none",
        boxShadow: "none",
      }}
    >
      <Toolbar sx={{ justifyContent: "flex-end" }}>
        
        <FlexBetween gap="1.5rem">
          {/*Dark and light mode button */}
          <IconButton onClick={() => dispatch(setMode())}>
            {theme.palette.mode === "dark" ? (
              <DarkModeOutlined sx={{ fontSize: "25px" }} /> //Icon will change depending on the mode
            ) : (
              <LightModeOutlined sx={{ fontSize: "25px" }} />
            )}
          </IconButton>

          {/* Settings with Dropdown */}
          <IconButton onClick={handleMenuClick}>
            <SettingsOutlined sx={{ fontSize: "25px" }} />
          </IconButton>

          {/* Dropdown Menu */}
          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
          >
            <MenuItem onClick={handleProfile}>
              <Typography>Manage Profile</Typography>
            </MenuItem>
            <MenuItem onClick={handleLogout}>
              <Typography>Logout</Typography>
            </MenuItem>
          </Menu>
        </FlexBetween>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;

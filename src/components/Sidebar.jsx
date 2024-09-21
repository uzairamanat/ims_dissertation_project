// Sidebar menu component

import React, {useState, useEffect } from 'react';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  useTheme
} from '@mui/material';
import {
  ChevronRightOutlined,
  HomeOutlined,
  ShoppingCartOutlined,
  Groups2Outlined,
  ReceiptLongOutlined,
} from '@mui/icons-material';
import { useLocation, useNavigate } from 'react-router-dom';
import FlexBetween from './FlexBetween';

// All the menu items and their icons
const navItems = [
  { text: "Dashboard", icon: <HomeOutlined /> },
  { text: "Products", icon: <ShoppingCartOutlined /> },
  { text: "Customers", icon: <Groups2Outlined /> },
  { text: "Orders", icon: <ReceiptLongOutlined /> },
];

const Sidebar = ({ drawerWidth, isSidebarOpen }) => {
  const { pathname } = useLocation();
  const [active, setActive] = useState('');
  const navigate = useNavigate();
  const theme = useTheme();

  useEffect(() => {
    setActive(pathname.substring(1));
  }, [pathname]);

  return (
    <Box component="nav">
      <Drawer
        open={isSidebarOpen}
        variant="persistent"
        anchor="left"
        sx={{
          width: drawerWidth,
          '& .MuiDrawer-paper': {
            color: theme.palette.secondary[200],
            backgroundColor: theme.palette.background.alt,
            boxSizing: 'border-box',
            borderWidth: '2px',
            width: drawerWidth
          }
        }}
      >
        <Box width="100%">
          <Box m="1.5rem 2rem 2rem 3rem">
            <FlexBetween color={theme.palette.secondary.main}>
              <Box display="flex" alignItems="center" gap="0.5rem">
                <Typography variant='h4' fontWeight="bold">
                  STOX
                </Typography>
              </Box>
            </FlexBetween>
          </Box>

          {/* Menu items that maps through the 'navItems' array defined above */}
          <List>
            {navItems.map(({ text, icon }) => {
              if (!icon) {
                return (
                  <Typography key={text} sx={{ m: "2.25rem 0 1rem 3rem" }}>
                    {text}
                  </Typography>
                );
              }
              const lcText = text.toLowerCase();

              return (
                <ListItem key={text} disablePadding>
                  <ListItemButton
                    onClick={() => {
                      navigate(`/${lcText}`); // Navigates to the corresponding page when clicked
                      setActive(lcText);
                    }}
                    sx={{
                      backgroundColor: active === lcText ? theme.palette.secondary[300] : 'transparent',    // Menu colour changes when page is active
                      color: active === lcText ? theme.palette.primary[600] : theme.palette.secondary[100],
                    }}
                  >
                    <ListItemIcon         // Icon for each menu button
                      sx={{
                        ml: "2rem",
                        color: active === lcText ? theme.palette.primary[600] : theme.palette.secondary[200],
                      }}
                    >
                      {icon}
                    </ListItemIcon>
                    <ListItemText primary={text} />
                    {active === lcText && (
                      <ChevronRightOutlined sx={{ ml: "auto" }} />
                    )}
                  </ListItemButton>
                </ListItem>
              );
            })}
          </List>
        </Box>
      </Drawer>
    </Box>
  );
};

export default Sidebar;

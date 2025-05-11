import React, { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Container,
  Menu,
  MenuItem,
  IconButton,
  ListItemIcon,
} from '@mui/material';
import { AccountCircle, ArrowDropDown, EventNote, Logout as LogoutIcon } from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import theme from '../theme';
import EventyButton from '../common/EventyButton';

const { accent, dark, cardBg, cardShadow } = theme;

const Navbar = () => {
  const { isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleLogout = () => {
    handleClose();
    logout();
    navigate('/');
  };

  return (
    <AppBar position="static" elevation={0} sx={{ background: cardBg, boxShadow: cardShadow, borderRadius: '0 0 24px 24px', mb: 4 }}>
      <Container maxWidth="lg">
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', py: 2 }}>
          <Typography
            variant="h4"
            component={RouterLink}
            to="/"
            sx={{
              textDecoration: 'none',
              color: accent,
              fontWeight: 900,
              fontFamily: '"Playwrite DK Loopet", cursive',
              letterSpacing: 1,
            }}
          >
            Eventy
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            {isAuthenticated ? (
              <>
                <IconButton
                  onClick={handleMenu}
                  sx={{
                    color: accent,
                    background: '#f3eaff',
                    borderRadius: '999px',
                    p: 1,
                    '&:hover': { background: '#e9d6fa' },
                  }}
                >
                  <AccountCircle fontSize="large" />
                  <ArrowDropDown fontSize="large" />
                </IconButton>
                <Menu
                  anchorEl={anchorEl}
                  open={open}
                  onClose={handleClose}
                  anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                  transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                  PaperProps={{
                    sx: {
                      mt: 1,
                      minWidth: 180,
                      borderRadius: 3,
                      boxShadow: cardShadow,
                    },
                  }}
                >
                  <MenuItem component={RouterLink} to="/profile" onClick={handleClose}>
                    <ListItemIcon>
                      <AccountCircle fontSize="small" />
                    </ListItemIcon>
                    View My Profile
                  </MenuItem>
                  <MenuItem component={RouterLink} to="/booked-events" onClick={handleClose}>
                    <ListItemIcon>
                      <EventNote fontSize="small" />
                    </ListItemIcon>
                    My Bookings
                  </MenuItem>
                  <MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}>
                    <ListItemIcon>
                      <LogoutIcon fontSize="small" />
                    </ListItemIcon>
                    Logout
                  </MenuItem>
                </Menu>
                {isAdmin && (
                  <EventyButton component={RouterLink} to="/admin">Admin Panel</EventyButton>
                )}
              </>
            ) : (
              <>
                <EventyButton component={RouterLink} to="/login">Login</EventyButton>
                <EventyButton component={RouterLink} to="/register">Register</EventyButton>
              </>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar; 
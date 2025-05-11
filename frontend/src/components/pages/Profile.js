import React, { useEffect, useState } from 'react';
import { Container, Typography, Box, Paper, CircularProgress, Alert } from '@mui/material';
import theme from '../theme';
import axios from 'axios';

const { cardBg, cardShadow, dark, gray } = theme;
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`${API_URL}/api/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data);
      } catch (err) {
        setError('Failed to load user info.');
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: theme.gradientBg,
        py: 6,
        px: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={0}
          sx={{
            background: cardBg,
            borderRadius: '32px',
            boxShadow: cardShadow,
            px: { xs: 2, sm: 6 },
            py: { xs: 3, sm: 6 },
            mb: 4,
            textAlign: 'center',
          }}
        >
          <Typography variant="h4" sx={{ color: dark, fontWeight: 700, mb: 2 }}>
            My Profile
          </Typography>
          {loading ? (
            <CircularProgress sx={{ color: dark, my: 4 }} />
          ) : error ? (
            <Alert severity="error">{error}</Alert>
          ) : user ? (
            <>
              <Typography variant="h6" sx={{ color: dark, mb: 1 }}>
                {user.name}
              </Typography>
              <Typography sx={{ color: gray, mb: 1 }}>{user.email}</Typography>
              <Typography sx={{ color: gray }}>
                Joined: {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : ''}
              </Typography>
            </>
          ) : null}
        </Paper>
      </Container>
    </Box>
  );
};

export default Profile; 
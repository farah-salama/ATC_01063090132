import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  Box,
  Chip,
  CircularProgress,
} from '@mui/material';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import theme from '../theme';
import EventyButton from '../common/EventyButton';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
const { accent, dark, gray, cardBg, cardShadow, gradientBg } = theme;

const BookedEvents = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const fetchBookings = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/bookings`);
        setBookings(res.data);
      } catch (error) {
        setError('Error fetching bookings');
        console.error('Error fetching bookings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [isAuthenticated, navigate]);

  const handleCancelBooking = async (bookingId) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      try {
        await axios.put(`${API_URL}/api/bookings/${bookingId}/cancel`);
        setBookings(bookings.filter(booking => booking._id !== bookingId));
      } catch (error) {
        setError('Error cancelling booking');
        console.error('Error cancelling booking:', error);
      }
    }
  };

  const handleViewEvent = (eventId) => {
    navigate(`/event/${eventId}`);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress sx={{ color: accent }} />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Typography color="error" align="center">
          {error}
        </Typography>
      </Container>
    );
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: gradientBg,
        py: 6,
        px: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <Container
        maxWidth="md"
        sx={{
          background: cardBg,
          borderRadius: '32px',
          boxShadow: cardShadow,
          px: { xs: 2, sm: 6 },
          py: { xs: 3, sm: 6 },
          mb: 4,
        }}
      >
        <Typography variant="h4" component="h1" align="center" sx={{ color: dark, fontWeight: 700, mb: 4 }}>
          My Booked Events
        </Typography>
        {bookings.length === 0 ? (
          <Typography variant="h6" align="center" sx={{ mt: 4, color: gray }}>
            You haven't booked any events yet.
          </Typography>
        ) : (
          <Grid container spacing={4}>
            {bookings.map((booking) => (
              <Grid item xs={12} key={booking._id}>
                <Card
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    background: cardBg,
                    borderRadius: '24px',
                    boxShadow: cardShadow,
                    p: 2,
                    mb: 2,
                    border: 'none',
                  }}
                >
                  <CardMedia
                    component="img"
                    image={booking.event.image || 'https://via.placeholder.com/120x120'}
                    alt={booking.event.name}
                    sx={{
                      width: 120,
                      height: 120,
                      borderRadius: '16px',
                      objectFit: 'cover',
                      mr: 3,
                    }}
                  />
                  <CardContent sx={{ flex: 1, p: 0 }}>
                    <Typography variant="h6" sx={{ color: accent, fontWeight: 700, mb: 1, fontSize: '1.2rem', cursor: 'pointer', textDecoration: 'none' }} onClick={() => handleViewEvent(booking.event._id)}>
                      {booking.event.name}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, gap: 2, flexWrap: 'wrap' }}>
                      <Typography sx={{ color: gray, fontWeight: 500, fontSize: '1rem', display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <span role="img" aria-label="calendar">📅</span> {new Date(booking.event.date).toLocaleDateString()}
                      </Typography>
                      <Typography sx={{ color: gray, fontWeight: 500, fontSize: '1rem', display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <span role="img" aria-label="location">📍</span> {booking.event.venue}
                      </Typography>
                    </Box>
                    <Box sx={{ mt: 1, display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
                      <Chip
                        label={booking.status}
                        sx={{
                          background: booking.status === 'confirmed' ? accent : '#ff7675',
                          color: '#fff',
                          fontWeight: 700,
                          borderRadius: '999px',
                          px: 3,
                          py: 1,
                          fontSize: '1rem',
                          textTransform: 'capitalize',
                        }}
                      />
                      <Typography sx={{ color: gray, fontSize: '0.95rem' }}>
                        Booked on: {new Date(booking.createdAt).toLocaleDateString()}
                      </Typography>
                    </Box>
                    <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
                      <EventyButton onClick={() => handleViewEvent(booking.event._id)}>View Event</EventyButton>
                      {booking.status === 'confirmed' && (
                        <EventyButton onClick={() => handleCancelBooking(booking._id)} sx={{ background: accent, '&:hover': { background: dark } }}>Cancel</EventyButton>
                      )}
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </Box>
  );
};

export default BookedEvents; 
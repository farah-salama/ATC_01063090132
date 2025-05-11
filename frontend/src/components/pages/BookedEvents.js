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

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

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
        // Update the bookings list after cancellation
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
        <CircularProgress />
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
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        My Booked Events
      </Typography>
      {bookings.length === 0 ? (
        <Typography variant="h6" align="center" sx={{ mt: 4 }}>
          You haven't booked any events yet.
        </Typography>
      ) : (
        <Grid container spacing={3}>
          {bookings.map((booking) => (
            <Grid item xs={12} sm={6} md={4} key={booking._id}>
              <Card>
                <CardMedia
                  component="img"
                  height="140"
                  image={booking.event.image || 'https://via.placeholder.com/300x140'}
                  alt={booking.event.name}
                />
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {booking.event.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    {new Date(booking.event.date).toLocaleDateString()}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    {booking.event.venue}
                  </Typography>
                  <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
                    <Chip
                      label={booking.status}
                      color={booking.status === 'confirmed' ? 'success' : 'error'}
                      size="small"
                    />
                    <Typography variant="body2" color="text.secondary">
                      Booked on: {new Date(booking.createdAt).toLocaleDateString()}
                    </Typography>
                  </Box>
                  <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                    <Button
                      variant="contained"
                      color="primary"
                      fullWidth
                      onClick={() => handleViewEvent(booking.event._id)}
                    >
                      View Event
                    </Button>
                    {booking.status === 'confirmed' && (
                      <Button
                        variant="outlined"
                        color="error"
                        fullWidth
                        onClick={() => handleCancelBooking(booking._id)}
                      >
                        Cancel
                      </Button>
                    )}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default BookedEvents; 
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Button,
  Box,
  Chip,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const EventDetails = () => {
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [isBooked, setIsBooked] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/events/${id}`);
        setEvent(res.data);
      } catch (error) {
        setError('Error fetching event details');
      } finally {
        setLoading(false);
      }
    };

    const checkBookingStatus = async () => {
      if (isAuthenticated) {
        try {
          const res = await axios.get(`${API_URL}/api/bookings`);
          const booking = res.data.find(booking => 
            booking.event._id === id && booking.status === 'confirmed'
          );
          setIsBooked(!!booking);
        } catch (error) {
          console.error('Error checking booking status:', error);
        }
      }
    };

    fetchEvent();
    checkBookingStatus();
  }, [id, isAuthenticated]);

  const handleBookNow = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    try {
      await axios.post(`${API_URL}/api/bookings`, {
        eventId: id,
      });
      setShowSuccess(true);
      setIsBooked(true);
    } catch (error) {
      setError(error.response?.data?.message || 'Error booking event');
    }
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="60vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Typography color="error" align="center">
          {error}
        </Typography>
      </Container>
    );
  }

  if (!event) {
    return null;
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Box sx={{ position: 'relative' }}>
          <img
            src={event.image || 'https://via.placeholder.com/800x400'}
            alt={event.name}
            style={{
              width: '100%',
              height: '400px',
              objectFit: 'cover',
              borderRadius: '4px',
            }}
          />
          <Chip
            label={event.category}
            color="primary"
            sx={{
              position: 'absolute',
              top: 16,
              right: 16,
            }}
          />
        </Box>

        <Typography variant="h4" component="h1" gutterBottom sx={{ mt: 3 }}>
          {event.name}
        </Typography>

        <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
          <Typography variant="body1" color="text.secondary">
            Date: {new Date(event.date).toLocaleDateString()}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Venue: {event.venue}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Price: ${event.price}
          </Typography>
        </Box>

        <Typography variant="body1" paragraph>
          {event.description}
        </Typography>

        {isBooked ? (
          <Box sx={{ mt: 3, textAlign: 'center' }}>
            <Chip
              label="Booked"
              color="success"
              sx={{ fontSize: '1.1rem', padding: '20px 10px' }}
            />
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              You have successfully booked this event
            </Typography>
          </Box>
        ) : (
          <Button
            variant="contained"
            color="primary"
            size="large"
            fullWidth
            onClick={handleBookNow}
            sx={{ mt: 3 }}
          >
            Book Now
          </Button>
        )}
      </Paper>

      <Dialog open={showSuccess} onClose={() => setShowSuccess(false)}>
        <DialogTitle>Booking Successful!</DialogTitle>
        <DialogContent>
          <Typography>
            You have successfully booked this event. You can view your bookings in the "My Bookings" section.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowSuccess(false)}>Close</Button>
          <Button
            onClick={() => {
              setShowSuccess(false);
              navigate('/booked-events');
            }}
            color="primary"
          >
            View My Bookings
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default EventDetails;
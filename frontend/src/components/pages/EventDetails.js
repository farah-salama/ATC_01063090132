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
  const { id } = useParams();
  const navigate = useNavigate();

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

    fetchEvent();
  }, [id]);

  const handleBookNow = async () => {
    try {
      await axios.post(`${API_URL}/api/bookings`, {
        eventId: id,
      });
      setShowSuccess(true);
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
        <img
          src={event.image}
          alt={event.name}
          style={{
            width: '100%',
            height: '400px',
            objectFit: 'cover',
            borderRadius: '4px',
          }}
        />
        <Typography variant="h4" component="h1" gutterBottom sx={{ mt: 3 }}>
          {event.name}
        </Typography>
        <Box sx={{ mb: 3 }}>
          <Chip
            label={event.category}
            sx={{ mr: 1 }}
          />
          <Chip
            label={`$${event.price}`}
            color="primary"
          />
        </Box>
        <Typography variant="body1" paragraph>
          {event.description}
        </Typography>
        <Typography variant="h6" gutterBottom>
          Event Details
        </Typography>
        <Typography variant="body1" paragraph>
          <strong>Date:</strong> {new Date(event.date).toLocaleDateString()}
        </Typography>
        <Typography variant="body1" paragraph>
          <strong>Venue:</strong> {event.venue}
        </Typography>
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
      </Paper>

      <Dialog open={showSuccess} onClose={() => navigate('/')}>
        <DialogTitle>Booking Successful!</DialogTitle>
        <DialogContent>
          <Typography>
            You have successfully booked a ticket for {event.name}.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => navigate('/')} color="primary">
            Return to Home
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default EventDetails;
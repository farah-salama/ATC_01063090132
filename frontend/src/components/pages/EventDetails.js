import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
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
import theme from '../theme';
import EventyButton from '../common/EventyButton';
import { CalendarToday, LocationOn, AttachMoney } from '@mui/icons-material';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
const { accent, dark, gray, cardBg, cardShadow, gradientBg } = theme;

const EventDetails = () => {
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [isBooked, setIsBooked] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, loading: authLoading, isAdmin } = useAuth();
  const confettiFired = useRef(false);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/events/${id}`);
        setEvent(res.data);
      } catch (error) {
        setError('Error fetching event details');
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

    const loadData = async () => {
      setLoading(true);
      await fetchEvent();
      if (isAuthenticated) {
        await checkBookingStatus();
      }
      setLoading(false);
    };

    if (!authLoading) {
      loadData();
    }
  }, [id, isAuthenticated, authLoading]);

  useEffect(() => {
    if (showSuccess && !confettiFired.current) {
      confettiFired.current = true;
      // Dynamically load the confetti library if not already loaded
      function fireRealisticConfetti() {
        if (!window.confetti) return;
        var count = 200;
        var defaults = { origin: { y: 0.7 } };
        function fire(particleRatio, opts) {
          window.confetti(Object.assign({}, defaults, opts, {
            particleCount: Math.floor(count * particleRatio)
          }));
        }
        fire(0.25, {
          spread: 26,
          startVelocity: 55,
        });
        fire(0.2, {
          spread: 60,
        });
        fire(0.35, {
          spread: 100,
          decay: 0.91,
          scalar: 0.8
        });
        fire(0.1, {
          spread: 120,
          startVelocity: 25,
          decay: 0.92,
          scalar: 1.2
        });
        fire(0.1, {
          spread: 120,
          startVelocity: 45,
        });
      }
      if (!window.confetti) {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/canvas-confetti@1.9.3/dist/confetti.browser.min.js';
        script.async = true;
        script.onload = fireRealisticConfetti;
        document.body.appendChild(script);
      } else {
        fireRealisticConfetti();
      }
    }
    if (!showSuccess) {
      confettiFired.current = false;
    }
  }, [showSuccess]);

  const handleBookNow = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    if (isAdmin) {
      return; // Don't allow admins to book events
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

  if (loading || authLoading) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          background: gradientBg,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <CircularProgress sx={{ color: accent }} />
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
        <Box sx={{ position: 'relative', mb: 3 }}>
          <img
            src={event.image || 'https://via.placeholder.com/800x400'}
            alt={event.name}
            style={{
              width: '100%',
              height: '340px',
              objectFit: 'cover',
              borderRadius: '24px',
              boxShadow: cardShadow,
            }}
          />
          <Chip
            label={event.category}
            sx={{
              position: 'absolute',
              top: 16,
              right: 16,
              background: accent,
              color: '#fff',
              fontWeight: 600,
              fontSize: '1rem',
              borderRadius: '12px',
              px: 2,
              py: 1,
            }}
          />
        </Box>
        <Typography variant="h4" component="h1" align="center" sx={{ color: dark, fontWeight: 700, mb: 2 }}>
          {event.name}
        </Typography>
        <Box sx={{ display: 'flex', gap: 3, mb: 3, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Typography sx={{ color: gray, fontWeight: 500, fontSize: '1rem', display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <CalendarToday sx={{ color: accent, fontSize: '1.2rem' }} /> {new Date(event.date).toLocaleDateString()}
          </Typography>
          <Typography sx={{ color: gray, fontWeight: 500, fontSize: '1rem', display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <LocationOn sx={{ color: accent, fontSize: '1.2rem' }} /> {event.venue}
          </Typography>
          <Typography sx={{ color: gray, fontWeight: 500, fontSize: '1rem', display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <AttachMoney sx={{ color: accent, fontSize: '1.2rem' }} />{event.price}
          </Typography>
        </Box>
        <Typography align="center" sx={{ color: gray, mb: 3, fontSize: '1.1rem' }}>
          {event.description}
        </Typography>
        {isBooked ? (
          <Box sx={{ mt: 3, textAlign: 'center' }}>
            <Chip
              label="Booked"
              sx={{
                background: '#23272f',
                color: '#fff',
                fontWeight: 700,
                fontSize: '1.1rem',
                borderRadius: '999px',
                px: 4,
                py: 1.2,
                mb: 1,
              }}
            />
            <Typography variant="body2" sx={{ color: gray, mt: 1 }}>
              You have successfully booked this event
            </Typography>
          </Box>
        ) : !isAdmin ? (
          <EventyButton onClick={handleBookNow} sx={{ width: '100%', mt: 3, background: '#23272f', color: '#fff', '&:hover': { background: '#181b20' } }}>Book Now</EventyButton>
        ) : null}
      </Container>
      <Dialog open={showSuccess} onClose={() => setShowSuccess(false)}
        PaperProps={{
          sx: {
            borderRadius: '24px',
          },
        }}
      >
        <DialogTitle sx={{ color: accent, fontWeight: 700 }}>Booking Successful!</DialogTitle>
        <DialogContent>
          <Typography sx={{ color: gray }}>
            You have successfully booked this event. You can view your bookings in the "My Bookings" section.
          </Typography>
        </DialogContent>
        <DialogActions>
          <EventyButton variant="text" onClick={() => setShowSuccess(false)} sx={{ color: accent, fontWeight: 700, background: 'transparent', '&:hover': { background: '#f3eaff', color: accent } }}>Close</EventyButton>
          <EventyButton
            variant="text"
            onClick={() => {
              setShowSuccess(false);
              navigate('/booked-events');
            }}
            sx={{ color: accent, fontWeight: 700, background: 'transparent', '&:hover': { background: '#f3eaff', color: accent } }}
          >
            View My Bookings
          </EventyButton>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default EventDetails;
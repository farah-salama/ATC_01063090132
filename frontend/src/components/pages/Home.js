import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
} from '@mui/material';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import theme from '../theme';
import EventyButton from '../common/EventyButton';
import { CalendarToday, AccessTime, LocationOn, AttachMoney } from '@mui/icons-material';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const { accent, dark, gray, cardBg, cardShadow, gradientBg } = theme;

const Home = () => {
  const [events, setEvents] = useState([]);
  const [bookedEvents, setBookedEvents] = useState([]);
  const { isAuthenticated, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState(null);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingError, setBookingError] = useState('');
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [loading, setLoading] = useState(true);
  const confettiFired = useRef(false);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/events`);
        setEvents(res.data);
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };

    const fetchBookedEvents = async () => {
      if (isAuthenticated) {
        try {
          const res = await axios.get(`${API_URL}/api/bookings`);
          const confirmedBookings = res.data.filter(booking => booking.status === 'confirmed');
          console.log('Confirmed bookings:', confirmedBookings);
          setBookedEvents(confirmedBookings.map(booking => booking.event._id));
          console.log('Booked event IDs:', confirmedBookings.map(booking => booking.event._id));
        } catch (error) {
          console.error('Error fetching bookings:', error);
        }
      }
    };

    const loadData = async () => {
      setLoading(true);
      await fetchEvents();
      if (isAuthenticated) {
        await fetchBookedEvents();
      }
      setLoading(false);
    };

    if (!authLoading) {
      loadData();
    }
  }, [isAuthenticated, authLoading]);

  useEffect(() => {
    if (bookingSuccess && !confettiFired.current) {
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
    if (!bookingSuccess) {
      confettiFired.current = false;
    }
  }, [bookingSuccess]);

  const handleViewDetails = (eventId) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    navigate(`/event/${eventId}`);
  };

  const handleBookNow = (eventId) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    setSelectedEventId(eventId);
    setConfirmOpen(true);
  };

  const handleConfirmBooking = async () => {
    setBookingLoading(true);
    setBookingError('');
    try {
      await axios.post(`${API_URL}/api/bookings`, { eventId: selectedEventId });
      setBookedEvents(prev => [...prev, selectedEventId]);
      setBookingSuccess(true);
      setConfirmOpen(false);
    } catch (error) {
      setBookingError(error.response?.data?.message || 'Error booking event');
    } finally {
      setBookingLoading(false);
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
        <Typography
          variant="h3"
          align="center"
          sx={{ color: dark, fontWeight: 700, mb: 4, fontSize: { xs: '2rem', sm: '2.5rem' } }}
        >
          Event Schedule
        </Typography>
        <Grid container spacing={4}>
          {events.map((event) => (
            <Grid item key={event._id} xs={12}>
              <Card
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  background: 'rgba(255,255,255,0.95)',
                  borderRadius: '28px',
                  boxShadow: '0 4px 24px 0 rgba(80, 80, 180, 0.10)',
                  p: { xs: 1, sm: 3 },
                  mb: 2,
                  border: '1.5px solid #f0f0f0',
                  minHeight: 180,
                  transition: 'box-shadow 0.2s',
                  '&:hover': {
                    boxShadow: '0 8px 32px 0 rgba(80, 80, 180, 0.18)',
                  },
                }}
              >
                <Box sx={{ flex: '0 0 180px', display: 'flex', alignItems: 'center', justifyContent: 'center', height: 160 }}>
                  <CardMedia
                    component="img"
                    image={event.image || 'https://via.placeholder.com/160x160'}
                    alt={event.name}
                    sx={{
                      width: 160,
                      height: 160,
                      borderRadius: '18px',
                      objectFit: 'cover',
                      boxShadow: '0 2px 12px 0 rgba(80, 80, 180, 0.08)',
                    }}
                  />
                </Box>
                <CardContent sx={{ flex: 1, p: { xs: 1, sm: 2 }, pl: { xs: 2, sm: 4 } }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, gap: 3, flexWrap: 'wrap' }}>
                    <Typography sx={{ color: gray, fontWeight: 500, fontSize: '1rem', display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <CalendarToday sx={{ color: accent, fontSize: '1.2rem' }} /> {new Date(event.date).toLocaleDateString()}
                    </Typography>
                    <Typography sx={{ color: gray, fontWeight: 500, fontSize: '1rem', display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <AccessTime sx={{ color: accent, fontSize: '1.2rem' }} /> 10.00 AM
                    </Typography>
                    <Typography sx={{ color: gray, fontWeight: 500, fontSize: '1rem', display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <LocationOn sx={{ color: accent, fontSize: '1.2rem' }} /> {event.venue}
                    </Typography>
                    <Typography sx={{ color: accent, fontWeight: 700, fontSize: '1rem', display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <AttachMoney sx={{ color: accent, fontSize: '1.2rem' }} /> {event.price}
                    </Typography>
                  </Box>
                  <Typography
                    variant="h5"
                    sx={{ color: accent, fontWeight: 600, mb: 1, fontSize: { xs: '1.3rem', sm: '1.7rem' }, cursor: 'pointer', textDecoration: 'none', lineHeight: 1.2 }}
                    onClick={() => handleViewDetails(event._id)}
                  >
                    {event.name}
                  </Typography>
                  <Typography sx={{ color: gray, mb: 2, fontSize: '1.08rem', maxWidth: 600 }}>
                    {event.description}
                  </Typography>
                  <Box sx={{ mt: 2, display: 'flex', gap: 2, alignItems: 'center' }}>
                    {bookedEvents.includes(event._id) ? (
                      <>
                        <EventyButton disabled sx={{ fontFamily: 'Lato, Arial, sans-serif', fontWeight: 700, fontSize: '1rem', px: 4, py: 1.2, borderRadius: '24px', background: '#23272f', color: '#fff' }}>Booked</EventyButton>
                        <Box
                          component="button"
                          onClick={() => handleViewDetails(event._id)}
                          sx={{
                            ml: 1,
                            background: 'none',
                            border: 'none',
                            color: accent,
                            fontWeight: 700,
                            fontFamily: 'Lato, Arial, sans-serif',
                            fontSize: '1.2rem',
                            cursor: 'pointer',
                            textDecoration: 'none',
                            transition: 'color 0.2s',
                            '&:hover': { color: dark },
                          }}
                        >
                          More Info
                        </Box>
                      </>
                    ) : (
                      <>
                        <EventyButton onClick={() => handleBookNow(event._id)} sx={{ fontFamily: 'Lato, Arial, sans-serif', fontWeight: 700, fontSize: '1rem', px: 4, py: 1.2, borderRadius: '24px', background: '#23272f', color: '#fff', '&:hover': { background: '#181b20' } }}>Book Now</EventyButton>
                        <Box
                          component="button"
                          onClick={() => handleViewDetails(event._id)}
                          sx={{
                            ml: 1,
                            background: 'none',
                            border: 'none',
                            color: accent,
                            fontWeight: 700,
                            fontFamily: 'Lato, Arial, sans-serif',
                            fontSize: '1.2rem',
                            cursor: 'pointer',
                            textDecoration: 'none',
                            transition: 'color 0.2s',
                            '&:hover': { color: dark },
                          }}
                        >
                          More Info
                        </Box>
                      </>
                    )}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
      {/* Booking Confirmation Dialog */}
      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}
        PaperProps={{
          sx: {
            borderRadius: '24px',
          },
        }}
      >
        <DialogTitle sx={{ color: accent, fontWeight: 700 }}>Confirm Booking</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to book this event?</Typography>
          {bookingError && <Typography color="error" sx={{ mt: 1 }}>{bookingError}</Typography>}
        </DialogContent>
        <DialogActions>
          <EventyButton variant="text" onClick={() => setConfirmOpen(false)} sx={{ color: accent, fontWeight: 700, background: 'transparent', '&:hover': { background: '#f3eaff', color: accent } }}>Cancel</EventyButton>
          <EventyButton onClick={handleConfirmBooking} disabled={bookingLoading}>
            {bookingLoading ? <CircularProgress size={22} sx={{ color: '#fff' }} /> : 'Confirm'}
          </EventyButton>
        </DialogActions>
      </Dialog>
      {/* Booking Success Dialog */}
      <Dialog open={bookingSuccess} onClose={() => setBookingSuccess(false)}
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
          <EventyButton variant="text" onClick={() => setBookingSuccess(false)} sx={{ color: accent, fontWeight: 700, background: 'transparent', '&:hover': { background: '#f3eaff', color: accent } }}>Close</EventyButton>
          <EventyButton
            variant="text"
            onClick={() => {
              setBookingSuccess(false);
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

export default Home; 
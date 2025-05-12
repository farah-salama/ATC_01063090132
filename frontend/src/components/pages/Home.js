import React, { useState, useEffect } from 'react';
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
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

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
          setBookedEvents(res.data.map(booking => booking.eventId));
        } catch (error) {
          console.error('Error fetching bookings:', error);
        }
      }
    };

    fetchEvents();
    fetchBookedEvents();
  }, [isAuthenticated]);

  const handleViewDetails = (eventId) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    navigate(`/event/${eventId}`);
  };

  const handleBookNow = async (eventId) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    navigate(`/event/${eventId}`);
  };

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
          variant="subtitle2"
          align="center"
          sx={{ color: accent, fontWeight: 600, letterSpacing: 1, mb: 1 }}
        >
          Schedule Details
        </Typography>
        <Typography
          variant="h3"
          align="center"
          sx={{ color: dark, fontWeight: 700, mb: 1, fontSize: { xs: '2rem', sm: '2.5rem' } }}
        >
          Event Schedule
        </Typography>
        <Typography
          align="center"
          sx={{ color: gray, mb: 4, fontSize: { xs: '1rem', sm: '1.1rem' } }}
        >
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus sit amet sodales magna. Nulla id tortor ultricies, tincidunt nulla vel, aliquet risus. Duis ac justo sed leo fringilla bibendum.
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
                      <EventyButton disabled sx={{ fontFamily: 'Lato, Arial, sans-serif', fontWeight: 700, fontSize: '1rem', px: 4, py: 1.2, borderRadius: '24px', background: '#23272f', color: '#fff' }}>Booked</EventyButton>
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
    </Box>
  );
};

export default Home; 
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
                  image={event.image || 'https://via.placeholder.com/120x120'}
                  alt={event.name}
                  sx={{
                    width: 120,
                    height: 120,
                    borderRadius: '16px',
                    objectFit: 'cover',
                    mr: 3,
                  }}
                />
                <CardContent sx={{ flex: 1, p: 0 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, gap: 2, flexWrap: 'wrap' }}>
                    <Typography sx={{ color: gray, fontWeight: 500, fontSize: '1rem', display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <span role="img" aria-label="calendar">📅</span> {new Date(event.date).toLocaleDateString()}
                    </Typography>
                    <Typography sx={{ color: gray, fontWeight: 500, fontSize: '1rem', display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <span role="img" aria-label="clock">🕒</span> 10.00 AM - 11.30 AM
                    </Typography>
                    <Typography sx={{ color: gray, fontWeight: 500, fontSize: '1rem', display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <span role="img" aria-label="location">📍</span> {event.venue}
                    </Typography>
                  </Box>
                  <Typography
                    variant="h6"
                    sx={{ color: accent, fontWeight: 700, mb: 1, fontSize: '1.2rem', cursor: 'pointer', textDecoration: 'none' }}
                    onClick={() => handleViewDetails(event._id)}
                  >
                    {event.name}
                  </Typography>
                  <Typography sx={{ color: gray, mb: 2, fontSize: '1rem' }}>
                    {event.description}
                  </Typography>
                  {bookedEvents.includes(event._id) ? (
                    <EventyButton disabled>Booked</EventyButton>
                  ) : (
                    <EventyButton onClick={() => handleViewDetails(event._id)}>Get a Ticket</EventyButton>
                  )}
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
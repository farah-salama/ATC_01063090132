import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Box,
  Chip,
} from '@mui/material';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

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

  const handleBookNow = (eventId) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    navigate(`/event/${eventId}`);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Upcoming Events
      </Typography>
      <Grid container spacing={4}>
        {events.map((event) => (
          <Grid item key={event._id} xs={12} sm={6} md={4}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                '&:hover': {
                  boxShadow: 6,
                },
              }}
            >
              <CardMedia
                component="img"
                height="200"
                image={event.image}
                alt={event.name}
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography gutterBottom variant="h5" component="h2">
                  {event.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  {event.description}
                </Typography>
                <Box sx={{ mb: 2 }}>
                  <Chip
                    label={event.category}
                    size="small"
                    sx={{ mr: 1 }}
                  />
                  <Chip
                    label={`$${event.price}`}
                    size="small"
                    color="primary"
                  />
                </Box>
                <Typography variant="body2" color="text.secondary">
                  {new Date(event.date).toLocaleDateString()} at {event.venue}
                </Typography>
                {bookedEvents.includes(event._id) ? (
                  <Button
                    fullWidth
                    variant="contained"
                    color="success"
                    disabled
                    sx={{ mt: 2 }}
                  >
                    Booked
                  </Button>
                ) : (
                  <Button
                    fullWidth
                    variant="contained"
                    color="primary"
                    onClick={() => handleBookNow(event._id)}
                    sx={{ mt: 2 }}
                  >
                    Book Now
                  </Button>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Home; 
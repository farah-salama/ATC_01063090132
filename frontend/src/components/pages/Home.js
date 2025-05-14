import React from 'react';
import { Box } from '@mui/material';
import theme from '../theme';
import EventsList from './EventsList';

const { gradientBg } = theme;

const Home = () => {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: gradientBg,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <EventsList />
    </Box>
  );
};

export default Home; 
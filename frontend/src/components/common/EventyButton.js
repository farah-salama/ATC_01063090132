import React from 'react';
import Button from '@mui/material/Button';
import theme from '../theme';

const { accent, dark } = theme;

const EventyButton = ({ children, variant = 'contained', sx = {}, ...props }) => (
  <Button
    variant={variant}
    sx={{
      background: variant === 'contained' ? dark : 'transparent',
      color: variant === 'contained' ? '#fff' : accent,
      borderRadius: '999px',
      fontWeight: 700,
      px: 4,
      py: 0.6,
      boxShadow: 'none',
      textTransform: 'uppercase',
      fontSize: '1rem',
      letterSpacing: 1,
      '&:hover': {
        background: variant === 'contained' ? accent : 'rgba(153,48,227,0.08)',
        color: '#fff',
      },
      ...sx,
    }}
    {...props}
  >
    {children}
  </Button>
);

export default EventyButton; 
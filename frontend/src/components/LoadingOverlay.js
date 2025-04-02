import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';

const LoadingOverlay = ({ message = 'Loading...' }) => {
  return (
    <Box
      className="loading-overlay"
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          p: 4,
          borderRadius: 2,
          bgcolor: 'background.paper',
        }}
      >
        <CircularProgress size={60} thickness={4} sx={{ mb: 2 }} />
        <Typography variant="h6">{message}</Typography>
      </Box>
    </Box>
  );
};

export default LoadingOverlay;

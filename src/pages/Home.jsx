import React from 'react';
import { Box, Typography } from '@mui/material';
import Navbar from '../components/Navbar';

const Home = () => {
  return (
    <Box
      sx={{
        height: '100vh',
        backgroundImage: 'url(https://source.unsplash.com/1600x900/?technology,nature)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <Navbar />
      <Box
        sx={{
          height: 'calc(100vh - 64px)', // Adjusting for navbar height
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          color: 'white',
          textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
        }}
      >
        <Typography variant="h2" component="h1" gutterBottom>
          Welcome to Garage24
        </Typography>
        <Typography variant="h5">
          Explore more by signing up or logging in!
        </Typography>
      </Box>
    </Box>
  );
};

export default Home;

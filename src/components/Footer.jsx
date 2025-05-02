import React from 'react';
import { Box, Typography, Stack, Link } from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import FacebookIcon from '@mui/icons-material/Facebook';

const Footer = () => {
  return (
    <Box sx={{ backgroundColor: '#424242', color: 'white', py: 4, px: 2 }}>
      <Stack spacing={4} alignItems="center" justifyContent="center" textAlign="center">
        {/* Contact Info */}
        <Box>
          <Typography variant="h6" gutterBottom>
            Contact Info
          </Typography>
          <Stack spacing={1} alignItems="center">
            <Stack direction="row" spacing={1} alignItems="center">
              <LocationOnIcon />
              <Typography>190, Galle Road, Kaluthara, Sri Lanka</Typography>
            </Stack>
            <Stack direction="row" spacing={1} alignItems="center">
              <PhoneIcon />
              <Typography>+94 11 234 3243</Typography>
            </Stack>
            <Stack direction="row" spacing={1} alignItems="center">
              <EmailIcon />
              <Typography>info@garage24.lk</Typography>
            </Stack>
          </Stack>
        </Box>

        {/* Opening Hours */}
        <Box>
            
          <Typography variant="h6" gutterBottom>
           Opening Hours
          </Typography>
          <Stack direction="row" spacing={1} alignItems="center" justifyContent="center">
            
            <Box>
              <Typography>Monday - Saturday</Typography>
              <Typography>8:00 AM - 5:00 PM</Typography>
            </Box>
          </Stack>
        </Box>

        {/* Copyright and Social */}
        <Box sx={{ backgroundColor: '#1f1f1f', width: '100%', py: 2, mt: 3 }}>
  <Typography variant="body2" sx={{ color: 'white' }}>
    © 2024 garage24. All Rights Reserved.
  </Typography>
  <Link
    href="https://www.facebook.com"
    target="_blank"
    rel="noopener"
    sx={{ color: 'white', mt: 1, display: 'inline-block' }}
  >
    <FacebookIcon
      sx={{
        fontSize: 30,
        mt: 1,
        backgroundColor: '#3b5998',
        borderRadius: '50%',
        p: 0.5,
      }}
    />
  </Link>
</Box>

      </Stack>
    </Box>
  );
};

export default Footer;

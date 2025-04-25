import React from 'react';
import { Typography, Box, Divider } from '@mui/material';

function PathNaming({ label, path }) {
  return (
    <Box sx={{ mb: 3 }}>
      <img src="assets/path.png" alt="path image" />
      <Typography variant="h5" sx={{ fontWeight: 600 }}>
        {label}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {path}
      </Typography>
      <Divider/>
    </Box>
  
  );
}

export default PathNaming;

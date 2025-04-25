import React from 'react';
import { Typography, Box, Divider } from '@mui/material';

function PathNaming({ label, path }) {
  return (
    <Box sx={{display:"flex",gap: 2}}>
       
      <img src="assets/path.png" alt="path image" />
      <div>
      <Typography variant="h5" sx={{ fontWeight: 600 }}>
        {label}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {path}
      </Typography>

      </div>
    
   
    </Box>
  
  );
}

export default PathNaming;

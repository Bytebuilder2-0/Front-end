import React from 'react';
import { Typography, Box, Divider } from '@mui/material';

function PathNaming({ label, path }) {
  return (
    <Box sx={{display:"flex",gap: 2}}>
       
   {/*<img src="assets/trans_bg.png" alt="path image" height={50} width={50}/> */ } 
      <div>
      <Typography variant="h5" sx={{ fontWeight: 600 ,color:"#33383E"}}>
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

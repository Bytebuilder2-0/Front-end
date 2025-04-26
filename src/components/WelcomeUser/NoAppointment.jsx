import React  from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const NoAppointemnt = () => {
    const navigate = useNavigate();

    return (
        <Box 
        sx={{
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          maxWidth: '400px',
          mx: 'auto',
          my: 4,
          overflow: 'hidden',
          textAlign: 'center',
          backgroundColor: 'background.paper',
        }}>

    <Box
        sx={{
          position: 'absolute',
          zIndex: 2,     
        
        }}>

          <Typography 
          variant="h5" 
          sx={{ 
            color: '#606060',
            fontWeight: 'medium',
            textShadow: '0 1px 3px rgba(0,0,0,0.3)'
          }}
        >
          You haven't made any<br />booking yet...
        </Typography>
      </Box>

        <img
           src="/assets/car.png"
           alt="Car illustration"
           style={{
            height: "300px", 
            width: "auto",
            opacity: 0.3,
           filter: 'drop-shadow(0px 4px 8px rgba(0,0,0,0.1))'
          }}
        />
        
    
     <Button
        variant="contained"
        onClick={() => navigate('/appointments/new')}
        sx={{
            width: '400px',
            fontSize: '17px',
          fontWeight: 'bold',
          textAlign: 'center',
          padding: '10px',
          borderRadius : '10px',
          backgroundColor: 'primary.main',
          '&:hover': {
            backgroundColor: 'primary.dark'
          }
        }}>

          Make a Booking
        </Button>
    </Box>
    
    );
  };


export default NoAppointemnt;


import React  from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

//This component for when user hasn't any appointment

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
          paddingBottom:'10px',
          width: 'auto',
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
            borderBottom: '4px solid #179e43',
            height:'50px',
            transition: '0.3s',        
	          backgroundColor:'#7acc95',
            color: 'black',
          '&:hover': {
            color:'text.secondary',
            borderBottomWidth: '2px',
            transform: 'translateY(2px)',
            backgroundColor: '#90EE90'        
          }
        }}>

          Make a Booking
        </Button>
    </Box>
    
    );
  };


export default NoAppointemnt;


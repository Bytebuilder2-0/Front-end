import React  from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';

//This component for when user hasn't any appointment

const NoAppointemnt = () => {
    const navigate = useNavigate();

    return (
        <Box 
        sx={{
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
          zIndex: 1,     
        
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
            filter: 'drop-shadow(0px 4px 8px rgba(0,0,0,0.1))',
            paddingBottom: '20px'
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
          padding: '12px',
          borderRadius: '10px',
          height: '50px',
          backgroundColor: '#66BB6A', // Fresh green
          color: '#1a1a1a', // Your specified dark text
          textTransform: 'none',
          // Depth effect with border
          border: '2px solid #4CAF50',
          boxShadow: '0 3px 0 #2E7D32',
          '&:hover': {
            backgroundColor: '#5CB860', // Slightly darker green
            transform: 'translateY(2px)',
            boxShadow: '0 1px 0 #2E7D32'
          },
          '&:active': {
            transform: 'translateY(3px)',
            boxShadow: 'none'
          },
          transition: 'all 0.15s ease',
        }}
      >
  BOOK  APPOINMENT
</Button>
    </Box>
    
    );
  };


export default NoAppointemnt;


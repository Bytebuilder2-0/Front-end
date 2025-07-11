import { Box, Typography, Button, useTheme } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const NoVehicles = () => {
  const navigate = useNavigate();
  const theme = useTheme();

  return (
    <Box
      sx={{
        
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        p: 4,
        maxWidth: 500,
        mx: 'auto',
        backgroundColor: theme.palette.background.paper,
        borderRadius: 2,
    
      }}
    >
      <Typography 
        variant="h6" 
        gutterBottom
        sx={{
          fontWeight: 600,
          color: theme.palette.text.primary,
          mb: 2
        }}
      >
        No Vehicles Added Yet
      </Typography>
      
      <Typography 
        variant="body1" 
        sx={{ 
          mb: 3,
          color: theme.palette.text.secondary,
          fontSize: '1rem'
        }}
      >
        You haven't registered any vehicles. Click below to add your first vehicle.
      </Typography>
      
      <Button
        variant="contained"
        onClick={() => navigate('/VehicleRegister')}
        sx={{
          width: '200px',
          fontSize: '0.9375rem', // 15px
          fontWeight: 600,
          py: 1.5,
          px: 3,
          borderRadius: '10px',
          backgroundColor: '#51b672 ',
          color: theme.palette.success.contrastText,
          textTransform: 'none',
          boxShadow: 'none',
          '&:hover': {
            backgroundColor: theme.palette.success.dark,
            
          },
          transition: 'all 0.3s ease'
        }}
      >
        Add Vehicle
      </Button>
    </Box>
  );
};

export default NoVehicles;
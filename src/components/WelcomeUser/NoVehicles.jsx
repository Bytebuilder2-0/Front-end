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
    fontSize: '0.9375rem',
    fontWeight: 600,
    py: 1.5,
    px: 3,
    borderRadius: '10px',
    backgroundColor: '#459328', // Dark green
    color: 'white',
    textTransform: 'none',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    '&:hover': {
      backgroundColor: '#3a7c21', // Darker green
      boxShadow: '0 4px 8px rgba(0,0,0,0.15)'
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
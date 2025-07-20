import { Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Plus, Car } from 'lucide-react';

const NoVehicles = () => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        p: 4,
        maxWidth: 500,
        mx: 'auto',
      }}
    >
      <Box
        sx={{
          width: 80,
          height: 80,
          borderRadius: '50%',
          backgroundColor: '#f8fafc',
          border: '2px solid #e5e7eb',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          mb: 3
        }}
      >
        <Car size={32} color="#428BCA" />
      </Box>
      
      <Typography 
        variant="h5" 
        gutterBottom
        sx={{
          fontWeight: 600,
          color: '#33383E',
          mb: 1,
          fontSize: { xs: '1.25rem', md: '1.5rem' }
        }}
      >
        No Vehicles Added Yet
      </Typography>
      
      <Typography 
        variant="body1" 
        sx={{ 
          mb: 4,
          color: '#6b7280',
          fontSize: '16px',
          lineHeight: 1.6,
          maxWidth: '320px'
        }}
      >
        You haven't registered any vehicles. Add your first vehicle to get started with our services.
      </Typography>
      
      <Button
        variant="contained"
        onClick={() => navigate('/VehicleRegister')}
        startIcon={<Plus size={18} />}
        sx={{
          backgroundColor: '#459328',
          color: 'white',
          fontSize: '14px',
          fontWeight: 600,
          py: 1.5,
          px: 4,
          borderRadius: '10px',
          textTransform: 'none',
          boxShadow: '0 2px 4px rgba(69, 147, 40, 0.2)',
          '&:hover': {
            backgroundColor: '#3a7c21',
            boxShadow: '0 4px 8px rgba(69, 147, 40, 0.3)',
            transform: 'translateY(-1px)'
          },
          transition: 'all 0.2s ease'
        }}
      >
        Add Vehicle
      </Button>
    </Box>
  );
};

export default NoVehicles;
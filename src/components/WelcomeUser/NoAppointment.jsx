import { Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Calendar, Plus } from 'lucide-react';

const NoAppointment = ({ userId }) => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        p: 4,
        maxWidth: 480,
        mx: 'auto',
      }}
    >
      <Box
        sx={{
          width: 80,
          height: 80,
          borderRadius: '50%',
          backgroundColor: '#f8fafc',
          border: '2px solid #e0e4e7',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          mb: 3
        }}
      >
        <Calendar size={32} color="#459328" />
      </Box>
      
      <Typography 
        variant="h5" 
        gutterBottom
        sx={{
          fontWeight: 600,
          color: '#33383E',
          mb: 1
        }}
      >
        No Active Appointments
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
        You don't have any active appointments. Schedule your next service appointment today.
      </Typography>
      
      <Button
        variant="contained"
        onClick={() => navigate('/appointments')}
        startIcon={<Plus size={18} />}
        sx={{
          backgroundColor: '#459328',
          color: 'white',
          fontSize: '14px',
          fontWeight: 600,
          py: 1.25,
          px: 3,
          borderRadius: '8px',
          textTransform: 'none',
          boxShadow: '0 1px 3px rgba(69, 147, 40, 0.2)',
          '&:hover': {
            backgroundColor: '#3a7c21',
            boxShadow: '0 2px 6px rgba(69, 147, 40, 0.3)'
          },
          transition: 'all 0.2s ease'
        }}
      >
        Book Appointment
      </Button>
    </Box>
  );
};

export default NoAppointment;
import React from 'react';
import {
  Paper,
  Typography,
  Chip,
  Box,
  Button,
  Divider
} from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

const AppointmentPending = ({ appointment }) => {
  return (
    <Paper
      elevation={3}
      sx={{
        padding: 3,
        maxWidth: '600px',
        borderRadius: '16px',
        bgcolor: '#fffef8',
      }}
    >
      {/* Status Chip */}
      <Chip
        label="Pending"
        color="warning"
        icon={<AccessTimeIcon />}
        sx={{ fontWeight: 'bold', padding:'17px', fontSize:'15px' }}
      />
      <Typography variant="body1" sx={{ my: 2, color: '#595959', fontSize: '14' }}>
        Your appointment is pending. Our team will confirm it shortly.

        <Divider sx={{ my: 2, borderBottomWidth: 3 }} /> 
      </Typography>

      {/* Title */}
      <Typography variant="h6" fontWeight="bold" gutterBottom>
        Appointment ID : {appointment.appointmentId}
      </Typography>

      

      {/* Date Info */}
      <Typography variant="body2" gutterBottom  sx={{ padding:'3px' }}>
        Date  : {new Date(appointment.expectedDeliveryDate).toLocaleDateString('en-US', { year :'numeric',month: 'short', day: 'numeric' })}</Typography>
      {/* Friendly Info Message */}
      <Typography variant="body2" gutterBottom  sx={{ padding:'3px' }}>
        Vehicle Number  : {appointment.vehicleNumber}</Typography>
      {/* Friendly Info Message */}
      <Typography variant="body2" gutterBottom  sx={{ padding:'3px' }}>
      Vehicle Model  : {appointment.model}</Typography>
   
    

      {/* Services */}
      <Box display="flex" flexWrap="wrap" mt={1}>
        {appointment.services.map((service, index) => (
          <Chip
            key={index}
            label={service.trim().replace(/,+$/, '')}
            sx={{
              backgroundColor: '#e8f5e9',
              color: '#2e7d32',
              mr: 1,
        
            }}
          />
        ))}
      </Box>

      {/* Buttons */}
      <Box mt={3} display="flex" gap={1}>
        <Button variant="contained" size="small" color="error">Cancel</Button>
      </Box>
    </Paper>
  );
};

export default AppointmentPending;

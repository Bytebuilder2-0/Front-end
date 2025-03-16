import React from 'react';
import { Typography, Paper, Box } from '@mui/material';

const AppointmentConfirm = ({ appointment }) => {
  return (
    <Paper elevation={3} sx={{ padding: '20px', backgroundColor: '#e8f5e9', margin: '20px' }}>
      <Typography variant="h5" sx={{ color: '#4caf50', fontWeight: 'bold', marginBottom: '10px' }}>
        Confirmed Appointment
      </Typography>
      <Box sx={{ marginBottom: '10px' }}>
        <Typography variant="body1">
          <strong>Appointment ID:</strong> {appointment.appointmentId}
        </Typography>
        <Typography variant="body1">
          <strong>Vehicle Number:</strong> {appointment.vehicleNumber}
        </Typography>
        <Typography variant="body1">
          <strong>Model:</strong> {appointment.model}
        </Typography>
        <Typography variant="body1">
          <strong>Expected Delivery Date:</strong> {new Date(appointment.expectedDeliveryDate).toLocaleDateString()}
        </Typography>
      </Box>
      <Typography variant="body1" sx={{ color: '#4caf50', fontStyle: 'italic' }}>
        Your appointment has been confirmed. Thank you for choosing us!
      </Typography>
    </Paper>
  );
};

export default AppointmentConfirm;

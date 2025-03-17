

import React from 'react';
import { Typography, Paper, Box } from '@mui/material';

const AppointmentPending = ({ appointment }) => {
  return (
    <Paper elevation={3} sx={{ padding: '20px', backgroundColor: '#fff3e0', margin: '20px' }}>
      <Typography variant="h5" sx={{ color: '#ff9800', fontWeight: 'bold', marginBottom: '10px' }}>
        Pending Appointment
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
      <Typography variant="body1" sx={{ color: '#ff9800', fontStyle: 'italic' }}>
        Your appointment is pending. Our team will confirm it shortly.
      </Typography>
    </Paper>
  );
};

export default AppointmentPending;

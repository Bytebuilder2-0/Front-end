import React, {useState} from 'react';
import {
  Paper,
  Typography,
  Chip,
  Box,
  Button,
  Divider,
  Snackbar,
  Alert
} from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import AlertDialog from '../Appointement/AlertDialog';

const AppointmentPending = ({ appointment, onCancel }) => {
  const [openConfirm, setOpenConfirm] = useState(false);
  const [snackbar, setSnackbar] = useState({ 
    open: false, 
    message: '',
    severity: 'success'
  });
  const [isCancelling, setIsCancelling] = useState(false);
  const navigate = useNavigate();

  const handleCancelClick = () => setOpenConfirm(true);

  const updateAppointmentStatus = async (newStatus) => {
    setIsCancelling(true);
    try {
      const response = await axios.put(
        `http://localhost:5000/api/appointments/${appointment._id}/statusUpdate`,
        { status: newStatus }
      );

      
      setSnackbar({
        open: true,
        message: `Appointment ${newStatus.toLowerCase()} successfully`,
        severity: 'success'
      });

      // Wait for user to see the message before proceeding
      setTimeout(() => {
        if (typeof onCancel === 'function') {
          onCancel(appointment._id);
        }
      }, 1500);
    
    } catch (error) {
      console.error('Error updating appointment:', error);
      setSnackbar({
        open: true,
        message: `Failed to update appointment: ${error.response?.data?.message || error.message}`,
        severity: 'error'
      });
    }
    finally {
      setIsCancelling(false);
    }
  };

  const handleConfirmCancel = () => {
    updateAppointmentStatus('Cancelled');
    setOpenConfirm(false);
  };

  
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
        <Button variant="contained" size="small" color="error"  onClick={handleCancelClick}>Cancel</Button>
      </Box>

      <AlertDialog
      open={openConfirm}
      onClose={() => setOpenConfirm(false)}
      onConfirm={handleConfirmCancel}
      loading={isCancelling}
      type="warning"
      title="Confirm Cancellation"
      message="Are you sure you want to cancel this appointment?"
      confirmText="Yes, Cancel"
      cancelText="No, Keep It"
      showCancelButton={true}
/> 

      {/* Success Message */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity || 'success'}>
          {snackbar.message}
        </Alert>
      </Snackbar>

    </Paper>
  );
};

export default AppointmentPending;

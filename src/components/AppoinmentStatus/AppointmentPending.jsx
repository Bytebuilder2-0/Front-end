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
import { useAuth } from "../../context/AuthContext";

const API_URL = 'http://localhost:5000/api/appointments';

const AppointmentPending = ({ appointment, onCancel }) => {
  const [openConfirm, setOpenConfirm] = useState(false);
  const { user, token } = useAuth();
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
        `${API_URL}/${appointment._id}/statusUpdate`,
      { status: newStatus },
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
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
      navigate(`/User`);
    setOpenConfirm(false);
  };

  
  return (

     <Box sx={{ padding: "20px" }}>

    <Typography  gutterBottom sx={{ 
              fontWeight: 600,
              fontSize : 35,
              marginBottom: '1px'
            }}>
              Appoinment Details
            </Typography>
            <Typography varient="caption" sx = {{color:'green'}} > Appoinment - Pending</Typography>
            
            <Divider sx={{ mb: 6  }} />

    
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
        color="#ff7700ff"
        icon={<AccessTimeIcon />}
        sx={{ fontWeight: 'bold', padding:'17px', fontSize:'15px',backgroundColor: "#ff5500ff", color: '#fff' , mb: 2 }}
      />
      <Typography variant="body1" sx={{ my: 2, color: '#595959', fontSize: '14' }}>
        Your appointment is pending. Our team will confirm it shortly.

        <Divider sx={{ my: 2, borderBottomWidth: 3 }} /> 
      </Typography>

      {/* Title */}
      <Typography variant="h6" fontWeight="bold" gutterBottom>
        Vehicle ID : {appointment.vehicleId}
      </Typography>

      

      {/* Date Info */}
        <Typography variant="body2" gutterBottom  sx={{ padding:'3px' }}>
        Date  : {new Date(appointment.expectedDeliveryDate).toLocaleDateString('en-US', { year :'numeric',month: 'short', day: 'numeric' })}</Typography>

         <Typography variant="body2" gutterBottom sx={{ padding: '3px' }}>
            Time :   {appointment.preferredTime}   
      </Typography>
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

    <Box 
        sx={{
          backgroundColor: '#fff8e1',
          p: 2,
          my: 4,
          borderRadius: 2,
          borderLeft: '4px solid #ffdb9eff'
        }}
      >
       
        <Typography variant="body2">
          To book a new appointment for this vehicle, you must first cancel this pending appointment.
          After cancellation, you can immediately submit a new booking request.
        </Typography>
      </Box>
  </Box>
  );
};

export default AppointmentPending;

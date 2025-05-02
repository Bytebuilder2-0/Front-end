import React,{useState} from 'react';
import { Typography, Paper, Box, Button,Divider,Alert,Snackbar } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import AlertDialog from '../Appointement/AlertDialog';


const AppointmentConfirm = ({ appointment, onCancel }) => {
  const [openConfirm, setOpenConfirm] = useState(false);
  const [snackbar, setSnackbar] = useState({ 
    open: false, 
    message: '',
    severity: 'success'
  });
  const [isCancelling, setIsCancelling] = useState(false);


  const handleCancelClick = () => setOpenConfirm(true);          // When user clicks "Cancel Booking" button, open confirmation dialog

  const updateAppointmentStatus = async (newStatus) => {           // Function to update appointment status (used to cancel the booking)

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
      setTimeout(() => {                                // After short delay, trigger onCancel callback to refresh data
        if (typeof onCancel === 'function') {
          onCancel(appointment._id);
        }
      }, 1500);
    
    } catch (error) {
      console.error('Error updating appointment:', error);
      setSnackbar({                                                              // If API call fails, show error message
        open: true, 
        message: "Failed to update appointment",
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
    <Paper elevation={3} sx={{ 
      padding: '20px', 
      maxWidth: '400px', 
      margin: '20px auto',
      borderRadius: '12px'
    }}>
      

      <Typography variant="h5" sx={{ 
        fontWeight: 'bold', 
        marginBottom: '30px',
        color: '#4CAF50',
        textAlign: 'center'
      }}>
        Booking Confirmed
      </Typography>

      <div style={{ display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'}}>
      <img
        src="https://cdn-icons-png.flaticon.com/512/3645/3645796.png"
        style={{
            height: "90px", 
            width: "auto",
            alignItems: 'center',
            marginBottom: "20px"
           }}/>
           </div>
                  
      
      <Box sx={{ 
        marginBottom: '30px',
        '& > div': {
          marginBottom: '15px'
        }
      }}>
   <Typography 
        variant="body1" 
        sx={{
          textAlign: 'center',
          fontStyle: 'italic',
          color: 'text.secondary',
          fontSize: "18px",
          mb: 3,
          lineHeight: 1.6
  }}>

       Your appointment has been confirmed. Thank you for choosing us!
   </Typography> 
   
          <div>
          <Typography variant="subtitle1" sx={{ fontWeight: '800',fontSize: '20px' }}>Vehicle Id  : {appointment.vehicleId}</Typography>
       
        </div>
        <Divider sx={{ my: 2, borderBottomWidth: 3 }} /> 
        <div>
          <Typography variant="subtitle1" sx={{ fontWeight: 'bold',fontSize: '20px' }}>Date</Typography>
          <Typography variant="body1">{new Date(appointment.expectedDeliveryDate).toLocaleDateString('en-US', { year :'numeric',month: 'short', day: 'numeric' })}</Typography>
        </div>
        
        <div>
          <Typography variant="subtitle1" sx={{ fontWeight: 'bold', fontSize: '20px' }}>Time</Typography>
          <Typography variant="body1">{appointment.preferredTime}</Typography>
        </div>

        <Divider sx={{ my: 2, borderBottomWidth: 3 }} /> 
        <div >
        <Typography sx={{ padding:'3px' }}>Vehicel Number : {appointment.vehicleNumber}</Typography>
        <Typography sx={{ padding:'3px' }}>Vehicel Model : {appointment.model}</Typography>
        <Typography sx={{ padding:'3px' }}>Services : {Array.isArray(appointment.services) 
            ? appointment.services.join(', ') 
            : appointment.services}
</Typography>
</div>

      </Box>
      
      <Button 
        variant="contained" 
        sx={{ 
          backgroundColor: '#f44336', 
          color: 'white',
          fontWeight: 'bold',
          padding: '10px 20px',
          '&:hover': {
            backgroundColor: '#d32f2f'
          }
        }}
        onClick={handleCancelClick}
      >
        Cancel Booking
      </Button>
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

export default AppointmentConfirm;

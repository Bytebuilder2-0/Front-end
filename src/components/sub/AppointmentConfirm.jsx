import React from 'react';
import { Typography, Paper, Box, Button,Divider } from '@mui/material';



const AppointmentConfirm = ({ appointment }) => {
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
  }}
>
  Your appointment has been confirmed. Thank you for choosing us!
</Typography>
         <div>
          <Typography variant="subtitle1" sx={{ fontWeight: '800',fontSize: '20px' }}>Appointment Id  : {appointment.appointmentId}</Typography>
       
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
      >
        Cancel Booking
      </Button>
    </Paper>
  );
};

export default AppointmentConfirm;

import React, { useEffect, useState } from 'react';
import { TextField, MenuItem, Select, FormControl, InputLabel, Button, Grid, Typography, FormHelperText,} from '@mui/material';
import { useNavigate } from 'react-router-dom'; 
import HandleAppointmentForm from './sub/HandleAppointmentForm';
import AlertDialog from './Appointement/AlertDialog';
import VehicleSelection from './Appointement/VehicleSelection';

const AppointmentSubmit = ({userId}) => {
  // Hardcoded user ID for testing

  const {
    vehicles,
    services,
    formData,
    errors,
    disabledVehicles = [],
    fetchData,
    handleVehicleChange,
    handleServiceChange,
    handleInputChange,
    handleSubmit,
    handleReset
  } = HandleAppointmentForm(userId);
  
  const navigate = useNavigate(); 
  const [showAlert, setShowAlert] = useState(false);
  const [createdAppointment, setCreatedAppointment] = useState(null); // Store created appointment data

 useEffect(() => {
    fetchData();
  }, [userId]);

const handleFormSubmit = async (e) => {
  e.preventDefault();
  console.log('Form submitted', formData);

  const object = await handleSubmit(e); // Call handleSubmit and get the created appointment
  console.log('Created Appointment ID:', object.appointment._id);

  if (object) {
    setShowAlert(true); // Show success alert
    setCreatedAppointment(object); // Store the created appointment data
    
  } else {
    console.error('Appointment creation failed'); 
};
}

const handleAlertClose = () => {
  if (createdAppointment.appointment && createdAppointment.appointment._id) {
    setShowAlert(false);
    navigate(`/appointments/${createdAppointment.appointment._id}`); // Redirect to the appointment details page
  } else {
    console.error('Appointment ID is undefined'); 
  }
};


  return (
    <Grid container justifyContent="center" style={{ padding: 20 }}>
      <Grid item xs={12} md={8}>
        <Typography variant="h4" gutterBottom>
          Create New Appointment
        </Typography>
        
        <form onSubmit={handleFormSubmit}>
          {/* Vehicle Selection */}
          <FormControl fullWidth margin="normal" error={!!errors.vehicleId}>
      
            <VehicleSelection
            vehicles={vehicles}
            value={formData.vehicleObject}
            onChange={handleVehicleChange}
            error={errors.vehicleId}
            disabledVehicles={disabledVehicles}
          />

          </FormControl>

          {/* Auto-filled Vehicle Details */}
          <TextField
            fullWidth
            margin="normal"
            label="Vehicle Number"
            value={formData.vehicleNumber}
            disabled
          />
          
          <TextField
            fullWidth
            margin="normal"
            label="Vehicle Model"
            value={formData.model}
            disabled
          />

          {/* Service Selection */}
          <FormControl fullWidth margin="normal" error={!!errors.services}>
            <InputLabel>Select Services</InputLabel>
            <Select
              multiple
              value={formData.services}
              onChange={handleServiceChange}
              label="Select Services"
            >
              {services.map((service) => (
                <MenuItem key={service._id} value={service.name}
                style={{
                  backgroundColor: formData.services.includes(service.name) ? '#9cd1f8' : 'white', // Light blue for selected, white for unselected 
                }}>  
                {service.name}
                </MenuItem>
              ))}
            </Select>
            {errors.services && <FormHelperText>{errors.services}</FormHelperText>}
          </FormControl>

      
          <TextField
            fullWidth
            margin="normal"
            label="Issue Description"
            name="issue"
            value={formData.issue}
            onChange={handleInputChange}
            multiline
            rows={4}
          />
    
          <TextField
            fullWidth
            margin="normal"
            label="Preferred Time (HH:MM AM/PM)"
            name="preferredTime"
            value={formData.preferredTime}
            onChange={handleInputChange}
            error={!!errors.preferredTime}
            helperText={errors.preferredTime || 'Example: 09:30 AM'}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Expected Delivery Date"
            name="expectedDeliveryDate"
            type="date"
            value={formData.expectedDeliveryDate}
            onChange={handleInputChange}
            InputLabelProps={{ shrink: true }}
            error={!!errors.expectedDeliveryDate}
            helperText={errors.expectedDeliveryDate}
            
            />          
          <TextField
            fullWidth
            margin="normal"
            label="Contact Number"
            name="contactNumber"
            value={formData.contactNumber}
            onChange={handleInputChange}
            error={!!errors.contactNumber}
            helperText={errors.contactNumber || 'Example : 0771234567 '}
          />
          <Grid container spacing={2} justifyContent="flex-end" style={{ marginTop: 20 }}>
            <Grid item>
              <Button variant="outlined"
               onClick={handleReset}
              sx={{
                backgroundColor: '', 
                '&:hover': {
                  backgroundColor: 'red', 
                  color: 'white'
                },
              }}>
                Reset
              </Button>
            </Grid>

            
            <Grid item>
              <Button type="submit" variant="contained" 
               sx={{
                backgroundColor: 'green', 
                '&:hover': {
                  backgroundColor: 'darkgreen', 
                },
              }}>
                Submit Appointment
              </Button>
            </Grid>
          </Grid>
        </form>

               <AlertDialog
                open={showAlert} 
                onClose={handleAlertClose}
                type="success"
                title="Appointment Submitted Successfully"
                message=" Your appointment has been submitted successfully! Our supervisor will contact you shortly."
                confirmText="Great!" /> 

      </Grid>
    </Grid>
  );
};

export default AppointmentSubmit;

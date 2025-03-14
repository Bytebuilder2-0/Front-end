import React, { useEffect, useState } from 'react';
import {
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Button,
  Grid,
  Typography,
  FormHelperText,
  Alert,
  AlertTitle
} from '@mui/material';
import HandleAppointmentForm from './sub/HandleAppointmentForm';

const AppointmentSubmit = ({userId}) => {
  // Hardcoded user ID for testing

  const {
    vehicles,
    services,
    formData,
    errors,
    fetchData,
    handleVehicleChange,
    handleServiceChange,
    handleInputChange,
    handleSubmit,
    handleReset
  } = HandleAppointmentForm(userId);
  

 useEffect(() => {
    fetchData();
  }, [userId]);

  const [showAlert, setShowAlert] = useState(false);

  const handSubmit = () => {
    setShowAlert(true); // Show the alert
    setTimeout(() => {
      setShowAlert(false); // Hide alert after 3 seconds
    }, 3000);
  };




  return (
    <Grid container justifyContent="center" style={{ padding: 20 }}>
      <Grid item xs={12} md={8}>
        <Typography variant="h4" gutterBottom>
          Create New Appointment
        </Typography>
        
        <form onSubmit={handleSubmit}>
          {/* Vehicle Selection */}
          <FormControl fullWidth margin="normal" error={!!errors.vehicleId}>
            <InputLabel>Select Vehicle</InputLabel>
            <Select
              value={formData.vehicleObject}
              onChange={handleVehicleChange}
              label="Select Vehicle"
            >
              {vehicles.map((vehicle) => (
                <MenuItem key={vehicle._id} value={vehicle._id}>
                  {vehicle.vehicleNumber} - {vehicle.model}
                </MenuItem>
              ))}
            </Select>
            {errors.vehicleId && <FormHelperText>{errors.vehicleId}</FormHelperText>}
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
            helperText={errors.contactNumber}
          />

      
          <Grid container spacing={2} justifyContent="flex-end" style={{ marginTop: 20 }}>
            <Grid item>
              <Button variant="outlined" onClick={handleReset}
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

              {showAlert && (
        <Alert severity="success" sx={{ mt: 2 }}>
          <AlertTitle>Done</AlertTitle>
          The appointment submitted successfully..
        </Alert>
      )}
            </Grid>
          </Grid>
        </form>
      </Grid>
    </Grid>
  );
};

export default AppointmentSubmit;
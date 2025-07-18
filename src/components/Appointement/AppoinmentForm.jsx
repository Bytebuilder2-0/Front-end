import React, { useEffect, useState } from 'react';
import { 
  TextField, 
  MenuItem, 
  FormControl, 
  InputLabel, 
  Select, 
  Button, 
  Grid, 
  Typography, 
  FormHelperText,
  Paper,
  Divider,
  Box,
  useTheme,

} from '@mui/material';
import { useNavigate } from 'react-router-dom'; 
import HandleAppointmentForm from './HandleAppointmentForm';
import AlertDialog from './AlertDialog';
import VehicleSelection from './VehicleSelection';
import TimingSection from './TimingSection';
import ServiceDetailsSection from './ServiceSelection';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';

const AppointmentSubmit = () => {
  const theme = useTheme();
  const {
    vehicles,
    services,
    formData,
    errors,
    disabledVehicles = [],
    handleVehicleChange,
    handleServiceChange,
    handleInputChange,
    handleSubmit,
    handleReset
  } = HandleAppointmentForm();
  
  const navigate = useNavigate(); 
  const [showAlert, setShowAlert] = useState(false);
  const [createdAppointment, setCreatedAppointment] = useState(null);
   const [loading, setLoading] = useState(false);

  const isFormValid = () => {
    return (
      formData.vehicleObject &&
      formData.services?.length > 0 &&
      formData.preferredDate &&
      formData.preferredTime &&
      formData.expectedDeliveryDate &&
      formData.contactNumber
    );
  };

 const handleFormSubmit = async (e) => {
  e.preventDefault();

  if (loading) return;  // Prevent multiple submits immediately

  setLoading(true); // Start loading

  try {
    const object = await handleSubmit(e);
    if (object) {
      setShowAlert(true);
      setCreatedAppointment(object);
    } else {
      console.error('Appointment creation failed');
    }
  } catch (error) {
    console.error('Submission error:', error);
  } finally {
    setLoading(false);  // Reset loading state
  }
};


  const handleAlertClose = () => {
    if (createdAppointment?.appointment?._id) {
      setShowAlert(false);
      navigate(`/User`);
    } else {
      console.error('Appointment ID is undefined'); 
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Paper elevation={3} sx={{ 
        p: 4, 
        borderRadius: 3,
        maxWidth: 800,
        mx: 'auto'
      }}>
        <Typography variant="h4" gutterBottom sx={{ 
          fontWeight: 600,

          mb: 3,
          display: 'flex',
          alignItems: 'center',
          gap: 1
        }}>
          New Service Appointment
        </Typography>
        
        <Divider sx={{ mb: 4 }} />

        <form onSubmit={handleFormSubmit}>
          <Grid container spacing={3}>
            {/* Vehicle Selection Section */}
            <Grid item xs={12}>
              <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1,color:'#302e2eff' }}>
            
            <DirectionsCarIcon color= "primary" />
                Vehicle Information
              </Typography>
              <FormControl fullWidth error={!!errors.vehicleId}>
                <VehicleSelection
                  vehicles={vehicles}
                  value={formData.vehicleObject}
                  onChange={handleVehicleChange}
                  error={errors.vehicleId}
                  disabledVehicles={disabledVehicles}
                />
              </FormControl>
            </Grid>

            

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Vehicle Number"
                value={formData.vehicleNumber}
                disabled
                InputProps={{
                  startAdornment: (
                    <Typography color="text.secondary" sx={{ mr: 1 }}>#</Typography>
                  ),
                }}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Vehicle Model"
                value={formData.model}
                disabled
              />
            </Grid>

            <ServiceDetailsSection
              services={services}
              formData={formData}
              errors={errors}
              handleServiceChange={handleServiceChange}
              handleInputChange={handleInputChange}
            />

            <TimingSection
              formData={formData}
              errors={errors}
              handleInputChange={handleInputChange}
            />

            {/* Form Actions */}
            <Grid item xs={12} sx={{ mt: 2 }}>
              <Divider sx={{ mb: 3 }} />
              <Box sx={{ display: 'flex', justifyContent:'flex-end', gap: 2 }}>
                <Button 
                  variant="outlined"
                  onClick={handleReset}
                  sx={{
                    px: 4,
                    py: 1,
                    fontWeight: 600,
                    '&:hover': {
                      backgroundColor: theme.palette.error.light,
                      color: theme.palette.error.contrastText
                    }
                  }}
                >
                  Reset Form
                </Button>
                <Button 
                  type="submit" 
                  variant="contained" 
                  disabled={!isFormValid() || loading}  // Disable if invalid or loading
                  sx={{
                    px: 4,
                    py: 1,
                    fontWeight: 600,
                    backgroundColor: theme.palette.success.main,
                    '&:hover': {
                      backgroundColor: theme.palette.success.dark
                    }
                  }}
                >
                  {loading ? 'Submitting...' : 'Submit Appointment'}
                </Button>

              </Box>
            </Grid>
          </Grid>
        </form>

        <AlertDialog
          open={showAlert} 
          onClose={handleAlertClose}
          type="success"
          title="Appointment Submitted Successfully"
          message="Your appointment has been submitted successfully! Our supervisor will contact you shortly."
          confirmText="Great!"
        /> 
      </Paper>
    </Box>
  );
};

export default AppointmentSubmit;
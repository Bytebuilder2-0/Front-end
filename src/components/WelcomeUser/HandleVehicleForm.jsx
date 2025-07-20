import React from 'react';
import {
  TextField,
  MenuItem,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  Paper,
  Typography,
  Divider,
  Box,
  useTheme
} from '@mui/material';
import { DirectionsCar, CalendarToday, Build } from '@mui/icons-material';

const vehicleTypes = ['Sedan', 'SUV', 'Truck', 'Van', 'Motorcycle', 'Other'];

const HandleVehicleForm = ({ formData, onChange, onSubmit, onReset }) => {
  const theme = useTheme();
  const currentYear = new Date().getFullYear();

  // Validations
  const isYearValid = formData.vehicleYear >= 1700 && formData.vehicleYear <= currentYear;
  const isModelValid = /^[a-zA-Z0-9 ]+$/.test(formData.model || '');

  // Check if all required fields are filled and valid
  const isFormValid = () => {
    return (
      formData.vehicleNumber &&
      formData.vehicleYear &&
      formData.model &&
      formData.vehicleType &&
      isYearValid &&
      isModelValid
    );
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
          Vehicle Registration
        </Typography>

        <Divider sx={{ mb: 4 }} />

        <form onSubmit={onSubmit}>
          <Grid container spacing={3}>

            {/* Vehicle Identification */}
            <Grid item xs={12}>
              <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                <DirectionsCar color="primary" />
                Vehicle Identification
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Vehicle Number *"
                name="vehicleNumber"
                value={formData.vehicleNumber}
                onChange={onChange}
                required
                InputProps={{
                  startAdornment: (
                    <Typography color="text.secondary" sx={{ mr: 1 }}>#</Typography>
                  ),
                }}
              />
            </Grid>

            {/* Vehicle Details */}
            <Grid item xs={12}>
              <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                <Build color="primary" />
                Vehicle Details
              </Typography>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Year *"
                name="vehicleYear"
                value={formData.vehicleYear}
                onChange={onChange}
                required
                error={formData.vehicleYear && !isYearValid}
                helperText={
                  formData.vehicleYear && !isYearValid
                    ? `Enter a valid year between 1700 and ${currentYear}`
                    : ''
                }
                InputProps={{
                  startAdornment: (
                    <CalendarToday color="action" sx={{ mr: 1 }} />
                  ),
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Model *"
                name="model"
                value={formData.model}
                onChange={onChange}
                required
                error={formData.model && !isModelValid}
                helperText={
                  formData.model && !isModelValid
                    ? 'Model can only contain letters and numbers'
                    : ''
                }
              />
            </Grid>

            <Grid item xs={12}>
              <FormControl fullWidth required>
                <InputLabel>Vehicle Type *</InputLabel>
                <Select
                  name="vehicleType"
                  value={formData.vehicleType}
                  onChange={onChange}
                  label="Vehicle Type *"
                >
                  {vehicleTypes.map(type => (
                    <MenuItem 
                      key={type} 
                      value={type}
                      sx={{
                        '&:hover': {
                          backgroundColor: theme.palette.primary.lighter,
                        }
                      }}
                    >
                      {type}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Actions */}
            <Grid item xs={12} sx={{ mt: 2 }}>
              <Divider sx={{ mb: 3 }} />
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                <Button 
                  variant="outlined"
                  onClick={onReset}
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
                  disabled={!isFormValid()}
                  sx={{
                    px: 4,
                    py: 1,
                    fontWeight: 600,
                    backgroundColor: theme.palette.success.main,
                    '&:hover': {
                      backgroundColor: theme.palette.success.dark
                    },
                    '&:disabled': {
                      backgroundColor: theme.palette.action.disabledBackground
                    }
                  }}
                >
                  Register Vehicle
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Box>
  );
};

export default HandleVehicleForm;

import React from 'react';
import { Grid, Typography, TextField } from '@mui/material';
import { Schedule, Phone } from '@mui/icons-material';
import { MobileTimePicker } from '@mui/x-date-pickers/MobileTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { parse, format } from 'date-fns';

const TimingSection = ({ formData, errors, handleInputChange }) => {
  // Convert time string to Date object for the picker
 const parseTimeString = (timeStr) => {
  if (!timeStr) return null;
  try {
    return parse(timeStr, 'hh:mm a', new Date()); // ✅ Match 12-hour format
  } catch {
    return null;
  }
};


  return (
    <>
      <Grid item xs={12}>
        <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1, color: '#302e2eff' }}>
          <Schedule color="primary" />
          Appointment Timing
        </Typography>
      </Grid>

      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="Preferred Date *"
          name="preferredDate"
          type="date"
          value={formData.preferredDate}
          onChange={handleInputChange}
          InputLabelProps={{ shrink: true }}
          error={!!errors.preferredDate}
          helperText={errors.preferredDate}
        />
      </Grid>

      <Grid item xs={12} md={6}>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <MobileTimePicker
            label="Preferred Time *"
            value={parseTimeString(formData.preferredTime)}
            onChange={(newValue) => {
             const timeString = newValue ? format(newValue, 'hh:mm a') : '';
              handleInputChange({
                target: {
                  name: 'preferredTime',
                  value: timeString,
                },
              });
            }}
            slotProps={{
              textField: {
                fullWidth: true, 
                error: !!errors.preferredTime,
                helperText: errors.preferredTime || 'Format: 07:30 PM',
              },
            }}
          />
        </LocalizationProvider>
      </Grid>

      {/* Rest of your component remains the same */}
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="Expected Delivery Date *"
          name="expectedDeliveryDate"
          type="date"
          value={formData.expectedDeliveryDate}
          onChange={handleInputChange}
          InputLabelProps={{ shrink: true }}
          error={!!errors.expectedDeliveryDate}
          helperText={errors.expectedDeliveryDate}
        />
      </Grid>

      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="Contact Number *"
          name="contactNumber"
          value={formData.contactNumber}
          onChange={handleInputChange}
          error={!!errors.contactNumber}
          helperText={errors.contactNumber || 'Format: 94712345678'}
          InputProps={{
            startAdornment: (
              <Phone color="action" sx={{ mr: 1 }} />
            ),
          }}
        />
      </Grid>
    </>
  );
};

export default TimingSection;
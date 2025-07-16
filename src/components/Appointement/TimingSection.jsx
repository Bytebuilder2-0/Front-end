import React from 'react';
import { 
  Grid, 
  Typography, 
  TextField 
} from '@mui/material';
import { Schedule, Phone } from '@mui/icons-material';

const TimingSection = ({ 
  formData, 
  errors, 
  handleInputChange 
}) => {
  return (
    <>
      <Grid item xs={12}>
        <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 , color:'#302e2eff'}}>
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
        <TextField
          fullWidth
          label="Preferred Time *"
          name="preferredTime"
          value={formData.preferredTime}
          onChange={handleInputChange}
          error={!!errors.preferredTime}
          helperText={errors.preferredTime || 'Format: 09:30 AM'}
          InputProps={{
            startAdornment: (
              <Schedule color="action" sx={{ mr: 1 }} />
            ),
          }}
        />
      </Grid>

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
          helperText={errors.contactNumber}
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
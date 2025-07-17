import React from 'react';
import { 
  Grid, 
  Typography, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  FormHelperText,
  TextField
} from '@mui/material';
import { Build } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';

const ServiceDetailsSection = ({ 
  services, 
  formData, 
  errors, 
  handleServiceChange, 
  handleInputChange 
}) => {
  const theme = useTheme();

  return (
    <Grid item xs={12}>
      <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 , color: '#302e2eff'}}>
        <Build color="primary" />
        Service Details
      </Typography>
      <FormControl fullWidth error={!!errors.services}>
        <InputLabel>Select Services *</InputLabel>
        <Select
          multiple
          value={formData.services}
          onChange={handleServiceChange}
          label="Select Services *"
          renderValue={(selected) => selected.join(', ')}
        >
          {services.map((service) => (
            <MenuItem 
              key={service._id} 
              value={service.name}
              sx={{
                backgroundColor: formData.services.includes(service.name) 
                  ? theme.palette.primary.light 
                  : 'inherit',
                '&:hover': {
                  backgroundColor: theme.palette.primary.lighter,
                }
              }}
            >  
              {service.name}
            </MenuItem>
          ))}
        </Select>
        {errors.services && <FormHelperText error>{errors.services}</FormHelperText>}
      </FormControl>

      <TextField
        fullWidth
        label="Issue Description (Optional)"
        name="issue"
        value={formData.issue}
        onChange={handleInputChange}
        multiline
        rows={4}
        sx={{ mt: 2 }}
        error={!!errors.issue}
        helperText={errors.issue}
      />
    </Grid>
  );
};

export default ServiceDetailsSection;
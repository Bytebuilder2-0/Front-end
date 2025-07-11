import React from 'react';
import {
  TextField,
  MenuItem,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select
} from '@mui/material';

const vehicleTypes = ['Sedan', 'SUV', 'Truck', 'Van', 'Motorcycle', 'Other'];

const HandleVehicleForm = ({ formData, onChange, onSubmit, onReset }) => {
  return (
    <form onSubmit={onSubmit}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Vehicle Number"
            name="vehicleNumber"
            value={formData.vehicleNumber}
            onChange={onChange}
            required
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Year"
            name="vehicleYear"
            value={formData.vehicleYear}
            onChange={onChange}
            required
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Model"
            name="model"
            value={formData.model}
            onChange={onChange}
            required
          />
        </Grid>

        <Grid item xs={12}>
          <FormControl fullWidth>
            <InputLabel>Vehicle Type</InputLabel>
            <Select
              name="vehicleType"
              value={formData.vehicleType}
              onChange={onChange}
              required
            >
              {vehicleTypes.map(type => (
                <MenuItem key={type} value={type}>
                  {type}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            sx={{ mr: 2 }}
          >
            Submit
          </Button>
          <Button
            type="button"
            variant="outlined"
            onClick={onReset}
          >
            Reset
          </Button>
        </Grid>
      </Grid>
    </form>
  );
};

export default HandleVehicleForm;
import { FormControl, InputLabel, Select, MenuItem, FormHelperText } from '@mui/material';

const VehicleSelection = ({ vehicles, value, onChange, error, disabledVehicles }) => {
  return (
    <FormControl fullWidth margin="normal" error={!!error}>
      <InputLabel>Select Vehicle</InputLabel>
      <Select value={value} onChange={onChange} label="Select Vehicle">
        {vehicles.map((vehicle) => (
          <MenuItem 
            key={vehicle._id} 
            value={vehicle._id}
            disabled={disabledVehicles.includes(vehicle._id)}
            sx={{
              color: disabledVehicles.includes(vehicle._id) ? '#999' : 'inherit',
              backgroundColor: disabledVehicles.includes(vehicle._id) ? '#f5f5f5' : 'inherit'
            }}
          >
            {vehicle.vehicleNumber} - {vehicle.model}
          </MenuItem>
        ))}
      </Select>
      {error && <FormHelperText>{error}</FormHelperText>}
    </FormControl>
  );
};

export default VehicleSelection;

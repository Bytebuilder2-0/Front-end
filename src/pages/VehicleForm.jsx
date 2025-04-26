import React, { useState } from 'react';
import { TextField, Button, Typography, Container, Paper, Box, Avatar, Grid } from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import axios from 'axios';

const VehicleForm = () => {
  const [formData, setFormData] = useState({
    type: '',
    model: '',
    registrationNumber: ''
  });

  const [responseMsg, setResponseMsg] = useState('');

  const handleChange = (e) => {
    setFormData({ 
      ...formData, 
      [e.target.name]: e.target.value 
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setResponseMsg('');

    try {
      const res = await axios.post('http://localhost:5000/api/vehicles/register', formData);
      setResponseMsg(res.data.message);
      setFormData({ type: '', model: '', registrationNumber: '' });
    } catch (err) {
      setResponseMsg(err.response?.data?.error || 'Registration failed.');
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={4} sx={{ p: 4, mt: 5 }}>
        <Grid align="center" mb={2}>
        <Avatar sx={{ width: 50, height: 50 }}></Avatar>
        <Typography variant="h5" gutterBottom>Vehicle Details</Typography>
        </Grid>
        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <TextField
            label="Type"
            variant="outlined"
            name="type"
            value={formData.type}
            onChange={handleChange}
            required
          />
          <TextField
            label="Model"
            variant="outlined"
            name="model"
            value={formData.model}
            onChange={handleChange}
            required
          />
          <TextField
            label="Registration Number"
            variant="outlined"
            name="registrationNumber"
            value={formData.registrationNumber}
            onChange={handleChange}
            required
          />
          <Button variant="contained"  type="submit">Add Vehicle</Button>
          {responseMsg && (
            <Typography variant="body1" color="secondary">{responseMsg}</Typography>
          )}
        </Box>
      </Paper>
    </Container>
  );
};

export default VehicleForm;

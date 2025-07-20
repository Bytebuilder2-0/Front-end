import React, { useState } from 'react';
import { TextField, Button, Typography, Container, Paper, Box, Avatar, Grid } from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-hot-toast'; // ✅ import toast

const VehicleForm = () => {
  const { user, token } = useAuth();
  const [formData, setFormData] = useState({
    type: '',
    model: '',
    registrationNumber: ''
  });

  const handleChange = (e) => {
    setFormData({ 
      ...formData, 
      [e.target.name]: e.target.value 
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post('http://localhost:5000/api/vehicles/register', formData);

      // ✅ Show success toast
      toast.success("🚗 Vehicle added successfully!", {
        style: {
          borderRadius: '10px',
          background: '#1a237e',
          color: '#fff',
        },
        iconTheme: {
          primary: '#82b1ff',
          secondary: '#fff',
        },
      });

      setFormData({ type: '', model: '', registrationNumber: '' });
    } catch (err) {
      // ✅ Show error toast
      toast.error(err.response?.data?.error || "❌ Vehicle registration failed.");
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper sx={{ p: 1, mt: 3 }} style={{ height: '50vh', width: 405, margin: "0px auto" }}>
        <Grid align="center" mb={2}>
          <Avatar sx={{ width: 50, height: 50 }}>
            <AddCircleOutlineIcon />
          </Avatar>
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
          <Button variant="contained" type="submit">Add Vehicle</Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default VehicleForm;

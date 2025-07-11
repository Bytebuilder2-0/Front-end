import React, { useState } from 'react';
import {  useNavigate } from 'react-router-dom';
import { Box, Typography } from '@mui/material';
import HandleVehicleForm from './HandleVehicleForm';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

const FormVehicle = () => {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    vehicleNumber: '',
    vehicleYear: '',
    model: '',
    vehicleType: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user?.id || !token) {
      alert('Please login to add a vehicle');
      return;
    }

    try {
      const API_URL = `http://localhost:5000/api/appointments/vehicles/${user.id}`;
      
      const response = await axios.post(API_URL, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert('Vehicle added successfully!');
      // Reset form after successful submission
  
      setFormData({
        vehicleNumber: '',
        vehicleYear: '',
        model: '',
        vehicleType: ''
      });
      
      // Navigate back to vehicles list or wherever appropriate
      navigate('/User');
    } catch (error) {
      console.error('Error adding vehicle:', error);
      alert(error.response?.data?.message || 'Failed to add vehicle');
    }
  };

  const handleReset = () => {
    setFormData({
      vehicleNumber: '',
      vehicleYear: '',
      model: '',
      vehicleType: ''
    });
  };

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Add New Vehicle
      </Typography>
      <HandleVehicleForm 
        formData={formData}
        onChange={handleChange}
        onSubmit={handleSubmit}
        onReset={handleReset}
      />
    </Box>
  );
};

export default FormVehicle;
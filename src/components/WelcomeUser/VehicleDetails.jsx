import { Typography, Box, CircularProgress } from '@mui/material';
import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import VehicleFound from './VehicleFound';
import NoVehicles from './NoVehicles';

const VehicleDetails = () => {
  const { user, token } = useAuth();
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVehicles = async () => {
      if (!user || !user.id || !token) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const API_URL = `http://localhost:5000/api/appointments/vehicles/${user.id}`;
        const response = await axios.get(API_URL, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // Ensure we always have an array, even if response.data is null/undefined
        const vehiclesData = Array.isArray(response.data) ? response.data : [];
        setVehicles(vehiclesData);
        
        // Reset error state on success
        setError(null);
      } catch (err) {
        setVehicles([]);
      } finally {
        setLoading(false);
      }
    };

    fetchVehicles();
  }, [user?.id, token]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 2, textAlign: 'center' }}>
        <Typography color="error">Error: {error}</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ mb: 4 }}>
 

      {vehicles.length > 0 ? (
        <VehicleFound vehicles={vehicles} />
      ) : (
        <NoVehicles />
      )}
    </Box>
  );
};

export default VehicleDetails;
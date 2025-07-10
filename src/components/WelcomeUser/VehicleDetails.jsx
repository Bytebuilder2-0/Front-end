import { Typography, Box, Grid } from '@mui/material';
import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext'; //Import useAuth

const VehicleDetails = () => {
  const { user, token } = useAuth(); //  Access user and token

  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVehicles = async () => {
      if (!user || !user.id) return;

      try {
        const API_URL = `http://localhost:5000/api/appointments/vehicles/${user.id}`;

        const response = await axios.get(API_URL, {
          headers: {
            Authorization: `Bearer ${token}`, //  Secure with token
          },
        });

        setVehicles(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchVehicles();
  }, [user?.id, token]);

  if (loading) {
    return <Typography>Loading vehicles...</Typography>;
  }

  if (error) {
    return <Typography color="error">Error: {error}</Typography>;
  }

  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold', fontSize: '22px' }}>
        Your Vehicles
      </Typography>

      {vehicles.length === 0 ? (
        <Typography sx={{ mb: 2 }}>No vehicles added!</Typography>
      ) : (
        <Grid container spacing={2} sx={{ mb: 3 }}>
          {vehicles.map((vehicle) => (
            <Grid item key={vehicle._id}>
              <Box
                sx={{
                  p: 4,
                  border: '1px solid #e0e0e0',
                  borderRadius: '8px',
                  minWidth: '180px',
                  textAlign: 'center',
                  '&:hover': {
                    boxShadow: '0px 2px 4px rgba(0,0,0,0.1)',
                  },
                }}
              >
                <Typography
                  variant="subtitle1"
                  sx={{
                    fontWeight: 'bold',
                    mb: 0.5,
                  }}
                >
                  {vehicle.model}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: '#666',
                    fontSize: '0.875rem',
                  }}
                >
                  {vehicle.vehicleNumber}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default VehicleDetails;

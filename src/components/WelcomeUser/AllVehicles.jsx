import React, { useState, useEffect } from 'react';
import {
  Typography,
  Box,
  CircularProgress,
  Paper,
  Grid,
  Divider,
  Stack,
  Chip,
  Avatar,
  useTheme
} from '@mui/material';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import CategoryIcon from '@mui/icons-material/Category';

const AllVehicles = () => {
  const theme = useTheme();
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

        const vehiclesData = Array.isArray(response.data) ? response.data : [];
        setVehicles(vehiclesData);
        setError(null);
      } catch (err) {
        setVehicles([]);
        setError('Failed to fetch vehicles. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchVehicles();
  }, [user?.id, token]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ textAlign: 'center', p: 4 }}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  if (vehicles.length === 0) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 600 }}>
          Your Vehicles
        </Typography>
        <Typography variant="body1" color="text.secondary">
          No vehicles registered yet.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 4 }}>
      <Typography 
        gutterBottom 
        sx={{ 
          fontWeight: 600,
          fontSize: 35,
          marginBottom: '1px'
        }}
      >
        Your Vehicles
      </Typography>
      <Typography  sx={{ color: 'green' }}>
        All your registered vehicles
      </Typography>
      
      <Divider sx={{ mb: 4, mt: 2 }} />

      <Grid container spacing={3}>
        {vehicles.map((vehicle) => (
          <Grid item xs={12} md={6} key={vehicle._id}>
            <Paper 
              sx={{ 
                p: 3, 
                height: '100%',
                borderRadius: 3
              }} 
              elevation={3}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ 
                  bgcolor: theme.palette.primary.main, 
                  mr: 2,
                  width: 40,
                  height: 40
                }}>
                  <DirectionsCarIcon fontSize="small" />
                </Avatar>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  {vehicle.model}
                </Typography>
                <Chip 
                  label={vehicle.vehicleType} 
                  varient="outlined"
                  size="small" 
                  sx={{  ml: 2 ,color: 'green' }}
                />
              </Box>

              <Divider sx={{ mb: 3 }} />

              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Stack direction="row" alignItems="center" spacing={1.5} mb={1.5}>
                    <ConfirmationNumberIcon 
                      fontSize="small" 
                      sx={{ color: "text.secondary", width: 20 }} 
                    />
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary">
                        Vehicle Number
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        {vehicle.vehicleNumber}
                      </Typography>
                    </Box>
                  </Stack>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Stack direction="row" alignItems="center" spacing={1.5} mb={1.5}>
                    <CategoryIcon 
                      fontSize="small" 
                      sx={{ color: "text.secondary", width: 20 }} 
                    />
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary">
                        Vehicle Type
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        {vehicle.vehicleType}
                      </Typography>
                    </Box>
                  </Stack>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Stack direction="row" alignItems="center" spacing={1.5} mb={1.5}>
                    <CalendarTodayIcon 
                      fontSize="small" 
                      sx={{ color: "text.secondary", width: 20 }} 
                    />
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary">
                        Manufacture Year
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        {vehicle.vehicleYear}
                      </Typography>
                    </Box>
                  </Stack>
                </Grid>

          
              </Grid>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default AllVehicles;
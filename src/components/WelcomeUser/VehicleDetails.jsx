import { Typography, Box, Button, Grid } from '@mui/material';
import axios from 'axios';
import React, { useState, useEffect } from 'react';

const VehicleDetails = ({ userId }) => {

     const API_URL = `http://localhost:5000/api/appointments/vehicles/${userId}`

    const [vehicles, setVehicles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchVehicles = async () => {
            try {
                const response = await axios.get(API_URL);
                console.log(response.data);
    
                setVehicles(response.data);

            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        if (userId) {
            fetchVehicles();
        }
    }, [userId]);

    if (loading) {
        return <Typography>Loading vehicles...</Typography>;
    }

    if (error) {
        return <Typography color="error">Error: {error}</Typography>;
    }

    return (
        <Box sx={{ mb: 4 }}>
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold', fontSize:'22px' }}>
                Your Vehicles
            </Typography>

            {vehicles.length === 0 ? (
                <Typography sx={{ mb: 2 }}>No vehicles added!</Typography>
            ) : (
                <Grid container spacing={2} sx={{ mb: 3 }}>

                    {vehicles.map((vehicle) => (
                        <Grid item key={vehicle.id}>
                            <Box sx={{ 
                                p:4,
                                border: '1px solid #e0e0e0',
                                borderRadius: '8px',
                                minWidth: '180px',
                                textAlign: 'center',
                                '&:hover': {
                                    boxShadow: '0px 2px 4px rgba(0,0,0,0.1)'
                                }
                            }}>
                                <Typography variant="subtitle1" sx={{ 
                                    fontWeight: 'bold',
                                    mb: 0.5
                                }}>
                                    {vehicle.model}
                                </Typography>
                                <Typography variant="body2" sx={{ 
                                    color: '#666',
                                    fontSize: '0.875rem'
                                }}>
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
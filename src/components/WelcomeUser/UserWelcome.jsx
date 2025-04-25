import { Typography, Box, Divider } from '@mui/material';
import React, { useState, useEffect } from 'react';
import AppointDetails from './AppointDetails';
import NoAppointment from './NoAppointment';
import VehicleDetails from './VehicleDetails';

const UserWelcome = ({ userId }) => {
    const [hasAppointments, setHasAppointments] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAppointments = async () => {
            try {
                const response = await fetch(`http://localhost:5000/api/appointments/user/${userId}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch appointments');
                }
                const data = await response.json();
                setHasAppointments(data.length > 0);
            } catch (err) {
                console.error('Error checking appointments:', err);
                setHasAppointments(false); // Default to no appointments if error occurs
            } finally {
                setLoading(false);
            }
        };

        if (userId) {
            checkAppointments();
        }
    }, [userId]);

    if (loading) {
        return <Typography>Loading...</Typography>;
    }

    return (
        <Box sx={{ p: 3, maxWidth: 'auto', margin: '10 auto' }}>
            {/* Welcome Header */}
            <Typography variant="h3" gutterBottom sx={{ fontFamily: '"Poppins", sans-serif', fontWeight: 750, letterSpacing: '0.1px' }}>
                Welcome to Garage24 !!
            </Typography>
            
            <Typography variant="body1" sx={{ 
                mb: 3,
                color: 'text.secondary',
                fontSize: '20px'
            }}>
                We are here to keep your vehicles running smoothly. 
            </Typography>
            
            <Divider sx={{ my: 5, borderBottomWidth: 3 }} /> 

            {/* Conditional rendering of appointments */}
            {hasAppointments ? (
                <AppointDetails userId={userId} />
            ) : (
                <NoAppointment userId={userId} />
            )}

            <Divider sx={{ my: 6, borderBottomWidth: 3 }} />     

            <VehicleDetails userId={userId} /> 
        </Box>
    );
};

export default UserWelcome;
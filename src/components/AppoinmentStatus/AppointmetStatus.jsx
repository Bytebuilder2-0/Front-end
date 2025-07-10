import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import AppointmentPending from "./AppointmentPending";
import AppointmentConfirm from "./AppointmentConfirm";
import AppointmentInProgress from './AppointmentInProgress';
import { CircularProgress, Typography } from '@mui/material';
import { useAuth } from "../../context/AuthContext";


const API_URL = 'http://localhost:5000/api/appointments';

const AppointmentStatus = () => {
  const { user, token } = useAuth();
  const { id } = useParams(); // Get appointment ID from URL params
  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchAppointment = async () => {
       if (!user || !id ||!token) return;
    try {
      const response = await axios.get(`${API_URL}/${id}`, { // Fixed: Added id to URL
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  


      setAppointment(response.data);
    } catch (error) {
      console.error('Error fetching appointment:', error);
      setError(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

    useEffect(() => {
      fetchAppointment();
      const interval = setInterval(fetchAppointment, 30000);
      return () => clearInterval(interval);
    }, [user?.id, token, id]);

  const handleAppointmentCancel = async (canceledId) => {
    try {
      await axios.delete(`${API_URL}/${canceledId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      navigate('/appointments/new');
    } catch (error) {
      console.error('Error handling cancellation:', error);
      // Re-fetch if error occurs
      await fetchAppointment();
    }
  };
  
  if (loading) {
    return <CircularProgress />;
  }

  if (!appointment) {
    return <Typography variant="h6">Appointment not found.</Typography>;
  }

  return (
    <div>
     {(appointment.status === 'Pending' || appointment.status === 'Checking') && (
      <AppointmentPending 
        appointment={appointment} 
        onCancel={handleAppointmentCancel} 
      />
    )}
      {appointment.status === 'Confirmed' && <AppointmentConfirm appointment={appointment} onCancel={handleAppointmentCancel}/>}
      {appointment.status === 'InProgress' && <AppointmentInProgress appointment={appointment} />}

    </div>
  );
};

export default AppointmentStatus;

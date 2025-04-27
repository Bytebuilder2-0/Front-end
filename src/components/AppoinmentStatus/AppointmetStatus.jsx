import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import AppointmentPending from "./AppointmentPending";
import AppointmentConfirm from "./AppointmentConfirm";
import AppointmentInProgress from './AppointmentInProgress';
import { CircularProgress, Typography } from '@mui/material';

const AppointmentStatus = () => {
  const { id } = useParams(); // Get appointment ID from the URL
  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  console.log("Id:", id);

  const fetchAppointment = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/appointments/${id}`);
      setAppointment(response.data);
    } catch (error) {
      console.error('Error fetching appointment:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {

    fetchAppointment();
  }, [id]);

  const handleAppointmentCancel = async (canceledId) => {
    try {
      // Immediately remove from UI
      setAppointment(null);
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
      {appointment.status === 'Pending' && <AppointmentPending appointment={appointment} onCancel={handleAppointmentCancel} />}
      {appointment.status === 'Confirmed' && <AppointmentConfirm appointment={appointment} onCancel={handleAppointmentCancel}/>}
      {appointment.status === 'InProgress' && <AppointmentInProgress appointment={appointment} />}
      {appointment.status === 'Paid' && <AppointmentInProgress appointment={appointment} />}

    </div>
  );
};

export default AppointmentStatus;

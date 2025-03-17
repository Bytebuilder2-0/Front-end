import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import AppointmentPending from "./sub/AppointmentPending";
import AppointmentConfirm from "./sub/AppointmentConfirm";
import { CircularProgress, Typography } from '@mui/material';

const AppointmentStatus = () => {
  const { id } = useParams(); // Get appointment ID from the URL
  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(true);
  console.log("Id:", id);

  useEffect(() => {
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

    fetchAppointment();
  }, [id]);

  if (loading) {
    return <CircularProgress />;
  }

  if (!appointment) {
    return <Typography variant="h6">Appointment not found.</Typography>;
  }

  return (
    <div>
      {appointment.status === 'Pending' && <AppointmentPending appointment={appointment} />}
      {appointment.status === 'Confirmed' && <AppointmentConfirm appointment={appointment} />}
    </div>
  );
};

export default AppointmentStatus;

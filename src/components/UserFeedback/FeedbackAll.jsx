import React, { useEffect, useState } from "react";
import { Box, Typography, Tabs, Tab, Alert, CircularProgress, Divider } from "@mui/material";
import { useParams } from "react-router-dom";
import PendingFeedback from "./PendingFeedback";
import FeedbackHistory from "./FeedbackHistory";
import FeedbackForm from "./FeedbackForm";
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

const API_URL = 'http://localhost:5000/api';

const FeedbackAll = () => {
  const [tabValue, setTabValue] = useState(0);
  const [appointments, setAppointments] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user, token } = useAuth();
  const [feedbackState, setFeedbackState] = useState({
  open: false,
  appointmentId: null
})
const fetchData = async () => {
  if (!user?.id || !token) {
    setLoading(false);
    return;
  }

  try {
    setLoading(true);
    setError(null);

    // Step 1: Fetch user's appointments
    const appointmentsRes = await axios.get(`${API_URL}/appointments/user/${user.id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    const appointmentsData = Array.isArray(appointmentsRes.data)
      ? appointmentsRes.data
      : appointmentsRes.data?.data || [];

    setAppointments(appointmentsData);

    const feedbacksList = [];

    console.log("Appointments with feedbackStatus: true", appointmentsData.filter(appt => appt.feedbackStatus));

    // Step 2: For appointments with feedbackStatus: true, fetch feedback
    for (const appointment of appointmentsData) {
      if (appointment.feedbackStatus && appointment._id) {
        try {
          const res = await axios.get(`${API_URL}/feedback/${appointment._id}`, {
            headers: { Authorization: `Bearer ${token}` }
          });

          const { data, appointmentDetails } = res.data;

          feedbacksList.push({
            ...data,
            ...appointmentDetails,
            appointmentId: appointment._id
          });

        } catch (err) {
          console.error(`Failed to fetch feedback for appointment ${appointment._id}`, err.response?.data || err.message);
        }
      }
    }

    console.log("Feedbacks fetched from /feedback/:id", feedbacksList);
    setFeedbacks(feedbacksList);

  } catch (err) {
    console.error("Error fetching dataaaaa:", err);
    setError("Failed to load data.");
  } finally {
    setLoading(false);
  }
};




  useEffect(() => {
    fetchData();
  }, [user?.id, token]);

  // Combine appointments with their feedback
  const getAppointmentsWithFeedback = () => {
    if (!Array.isArray(appointments)) return [];
    
    return appointments.map(appointment => {
      const feedback = Array.isArray(feedbacks) 
        ? feedbacks.find(fb => 
            fb.appointmentId === appointment._id || 
            fb.appointmentId?.toString() === appointment._id?.toString()
          )
        : null;
      return {
        ...appointment,
        feedback,
        hasFeedback: !!feedback?.rating
      };
    });
  };

  const appointmentsWithFeedback = getAppointmentsWithFeedback();

  console.log("Appointments with feedback statussss", appointmentsWithFeedback);


  // Separate pending and completed feedbacks
  const pendingFeedbacks = appointmentsWithFeedback.filter(
    appt => ((appt.status === "Task Done" || appt.status === 'Paid'|| appt.status === 'All done') && appt.feedbackStatus === false ));
    

    console.log("Appointments with pending feedbackss", pendingFeedbacks);
  


const completedFeedbacks = feedbacks;

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        {error}
      </Alert>
    );
  }
  
  const handleOpenFeedback = (appointmentId) => {
    setFeedbackState({
      open: true,
      appointmentId
    });
  };

  return (
    <Box sx={{ width: "100%", padding: 3 }}>
      <Typography variant="h6" fontWeight={700} gutterBottom sx={{  
              fontWeight: 600,
              fontSize : 30,
              marginBottom: '1px'
        }}>
        Feedback Center
      </Typography>
      <Typography  color="text.secondary" sx={{ mb: 3 }}>
           Track your pending feedback and review your feedback history in one place.
            </Typography>

      <Divider sx={{ my: 3, borderBottomWidth: 1, mb:4 }} /> 
      
      <Tabs value={tabValue} onChange={handleTabChange} sx={{ mb: 3 }}>
        <Tab label={`Pending Feedback (${pendingFeedbacks.length})`} />
        <Tab label={`Feedback History (${completedFeedbacks.length})`} />
      </Tabs>

    {tabValue === 0 && (
        <PendingFeedback 
          feedbacks={pendingFeedbacks} 
          loading={loading}
          onOpenFeedback={handleOpenFeedback} 
        />
      )}


      {tabValue === 1 && (
        <FeedbackHistory 
          feedbacks={completedFeedbacks} 
          loading={loading} 
        />
      )}

      <FeedbackForm
        open={feedbackState.open}
        onClose={() => setFeedbackState({ open: false, appointmentId: null })}
        appointmentId={feedbackState.appointmentId}
        onSubmitted={() => fetchData()} 
/>

    </Box>
  );
};

export default FeedbackAll;
import React, { useEffect, useState } from "react";
import { Box, Typography, Tabs, Tab, Alert, CircularProgress } from "@mui/material";
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
  const { id } = useParams();
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
      
      // Fetch all appointments for this user
      const appointmentsRes = await axios.get(`${API_URL}/appointments/user/${user.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      }).catch(err => {
        console.error('Error fetching appointments:', err);
        return { data: [] }; // Return empty array if request fails
      });
      
      // Handle different response structures
      const appointmentsData = Array.isArray(appointmentsRes.data) 
        ? appointmentsRes.data 
        : appointmentsRes.data?.data || [];
      setAppointments(appointmentsData);
      
      // Fetch all feedbacks for this user
      const feedbacksRes = await axios.get(`${API_URL}/feedback/user/${user.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      }).catch(err => {
        console.error('Error fetching feedbacks:', err);
        return { data: [] }; // Return empty array if request fails
      });
      
      const feedbacksData = Array.isArray(feedbacksRes.data)
        ? feedbacksRes.data
        : feedbacksRes.data?.data || [];
      setFeedbacks(feedbacksData);
      
    } catch (error) {
      console.error('Error in fetchData:', error);
      setError(error.message || "Failed to load data");
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

  // Separate pending and completed feedbacks
  const pendingFeedbacks = appointmentsWithFeedback.filter(
    appt => appt.status === 'Task Done' && !appt.hasFeedback
  );
  
  const completedFeedbacks = appointmentsWithFeedback.filter(
    appt => appt.status === 'All done' && appt.hasFeedback
  );

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
    <Box sx={{ width: "100%" }}>
      <Typography variant="h4" gutterBottom>
        Feedback Center
      </Typography>
      
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
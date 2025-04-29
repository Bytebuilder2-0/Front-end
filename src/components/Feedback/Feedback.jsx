// src/components/Feedback/Feedback.jsx

import { useEffect, useState } from "react";
import axios from "axios";
import { Container, Typography, Paper, Box } from "@mui/material";
import FeedbackList from "./FeedbackList";

const API_URL = "http://localhost:5000/api/feedback";

const Feedback = () => {
  const [feedbacks, setFeedbacks] = useState([]);

  const fetchFeedbacks = async () => {
    try {
      const res = await axios.get(API_URL);
      setFeedbacks(res.data.data);
    } catch (error) {
      console.error("Error fetching feedback:", error);
    }
  };

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper
        elevation={6}
        sx={{
          p: 4,
          backgroundColor: "#f9fafb",
          borderRadius: "16px",
        }}
      >
        <Box mb={3}>
          <Typography
            variant="h4"
            align="center"
            sx={{
              fontWeight: "bold",
              color: "#3f51b5",
              letterSpacing: 1,
            }}
          >
            Manage User Feedback
          </Typography>
          <Typography variant="subtitle1" align="center" sx={{ color: "gray", mt: 1 }}>
            View, Reply, and Take Actions on User Feedbacks
          </Typography>
        </Box>

        <FeedbackList feedbacks={feedbacks} onUpdate={fetchFeedbacks} />
      </Paper>
    </Container>
  );
};

export default Feedback;

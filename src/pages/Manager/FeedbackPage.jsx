import { useEffect, useState } from "react";
import axios from "axios";
import { Container, Typography, Paper } from "@mui/material";
import FeedbackList from "../../components/Feedback/FeedbackList";

const API_URL = "http://localhost:5000/api/feedback";

const FeedbackPage = () => {
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
    <Container>
      <Paper elevation={3} sx={{ padding: 3, marginTop: 2 }}>
        <Typography variant="h5" gutterBottom>
          User Feedback
        </Typography>
        <FeedbackList feedbacks={feedbacks} onUpdate={fetchFeedbacks} />
      </Paper>
    </Container>
  );
};

export default FeedbackPage;

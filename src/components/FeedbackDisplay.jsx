import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Card,
  CardHeader,
  Avatar,
  CardContent,
  Typography,
  Box,
  Container,
  CircularProgress,
  Alert,
  Paper,
  Rating,
  Grid, // Import Grid for layout
} from "@mui/material";
import { styled } from "@mui/material/styles";

// FeedbackDisplay component
const FeedbackDisplay = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/feedbackDisplay"
        );
        if (response.data.success && Array.isArray(response.data.data)) {
          setFeedbacks(response.data.data);
        } else {
          throw new Error(response.data.message || "Invalid data format");
        }
      } catch (err) {
        setError(err.message || "Failed to load feedbacks");
        setFeedbacks([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFeedbacks();
  }, []);

  const StyledCard = styled(Card)(({ theme }) => ({
    marginBottom: theme.spacing(2),
    boxShadow: theme.shadows[1], // Reduced shadow for a lighter look
    borderRadius: theme.shape.borderRadius * 2,
    height: "auto", // Set to 'auto' to adjust based on content
    maxHeight: "250px", // More aggressive height limit
    padding: theme.spacing(1), // Reduced padding for compact design
    overflow: "hidden", // Ensure content does not overflow
  }));

  const AdminReplyBox = styled(Box)(({ theme }) => ({
    backgroundColor: theme.palette.grey[100],
    padding: theme.spacing(1), // Reduced padding for compactness
    borderRadius: theme.shape.borderRadius,
    borderLeft: `4px solid ${theme.palette.primary.main}`,
    marginTop: theme.spacing(0.5), // Smaller margin for tighter layout
    maxHeight: "80px", // Further reduce height for the admin reply
    overflow: "hidden",
  }));

  const FeedbackCard = ({ feedback }) => {
    const fallbackAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(
      feedback.username || "User"
    )}&background=random`;

    return (
      <StyledCard>
        <CardHeader
          avatar={
            <Avatar
              src={feedback.avatarUrl || fallbackAvatar}
              alt={feedback.username || "User"}
              sx={{ width: 40, height: 40 }} // Reduced avatar size
              imgProps={{
                onError: (e) => {
                  e.target.src = fallbackAvatar;
                },
              }}
            />
          }
          title={
            <Typography
              variant="h6"
              component="div"
              sx={{ fontSize: "0.875rem" }}
            >
              {feedback.username || "Anonymous User"}
            </Typography>
          }
          subheader={
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ fontSize: "0.75rem" }}
            >
              {feedback.feedbackDate
                ? new Date(feedback.feedbackDate).toLocaleDateString("en-GB", {
                    year: "numeric",
                    month: "numeric",
                    day: "numeric",
                  })
                : "No date available"}
            </Typography>
          }
        />
        <CardContent sx={{ paddingBottom: "4px" }}>
          <Typography variant="body2" paragraph sx={{ fontSize: "0.875rem" }}>
            <Box component="span" fontWeight="bold">
              Comment:
            </Box>{" "}
            {feedback.userComment || "No comment provided"}
          </Typography>

          {/* Display the star rating */}
          <Box display="flex" alignItems="center" mb={1}>
            <Rating
              value={feedback.rating || 0}
              readOnly
              sx={{ fontSize: "1rem" }}
            />
          </Box>

          {feedback.adminReply && (
            <AdminReplyBox>
              <Typography
                variant="subtitle2"
                color="text.secondary"
                gutterBottom
                sx={{ fontSize: "0.75rem" }}
              >
                Reply
              </Typography>
              <Typography variant="body2" sx={{ fontSize: "0.75rem" }}>
                {feedback.adminReply}
              </Typography>
            </AdminReplyBox>
          )}
        </CardContent>
      </StyledCard>
    );
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography
        variant="h4"
        component="h2"
        gutterBottom
        align="center"
        sx={{ mb: 4 }}
      >
        Customer Feedback
      </Typography>

      {loading ? (
        <Box display="flex" justifyContent="center" my={4}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      ) : feedbacks.length === 0 ? (
        <Paper elevation={0} sx={{ p: 3, textAlign: "center" }}>
          <Typography variant="body1">No feedback available</Typography>
        </Paper>
      ) : (
        <Grid container spacing={2}>
          {feedbacks.map((feedback) => (
            <Grid
              item
              xs={12}
              sm={6}
              md={6}
              key={
                feedback.id ||
                feedback.feedbackId ||
                Math.random().toString(36).substr(2, 9)
              }
            >
              <FeedbackCard feedback={feedback} />
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default FeedbackDisplay;

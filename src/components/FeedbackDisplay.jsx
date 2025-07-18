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
} from "@mui/material";
import { styled } from "@mui/material/styles";
import Slider from "react-slick"; // Import react-slick for carousel
import FeedbackIcon from "@mui/icons-material/Feedback"; // For feedback icon

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
    boxShadow: theme.shadows[5],
    borderRadius: theme.shape.borderRadius * 2,
    height: "auto",
    padding: theme.spacing(2),
    overflow: "hidden",
    background: "rgba(255, 255, 255, 0.9)",
    backdropFilter: "blur(20px)",
    transition: "all 0.3s ease",
    "&:hover": {
      transform: "translateY(-10px)",
      boxShadow: "0 25px 50px rgba(0,0,0,0.1)"
    }
  }));

  const AdminReplyBox = styled(Box)(({ theme }) => ({
    backgroundColor: theme.palette.grey[200],
    padding: theme.spacing(1),
    borderRadius: theme.shape.borderRadius,
    borderLeft: `4px solid ${theme.palette.primary.main}`,
    marginTop: theme.spacing(0.5),
    maxHeight: "80px",
    overflow: "hidden",
  }));

  const FeedbackCard = ({ feedback }) => {
    const fallbackAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(
      feedback.username || "User"
    )}&background=random&color=fff&font-size=0.3`;

    return (
      <StyledCard>
        <CardHeader
          avatar={
            <Avatar
              src={fallbackAvatar}
              alt={feedback.username || "User"}
              sx={{ width: 50, height: 50 }}
              imgProps={{
                onError: (e) => {
                  e.target.src = fallbackAvatar;
                },
              }}
            />
          }
          title={
            <Typography variant="h6" component="div">
              {feedback.username || "Anonymous User"}
            </Typography>
          }
          subheader={
            <Typography variant="body2" color="text.secondary">
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
          <Typography variant="body2" paragraph>
            <Box component="span" fontWeight="bold">
              Comment:
            </Box>{" "}
            {feedback.userComment || "No comment provided"}
          </Typography>

          <Box display="flex" alignItems="center" mb={1}>
            <Rating value={feedback.rating || 0} readOnly />
          </Box>

          {feedback.adminReply && (
            <AdminReplyBox>
              <Typography variant="subtitle2" color="text.secondary">
                Admin Reply:
              </Typography>
              <Typography variant="body2">{feedback.adminReply}</Typography>
            </AdminReplyBox>
          )}
        </CardContent>
      </StyledCard>
    );
  };

  const carouselSettings = {
    dots: true, // Enable dots for navigation
    infinite: true, // Loop the slides
    speed: 500,
    slidesToShow: 3, // Show three slides at a time
    slidesToScroll: 1,
    autoplay: true, // Enable auto play
    autoplaySpeed: 5000, // Interval between slides
    centerMode: true, // Center the active slide
    focusOnSelect: true, // Allow selecting the slide by clicking
    responsive: [
      {
        breakpoint: 1024, // For tablet and larger screens
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 600, // For smaller screens like phones
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* <Typography
        variant="h4"
        component="h2"
        gutterBottom
        align="center"
        sx={{ mb: 4 }}
      >
        Customer Feedback
      </Typography> */}
      <Typography
            variant="h4"
            sx={{
              fontWeight: 800,
              mb: 8,
              textAlign: "center",
              fontSize: { xs: "2.5rem", md: "3.5rem" },
              background: "linear-gradient(45deg, #1976d2, #42a5f5)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Customer Reviews
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
        <Slider {...carouselSettings}>
          {feedbacks.map((feedback) => (
            <div key={feedback.id || Math.random().toString(36).substr(2, 9)}>
              <FeedbackCard feedback={feedback} />
            </div>
          ))}
        </Slider>
      )}
    </Container>
  );
};

export default FeedbackDisplay;

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
  Rating,
  useTheme,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation"; // Navigation styles can be removed too

const FeedbackDisplay = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const theme = useTheme();

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/feedbackDisplay");
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
    p: theme.spacing(2),
    borderRadius: 20,
    background: "rgba(255, 255, 255, 0.95)",
    backdropFilter: "blur(10px)",
    boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
    maxWidth: 500,
    margin: "0 auto",
    transition: "transform 0.3s ease",
    "&:hover": {
      transform: "translateY(-6px)",
    },
  }));

  const AdminReplyBox = styled(Box)(({ theme }) => ({
    backgroundColor: theme.palette.grey[100],
    padding: theme.spacing(1),
    borderRadius: theme.shape.borderRadius,
    borderLeft: `4px solid ${theme.palette.primary.main}`,
    marginTop: theme.spacing(1),
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
              src={feedback.profilePhoto || fallbackAvatar}
              alt={feedback.username || "User"}
              sx={{ width: 48, height: 48 }}
              imgProps={{
                onError: (e) => {
                  e.target.src = fallbackAvatar;
                },
              }}
            />
          }
          title={
            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
              {feedback.username || "Anonymous"}
            </Typography>
          }
          subheader={
            <Typography variant="body2" color="text.secondary">
              {feedback.feedbackDate
                ? new Date(feedback.feedbackDate).toLocaleDateString("en-GB")
                : "No date"}
            </Typography>
          }
        />
        <CardContent sx={{ pt: 0 }}>
          <Rating value={feedback.rating || 0} precision={0.5} readOnly sx={{ fontSize: 20 }} />
          <Typography variant="body2" sx={{ mt: 1 }}>
            <strong>Comment:</strong> {feedback.userComment || "No comment provided"}
          </Typography>
          {feedback.adminReply && (
            <AdminReplyBox>
              <Typography variant="caption" color="text.secondary">
                Garage Response
              </Typography>
              <Typography variant="body2">{feedback.adminReply}</Typography>
            </AdminReplyBox>
          )}
        </CardContent>
      </StyledCard>
    );
  };

  return (
    <Box
      sx={{
        py: { xs: 8, md: 12 },
        background: "linear-gradient(135deg, #cddcfd 0%, #1a237e 100%)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <Container>
        <Box sx={{ textAlign: "center", mb: 4 }}>
          <Typography
            variant="h3"
            sx={{
              color: "#fff",
              fontWeight: 800,
              textShadow: "0 2px 10px rgba(0,0,0,0.2)",
            }}
          >
            What Our Customers Say
          </Typography>
          <Typography
            variant="subtitle1"
            sx={{ color: "rgba(255,255,255,0.8)", mt: 1 }}
          >
            Genuine feedback shared by customers after their service
          </Typography>
        </Box>

        {loading ? (
          <Box display="flex" justifyContent="center" my={6}>
            <CircularProgress color="inherit" />
          </Box>
        ) : error ? (
          <Alert severity="error" sx={{ mt: 3 }}>
            {error}
          </Alert>
        ) : feedbacks.length === 0 ? (
          <Typography align="center" sx={{ color: "white", fontSize: "1rem" }}>
            No feedback available
          </Typography>
        ) : (
          <Swiper
            modules={[Autoplay, Pagination]}
            autoplay={{ delay: 4000, disableOnInteraction: false }}
            loop={true}
            pagination={{ clickable: true }}
            breakpoints={{
              0: { slidesPerView: 1 },
              600: { slidesPerView: 1 },
              900: { slidesPerView: 2 },
              1200: { slidesPerView: 3 },
            }}
            spaceBetween={30}
          >
            {feedbacks.map((feedback) => (
              <SwiperSlide key={feedback.id || feedback.feedbackId}>
                <FeedbackCard feedback={feedback} />
              </SwiperSlide>
            ))}
          </Swiper>
        )}
      </Container>
    </Box>
  );
};

export default FeedbackDisplay;

import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import API_BASE_URL from "../config/api";
import {
  Box,
  Typography,
  Avatar,
  Rating,
  useMediaQuery,
  useTheme,
  Paper,
  Divider,
} from "@mui/material";
import axios from "axios"; // assuming you'll fetch from backend

const FeedbackSlider = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [feedbacks, setFeedbacks] = useState([]);

  useEffect(() => {
    // Replace this with your actual API endpoint
    axios
      .get(`${API_BASE_URL}/feedbacks`) // Update URL
      .then((res) => setFeedbacks(res.data))
      .catch((err) => console.error("Error fetching feedbacks", err));
  }, []);

  return (
    <Box sx={{ py: 8, px: 2, backgroundColor: "#fafafa" }}>
      <Typography variant="h4" align="center" fontWeight="bold" gutterBottom>
        What Our Customers Say
      </Typography>

      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        spaceBetween={30}
        slidesPerView={isMobile ? 1 : 3}
        navigation={!isMobile}
        pagination={{ clickable: true }}
        autoplay={{ delay: 4000 }}
        loop
      >
        {feedbacks.map((item, index) => (
          <SwiperSlide key={index}>
            <Paper
              elevation={3}
              sx={{
                p: 4,
                borderRadius: 4,
                height: "100%",
                minHeight: "370px", // Increased vertical space
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              {/* Top Section: Avatar, Name, Date */}
              <Box display="flex" alignItems="center" mb={2}>
                <Avatar
                  src={item.image}
                  alt={item.name}
                  sx={{ width: 56, height: 56, mr: 2 }}
                />
                <Box>
                  <Typography fontWeight="bold">{item.name}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {item.date}
                  </Typography>
                </Box>
              </Box>

              {/* Rating & Message */}
              <Rating
                value={item.rating}
                readOnly
                size="small"
                sx={{ mb: 1 }}
              />
              <Typography variant="body2" color="text.primary" sx={{ mb: 2 }}>
                {item.message}
              </Typography>

              {/* Optional Garage Response */}
              {item.response && (
                <>
                  <Divider sx={{ my: 1 }} />
                  <Typography
                    variant="caption"
                    sx={{ fontStyle: "italic", color: "text.secondary" }}
                  >
                    {item.response}
                  </Typography>
                </>
              )}
            </Paper>
          </SwiperSlide>
        ))}
      </Swiper>
    </Box>
  );
};

export default FeedbackSlider;

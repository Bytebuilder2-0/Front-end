import React from "react";
import {
  Box,
  Typography,
  List,
  ListItem,
  Divider,
  Rating,
  Chip,
  Skeleton
} from "@mui/material";
import {
  CarRepair,
  DirectionsCar,
  CalendarToday,
  RateReview,
  Reply
} from "@mui/icons-material";

const FeedbackHistory = ({ feedbacks, loading }) => {
  if (loading) {
    return (
      <Box>
        {[...Array(3)].map((_, index) => (
          <Skeleton key={index} variant="rectangular" height={180} sx={{ mb: 2 }} />
        ))}
      </Box>
    );
  }

  if (feedbacks.length === 0) {
    return (
      <Typography variant="body1" color="textSecondary">
        No feedback history available
      </Typography>
    );
  }

  return (
    <List>
      {feedbacks.map((feedback, index) => (
        <React.Fragment key={feedback.id}>
          <ListItem sx={{ display: "block", p: 3, bgcolor: "background.paper", mb: 2 }}>
            <Typography variant="h6" gutterBottom>
              {feedback.service}
            </Typography>
            
            <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
              <CalendarToday fontSize="small" sx={{ mr: 1 }} />
              <Typography variant="body2">{feedback.date}</Typography>
            </Box>
            
            <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
              <CarRepair fontSize="small" sx={{ mr: 1 }} />
              <Typography variant="body2">Vehicle Model: {feedback.vehicleModel}</Typography>
            </Box>
            
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <DirectionsCar fontSize="small" sx={{ mr: 1 }} />
              <Typography variant="body2">Vehicle Number: {feedback.vehicleNumber}</Typography>
            </Box>
            
            <Divider sx={{ my: 2 }} />
            
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" gutterBottom sx={{ display: "flex", alignItems: "center" }}>
                <RateReview fontSize="small" sx={{ mr: 1 }} />
                Your Feedback
              </Typography>
              
              <Rating value={feedback.rating} precision={0.5} readOnly />
              
              <Typography variant="body1" sx={{ mt: 1 }}>
                {feedback.comment}
              </Typography>
              
              <Chip
                label={`Submitted on ${feedback.feedbackDate}`}
                size="small"
                sx={{ mt: 1 }}
              />
            </Box>
            
            {feedback.reply && (
              <Box>
                <Typography variant="subtitle2" gutterBottom sx={{ display: "flex", alignItems: "center" }}>
                  <Reply fontSize="small" sx={{ mr: 1 }} />
                  Manager's Response
                </Typography>
                
                <Typography variant="body1" sx={{ mb: 1 }}>
                  {feedback.reply}
                </Typography>
                
                <Chip
                  label={`Replied on ${feedback.replyDate}`}
                  size="small"
                />
              </Box>
            )}
          </ListItem>
          
          {index < feedbacks.length - 1 && <Divider />}
        </React.Fragment>
      ))}
    </List>
  );
};

export default FeedbackHistory;
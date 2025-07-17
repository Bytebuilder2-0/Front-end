import React from "react";
import {
  Box,
  Typography,
  Button,
  Paper,
  Stack,
  Skeleton,
  Alert,
  Divider
} from "@mui/material";
import { RateReview, CalendarToday, DirectionsCar } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const PendingFeedback = ({ feedbacks, loading ,onOpenFeedback}) => {
  const navigate = useNavigate();

  if (loading) {
    return (
      <Box>
        {[...Array(3)].map((_, index) => (
          <Skeleton 
            key={index} 
            variant="rectangular" 
            height={120} 
            sx={{ mb: 2, borderRadius: 2 }} 
          />
        ))}
      </Box>
    );
  }

  if (feedbacks.length === 0) {
    return (
      <Paper elevation={3} sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
          <RateReview fontSize="large" color="action" sx={{ mb: 1 }} />
          <br />
          No Pending Feedbacks
        </Typography>
        <Typography variant="body1" color="textSecondary" sx={{ mb: 3 }}>
          All your completed services have been reviewed.
        </Typography>
      </Paper>
    );
  }

  return (
    <Stack spacing={2}>
      {feedbacks.map((appointment, index) => (
        <React.Fragment key={appointment._id}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              {appointment.services.join(', ')}
            </Typography>
            
            <Stack spacing={1} sx={{ mb: 2 }}>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <CalendarToday fontSize="small" sx={{ mr: 1 }} />
                <Typography variant="body2">
                  {new Date(appointment.date).toLocaleDateString()}
                </Typography>
              </Box>
              
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <DirectionsCar fontSize="small" sx={{ mr: 1 }} />
                <Typography variant="body2">
                  {appointment.vehicleModel} • {appointment.vehicleNumber}
                </Typography>
              </Box>
            </Stack>
            
            <Button
              variant="contained"
              fullWidth
              onClick={() => onOpenFeedback(appointment._id)}
            >
              Submit Feedback
            </Button>
          </Paper>
          {index < feedbacks.length - 1 && <Divider sx={{ my: 1 }} />}
        </React.Fragment>
      ))}
    </Stack>
  );
};

export default PendingFeedback;
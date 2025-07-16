import React from "react";
import {
  Box,
  Typography,
  Button,
  Paper,
  Stack,
  Skeleton,
  Divider,
  Avatar,
  Chip,
  useTheme
} from "@mui/material";
import { 
  RateReview, 
  CalendarToday, 
  DirectionsCar,
  CarRepair
} from "@mui/icons-material";

const PendingFeedback = ({ feedbacks = [], loading, onOpenFeedback }) => {
  const theme = useTheme();

  if (loading) {
    return (
      <Stack spacing={2}>
        {[1, 2, 3].map((i) => (
          <Skeleton 
            key={i}
            variant="rounded"
            height={160}
            sx={{ 
              borderRadius: 2,
              bgcolor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.11)' : 'rgba(0, 0, 0, 0.05)'
            }}
          />
        ))}
      </Stack>
    );
  }

  if (!feedbacks.length) {
    return (
      <Paper
        elevation={0}
        sx={{
          p: 4,
          textAlign: 'center',
          borderRadius: 3,
          bgcolor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)'
        }}
      >
        <RateReview sx={{ 
          fontSize: 60, 
          color: 'text.secondary', 
          mb: 2 
        }} />
        <Typography variant="h6" color="text.secondary" gutterBottom>
          No pending feedback requests
        </Typography>
        <Typography variant="body1" color="text.secondary">
          All your completed services have been reviewed
        </Typography>
      </Paper>
    );
  }

  return (
    <Stack spacing={3}>
      {feedbacks.map((appointment) => (
        <Paper
          key={appointment._id}
          elevation={3}
          sx={{
            p: 3,
            borderRadius: 3,
            transition: 'box-shadow 0.3s ease',
            '&:hover': {
              boxShadow: theme.shadows[6]
            }
          }}
        >
          <Stack spacing={2}>
            <Box display="flex" alignItems="center" gap={2}>
              <Avatar sx={{ 
                bgcolor: theme.palette.primary.main,
                width: 40,
                height: 40
              }}>
                <CarRepair fontSize="small" />
              </Avatar>
              <Box>
                <Typography variant="h6" fontWeight={600}>
                  {appointment.services?.join(', ') || 'Vehicle Service'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {appointment.vehicleModel} • {appointment.vehicleNumber}
                </Typography>
              </Box>
            </Box>

            <Divider />

            <Stack direction="row" spacing={4}>
              <Box display="flex" alignItems="center">
                <CalendarToday 
                  fontSize="small" 
                  sx={{ 
                    mr: 1.5, 
                    color: "text.secondary",
                    width: 20
                  }} 
                />
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Service Date
                  </Typography>
                  <Typography variant="body2">
                    {appointment.date ? 
                      new Date(appointment.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      }) : 
                      'Not specified'}
                  </Typography>
                </Box>
              </Box>

              <Box display="flex" alignItems="center">
                <DirectionsCar 
                  fontSize="small" 
                  sx={{ 
                    mr: 1.5, 
                    color: "text.secondary",
                    width: 20
                  }} 
                />
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Vehicle Number
                  </Typography>
                  <Typography variant="body2">
                    {appointment.vehicleNumber || 'Not specified'}
                  </Typography>
                </Box>
              </Box>
            </Stack>

            <Button
              variant="contained"
              fullWidth
              size="large"
              startIcon={<RateReview />}
              onClick={() => onOpenFeedback(appointment._id)}
              sx={{ mt: 2 }}
            >
              Submit Your Feedback
            </Button>

            <Chip
              label="Pending Review"
              color="warning"
              size="small"
              sx={{ alignSelf: 'flex-start' }}
            />
          </Stack>
        </Paper>
      ))}
    </Stack>
  );
};

export default PendingFeedback;
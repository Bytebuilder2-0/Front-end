import React from "react";
import {
  Box,
  Typography,
  Paper,
  Rating,
  Chip,
  Skeleton,
  Divider,
  Stack,
  Grid,
  Avatar,
  useTheme
} from "@mui/material";
import {
  RateReview,
  Reply,
  Star
} from "@mui/icons-material";
import AppHistory from "./AppHistory";
import MarkChatReadIcon from '@mui/icons-material/MarkChatRead';

const FeedbackHistory = ({ feedbacks, loading }) => {
  const theme = useTheme();

  if (loading) {
    return (
      <Stack spacing={3}>
        {[...Array(3)].map((_, index) => (
          <Skeleton 
            key={index} 
            variant="rounded" 
            height={220} 
            sx={{ 
              borderRadius: 3,
              bgcolor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.11)' : 'rgba(0, 0, 0, 0.05)'
            }} 
          />
        ))}
      </Stack>
    );
  }

  if (!feedbacks || feedbacks.length === 0) {
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
        <RateReview sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
        <Typography variant="h6" color="text.secondary" gutterBottom>
          No feedback history yet
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Your submitted feedback will appear here
        </Typography>
      </Paper>
    );
  }

  return (
    <Stack spacing={3}>
      {feedbacks.map((feedback) => (
        <Paper
          key={feedback.id}
          elevation={3}
          sx={{
            p: 3,
            borderRadius: 2,
            border: `1px solid ${theme.palette.divider}`,
            '&:hover': {
              boxShadow: theme.shadows[4]
            }
          }}
        >
          {/* Header */}
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Avatar sx={{ 
              bgcolor: theme.palette.primary.main, 
              mr: 2,
              width: 40,
              height: 40
            }}>
              <MarkChatReadIcon fontSize="small" />
            </Avatar>
            <Box>
              <Typography variant="h6" fontWeight={600}>
                Service Feedback
              </Typography>
              <Typography  color="text.secondary">
                {feedback.model}
              </Typography>
            </Box>
          </Box>


          {/* Vehicle Details */}

          <AppHistory appointment={feedback} />

           <Divider sx={{ my: 3 }} />
          

          {/* Rating Section */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle1" fontWeight={600} mb={1}>
              Your Rating
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Rating 
                value={feedback.rating} 
                precision={1} 
                readOnly 
                sx={{ mr: 2 }}
                icon={<Star fontSize="inherit" />}
                emptyIcon={<Star fontSize="inherit" />}
              />

              <Chip
                  label={`${feedback.rating} out of 5`}
                  size="small"
                  variant="outlined"
                  color="primary"
                  sx={{ mt: 1 }}
                />
      
            </Box>
            {feedback.comment && (
              <Paper elevation={0} sx={{ 
                p: 2, 
                mt: 1,
                borderRadius: 1,
                bgcolor: theme.palette.action.hover
              }}>
                <Typography variant="body1">
                  {feedback.comment}
                </Typography>
              </Paper>
            )}
            <Chip
              label={`Submitted on ${new Date(feedback.feedbackDate).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
              })}`}
              size="small"
              variant="outlined"
              sx={{ mt: 2 }}
            />
          </Box>

          {/* Manager's Response */}
          {feedback.reply && (
            <Paper elevation={0} sx={{ 
              p: 2, 
              mt: 2,
              borderRadius: 1,
              bgcolor: theme.palette.primary.lighter,
              borderLeft: `4px solid ${theme.palette.primary.main}`
            }}>
              <Typography variant="subtitle1" fontWeight={600} mb={1} sx={{ 
                display: 'flex', 
                alignItems: 'center',
                color: theme.palette.primary.dark
              }}>
                <Reply fontSize="small" sx={{ mr: 1 }} />
                Manager's Response
              </Typography>
              <Typography variant="body1" mb={1}>
                {feedback.reply}
              </Typography>
              {feedback.replyDate && (
                <Chip
                  label={`Replied on ${new Date(feedback.replyDate).toLocaleDateString()}`}
                  size="small"
                  variant="outlined"
                  sx={{ mt: 1 }}
                />
              )}
            </Paper>
          )}
        </Paper>
      ))}
    </Stack>
  );
};

export default FeedbackHistory;
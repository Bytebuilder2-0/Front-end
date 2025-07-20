import React from "react";
import {
  Box,
  Typography,
  Button,
  Paper,
  Stack,
  Avatar,
  Chip,
  useTheme,
  Grid,
} from "@mui/material";
import { RateReview, } from "@mui/icons-material";
import CommentIcon from '@mui/icons-material/Comment';
import AppHistory from "./AppHistory";
import { format } from 'date-fns';

const PendingFeedback = ({ feedbacks = [], loading, onOpenFeedback }) => {
  const theme = useTheme();

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
            <RateReview sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
            No pending feedback requests
            </Typography>
            <Typography variant="body1" color="text.secondary">
           All your recent service appointments have been reviewed. Thank you for your feedback!
            </Typography>
          </Paper>
        );
      }

  return (
    <Grid container spacing={3}>
      {feedbacks.map((appointment) => (
        <Grid item xs={12} key={appointment._id}>
          <Paper
            elevation={2}
            sx={{
              p: 3,
              borderRadius: 3,
            
            }}
          >
            <Stack spacing={2}>
              {/* Header */}
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Box display="flex" alignItems="center" gap={2}>
                  <Avatar sx={{ 
                    bgcolor: theme.palette.primary.main,
                    width: 44,
                    height: 44
                  }}>
                    <CommentIcon fontSize="small" />
                  </Avatar>
                  <Box>
                    <Typography variant="h6" fontWeight={600}>
                      {appointment.model || 'Vehicle Service'}
                    </Typography>
                    <Typography color="text.secondary">
                      {format(new Date(appointment.preferredDate), 'PPp')}
                    </Typography>
                  </Box>
                </Box>
                
                <Chip
                  label="Feedback Pending"
                  color="warning"
                  size="small"
                  variant="outlined"
                  fontWeigh='600'
                />
              </Box>

              <AppHistory data={appointment} />
      
              <Box display="flex"  sx={{ pt: 1 }}>

                  <Button
                    variant="contained"
                    size="medium"
                    onClick={() => onOpenFeedback(appointment._id)}
                    sx={{
                      borderRadius: 2,
                      backgroundColor: '#2e7d32',
                      px: 3,
                    }}
                  >
                    Submit Feedback
                  </Button>
          
              </Box>
            </Stack>
          </Paper>
        </Grid>
      ))}
    </Grid>
  );
};

export default PendingFeedback;
import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  Rating,
  TextField,
  Button,
  CircularProgress,
  IconButton,
  Alert
} from "@mui/material";
import { Star, Send, Close } from "@mui/icons-material";
import { useAuth } from '../../context/AuthContext';
import axios from "axios";


const FeedbackForm = ({ open, onClose, appointmentId }) => {
  const { user, token } = useAuth();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);


  const handleSubmit = async () => {
    if (!rating) {
      setError("Please provide a rating");
      return;
    }

    if (appointmentId) {
        console.log( 'AAPP : ', appointmentId);
    }
    


    setLoading(true);
    setError("");

    try {
      const response = await axios.post(
        `http://localhost:5000/api/feedback/${appointmentId}/submit`,
        { rating, comment },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          
          validateStatus: (status) => status < 500
        }
      );


       if (response.data.success) {
      setSubmitted(true);
      setTimeout(handleClose, 1500);
    } else {
      throw new Error(response.data.message || "Failed to submit feedback");
    }
    } catch (err) {
  console.error("Feedback submission error:", {
    error: err,
    response: err.response
  });
  
}
finally {
    setLoading(false);
  }
  };
  

  const handleClose = () => {
    onClose();
    setRating(0);
    setComment("");
    setError("");
    setSubmitted(false);
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleClose} 
      maxWidth="sm" 
      fullWidth
      aria-labelledby="feedback-dialog-title"
    >
      <DialogTitle id="feedback-dialog-title">
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">Rate Your Experience</Typography>
          <IconButton 
            onClick={handleClose}
            aria-label="close"
            disabled={loading}
          >
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>
      
      <DialogContent dividers>
        {submitted ? (
          <Box textAlign="center" py={4}>
            <Typography variant="h6" color="primary" gutterBottom>
              Thank you for your feedback!
            </Typography>
            <Typography>Your rating has been submitted successfully.</Typography>
          </Box>
        ) : (
          <>
            <Box mb={3}>
              <Typography component="legend" gutterBottom>
                Overall Rating *
              </Typography>
              <Rating
                name="feedback-rating"
                value={rating}
                onChange={(event, newValue) => setRating(newValue)}
                precision={0.5}
                size="large"
                emptyIcon={<Star style={{ opacity: 0.55 }} fontSize="inherit" />}
              />
            </Box>

            <TextField
              fullWidth
              multiline
              rows={4}
              label="Your Feedback (Optional)"
              variant="outlined"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              sx={{ mb: 3 }}
              disabled={loading}
            />

            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}
          </>
        )}
      </DialogContent>

      {!submitted && (
        <DialogActions>
          <Button 
            onClick={handleClose} 
            color="secondary"
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="primary"
            startIcon={loading ? <CircularProgress size={20} /> : <Send />}
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? 'Submitting...' : 'Submit'}
          </Button>
        </DialogActions>
      )}
    </Dialog>
  );
};

export default FeedbackForm;
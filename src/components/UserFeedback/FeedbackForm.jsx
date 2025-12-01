import React, { useState } from "react";
import API_BASE_URL from "../../config/api";
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
  Alert,
  useTheme,
  Paper,
  Divider,
  styled,
} from "@mui/material";
import { Star, Send, Close, EmojiEmotions } from "@mui/icons-material";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";

const StyledRating = styled(Rating)(({ theme }) => ({
  "& .MuiRating-iconFilled": {
    color: theme.palette.warning.main,
  },
  "& .MuiRating-iconHover": {
    color: theme.palette.warning.dark,
  },
}));

const FeedbackForm = ({ open, onClose, appointmentId }) => {
  const theme = useTheme();
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

    setLoading(true);
    setError("");

    try {
      const response = await axios.post(
        `${API_BASE_URL}/feedback/${appointmentId}/submit`,
        { rating, comment },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          validateStatus: (status) => status < 500,
        }
      );

      if (response.data.success) {
        setSubmitted(true);
        setTimeout(handleClose, 1500);
      } else {
        throw new Error(response.data.message || "Failed to submit feedback");
      }
    } catch (err) {
      console.error("Feedback submission error:", err);
      setError(
        err.response?.data?.message ||
          "An error occurred while submitting feedback"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      onClose();
      setRating(0);
      setComment("");
      setError("");
      setSubmitted(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      aria-labelledby="feedback-dialog-title"
      PaperProps={{
        sx: {
          borderRadius: 3,
          background: theme.palette.background.paper,
        },
      }}
    >
      <DialogTitle id="feedback-dialog-title" sx={{ p: 0 }}>
        <Paper
          elevation={0}
          sx={{
            p: 3,
            borderTopLeftRadius: 12,
            borderTopRightRadius: 12,
            background: theme.palette.primary.main,
            color: theme.palette.primary.contrastText,
          }}
        >
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="h6" fontWeight="bold">
              Rate Your Experience
            </Typography>
            <IconButton
              onClick={handleClose}
              aria-label="close"
              disabled={loading}
              sx={{ color: theme.palette.primary.contrastText }}
            >
              <Close />
            </IconButton>
          </Box>
        </Paper>
      </DialogTitle>

      <DialogContent dividers sx={{ p: 3 }}>
        {submitted ? (
          <Box textAlign="center" py={4}>
            <EmojiEmotions color="primary" sx={{ fontSize: 60, mb: 2 }} />
            <Typography
              variant="h5"
              color="primary"
              gutterBottom
              fontWeight="bold"
            >
              Thank You!
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Your feedback has been submitted.
            </Typography>
          </Box>
        ) : (
          <>
            <Box mb={4} textAlign="center">
              <StyledRating
                name="feedback-rating"
                value={rating}
                onChange={(event, newValue) => setRating(newValue)}
                precision={1} // Whole numbers only
                size="large"
                icon={<Star fontSize="inherit" />}
                emptyIcon={<Star fontSize="inherit" />}
              />
            </Box>

            <Divider sx={{ my: 2 }} />

            <Box mb={3}>
              <TextField
                fullWidth
                multiline
                rows={4}
                placeholder="Share your thoughts (optional)"
                variant="outlined"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                disabled={loading}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                    "& fieldset": {
                      borderColor: theme.palette.divider,
                    },
                    "&:hover fieldset": {
                      borderColor: theme.palette.primary.light,
                    },
                  },
                }}
              />
            </Box>

            {error && (
              <Alert
                severity="error"
                sx={{ mb: 2 }}
                onClose={() => setError("")}
              >
                {error}
              </Alert>
            )}
          </>
        )}
      </DialogContent>

      {!submitted && (
        <DialogActions sx={{ p: 3, pt: 0 }}>
          <Button
            onClick={handleClose}
            color="inherit"
            disabled={loading}
            sx={{ mr: 2 }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="primary"
            endIcon={!loading && <Send />}
            onClick={handleSubmit}
            disabled={loading || rating === 0}
            sx={{
              px: 3,
              py: 1,
              borderRadius: 2,
              fontWeight: "bold",
              boxShadow: "none",
              backgroundColor: "#2e7d32",
              "&:hover": {
                boxShadow: "none",
                backgroundColor: "#1b5e20",
              },
            }}
          >
            {loading ? (
              <>
                <CircularProgress size={20} sx={{ mr: 1 }} />
                Submitting...
              </>
            ) : (
              "Submit"
            )}
          </Button>
        </DialogActions>
      )}
    </Dialog>
  );
};

export default FeedbackForm;

import React, { useState } from "react";
import { Paper, Button, Grid, Box } from "@mui/material";
import axios from "axios";
import FeedbackActions from "./FeedbackActions";
import FeedbackInfo from "./FeedbackInfo";
import ReplyBox from "./ReplyBox";
import SuccessSnackbar from "../ServiceManage/SuccessSnackbar";

const FeedbackItem = ({ feedback, onUpdate }) => {
  const [reply, setReply] = useState(feedback.reply || "");
  const [isReplying, setIsReplying] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false); // Manage button state

  const handleReplySubmit = async (updatedReply) => {
    if (!updatedReply.trim()) return;

    setIsButtonDisabled(true); // Disable the button when reply is being submitted

    const token = localStorage.getItem("token");
    const authConfig = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      await axios.put(
        `http://localhost:5000/api/feedback/${feedback._id}/reply`,
        { reply: updatedReply },
        authConfig
      );

      setReply(updatedReply);
      setIsReplying(false); // Stop the reply editor after success
      setSnackbarOpen(true); // Show success snackbar
      onUpdate(); // Call update function
    } catch (err) {
      console.error("Error updating reply:", err);
    } finally {
      setIsButtonDisabled(false); // Re-enable the button after operation
    }
  };

  return (
    <Paper elevation={2} sx={{ padding: 2, marginBottom: 2 }}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={8}>
          <FeedbackInfo feedback={feedback} />
        </Grid>

        <Grid item xs={12} md={4}>
          <FeedbackActions feedback={feedback} onUpdate={onUpdate} />
        </Grid>
      </Grid>

      <Box sx={{ marginTop: 2 }}>
        {isReplying ? (
          <ReplyBox feedback={feedback} onUpdateReply={handleReplySubmit} />
        ) : (
          <Button
            variant="outlined"
            color="primary"
            onClick={() => setIsReplying(true)}
            size="small"
            disabled={isButtonDisabled} // Disable button based on isButtonDisabled state
          >
            {reply ? "Edit Reply" : "Add Reply"}
          </Button>
        )}
      </Box>

      <SuccessSnackbar
        open={snackbarOpen}
        message="Reply submitted successfully!"
        onClose={() => setSnackbarOpen(false)}
      />
    </Paper>
  );
};

export default FeedbackItem;

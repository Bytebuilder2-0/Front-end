import React, { useState } from "react";
import { Paper, Button, Grid, Box } from "@mui/material";
import axios from "axios";
import FeedbackActions from "./FeedbackActions";
import FeedbackInfo from "./FeedbackInfo";
import ReplyBox from "./ReplyBox";
import SuccessSnackbar from "../ServiceManage/SuccessSnackbar";
import API_BASE_URL from "../../config/api";

const FeedbackItem = ({ feedback, onUpdate }) => {
  const [reply, setReply] = useState(feedback.reply || "");
  const [isReplying, setIsReplying] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const handleReplySubmit = async (updatedReply) => {
    if (!updatedReply.trim()) return;

    const token = localStorage.getItem("token");
    const authConfig = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      await axios.put(
        `${API_BASE_URL}/feedback/${feedback._id}/reply`,
        { reply: updatedReply },
        authConfig
      );
      setReply(updatedReply);
      setIsReplying(false);

      setSnackbarOpen(true);
      onUpdate();
    } catch (err) {
      console.error("Error updating reply:", err);
    }
  };

  return (
    <Paper elevation={3} sx={{ padding: 2, marginBottom: 2 }}>
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

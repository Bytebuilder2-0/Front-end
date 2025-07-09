// src/components/Feedback/FeedbackItem.jsx

import React, { useState } from "react";
import { Paper, Button, Grid, Box } from "@mui/material";
import axios from "axios";
import FeedbackActions from "./FeedbackActions";
import FeedbackInfo from "./FeedbackInfo";
import ReplyBox from "./ReplyBox";
import SuccessSnackbar from "../ServiceManage/SuccessSnackbar"; // import

import { jwtDecode } from "jwt-decode";

const API_URL = "http://localhost:5000/api/feedback";
const token = localStorage.getItem("token");

let decoded = null;
if (token) {
  try {
    decoded = jwtDecode(token);
    console.log(decoded.id); // optional
  } catch (err) {
    console.error("Invalid token:", err);
  }
}

//  Handy config object you can reuse
const authConfig = {
  headers: {
    Authorization: `Bearer ${token}`,
  },
};

const FeedbackItem = ({ feedback, onUpdate }) => {
  const [reply, setReply] = useState(feedback.reply || "");
  const [isReplying, setIsReplying] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const handleReplySubmit = async (updatedReply) => {
    if (!updatedReply.trim()) return;

    try {
      await axios.put(
        `${API_URL}/${feedback._id}/reply`,
        {
          reply: updatedReply,
        },
        authConfig
      );
      setReply(updatedReply);
      setIsReplying(false);

      //  Show success snackbar
      setSnackbarOpen(true);

      // Refresh the feedback list after reply
      onUpdate();
    } catch (err) {
      console.error("Error updating reply:", err);
    }
  };

  return (
    <Paper elevation={2} sx={{ padding: 2, marginBottom: 2 }}>
      <Grid container spacing={2}>
        {/* Feedback info */}
        <Grid item xs={12} md={8}>
          <FeedbackInfo feedback={feedback} />
        </Grid>

        {/* Actions */}
        <Grid item xs={12} md={4}>
          <FeedbackActions feedback={feedback} onUpdate={onUpdate} />
        </Grid>
      </Grid>

      {/* Reply section */}
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

      {/* Snackbar */}
      <SuccessSnackbar
        open={snackbarOpen}
        message="Reply submitted successfully!"
        onClose={() => setSnackbarOpen(false)}
      />
    </Paper>
  );
};

export default FeedbackItem;

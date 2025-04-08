import React, { useState } from "react";
import { Paper, Button, Grid, Box } from "@mui/material";
import axios from "axios";
import FeedbackActions from "./FeedbackActions";
import FeedbackInfo from "./FeedbackInfo";
import ReplyBox from "./ReplyBox";

const FeedbackItem = ({ feedback, onUpdate }) => {
  const [reply, setReply] = useState(feedback.reply || "");
  const [isReplying, setIsReplying] = useState(false);
  const [loading, setLoading] = useState(false);

  // ✅ Handle reply submission
  const handleReplySubmit = async (updatedReply) => {
    if (!updatedReply.trim()) return;
    
    setLoading(true);
    try {
      await axios.put(`http://localhost:5000/api/feedback/${feedback._id}/reply`, { reply: updatedReply });
      setReply(updatedReply); // ✅ Update local state immediately
      setIsReplying(false);
      onUpdate(); // ✅ Refresh feedback list
    } catch (err) {
      console.error("Error updating reply:", err);
    }
    setLoading(false);
  };

  return (
    <Paper elevation={2} sx={{ padding: 2, marginBottom: 1 }}>
      <Grid container spacing={2}>
        {/* Feedback Information Section */}
        <Grid item xs={12} md={8}>
          <FeedbackInfo feedback={feedback} />
        </Grid>

        {/* Action Buttons Section */}
        <Grid item xs={12} md={4}>
          <FeedbackActions feedback={feedback} onUpdate={onUpdate} />
        </Grid>
      </Grid>

      {/* Reply Section */}
      <Box sx={{ marginTop: 2 }}>
        {isReplying ? (
          <ReplyBox feedback={feedback} onUpdateReply={handleReplySubmit} />
        ) : (
          <Button variant="outlined" color="primary" onClick={() => setIsReplying(true)} size="small">
            {reply ? "Edit Reply" : "Add Reply"}
          </Button>
        )}
      </Box>
    </Paper>
  );
};

export default FeedbackItem;

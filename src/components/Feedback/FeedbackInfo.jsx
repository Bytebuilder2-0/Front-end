import React from "react";
import { Typography, Box, Grid } from "@mui/material";

const FeedbackInfo = ({ feedback }) => {
  return (
    <Box sx={{ width: "100%" }}>
      <Grid container spacing={1}>
        <Grid item xs={4}>
          {["Feedback ID:", "Date:", "Comment:", "Reply:", "Action Status:"].map((label, index) => (
            <Typography key={index} variant="subtitle2" sx={{ fontWeight: "bold" }}>
              {label}
            </Typography>
          ))}
        </Grid>

        <Grid item xs={8}>
          {[
            feedback.feedbackId,
            new Date(feedback.feedbackDate).toLocaleDateString(),
            feedback.comment,
            feedback.reply || "No reply yet",
            feedback.actionStatus,
          ].map((value, index) => (
            <Typography key={index} variant="body2">{value}</Typography>
          ))}
        </Grid>
      </Grid>
    </Box>
  );
};

export default FeedbackInfo;

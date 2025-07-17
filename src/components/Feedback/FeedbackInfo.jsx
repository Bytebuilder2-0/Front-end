// src/components/Feedback/FeedbackInfo.jsx

import React from "react";
import { Typography, Box, Grid } from "@mui/material";

const FeedbackInfo = ({ feedback }) => {
  const infoData = [
    {
      label: "Username",
      value: feedback.username || "Unknown", // Show username instead of feedbackId
    },
    {
      label: "Date",
      value: new Date(feedback.feedbackDate).toLocaleDateString(),
    },
    { label: "Comment", value: feedback.comment },
    { label: "Reply", value: feedback.reply || "No reply yet" },
    {
      label: "Added",
      value: feedback.actionStatus === "yes" ? "Add" : "No", // More user-friendly
    },
  ];

  return (
    <Box sx={{ width: "100%" }}>
      <Grid container spacing={0.5}>
        {infoData.map((item, index) => (
          <Grid
            key={index}
            container
            item
            xs={12}
            alignItems="center"
            sx={{ mb: 0.5 }}
          >
            <Grid item xs={4}>
              <Typography
                variant="subtitle2"
                sx={{
                  fontWeight: "bold",
                  color: "text.secondary",
                  fontSize: "0.85rem",
                }}
              >
                {item.label}:
              </Typography>
            </Grid>
            <Grid item xs={8}>
              <Typography
                variant="body2"
                sx={{ fontSize: "0.85rem", wordBreak: "break-word" }}
              >
                {item.value}
              </Typography>
            </Grid>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default FeedbackInfo;

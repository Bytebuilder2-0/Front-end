import React from "react";
import { Typography, Box, Grid, Rating } from "@mui/material";

const FeedbackInfo = ({ feedback }) => {
  const infoData = [
    {
      label: "Username",
      value: feedback.username || "Unknown",
    },
    {
      label: "Date",
      value: new Date(feedback.feedbackDate).toLocaleDateString(),
    },
    { label: "Comment", value: feedback.comment },
    { label: "Reply", value: feedback.reply || "No reply yet" },
    {
      label: "Added",
      value: feedback.actionStatus === "yes" ? "Add" : "No",
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
                sx={{
                  fontSize: "0.85rem",
                  wordBreak: "break-word",
                  display: "inline-block",
                }}
              >
                {item.value}
              </Typography>
            </Grid>
          </Grid>
        ))}

        {/* Adjust Rating: Slightly shift the rating stars to the left */}
        <Grid item xs={12}>
          <Grid container alignItems="center">
            <Grid item xs={4}>
              <Typography
                variant="subtitle2"
                sx={{
                  fontWeight: "bold",
                  color: "text.secondary",
                  fontSize: "0.85rem",
                }}
              >
                Rating:
              </Typography>
            </Grid>
            <Grid item xs={8}>
              <Box sx={{ marginLeft: "-8px" }}>
                {" "}
                {/* Shift stars left */}
                <Rating
                  name="feedback-rating"
                  value={feedback.rating || 0} // Default to 0 if no rating exists
                  precision={0.5} // For half-star precision
                  readOnly // Make it read-only if feedback has already been rated
                />
              </Box>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};

export default FeedbackInfo;

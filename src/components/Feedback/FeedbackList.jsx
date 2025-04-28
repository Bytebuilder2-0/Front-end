// src/components/Feedback/FeedbackList.jsx

import { List, Box, Typography } from "@mui/material";
import FeedbackItem from "./FeedbackItem";
import { useState, useEffect } from "react";

const FeedbackList = ({ feedbacks, onUpdate }) => {
  const [localFeedbacks, setLocalFeedbacks] = useState(feedbacks);

  useEffect(() => {
    setLocalFeedbacks(feedbacks); // Sync when new feedbacks are fetched
  }, [feedbacks]);

  // Remove feedback from UI when deleted
  const handleDeleteFromUI = (deletedId) => {
    setLocalFeedbacks((prevFeedbacks) =>
      prevFeedbacks.filter((feedback) => feedback._id !== deletedId)
    );
  };

  return (
    <Box sx={{ mt: 2 }}>
      {localFeedbacks.length > 0 ? (
        <List sx={{ width: "100%", bgcolor: "background.paper" }}>
          {localFeedbacks.map((feedback) => (
            <FeedbackItem
              key={feedback._id}
              feedback={feedback}
              onUpdate={(deletedId) => {
                onUpdate();
                handleDeleteFromUI(deletedId);
              }}
            />
          ))}
        </List>
      ) : (
        <Box
          sx={{
            textAlign: "center",
            py: 5,
            backgroundColor: "#f5f5f5",
            borderRadius: "12px",
          }}
        >
          <Typography variant="h6" color="textSecondary">
            No feedback available
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default FeedbackList;

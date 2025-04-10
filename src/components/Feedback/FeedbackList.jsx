import { List } from "@mui/material";
import FeedbackItem from "./FeedbackItem";
import { useState, useEffect } from "react";

const FeedbackList = ({ feedbacks, onUpdate }) => {
  const [localFeedbacks, setLocalFeedbacks] = useState(feedbacks);

  useEffect(() => {
    setLocalFeedbacks(feedbacks); // ✅ Sync state when new feedback is fetched
  }, [feedbacks]);

  // ✅ Remove deleted feedback from UI instantly
  const handleDeleteFromUI = (deletedId) => {
    setLocalFeedbacks((prevFeedbacks) => prevFeedbacks.filter((feedback) => feedback._id !== deletedId));
  };

  return (
    <List>
      {localFeedbacks.length > 0 ? (
        localFeedbacks.map((feedback) => (
          <FeedbackItem 
            key={feedback._id} 
            feedback={feedback} 
            onUpdate={(deletedId) => {
              onUpdate(); // ✅ Refresh backend state
              handleDeleteFromUI(deletedId); // ✅ Remove from UI instantly
            }} 
          />
        ))
      ) : (
        <p>No feedback available</p>
      )}
    </List>
  );
};

export default FeedbackList;

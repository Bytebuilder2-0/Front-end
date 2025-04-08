import { Button, Box, Grid } from "@mui/material";
import axios from "axios";
import ButtonLink from "./ButtonLink";
import { useState } from "react";

const FeedbackActions = ({ feedback, onUpdate }) => {
  const [deleted, setDeleted] = useState(false);
  const [actionStatus, setActionStatus] = useState(feedback.actionStatus); // ✅ Track actionStatus in state

  // ✅ Handle delete (Frontend only)
  const handleDelete = async () => {
    try {
      await axios.put(`http://localhost:5000/api/feedback/${feedback._id}/delete`);
      setDeleted(true);
      onUpdate(feedback._id); // ✅ Remove from UI instantly
    } catch (err) {
      console.error("Error deleting feedback:", err);
    }
  };

  // ✅ Handle Action Toggle (Frontend & Backend)
  const handleActionUpdate = async () => {
    try {
      const newStatus = actionStatus === "yes" ? "no" : "yes"; // Toggle status
      setActionStatus(newStatus); // ✅ Update UI instantly
      await axios.put(`http://localhost:5000/api/feedback/${feedback._id}/action`); // Update backend
      onUpdate(); // Refresh parent state
    } catch (err) {
      console.error("Error updating action status:", err);
    }
  };

  if (deleted) return null;

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
      <Grid container spacing={1}>
        <Grid item xs={6}>
          <Button variant="contained" color="primary" onClick={handleActionUpdate} fullWidth size="small">
            {actionStatus === "yes" ? "Remove" : "Add"}
          </Button>
        </Grid>
        <Grid item xs={6}>
          <ButtonLink to={`/service-details/${feedback.feedbackId}`}>Service Details</ButtonLink>
        </Grid>

        <Grid item xs={6}>
          <ButtonLink to={`/invoice/${feedback.feedbackId}`}>Invoice</ButtonLink>
        </Grid>
        <Grid item xs={6}>
          <Button variant="contained" color="error" onClick={handleDelete} fullWidth size="small">
            Delete
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default FeedbackActions;

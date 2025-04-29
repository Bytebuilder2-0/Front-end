// src/components/Feedback/FeedbackActions.jsx

import { Button, Box, Grid } from "@mui/material";
import axios from "axios";
import ButtonLink from "./ButtonLink";
import { useState } from "react";
import SuccessSnackbar from "../ServiceManage/SuccessSnackbar";
import ConfirmDeleteDialog from "../ServiceManage/ConfirmDeleteDialog"; // ✅ Import

const FeedbackActions = ({ feedback, onUpdate }) => {
  const [deleted, setDeleted] = useState(false);
  const [actionStatus, setActionStatus] = useState(feedback.actionStatus);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false); // ✅ New state for delete confirm

  // ✅ Open Confirm Delete Dialog
  const handleDeleteClick = () => {
    setConfirmDeleteOpen(true);
  };

  // ✅ Actually delete after confirm
  const handleConfirmDelete = async () => {
    try {
      await axios.put(`http://localhost:5000/api/feedback/${feedback._id}/delete`);
      setSnackbarMessage("Feedback successfully deleted!");
      setSnackbarOpen(true);
      setDeleted(true);
      onUpdate(feedback._id);
      setConfirmDeleteOpen(false);
    } catch (err) {
      console.error("Error deleting feedback:", err);
    }
  };

  const handleCancelDelete = () => {
    setConfirmDeleteOpen(false); // Close without deleting
  };

  // ✅ Toggle Add/Remove Action
  const handleActionUpdate = async () => {
    try {
      const newStatus = actionStatus === "yes" ? "no" : "yes";
      setActionStatus(newStatus);
      await axios.put(`http://localhost:5000/api/feedback/${feedback._id}/action`);
      onUpdate();

      setSnackbarMessage(newStatus === "yes" ? "Feedback successfully added!" : "Feedback successfully removed!");
      setSnackbarOpen(true);
    } catch (err) {
      console.error("Error updating action status:", err);
    }
  };

  if (deleted) return null;

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
      <Grid container spacing={1}>
        <Grid item xs={6}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleActionUpdate}
            fullWidth
            size="small"
          >
            {actionStatus === "yes" ? "Remove" : "Add"}
          </Button>
        </Grid>

        <Grid item xs={6}>
          <ButtonLink to={`/service-details/${feedback.feedbackId}`}>
            Service Details
          </ButtonLink>
        </Grid>

        <Grid item xs={6}>
          <ButtonLink to={`/invoice/${feedback.feedbackId}`}>
            Invoice
          </ButtonLink>
        </Grid>

        <Grid item xs={6}>
          <Button
            variant="contained"
            color="error"
            onClick={handleDeleteClick} // ✅ Ask confirmation before delete
            fullWidth
            size="small"
          >
            Delete
          </Button>
        </Grid>
      </Grid>

      {/* ✅ Confirm Delete Dialog */}
      <ConfirmDeleteDialog
        open={confirmDeleteOpen}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        itemName={`feedback ID: ${feedback.feedbackId}`} // ✅ Pass item name
      />

      {/* ✅ Success Snackbar */}
      <SuccessSnackbar
        open={snackbarOpen}
        message={snackbarMessage}
        onClose={() => setSnackbarOpen(false)}
      />
    </Box>
  );
};

export default FeedbackActions;

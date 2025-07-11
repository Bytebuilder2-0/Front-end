import { Button, Box, Grid } from "@mui/material";
import axios from "axios";
import ButtonLink from "./ButtonLink";
import { useState } from "react";
import SuccessSnackbar from "../ServiceManage/SuccessSnackbar";
import ConfirmDeleteDialog from "../ServiceManage/ConfirmDeleteDialog";

const FeedbackActions = ({ feedback, onUpdate }) => {
  const [deleted, setDeleted] = useState(false);
  const [actionStatus, setActionStatus] = useState(feedback.actionStatus);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);

  const token = localStorage.getItem("token");
  const authConfig = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const handleDeleteClick = () => {
    setConfirmDeleteOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await axios.put(
        `http://localhost:5000/api/feedback/${feedback._id}/delete`,
        {},
        authConfig
      );

      setSnackbarMessage("Feedback successfully deleted!");
      setSnackbarOpen(true);

      // Wait for snackbar to show before triggering deletion
      setTimeout(() => {
        setDeleted(true);
        onUpdate(feedback._id);
      }, 1000);

      setConfirmDeleteOpen(false);
    } catch (err) {
      console.error("Error deleting feedback:", err);
      setSnackbarMessage("Error deleting feedback!");
      setSnackbarOpen(true);
    }
  };
  const handleCancelDelete = () => {
    setConfirmDeleteOpen(false); // Close without deleting
  };

  const handleActionUpdate = async () => {
    try {
      const newStatus = actionStatus === "yes" ? "no" : "yes";
      setActionStatus(newStatus);
      await axios.put(
        `http://localhost:5000/api/feedback/${feedback._id}/action`,
        {},
        authConfig
      );
      onUpdate();

      setSnackbarMessage(
        newStatus === "yes"
          ? "Feedback successfully added!"
          : "Feedback successfully removed!"
      );
      setSnackbarOpen(true);
    } catch (err) {
      console.error("Error updating action status:", err);
    }
  };

  if (deleted) return null; // If deleted, return null to hide this component

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
            onClick={handleDeleteClick}
            fullWidth
            size="small"
          >
            Delete
          </Button>
        </Grid>
      </Grid>

      <ConfirmDeleteDialog
        open={confirmDeleteOpen}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        itemName={`feedback ID: ${feedback.feedbackId}`}
      />

      {/* Snackbar to show success message */}
      <SuccessSnackbar
        open={snackbarOpen}
        message={snackbarMessage}
        onClose={() => setSnackbarOpen(false)} // Close snackbar on manual close
      />
    </Box>
  );
};

export default FeedbackActions;

import { Button, Box, Grid } from "@mui/material";
import axios from "axios";
import { useState } from "react";
import SuccessSnackbar from "../ServiceManage/SuccessSnackbar";
import ConfirmDeleteDialog from "../ServiceManage/ConfirmDeleteDialog";
import AppointmentDetailsModal from "./AppointmentDetailsModal";

// Base URL configuration
const API_BASE_URL = "http://localhost:5000/api";

const FeedbackActions = ({ feedback, onUpdate }) => {
  const [deleted, setDeleted] = useState(false);
  const [actionStatus, setActionStatus] = useState(feedback.actionStatus);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [appointmentDetails, setAppointmentDetails] = useState(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [loadingDetails, setLoadingDetails] = useState(false);

  const token = localStorage.getItem("token");
  const authConfig = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const fetchAppointmentDetails = async (appointmentId) => {
    try {
      setLoadingDetails(true);
      // Make sure appointmentId is a string, not an object
      const id =
        typeof appointmentId === "object"
          ? appointmentId._id || appointmentId.toString()
          : appointmentId;

      const res = await axios.get(
        `${API_BASE_URL}/appointments/manager/${id}`,
        authConfig
      );
      setAppointmentDetails(res.data);
      setDetailsModalOpen(true);
    } catch (err) {
      console.error("Error fetching appointment details:", err);
      setSnackbarMessage("Failed to load appointment details");
      setSnackbarOpen(true);
    } finally {
      setLoadingDetails(false);
    }
  };

  const handleDeleteClick = () => {
    setConfirmDeleteOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await axios.put(
        `${API_BASE_URL}/feedback/${feedback._id}/delete`,
        {},
        authConfig
      );

      setSnackbarMessage("Feedback successfully deleted!");
      setSnackbarOpen(true);

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
    setConfirmDeleteOpen(false);
  };

  const handleActionUpdate = async () => {
    try {
      const newStatus = actionStatus === "yes" ? "no" : "yes";
      setActionStatus(newStatus);
      await axios.put(
        `${API_BASE_URL}/feedback/${feedback._id}/action`,
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
      setSnackbarMessage("Error updating feedback status");
      setSnackbarOpen(true);
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
            disabled={loadingDetails}
          >
            {actionStatus === "yes" ? "Remove" : "Add"}
          </Button>
        </Grid>

        <Grid item xs={6}>
          <Button
            variant="outlined"
            color="secondary"
            onClick={() => fetchAppointmentDetails(feedback.appointmentId)}
            fullWidth
            size="small"
            disabled={loadingDetails}
            sx={{
              borderRadius: "8px",
              fontWeight: "bold",
              "&:hover": {
                backgroundColor: "#f0f0f0",
              },
            }}
          >
            {loadingDetails ? "Loading..." : "Relevant Details"}
          </Button>
        </Grid>
      </Grid>

      {/* Move the delete button to the right side with same size */}
      <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 1 }}>
        <Button
          variant="contained"
          color="error"
          onClick={handleDeleteClick}
          fullWidth
          size="small"
          disabled={loadingDetails}
          sx={{ minWidth: "100px" }} // Ensure button size is consistent with others
        >
          Delete
        </Button>
      </Box>

      <AppointmentDetailsModal
        appointment={appointmentDetails}
        open={detailsModalOpen}
        onClose={() => setDetailsModalOpen(false)}
      />

      <ConfirmDeleteDialog
        open={confirmDeleteOpen}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        itemName={`feedback ID: ${feedback.feedbackId}`}
      />

      <SuccessSnackbar
        open={snackbarOpen}
        message={snackbarMessage}
        onClose={() => setSnackbarOpen(false)}
      />
    </Box>
  );
};

export default FeedbackActions;

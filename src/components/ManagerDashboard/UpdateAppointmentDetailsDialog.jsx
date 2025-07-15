import React, { useState, useEffect } from "react";
import {
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Typography,
  colors,
} from "@mui/material";
import axios from "axios";
import SuccessSnackbar from "../ServiceManage/SuccessSnackbar"; // Import SuccessSnackbar

// Helper function to convert 12-hour AM/PM format to 24-hour format
const convertTo24HourFormat = (time12h) => {
  const [time, modifier] = time12h.split(" ");
  const [hours, minutes] = time.split(":");
  let hours24 = parseInt(hours, 10);

  if (modifier === "PM" && hours24 !== 12) {
    hours24 += 12;
  } else if (modifier === "AM" && hours24 === 12) {
    hours24 = 0;
  }

  return `${hours24.toString().padStart(2, "0")}:${minutes}`;
};

// Helper function to convert 24-hour format to 12-hour AM/PM format
const convertTo12HourFormat = (time24h) => {
  let [hours, minutes] = time24h.split(":");
  const modifier = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12; // Convert hours to 12-hour format
  return `${hours}:${minutes} ${modifier}`;
};

const API_BASE_URL = "http://localhost:5000/api/appointments";

const UpdateAppointmentDetailsDialog = ({ appointment, open, onClose }) => {
  const [preferredDate, setPreferredDate] = useState("");
  const [preferredTime, setPreferredTime] = useState("");
  const [expectedDeliveryDate, setExpectedDeliveryDate] = useState("");
  const [error, setError] = useState("");
  const [showSnackbar, setShowSnackbar] = useState(false); // Snackbar visibility state
  const [snackbarMessage, setSnackbarMessage] = useState(""); // Snackbar message

  const [openConfirmationDialog, setOpenConfirmationDialog] = useState(false); // For confirmation dialog

  // Initialize form fields with the current appointment data
  useEffect(() => {
    if (appointment) {
      setPreferredDate(
        new Date(appointment.preferredDate).toISOString().split("T")[0]
      );
      setExpectedDeliveryDate(
        new Date(appointment.expectedDeliveryDate).toISOString().split("T")[0]
      );
      setPreferredTime(
        appointment.preferredTime
          ? convertTo24HourFormat(appointment.preferredTime)
          : ""
      );
    }
  }, [appointment]);

  const handleSubmit = async () => {
    // Ensure both dates are in the future
    const currentDate = new Date().toISOString().split("T")[0];

    if (preferredDate <= currentDate || expectedDeliveryDate <= currentDate) {
      setError("Both dates must be in the future.");
      return;
    }

    // Ensure Preferred Date <= Expected Delivery Date
    if (preferredDate > expectedDeliveryDate) {
      setError(
        "Preferred Date must be before or equal to the Expected Delivery Date."
      );
      return;
    }

    // Open the confirmation dialog
    setOpenConfirmationDialog(true);
  };

  const handleConfirmSave = async () => {
    setOpenConfirmationDialog(false);

    try {
      // Convert Preferred Time back to 12-hour format before saving
      const time12h = convertTo12HourFormat(preferredTime);

      await axios.put(
        `${API_BASE_URL}/${appointment._id}/updateDetails`,
        { preferredDate, preferredTime: time12h, expectedDeliveryDate },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      // On success, show the success snackbar
      setSnackbarMessage("Appointment details updated successfully.");
      setShowSnackbar(true);

      // Close the dialog after successful update
      onClose();
      window.location.reload();
    } catch (error) {
      console.error("Error updating appointment details:", error);
    }
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogTitle>Update Appointment Details</DialogTitle>
        <Divider />
        <DialogContent>
          {/* Error message */}
          {error && (
            <Typography color="error" sx={{ mb: 2 }}>
              {error}
            </Typography>
          )}

          <TextField
            label="Preferred Date"
            type="date"
            fullWidth
            value={preferredDate}
            onChange={(e) => setPreferredDate(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Preferred Time"
            type="time"
            fullWidth
            value={preferredTime}
            onChange={(e) => setPreferredTime(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Expected Delivery Date"
            type="date"
            fullWidth
            value={expectedDeliveryDate}
            onChange={(e) => setExpectedDeliveryDate(e.target.value)}
            sx={{ mb: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="error">
            Cancel
          </Button>
          <Button onClick={handleSubmit} color="primary">
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>

      {/* Confirmation Dialog */}
      <Dialog
        open={openConfirmationDialog}
        onClose={() => setOpenConfirmationDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle color="primary">Confirm Edit</DialogTitle>
        <Divider />
        <DialogContent>
          <Typography>
            Are you sure you want to change the{" "}
            <span style={{ color: "#1976d2" }}>appointment details?</span>
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setOpenConfirmationDialog(false)}
            color="primary"
            variant="outlined"
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirmSave}
            color="primary"
            variant="contained"
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>

      {/* Success Snackbar */}
      <SuccessSnackbar
        open={showSnackbar}
        message={snackbarMessage}
        onClose={() => setShowSnackbar(false)}
      />
    </>
  );
};

export default UpdateAppointmentDetailsDialog;

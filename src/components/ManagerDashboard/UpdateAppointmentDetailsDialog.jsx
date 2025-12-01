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
} from "@mui/material";
import axios from "axios";
import API_BASE_URL from "../../config/api";

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

const convertTo12HourFormat = (time24h) => {
  let [hours, minutes] = time24h.split(":");
  const modifier = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12;
  return `${hours}:${minutes} ${modifier}`;
};

const API_URL = `${API_BASE_URL}/appointments`;

const UpdateAppointmentDetailsDialog = ({
  appointment,
  open,
  onClose,
  onSuccess,
}) => {
  const [preferredDate, setPreferredDate] = useState("");
  const [preferredTime, setPreferredTime] = useState("");
  const [expectedDeliveryDate, setExpectedDeliveryDate] = useState("");
  const [error, setError] = useState("");
  const [openConfirmationDialog, setOpenConfirmationDialog] = useState(false);

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
    const currentDate = new Date().toISOString().split("T")[0];

    if (preferredDate < currentDate || expectedDeliveryDate < currentDate) {
      setError("Both dates must be in the future.");
      return;
    }

    if (preferredDate > expectedDeliveryDate) {
      setError(
        "Preferred Date must be before or equal to the Expected Delivery Date."
      );
      return;
    }

    setOpenConfirmationDialog(true);
  };

  const handleConfirmSave = async () => {
    setOpenConfirmationDialog(false);

    try {
      const time12h = convertTo12HourFormat(preferredTime);

      await axios.put(
        `${API_URL}/${appointment._id}/updateDetails`,
        { preferredDate, preferredTime: time12h, expectedDeliveryDate },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      onSuccess("Appointment details updated successfully!");
    } catch (error) {
      console.error("Error updating appointment details:", error);
      onSuccess("Error updating appointment details");
    }
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogTitle>Update Appointment Details</DialogTitle>
        <Divider />
        <DialogContent>
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
    </>
  );
};

export default UpdateAppointmentDetailsDialog;

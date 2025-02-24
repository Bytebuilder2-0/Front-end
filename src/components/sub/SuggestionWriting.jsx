import React, { useState } from "react";
import axios from "axios";
import { Button, Modal, Box, TextField, Typography } from "@mui/material";

const SuggestionWriting = ({ appointment, updateAppointment }) => {
  const [openSuggestionModal, setOpenSuggestionModal] = useState(false);
  const [suggestion, setSuggestion] = useState(appointment?.suggestion || "");

  const handleOpenSuggestion = () => {
    setOpenSuggestionModal(true);
  };

  const handleCloseModals = () => {
    setOpenSuggestionModal(false);
    setSuggestion(appointment?.suggestion || "");
  };

  const handleSuggestionSubmit = async () => {
    if (!appointment) return;

    try {
      console.log("📡 Sending Suggestion Update:", suggestion, "for Appointment ID:", appointment._id);

      const response = await axios.put(
        `http://localhost:5000/api/appointments/${appointment._id}/suggestions`,
        { suggestion }
      );

      console.log("✅ API Response:", response.data);

      if (response.data && response.data.appointment) {
        console.log("📌 Updating appointment state with:", response.data.appointment);
        updateAppointment(response.data.appointment);
      } else {
        console.warn("⚠️ No updated appointment data in response.");
      }

      handleCloseModals();
    } catch (error) {
      console.error("🚨 Error updating suggestion:", error.response?.data || error.message);
    }
  };

  return (
    <>
      <Button variant="contained" color="secondary" onClick={handleOpenSuggestion}>
        Write Suggestion
      </Button>

      <Modal open={openSuggestionModal} onClose={handleCloseModals}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "white",
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
          }}
        >
          <Typography variant="h6" gutterBottom>
            Suggestion for {appointment?.vehicleNumber}
          </Typography>
          <TextField
            fullWidth
            label="Suggestion Details"
            multiline
            rows={4}
            value={suggestion}
            onChange={(e) => setSuggestion(e.target.value)}
          />
          <Box sx={{ display: "flex", justifyContent: "space-between", marginTop: 2 }}>
            <Button variant="contained" color="primary" onClick={handleSuggestionSubmit} sx={{ width: "48%" }}>
              Submit
            </Button>
            <Button variant="contained" color="error" onClick={handleCloseModals} sx={{ width: "48%" }}>
              Cancel
            </Button>
          </Box>
        </Box>
      </Modal>
    </>
  );
};

export default SuggestionWriting;

import React, { useState } from "react";
import axios from "axios";
import { Button, Modal, Box, TextField, Typography } from "@mui/material";

const baseURL=import.meta.env.VITE_API_BASE_URL;

const SuggestionWriting = ({ appointment, updateAppointment }) => {
  const [openSuggestionModal, setOpenSuggestionModal] = useState(false);
  const [suggestion, setSuggestion] = useState(appointment?.suggestion || "");

  const handleOpenSuggestion = async() => {
    await fetchLatestSuggestion(); 
    setOpenSuggestionModal(true);
  };

  const handleCloseModals = () => {
    setOpenSuggestionModal(false);
    setSuggestion(appointment?.suggestion || "");
  };

  const handleSuggestionSubmit = async () => {
    if (!appointment) return;

    try {
      console.log("Sending Suggestion Update:", suggestion, "for Appointment ID:", appointment._id);

      const response = await axios.put(
        `${baseURL}/appointments/${appointment._id}/suggestions`,
        { suggestion }
      );

      console.log("API Response:", response.data);

      if (response.data && response.data.appointment) {
        console.log("Updating appointment state with:", response.data.appointment);
        updateAppointment(response.data.appointment);
      } else {
        console.warn("No updated appointment data in response.");
      }

      handleCloseModals();
    } catch (error) {
      console.error("Error updating suggestion:", error.response?.data || error.message);
    }
  };
  const fetchLatestSuggestion = async () => {
    if (!appointment) return;
  
    try {
      const response = await axios.get(`${baseURL}/appointments/${appointment._id}`);
      
      if (response.data && response.data.suggestion !== undefined) {
        setSuggestion(response.data.suggestion);
        console.log("🛬 Fetched Latest Suggestion:", response.data.suggestion);
      }
    } catch (error) {
      console.error("Error fetching latest suggestion:", error.response?.data || error.message);
    }
  };
  

  return (
    <>
      <Button variant="text" color="success" onClick={handleOpenSuggestion} sx={{fontWeight:"bold"}}>
        Write
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

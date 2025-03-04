import React, { useState } from "react";
import axios from "axios";
import {
  Button,
  Modal,
  Box,
  TextField,
  Typography,
  IconButton,
} from "@mui/material";
import { Add, Delete } from "@mui/icons-material";

const WorkloadManager = ({ appointment, updateAppointment, btn_name }) => {
  const [openWorkloadModal, setOpenWorkloadModal] = useState(false);
  const [workload, setWorkload] = useState(appointment?.workload || []);

  // Open Modal and Fetch Latest Workload
  const handleOpenWorkload = async () => {
    if (!appointment?._id) {
      console.error("No appointment found");
      return;
    }

    try {
      const response = await axios.get(
        `http://localhost:5000/api/appointments/${appointment._id}/workload`
      );
      setWorkload(response.data.workload); // Ensure fresh data is fetched
      setOpenWorkloadModal(true);
    } catch (error) {
      console.error("Error fetching workload:", error);
    }
  };

  // Close Modal
  const handleCloseModals = () => {
    setOpenWorkloadModal(false);
  };

  // Handle Workload Input Changes
  const handleWorkloadChange = (index, field, value) => {
    setWorkload((prevWorkload) =>
      prevWorkload.map((task, i) =>
        i === index ? { ...task, [field]: value } : task
      )
    );
  };

  // Add a New Workload Step
  const addWorkloadStep = () => {
    setWorkload((prevWorkload) => [
      ...prevWorkload,
      { step: prevWorkload.length + 1, description: "", status: "Pending" },
    ]);
  };

  // Remove a Workload Step
  const removeWorkloadStep = (index) => {
    setWorkload(
      (prevWorkload) =>
        prevWorkload
          .filter((_, i) => i !== index)
          .map((task, i) => ({ ...task, step: i + 1 })) // Reorder steps
    );
  };

  // Submit Workload Updates
  const handleWorkloadSubmit = async () => {
    if (!appointment?._id) return;

    try {
      await axios.put(
        `http://localhost:5000/api/appointments/${appointment._id}/workload`,
        { workload }
      );
      setOpenWorkloadModal(false);//close model here ..otherwise it will delay to get close if we put it bottom
      // Fetch updated appointment details
      const { data } = await axios.get(
        `http://localhost:5000/api/appointments/${appointment._id}`
      );

      updateAppointment(data); // Update parent state
      setWorkload(data.workload); // Sync local state
    
    } catch (error) {
      console.error("Error updating workload:", error);
    }
  };

  return (
    <>
      <Button
        variant="contained"
        color="secondary"
        onClick={handleOpenWorkload}
      >
        {btn_name}
      </Button>

      <Modal open={openWorkloadModal} onClose={handleCloseModals}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 500,
            bgcolor: "white",
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
          }}
        >
          <Typography variant="h6" gutterBottom>
            Workload for {appointment?.vehicleNumber}
          </Typography>

          {workload.map((task, index) => (
            <Box
              key={index}
              sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}
            >
              <Typography variant="body1" sx={{ width: 30 }}>
                {task.step}.
              </Typography>
              <TextField
                label="Description"
                variant="outlined"
                size="small"
                fullWidth
                value={task.description}
                onChange={(e) =>
                  handleWorkloadChange(index, "description", e.target.value)
                }
              />
              <IconButton
                color="error"
                onClick={() => removeWorkloadStep(index)}
              >
                <Delete />
              </IconButton>
            </Box>
          ))}

          <Button
            startIcon={<Add />}
            variant="contained"
            color="primary"
            fullWidth
            onClick={addWorkloadStep}
            sx={{ mt: 2 }}
          >
            Add Step
          </Button>

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: 2,
            }}
          >
            <Button
              variant="contained"
              color="success"
              onClick={handleWorkloadSubmit}
              sx={{ width: "48%" }}
            >
              Submit
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={handleCloseModals}
              sx={{ width: "48%" }}
            >
              Cancel
            </Button>
          </Box>
        </Box>
      </Modal>
    </>
  );
};

export default WorkloadManager;

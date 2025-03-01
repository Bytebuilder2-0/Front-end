import React, { useState, useEffect } from "react";
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

const WorkloadManager = ({ appointment, updateAppointment }) => {
  const [openWorkloadModal, setOpenWorkloadModal] = useState(false);
  const [workload, setWorkload] = useState(appointment?.workload || []);

  // Fetch the latest workload when the modal is opened
  useEffect(() => {
    if (openWorkloadModal && appointment?._id) {
      // Fetch the latest workload from the backend
      axios
        .get(
          `http://localhost:5000/api/appointments/${appointment._id}/workload`
        )
        .then((response) => {
          setWorkload(response.data.workload); // Set the latest workload
        })
        .catch((error) => {
          console.error("Error fetching workload:", error);
        });
    }
  }, [openWorkloadModal, appointment?._id]);

  // Open Modal
  const handleOpenWorkload = () => {
    if (!appointment?._id) {
      console.log("No appointment found");
      return; // Ensure appointment is present
    }

    console.log("Opening workload modal..."); // Debugging line to ensure button click is working
    // Fetch the latest workload from the backend
    axios
      .get(`http://localhost:5000/api/appointments/${appointment._id}/workload`)
      .then((response) => {
        setWorkload(response.data.workload); // Ensure fresh data is always fetched
        setOpenWorkloadModal(true); // Open modal only after data is updated
      })
      .catch((error) => {
        console.error("Error fetching workload:", error);
      });
  };

  // Close Modal
  const handleCloseModals = () => {
    setOpenWorkloadModal(false);
  };

  // Handle change in workload steps
  const handleWorkloadChange = (index, field, value) => {
    const updatedWorkload = [...workload];
    updatedWorkload[index][field] = value;
    setWorkload(updatedWorkload);
  };

  // Add new workload step
  const addWorkloadStep = () => {
    setWorkload([
      ...workload,
      { step: workload.length + 1, description: "", status: "Pending" },
    ]);
  };

  // Remove a workload step
  const removeWorkloadStep = (index) => {
    const updatedWorkload = workload.filter((_, i) => i !== index);
    updatedWorkload.forEach((task, i) => (task.step = i + 1)); // Reorder step numbers
    setWorkload(updatedWorkload);
  };

  // Submit workload
  const handleWorkloadSubmit = async () => {
    if (!appointment) return;

    try {
      // First, update the workload on the backend
      await axios.put(
        `http://localhost:5000/api/appointments/${appointment._id}/workload`,
        {
          workload,
        }
      );
      setOpenWorkloadModal(false);

      // Fetch the updated appointment details to get the latest workload
      const response = await axios.get(
        `http://localhost:5000/api/appointments/${appointment._id}`
      );

      // Update the parent component with the latest appointment data
      updateAppointment(response.data);

      // Update local state to reflect the latest workload
      setWorkload(response.data.workload);

      // Close the modal after the workload is successfully submitted
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
        Write Workload
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

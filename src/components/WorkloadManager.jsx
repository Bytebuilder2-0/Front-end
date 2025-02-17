import React, { useState } from "react";
import axios from "axios";
import { Button, Modal, Box, TextField, Typography } from "@mui/material";

const WorkloadManager = ({ appointment, fetchAppointments }) => {
  const [openWorkloadModal, setOpenWorkloadModal] = useState(false);
  const [workload, setWorkload] = useState(appointment?.workload || "");

  const handleOpenWorkload = () => {
    setOpenWorkloadModal(true);
  };

  const handleCloseModals = () => {
    setOpenWorkloadModal(false);
    setWorkload(appointment?.workload || "");
  };

  const handleWorkloadSubmit = () => {
    if (!appointment) return;

    axios
      .put(`http://localhost:5000/api/appointments/${appointment._id}/workload`, { workload })
      .then(() => {
        fetchAppointments(); // Refresh table after workload update
        handleCloseModals();
      })
      .catch((error) => {
        console.error("Error updating workload:", error);
      });
  };

  return (
    <>
      <Button variant="contained" color="secondary" onClick={handleOpenWorkload}>
        Write Workload
      </Button>

      <Modal open={openWorkloadModal} onClose={handleCloseModals}>
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
            Workload for {appointment?.vehicleNumber}
          </Typography>
          <TextField
            fullWidth
            label="Workload Details"
            multiline
            rows={4}
            value={workload}
            onChange={(e) => setWorkload(e.target.value)}
          />
          <Box sx={{ display: "flex", justifyContent: "space-between", marginTop: 2 }}>
            <Button variant="contained" color="primary" onClick={handleWorkloadSubmit} sx={{ width: "48%" }}>
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

export default WorkloadManager;

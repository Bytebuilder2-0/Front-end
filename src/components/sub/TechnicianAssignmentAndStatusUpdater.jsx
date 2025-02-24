import React, { useState, useEffect } from "react";
import axios from "axios";
import { Select, MenuItem, CircularProgress, Button, Grid } from "@mui/material";

const TechnicianAssignmentAndStatusUpdater = ({ appointment, updateAppointment }) => {
  const [technicians, setTechnicians] = useState([]);
  const [selectedTechnician, setSelectedTechnician] = useState(appointment?.tech || "");
  const [status, setStatus] = useState(appointment.status);
  const [techAssigned, setTechAssigned] = useState(Boolean(appointment.tech));
  const [loading, setLoading] = useState(false);

  // Fetch technician list when the component mounts
  useEffect(() => {
    async function fetchTechnicians() {
      try {
        const response = await axios.get("http://localhost:5000/api/technicians");
        setTechnicians(response.data);
      } catch (error) {
        console.error("Error fetching technicians:", error);
      }
    }
    fetchTechnicians();
  }, []);

  // Fetch the appointment status when the component mounts


  const handleTechnicianChange = async (event) => {
    const technicianId = event.target.value;
    setSelectedTechnician(technicianId);

    try {
      setLoading(true);
      await axios.put(`http://localhost:5000/api/appointments/${appointment._id}/assign`, {
        technicianId,
      });

      setTechAssigned(Boolean(technicianId));
      updateAppointment({ ...appointment, tech: technicianId });
    } catch (error) {
      console.error("Error assigning technician:", error);
    } finally {
      setLoading(false);
    }
  };

  // Update status to "Waiting for Technician Confirmation"
  const handleStatusUpdate = async () => {
    if (!techAssigned || status === "Waiting for Technician Confirmation" || loading) return;

    try {
      setLoading(true);
      await axios.put(
        `http://localhost:5000/api/appointments/${appointment._id}/statusUpdate`,
        { status: "Waiting for Technician Confirmation" }
      );

      setStatus("Waiting for Technician Confirmation");
      updateAppointment({ ...appointment, status: "Waiting for Technician Confirmation" });
    } catch (error) {
      console.error("Error updating status:", error);
    } finally {
      setLoading(false);
    }
  };


  return (
    <Grid container spacing={2}>
      {/* Technician Selection */}
      <Grid item xs={12} sm={6} display="flex" alignItems="center">
        <Select value={selectedTechnician} onChange={handleTechnicianChange} displayEmpty fullWidth   disabled={status === "Waiting for Technician Confirmation"}>
          <MenuItem value="">Select Technician</MenuItem>
          {loading ? (
            <MenuItem disabled>
              <CircularProgress size={24} />
            </MenuItem>
          ) : technicians.length > 0 ? (
            technicians.map((tech) => (
              <MenuItem key={tech._id} value={tech._id}>
                {tech.employee_id} - {tech.technician_id}
              </MenuItem>
            ))
          ) : (
            <MenuItem disabled>No Technicians Available</MenuItem>
          )}
        </Select>
      </Grid>

      {/* Status Update Button */}
      <Grid item xs={12} sm={6} display="flex" alignItems="center">
        <Button
          variant="contained"
          color="success"
          onClick={handleStatusUpdate}
          disabled={!techAssigned || status === "Waiting for Technician Confirmation" || loading}
          fullWidth
        >
          {loading ? (
            <CircularProgress size={24} color="inherit" />
          ) : status === "Waiting for Technician Confirmation" ? (
            "Pending"
          ) : (
            "Confirm"
          )}
        </Button>
      </Grid>
    </Grid>
  );
};

export default TechnicianAssignmentAndStatusUpdater;

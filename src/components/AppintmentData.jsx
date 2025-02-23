import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Typography, Container, TextField, Box
} from "@mui/material";
import WorkloadManager from "./WorkloadManager";
import IssueViewer from "./IssueView";
import TechnicianAssignmentAndStatusUpdater from "./TechnicianAssignmentAndStatusUpdater";

// API Base URL
const API_BASE_URL = "http://localhost:5000/api/appointments";

// Fetch all appointments
const fetchAppointments = async () => {
  try {
    const response = await axios.get(API_BASE_URL);
    return response.data.reverse(); // Latest first
  } catch (error) {
    console.error("Error fetching appointments:", error);
    return [];
  }
};

// Update an appointment


// Main Appointment Data Component
function AppointmentData() {
  const [appointments, setAppointments] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getAppointments = async () => {
      setLoading(true);
      const data = await fetchAppointments();
      setAppointments(data);
      setLoading(false);
    };
    getAppointments();
  }, []);

  const updateAppointmentInState = (updatedAppointment) => {
    setAppointments((prevAppointments) =>
      prevAppointments.map((appt) =>
        appt._id === updatedAppointment._id ? updatedAppointment : appt
      )
    );
  };

  const filteredAppointments = appointments.filter((appointment) =>
    (appointment.vehicleId || "").toString().toLowerCase().includes(searchTerm.toLowerCase()) &&
    (!appointment.status || appointment.status.trim() !== "Accepted")
  );
  

  return (
    <Container>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h5" gutterBottom>Appointments</Typography>
        <TextField
          label="Search by Vehicle ID"
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </Box>

      <TableContainer component={Paper} elevation={3}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>Vehicle ID</strong></TableCell>
              <TableCell><strong>Vehicle Number</strong></TableCell>
              <TableCell><strong>Model</strong></TableCell>
              <TableCell><strong>Issue</strong></TableCell>
              <TableCell><strong>Write Workload</strong></TableCell>
              <TableCell><strong>Assign Technician</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} align="center">Loading...</TableCell>
              </TableRow>
            ) : filteredAppointments.length > 0 ? (
              filteredAppointments.map((appointment) => (
                <TableRow key={appointment._id}>
                  <TableCell>{appointment.vehicleId}</TableCell>
                  <TableCell>{appointment.vehicleNumber}</TableCell>
                  <TableCell>{appointment.model}</TableCell>
                  <TableCell><IssueViewer issue={appointment.issue} /></TableCell>
                  <TableCell>
                    <WorkloadManager appointment={appointment} updateAppointment={updateAppointmentInState} />
                  </TableCell>
                  <TableCell>
                    <TechnicianAssignmentAndStatusUpdater
                      appointment={appointment}
                      updateAppointment={updateAppointmentInState}
                    />
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} align="center">No matching appointments</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
}

export default AppointmentData;

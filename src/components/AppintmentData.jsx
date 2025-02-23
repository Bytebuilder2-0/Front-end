import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Typography, Container
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
    return response.data.reverse().filter((x) => x.status === "Accepted" || x.status === "Waiting for Technician Confirmation"); // Latest first
  } catch (error) {
    console.error("Error fetching appointments:", error);
    return [];
  }
};



// Main Appointment Data Component
function AppointmentData() {
  const [appointments, setAppointments] = useState([]);

  // Fetch appointments and set state
  const fetchAppointments = async () => {
    try {
      const appointmentRes = await axios.get("http://localhost:5000/api/appointments");
      console.log("Fetched appointments: ", appointmentRes.data); // Log the data

      // Reverse appointments to show the latest first
      setAppointments(appointmentRes.data.reverse());  
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchAppointments(); // Fetch appointments initially when the component mounts
  }, []); // ✅ Empty dependency array to fetch only once

  // Function to update the appointment in the parent component
  const updateAppointment = (updatedAppointment) => {
    setAppointments((prevAppointments) =>
      prevAppointments.map((appt) =>
        appt._id === updatedAppointment._id ? updatedAppointment : appt
      )
    );
  };

  const filteredAppointments = appointments.filter((appointment) =>
    (appointment.vehicleId || "").toString().toLowerCase().includes(searchTerm.toLowerCase())
  );
  

  return (
    <Container>
      <Typography variant="h5" gutterBottom>
        Appointments
      </Typography>
      <TableContainer component={Paper} elevation={3}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>Vehicle ID</strong></TableCell>
              <TableCell><strong>Vehicle Number</strong></TableCell>
              <TableCell><strong>Model</strong></TableCell>
              <TableCell><strong>Issue</strong></TableCell>
              <TableCell><strong>Workload</strong></TableCell>
              <TableCell><strong>Technician</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredAppointments.length > 0 ? (
              filteredAppointments.map((appointment) => (
                <TableRow key={appointment._id}>
                  <TableCell>{appointment.vehicleId}</TableCell>
                  <TableCell>{appointment.vehicleNumber}</TableCell>
                  <TableCell>{appointment.model}</TableCell>
                  <TableCell><IssueViewer issue={appointment.issue} /></TableCell>
                  <TableCell>
                    <WorkloadManager
                      appointment={appointment}
                      fetchAppointments={fetchAppointments}
                    />
                  </TableCell>
                  <TableCell>
                    <TechnicianAssignmentAndStatusUpdater
                      appointment={appointment}
                      updateAppointment={updateAppointment} // Pass the function to update the appointment
                    />
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} align="center">No appointments available</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
}

export default AppointmentData;

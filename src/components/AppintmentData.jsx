import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Typography, Container
} from "@mui/material";
import WorkloadManager from "./WorkloadManager";
import IssueViewer from "./IssueView";
import TechnicianAssignmentAndStatusUpdater from "./TechnicianAssignmentAndStatusUpdater";

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

  // Filter out appointments with the status "Accepted"
  const filteredAppointments = appointments.filter((appointment) => {
    // Check if status exists and is not "Accepted" (trim spaces)
    if (!appointment.status) {
      console.log("Missing status for appointment: ", appointment);
      return true; // If no status is present, include the appointment
    }
    console.log("Appointment status: ", appointment.status); // Log status value
    return appointment.status.trim() !== "Accepted";
  });

  console.log("Filtered appointments: ", filteredAppointments); // Log filtered appointments

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

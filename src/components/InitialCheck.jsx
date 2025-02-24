import React, { useEffect, useState } from "react";
import axios from "axios";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from "@mui/material";
import IssueViewer from "./sub/IssueView";

// API Base URL
const API_BASE_URL = "http://localhost:5000/api/appointments";

// Fetch only "Pending" appointments
const fetchAppointments = async () => {
  try {
    const response = await axios.get(API_BASE_URL);
    return response.data
      .reverse()
      .filter((appt) => appt.status === "Pending"); // Fetch only pending ones
  } catch (error) {
    console.error("Error fetching appointments:", error);
    return [];
  }
};

// Update appointment status and remove from table
const updateAppointmentStatus = async (appointmentId, newStatus, setAppointments) => {
  try {
    await axios.put(`${API_BASE_URL}/${appointmentId}/statusUpdate`, { status: newStatus });

    setAppointments((prevAppointments) =>
      prevAppointments.filter((appt) => appt._id !== appointmentId) // Remove updated appointment
    );
  } catch (error) {
    console.error(`Error updating appointment status to ${newStatus}:`, error);
  }
};

const InitialCheck = () => {
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    const getAppointments = async () => {
      const data = await fetchAppointments();
      setAppointments(data);
    };
    getAppointments();
  }, []);

  return (
    <TableContainer component={Paper} sx={{ marginTop: 2 }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell><strong>Vehicle ID</strong></TableCell>
            <TableCell><strong>Model</strong></TableCell>
            <TableCell><strong>Issue</strong></TableCell>
            <TableCell><strong>Actions</strong></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {appointments.map((appointment) => (
            <TableRow key={appointment._id}>
              <TableCell>{appointment.vehicleId}</TableCell>
              <TableCell>{appointment.model}</TableCell>
              <TableCell><IssueViewer issue={appointment.issue} /></TableCell>
              <TableCell>
                <Button
                  variant="contained"
                  color="success"
                  sx={{ marginRight: 1 }}
                  onClick={() => updateAppointmentStatus(appointment._id, "Accepted", setAppointments)}
                >
                  Accept
                </Button>
                <Button
                  variant="contained"
                  color="error"
                  onClick={() => updateAppointmentStatus(appointment._id, "Rejected", setAppointments)}
                >
                  Reject
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default InitialCheck;

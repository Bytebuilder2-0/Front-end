import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,Container,Box,Typography,TextField
} from "@mui/material";
import IssueViewer from "./sub/IssueView";

// API Base URL
const API_BASE_URL = "http://localhost:5000/api/appointments";

// Fetch only "Pending" appointments
const fetchAppointments = async () => {
  try {
    const response = await axios.get(API_BASE_URL);
    return response.data.reverse().filter((appt) => appt.status === "Pending"); // Fetch only pending ones
  } catch (error) {
    console.error("Error fetching appointments:", error);
    return [];
  }
};

// Update appointment status and remove from table
const updateAppointmentStatus = async (
  appointmentId,
  newStatus,
  setAppointments
) => {
  try {
    await axios.put(`${API_BASE_URL}/${appointmentId}/statusUpdate`, {
      status: newStatus,
    });

    setAppointments(
      (prevAppointments) =>
        prevAppointments.filter((appt) => appt._id !== appointmentId) // Remove updated appointment
    );
  } catch (error) {
    console.error(`Error updating appointment status to ${newStatus}:`, error);
  }
};

const InitialCheck = () => {
  const [appointments, setAppointments] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");



  useEffect(() => {
    const getAppointments = async () => {
      const data = await fetchAppointments();
      setAppointments(data);
    };
    getAppointments();
  }, []);

  const filteredAppointments = appointments.filter((appointment) =>
    (appointment.vehicleId || "")
      .toString()
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );


  return (
    <Container>
    <Box
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      mb={2}
    >
      <Typography variant="h5" gutterBottom>
        Home
      </Typography>
        <TextField
                label="Search by Vehicle ID"
                variant="outlined"
                size="small"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
    </Box>
    <TableContainer component={Paper} sx={{ marginTop: 2 }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>
              <strong>Vehicle ID</strong>
            </TableCell>
            <TableCell>
              <strong>Model</strong>
            </TableCell>
            <TableCell>
              <strong>Issue</strong>
            </TableCell>
            <TableCell>
              <strong>Exp.Delivery</strong>
            </TableCell>
            <TableCell>
              <strong>Actions</strong>
            </TableCell>
            <TableCell>
              <strong>Status</strong>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
  {filteredAppointments.length > 0 ? (
    filteredAppointments.map((appointment) => (
      <TableRow key={appointment._id}>
        <TableCell>{appointment.vehicleId}</TableCell>
        <TableCell>{appointment.model}</TableCell>
        <TableCell>
          <IssueViewer issue={appointment.issue} />
        </TableCell>
        <TableCell>
          {new Date(appointment.expectedDeliveryDate).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
        </TableCell>

        {/* 🔵 Status with color */}
        <TableCell>
          <span
            style={{
              color:
                appointment.status === "Pending"
                  ? "orange"
                  : appointment.status === "Confirmed"
                  ? "green"
                  : appointment.status === "Cancelled" || appointment.status === "Reject1"
                  ? "red"
                  : "gray",
              fontWeight: 500,
              textTransform: "capitalize",
            }}
          >
            {appointment.status}
          </span>
        </TableCell>

    
        <TableCell>
          <Button
            variant="contained"
            color="success"
            sx={{ marginRight: 1 }}
            onClick={() =>
              updateAppointmentStatus(appointment._id, "Confirmed", setAppointments)
            }
          >
            Accept
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={() =>
              updateAppointmentStatus(appointment._id, "Reject1", setAppointments)
            }
          >
            Reject
          </Button>
        </TableCell>
      </TableRow>
    ))
  ) : (
    <TableRow>
      <TableCell colSpan={6} align="center">
        No matching appointments
      </TableCell>
    </TableRow>
  )}
</TableBody>

      </Table>
    </TableContainer>
    </Container>
  );
};

export default InitialCheck;

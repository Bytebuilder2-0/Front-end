import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Container,
  Button,
  Box,
  Typography,
  TextField,
} from "@mui/material";

const API_BASE_URL = "http://localhost:5000/api/appointments";

function TAssignedWork() {
  const [appointments, setAppointments] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  // Fetch appointments from backend
  useEffect(() => {
    axios
      .get(API_BASE_URL)
      .then((response) => {
        setAppointments(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching appointments:", error);
        setLoading(false);
      });
  }, []);

  // Function to confirm appointment
  const handleConfirm = async (appointmentId) => {
    const isConfirmed = window.confirm(
      "Are you sure you want to confirm this appointment?"
    );
    if (!isConfirmed) return; // If user cancels, do nothing

    try {
      await axios.put(`${API_BASE_URL}/${appointmentId}/statusUpdate`, {
        status: "Confirmed",
      });

      // Update UI instantly
      setAppointments((prevAppointments) =>
        prevAppointments.map((appointment) =>
          appointment._id === appointmentId
            ? { ...appointment, status: "Confirmed" }
            : appointment
        )
      );

      alert("✅ Appointment Confirmed!");
    } catch (error) {
      console.error("Error confirming appointment:", error);
      alert("❌ Failed to confirm appointment.");
    }
  };

  // Function to decline appointment
  // Frontend (React)
  const handleDecline = async (appointmentId) => {
    const isConfirmed = window.confirm(
      "Are you sure you want to decline this appointment?"
    );
    if (!isConfirmed) return; // If user cancels, do nothing

    try {
      // Ensure the route and data being sent match the backend
      await axios.put(`${API_BASE_URL}/${appointmentId}/statusUpdate`, {
        status: "Reject1",
      });

      // Update UI instantly
      setAppointments((prevAppointments) =>
        prevAppointments.map((appointment) =>
          appointment._id === appointmentId
            ? { ...appointment, status: "Reject1" } // Match the status value with the backend
            : appointment
        )
      );

      alert("❌ Appointment Declined!");
    } catch (error) {
      console.error("Error declining appointment:", error);
      alert("❌ Failed to decline appointment.");
    }
  };

  const filteredAppointments = appointments.filter((appointment) =>
    (appointment.vehicleId || "")
      .toString()
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  return (
    <Container>
      <h2>Assigned Works</h2>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Typography variant="h5" gutterBottom>
          Appointments
        </Typography>
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
              <TableCell>
                <strong>Vehicle ID</strong>
              </TableCell>
              <TableCell>
                <strong>Vehicle Number</strong>
              </TableCell>
              <TableCell>
                <strong>Appointment Date</strong>
              </TableCell>
              <TableCell>
                <strong>Work Load</strong>
              </TableCell>
              <TableCell>
                <strong>Status</strong>
              </TableCell>
              <TableCell>
                <strong>Actions</strong>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  Loading...
                </TableCell>
              </TableRow>
            ) : filteredAppointments.length > 0 ? (
              // Filter appointments to show only "Pending", "Reject1", or "Confirmed"
              filteredAppointments
                .filter((appointment) =>
                  ["Waiting for Technician Confirmation", "Reject1", "Confirmed"].includes(
                    appointment.status
                  )
                )
                .map((appointment) => (
                  <TableRow key={appointment._id}>
                    <TableCell>{appointment.vehicleId}</TableCell>
                    <TableCell>{appointment.vehicleNumber}</TableCell>
                    <TableCell>
                      {new Date(
                        appointment.appointmentDate
                      ).toLocaleDateString()}
                    </TableCell>
                    <TableCell>{appointment.workLoad}</TableCell>
                    <TableCell>
                      {appointment.status === "Confirmed" ? (
                        <span style={{ color: "green", fontWeight: "bold" }}>
                          Confirmed
                        </span>
                      ) : appointment.status === "Reject1" ? (
                        <span style={{ color: "red", fontWeight: "bold" }}>
                          Declined
                        </span>
                      ) : (
                        <span style={{ color: "orange", fontWeight: "bold" }}>
                          Waiting
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      {appointment.status === "Confirmed" ? (
                        <Button variant="contained" disabled>
                          {appointment.status}
                        </Button>
                      ) : (
                          <Button
                            variant="contained"
                            color="primary"
                            onClick={() => handleConfirm(appointment._id)}
                            style={{ marginRight: "10px" }}
                          >
                            Confirm
                          </Button>                      
                      )}
                    </TableCell>
                    <TableCell>
                      {appointment.status === "Reject1" ? (
                        <Button variant="contained" disabled>
                          Declined
                        </Button>
                      ) : (
                          <Button
                            variant="contained"
                            color="secondary"
                            onClick={() => handleDecline(appointment._id)}
                            style={{ marginRight: "10px" }}
                          >
                            Decline
                          </Button>                      
                      )}
                    </TableCell>
                  </TableRow>
                ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  No appointments found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
}

export default TAssignedWork;

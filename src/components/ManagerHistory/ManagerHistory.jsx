import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Container, Box, Typography, TextField, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow, Paper,
  IconButton, Tooltip
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import WhatsAppButton from "../sub/WhatsAppButton";
import DeatailsViewer from "../ManagerDashboard/viewDeatails"; // Full appointment details modal

const API_URL = "http://localhost:5000/api/appointments";

const ApointmentChecking = () => {
  const [appointments, setAppointments] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const res = await axios.get(API_URL);
        setAppointments(
          res.data.reverse().filter((appt) => appt.status === "Checking")
        );
      } catch (error) {
        console.error("Error fetching appointments:", error);
      }
    };
    fetchAppointments();
  }, []);

  const updateStatus = async (appointmentId, newStatus) => {
    try {
      await axios.put(`${API_URL}/${appointmentId}/statusUpdate`, { status: newStatus });
      setAppointments((prev) => prev.filter((appt) => appt._id !== appointmentId));
    } catch (error) {
      console.error("Error updating appointment:", error);
    }
  };

  const filtered = appointments.filter((appt) =>
    (appt.vehicleId || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={6} sx={{ p: 3, borderRadius: 4 }}>
        {/* Header */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h5" sx={{ fontWeight: "bold", color: "#1976d2" }}>
            Manage Appointment Checking
          </Typography>
          <TextField
            label="Search by Vehicle ID"
            variant="outlined"
            size="small"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </Box>

        {/* Table */}
        <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell align="center"><strong>Vehicle ID</strong></TableCell>
                <TableCell align="center"><strong>Model</strong></TableCell>
                <TableCell align="center"><strong>Details</strong></TableCell>
                <TableCell align="center"><strong>Contact</strong></TableCell>
                <TableCell align="center"><strong>Status</strong></TableCell>
                <TableCell align="center"><strong>Actions</strong></TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {filtered.length > 0 ? (
                filtered.map((appointment) => (
                  <TableRow key={appointment._id}>
                    <TableCell align="center">{appointment.vehicleId}</TableCell>
                    <TableCell align="center">{appointment.model}</TableCell>
                    <TableCell align="center">
                      <DeatailsViewer appointment={appointment} />
                    </TableCell>
                    <TableCell align="center">
                      <WhatsAppButton phone={appointment.contactNumber} />
                    </TableCell>
                    <TableCell align="center">
                      <Typography
                        sx={{
                          color:
                            appointment.status === "Checking" ? "orange" :
                            appointment.status === "Pending" ? "green" :
                            ["Cancelled", "Reject1"].includes(appointment.status) ? "red" : "gray",
                          fontWeight: 600,
                          textTransform: "capitalize",
                          fontSize: "0.9rem",
                        }}
                      >
                        {appointment.status}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Tooltip title="Accept">
                        <IconButton
                          color="success"
                          onClick={() => updateStatus(appointment._id, "Pending")}
                        >
                          <CheckCircleIcon sx={{ fontSize: 26 }} />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Reject">
                        <IconButton
                          color="error"
                          onClick={() => updateStatus(appointment._id, "Reject1")}
                        >
                          <CancelIcon sx={{ fontSize: 26 }} />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 5 }}>
                    <Typography variant="h6" color="textSecondary">
                      No appointments found
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Container>
  );
};

export default ApointmentChecking;

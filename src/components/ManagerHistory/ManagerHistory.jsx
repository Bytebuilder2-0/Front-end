import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Container,
  Box,
  Typography,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import WhatsAppButton from "../sub/WhatsAppButton";
import DeatailsViewer from "../ManagerDashboard/viewDeatails";
import { jwtDecode } from "jwt-decode";

const API_URL = "http://localhost:5000/api/appointments";

const token = localStorage.getItem("token");

let decoded = null;
if (token) {
  try {
    decoded = jwtDecode(token);
  } catch (err) {
    console.error("Invalid token:", err);
  }
}

const authConfig = {
  headers: {
    Authorization: `Bearer ${token}`,
  },
};

const ApointmentHistory = () => {
  const [appointments, setAppointments] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const res = await axios.get(API_URL, authConfig);
        // Filter for completed appointments (adjust statuses as needed)
        const completedAppointments = res.data
          .reverse()
          .filter((appt) =>
            ["Paid", "Completed", "Finished"].includes(appt.status)
          );
        setAppointments(completedAppointments);
      } catch (error) {
        console.error("Error fetching appointments:", error);
      }
    };
    fetchAppointments();
  }, []);

  const filteredAppointments = appointments.filter((appt) =>
    String(appt.vehicleId || "")
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={6} sx={{ p: 3, borderRadius: "16px" }}>
        {/* Header */}
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
        >
          <Typography variant="h5" fontWeight="bold" color="#1976d2">
            Appointment History
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
                <TableCell align="center">
                  <strong>Vehicle ID</strong>
                </TableCell>
                <TableCell align="center">
                  <strong>Model</strong>
                </TableCell>
                <TableCell align="center">
                  <strong>Details</strong>
                </TableCell>
                <TableCell align="center">
                  <strong>Contact</strong>
                </TableCell>
                <TableCell align="center">
                  <strong>Status</strong>
                </TableCell>
                <TableCell align="center">
                  <strong>Invoice Details</strong>
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {filteredAppointments.length > 0 ? (
                filteredAppointments.map((appointment) => (
                  <TableRow key={appointment._id}>
                    <TableCell align="center">
                      {appointment.vehicleId}
                    </TableCell>
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
                            appointment.status === "Paid" ||
                            appointment.status === "Completed"
                              ? "green"
                              : ["Cancelled", "Rejected"].includes(
                                  appointment.status
                                )
                              ? "red"
                              : "gray",
                          fontWeight: 600,
                          textTransform: "capitalize",
                          fontSize: "0.9rem",
                        }}
                      >
                        {appointment.status}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Typography variant="body2" color="textSecondary">
                        {appointment.invoiceId || "No invoice"}
                      </Typography>
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

export default ApointmentHistory;

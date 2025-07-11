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
import DeatailsViewer from "./viewDeatails";
import WhatsAppButton from "../sub/WhatsAppButton";
import { jwtDecode } from "jwt-decode";

const API_BASE_URL = "http://localhost:5000/api/appointments";
const token = localStorage.getItem("token");

// Status configuration object for better maintainability
const STATUS_CONFIG = {
  Pending: { color: "orange", label: "Pending" },
  Cancelled: { color: "red", label: "Cancelled" },
  Confirmed: { color: "green", label: "Confirmed" },
  Reject1: { color: "red", label: "Rejected" },
  Reject2: { color: "red", label: "Rejected" },
  "Waiting for Technician Confirmation": {
    color: "#fb8c00",
    label: "Waiting for Tech",
  },
  Accepted: { color: "#1976d2", label: "Accepted" },
  InProgress: { color: "#fb8c00", label: "In Progress" },
  "Task Done": { color: "green", label: "Completed" },
};

const allowedStatuses = Object.keys(STATUS_CONFIG);

const authConfig = {
  headers: {
    Authorization: `Bearer ${token}`,
  },
};

const CheckStatus = () => {
  const [appointments, setAppointments] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const res = await axios.get(API_BASE_URL, authConfig);
        const filtered = res.data
          .filter((appt) => allowedStatuses.includes(appt.status))
          .reverse();
        setAppointments(filtered);
      } catch (err) {
        console.error("Error fetching appointments:", err);
        setError("Failed to load appointments. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  const filteredAppointments = appointments.filter((appointment) =>
    String(appointment.vehicleId || "")
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const getStatusDisplay = (status) => {
    const config = STATUS_CONFIG[status] || { color: "gray", label: status };
    return (
      <Typography
        sx={{
          color: config.color,
          fontWeight: 600,
          fontSize: "0.9rem",
        }}
      >
        {config.label}
      </Typography>
    );
  };

  if (isLoading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Typography>Loading appointments...</Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Typography color="error">{error}</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={6} sx={{ p: 3, borderRadius: "16px" }}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
        >
          <Typography variant="h5" fontWeight="bold" color="#1976d2">
            Check Appointment Status
          </Typography>

          <TextField
            label="Search by Vehicle ID"
            variant="outlined"
            size="small"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </Box>

        <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
          <Table>
            <TableHead>
              <TableRow>
                {["Vehicle ID", "Model", "Details", "Contact", "Status"].map(
                  (head) => (
                    <TableCell align="center" key={head}>
                      <strong>{head}</strong>
                    </TableCell>
                  )
                )}
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
                      {getStatusDisplay(appointment.status)}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 5 }}>
                    <Typography variant="h6" color="textSecondary">
                      {searchTerm
                        ? "No matching appointments found"
                        : "No appointments available"}
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

export default CheckStatus;

import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Container,
  Box,
  Typography,
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
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
  //Pending: { color: "orange", label: "Pending" },
  Confirmed: { color: "#736953ff", label: "Confirmed" },
  //Reject1: { color: "#28c930ff", label: "Rejected" },
  Reject2: { color: "#d08b09ff", label: "Tech Rejected" },
  "Waiting for Technician Confirmation": {
    color: "#765834ff",
    label: "Waiting for Tech",
  },
  Accepted: { color: "#1976d2", label: "Accepted" },
  InProgress: { color: "#6e0bccff", label: "In Progress" },
  "Task Done": { color: "#129b02ff", label: "Completed" },
};

const allowedStatuses = Object.keys(STATUS_CONFIG);

const authConfig = {
  headers: {
    Authorization: `Bearer ${token}`,
  },
};

const CheckStatus = () => {
  const [appointments, setAppointments] = useState([]);
  const [searchTerm, setSearchTerm] = useState(""); // For vehicle ID search
  const [selectedStatus, setSelectedStatus] = useState(""); // For filtering by status
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const res = await axios.get(API_BASE_URL, authConfig);
        const filtered = res.data
          .filter((appt) => allowedStatuses.includes(appt.status)) // Initial filter by allowed statuses
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

  // Filter appointments based on search term (vehicle ID) and selected status
  const filteredAppointments = appointments.filter((appointment) => {
    const matchesVehicle = String(appointment.vehicleId || "")
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    const matchesStatus =
      selectedStatus === "" || appointment.status === selectedStatus;

    return matchesVehicle && matchesStatus;
  });

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

          <Box display="flex" alignItems="center">
            <TextField
              label="Search by Vehicle ID"
              variant="outlined"
              size="small"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              sx={{ mr: 2 }}
            />

            <FormControl size="small">
              <InputLabel>Status</InputLabel>
              <Select
                label="Status"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                sx={{ minWidth: 120 }}
              >
                <MenuItem value="">All</MenuItem>
                {allowedStatuses.map((status) => (
                  <MenuItem key={status} value={status}>
                    {STATUS_CONFIG[status].label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </Box>

        <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
          <Table>
            <TableHead>
              <TableRow>
                {[
                  "Vehicle ID",
                  "Expected Delivery Date",
                  "Details",
                  "Contact",
                  "Status",
                ].map((head) => (
                  <TableCell align="center" key={head}>
                    <strong>{head}</strong>
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>

            <TableBody>
              {filteredAppointments.length > 0 ? (
                filteredAppointments.map((appointment) => (
                  <TableRow key={appointment._id}>
                    <TableCell align="center">
                      {appointment.vehicleId}
                    </TableCell>
                    <TableCell align="center">
                      {new Date(
                        appointment.expectedDeliveryDate
                      ).toLocaleDateString()}
                    </TableCell>
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
                      {searchTerm || selectedStatus
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

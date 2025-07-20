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

const API_BASE_URL = "http://localhost:5000/api/appointments/";
const token = localStorage.getItem("token");

// Status configuration object for better maintainability
const STATUS_CONFIG = {
  Confirmed: { color: "#736953ff", label: "Confirmed" },
  Reject2: { color: "#d08b09ff", label: "Tech Rejected" },
  "Waiting for Technician Confirmation": {
    color: "#765834ff",
    label: "Waiting for Tech",
  },
  Accepted: { color: "#1976d2", label: "Accepted" },
  InProgress: { color: "#6e0bccff", label: "In Progress" },
  "Task Done": { color: "#129b02ff", label: "Task Done" },
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
  const [vehicleNumberSearch, setVehicleNumberSearch] = useState(""); // For vehicle number search
  const [selectedStatus, setSelectedStatus] = useState(""); // For filtering by status
  const [expectedDateFilter, setExpectedDateFilter] = useState(""); // For expected delivery date filter
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

  // Function to handle date input format and apply filtering
  const getDateFilterType = (dateInput) => {
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/; // Full Date (YYYY-MM-DD)
    const monthRegex = /^\d{2}$/; // Month (MM)
    const dayRegex = /^\d{2}$/; // Day (DD)

    if (dateRegex.test(dateInput)) {
      return "full";
    } else if (monthRegex.test(dateInput)) {
      return "month";
    } else if (dayRegex.test(dateInput)) {
      return "day";
    } else {
      return "none";
    }
  };

  // Filter appointments based on all filters
  const filteredAppointments = appointments.filter((appointment) => {
    // Vehicle ID filter
    const matchesVehicleId = String(appointment.vehicleId || "")
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    // Vehicle Number filter
    const matchesVehicleNumber = String(appointment.vehicleNumber || "")
      .toLowerCase()
      .includes(vehicleNumberSearch.toLowerCase());

    // Status filter
    const matchesStatus =
      selectedStatus === "" || appointment.status === selectedStatus;

    // Expected Date filter
    const dateFilterType = getDateFilterType(expectedDateFilter);
    let matchesExpectedDate = true;

    if (dateFilterType === "full") {
      matchesExpectedDate =
        new Date(appointment.expectedDeliveryDate)
          .toISOString()
          .split("T")[0] === expectedDateFilter;
    } else if (dateFilterType === "month") {
      const appointmentMonth = new Date(appointment.expectedDeliveryDate)
        .toISOString()
        .slice(5, 7);
      matchesExpectedDate = appointmentMonth === expectedDateFilter;
    } else if (dateFilterType === "day") {
      const appointmentDay = new Date(appointment.expectedDeliveryDate)
        .toISOString()
        .slice(8, 10);
      matchesExpectedDate = appointmentDay === expectedDateFilter;
    }

    return (
      matchesVehicleId &&
      matchesVehicleNumber &&
      matchesStatus &&
      matchesExpectedDate
    );
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
    return <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}></Container>;
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Typography color="error">{error}</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 1, mb: 1 }}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Typography variant="h5" fontWeight="bold" color="#1976d2"></Typography>

        <Box display="flex" alignItems="center" gap={2}>
          <TextField
            label="Search by Vehicle ID"
            variant="outlined"
            size="small"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ width: 180 }}
          />

          <TextField
            label="Search by Vehicle Number"
            variant="outlined"
            size="small"
            value={vehicleNumberSearch}
            onChange={(e) => setVehicleNumberSearch(e.target.value)}
            sx={{ width: 180 }}
          />

          <FormControl size="small" sx={{ width: 180 }}>
            <InputLabel>Filter by Status</InputLabel>
            <Select
              label="Filter by Status"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              <MenuItem value="">All Statuses</MenuItem>
              {allowedStatuses.map((status) => (
                <MenuItem key={status} value={status}>
                  {STATUS_CONFIG[status].label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            label="Filter by Expected Date"
            type="date"
            variant="outlined"
            size="small"
            value={expectedDateFilter}
            onChange={(e) => setExpectedDateFilter(e.target.value)}
            InputLabelProps={{ shrink: true }}
            sx={{ width: 180 }}
          />
        </Box>
      </Box>

      <TableContainer
        component={Paper}
        sx={{
          marginTop: 2,
          overflow: "auto",
          maxHeight: 600,
          borderRadius: 2,
          boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.05)",
        }}
      >
        <Table stickyHeader>
          <TableHead>
            <TableRow
              sx={{
                "& th": {
                  fontWeight: "bold",
                  backgroundColor: "#f5f5f5",
                  textAlign: "center",
                },
              }}
            >
              <TableCell align="center">Vehicle ID</TableCell>
              <TableCell align="center">Vehicle Number</TableCell>
              <TableCell align="center">Expected Delivery Date</TableCell>
              <TableCell align="center">Details</TableCell>
              <TableCell align="center">Contact</TableCell>
              <TableCell align="center">Status</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {filteredAppointments.length > 0 ? (
              filteredAppointments.map((appointment) => (
                <TableRow
                  key={appointment._id}
                  sx={{
                    "&:nth-of-type(odd)": { backgroundColor: "#fafafa" },
                    "&:hover": { backgroundColor: "#e0e0e0" },
                  }}
                >
                  <TableCell align="center">{appointment.vehicleId}</TableCell>
                  <TableCell align="center">
                    {appointment.vehicleNumber}
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
                    <WhatsAppButton phone={appointment.contactNumber} VNumber={ appointment.vehicleNumber} />
                  </TableCell>
                  <TableCell align="center">
                    {getStatusDisplay(appointment.status)}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 5 }}>
                  <Typography variant="h6" color="textSecondary">
                    {searchTerm || selectedStatus || expectedDateFilter
                      ? "No matching appointments found"
                      : "No appointments available"}
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default CheckStatus;

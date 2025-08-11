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
  Button,
} from "@mui/material";
import WhatsAppButton from "../sub/WhatsAppButton";
import DeatailsViewer from "../ManagerDashboard/viewDeatails";
import InvoiceView from "../sub/InvoiceView";
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
  const [vehicleNumberSearch, setVehicleNumberSearch] = useState("");
  const [dateFilter, setDateFilter] = useState("");

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const res = await axios.get(API_URL, authConfig);
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

  const getFormattedDate = (dateString) => {
    if (!dateString) return "Not specified";
    try {
      const date = new Date(dateString);
      return isNaN(date.getTime())
        ? "Invalid date"
        : date.toLocaleDateString("en-LK", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          });
    } catch (e) {
      console.error("Error formatting date:", e);
      return "Invalid date";
    }
  };

  const filteredAppointments = appointments.filter((appointment) => {
    const matchesVehicleId = String(appointment.vehicleId || "")
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    const matchesVehicleNumber = String(appointment.vehicleNumber || "")
      .toLowerCase()
      .includes(vehicleNumberSearch.toLowerCase());

    // Date filtering by comparing ISO date strings
    const matchesDate = dateFilter
      ? new Date(appointment.expectedDeliveryDate)
          .toISOString()
          .split("T")[0] === dateFilter
      : true;

    return matchesVehicleId && matchesVehicleNumber && matchesDate;
  });

  const clearFilters = () => {
    setSearchTerm("");
    setVehicleNumberSearch("");
    setDateFilter("");
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 1, mb: 4 }}>
      {/* Header with filters */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Typography variant="h5" fontWeight="bold" color="#1976d2">
          Appointment History
        </Typography>

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

          <TextField
            label="Filter by Delivery Date"
            type="date"
            variant="outlined"
            size="small"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            InputLabelProps={{ shrink: true }}
            sx={{ width: 180 }}
          />
        </Box>
      </Box>

      {/* Table */}
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
              <TableCell align="center">Model</TableCell>
              <TableCell align="center">Expected Delivery Date</TableCell>
              <TableCell align="center">Details</TableCell>
              <TableCell align="center">Contact</TableCell>
              <TableCell align="center">Status</TableCell>
              <TableCell align="center">Invoice</TableCell>
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
                  <TableCell align="center">{appointment.model}</TableCell>
                  <TableCell align="center">
                    {getFormattedDate(appointment.expectedDeliveryDate)}
                  </TableCell>
                  <TableCell align="center">
                    <DeatailsViewer appointment={appointment} />
                  </TableCell>
                  <TableCell align="center">
                    <WhatsAppButton phone={appointment.contactNumber} VNumber={ appointment.vehicleNumber} />
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
                    <InvoiceView appointment={appointment} />
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} align="center" sx={{ py: 5 }}>
                  <Typography variant="h6" color="text.secondary">
                    {searchTerm || vehicleNumberSearch || dateFilter
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

export default ApointmentHistory;

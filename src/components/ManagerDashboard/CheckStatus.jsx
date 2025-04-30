import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Container, Box, Typography, TextField, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Paper
} from "@mui/material";
import DeatailsViewer from "./viewDeatails";
import WhatsAppButton from "../sub/WhatsAppButton";

const API_BASE_URL = "http://localhost:5000/api/appointments";

const allowedStatuses = [
  "Pending",
  "Cancelled",
  "Confirmed",
  "Reject1",
  "Waiting for Technician Confirmation",
  "Accepted",
  "Reject2",
  "InProgress",
  "Task Done"
];

const CheckStatus = () => {
  const [appointments, setAppointments] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    axios.get(API_BASE_URL)
      .then((res) => {
        const filtered = res.data.filter((appt) => allowedStatuses.includes(appt.status));
        setAppointments(filtered.reverse());
      })
      .catch((err) => console.error("Error fetching appointments:", err));
  }, []);

  const filteredAppointments = appointments.filter((appointment) =>
    (appointment.vehicleId || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={6} sx={{ p: 3, borderRadius: "16px" }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
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
                {["Vehicle ID", "Model", "Details", "Contact", "Status"].map((head) => (
                  <TableCell align="center" key={head}><strong>{head}</strong></TableCell>
                ))}
              </TableRow>
            </TableHead>

            <TableBody>
              {filteredAppointments.length > 0 ? (
                filteredAppointments.map((appointment) => (
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
                      <Typography sx={{
                        color:
                          appointment.status === "Pending" ? "orange" :
                          appointment.status === "Cancelled" ? "red" :
                          ["Reject1", "Reject2"].includes(appointment.status) ? "red" :
                          appointment.status === "Confirmed" ? "green" :
                          appointment.status === "Accepted" ? "#1976d2" :
                          appointment.status === "Task Done" ? "green" :
                          appointment.status === "InProgress" ? "#fb8c00" :
                          "gray",
                        fontWeight: 600,
                        textTransform: "capitalize",
                        fontSize: "0.9rem"
                      }}>
                        {appointment.status}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 5 }}>
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

export default CheckStatus;

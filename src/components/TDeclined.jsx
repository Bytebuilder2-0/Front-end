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
  Box,
  Typography,
  TextField,
} from "@mui/material";

const API_BASE_URL = "http://localhost:5000/api/appointments";

function TAssignedWork() {
  const [appointments, setAppointments] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  // Fetch appointments from backend  ..
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

  const filteredAppointments = appointments.filter((appointment) =>
    (appointment.vehicleId || "")
      .toString()
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  return (
    <Container>
      <h2>Declined Works</h2>
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
                <strong>Service description</strong>
              </TableCell>
              <TableCell>
                <strong>Declined Reason</strong>
              </TableCell>
              <TableCell>
                <strong>Date</strong>
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
              filteredAppointments.filter((appointment) =>
                ["Reject1"].includes(
                  appointment.status
                )
              ).map((appointment) => (
                <TableRow key={appointment._id}>
                  <TableCell>{appointment.vehicleId}</TableCell>
                  <TableCell>{appointment.vehicleNumber}</TableCell>
                  <TableCell>{}</TableCell>
                  <TableCell>{}</TableCell>
                  <TableCell>
                      {new Date(
                        appointment.appointmentDate
                      ).toLocaleDateString()}
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
}

export default TAssignedWork;

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
  Container,
  Box,
  TextField,
  Tooltip,
  IconButton
} from "@mui/material";
import IssueViewer from "./sub/IssueView";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";

// API Base URL
const API_BASE_URL = "http://localhost:5000/api/appointments";

// Fetch only "Reject2" appointments
const fetchDeclinedAppointments = async () => {
  try {
    const response = await axios.get(API_BASE_URL);
    return response.data.reverse().filter((appt) => appt.status === "Reject2");
  } catch (error) {
    console.error("Error fetching declined appointments:", error);
    return [];
  }
};

// Update appointment status and remove from table
const updateAppointmentStatus = async (appointmentId, newStatus, setAppointments) => {
  try {
    await axios.put(`${API_BASE_URL}/${appointmentId}/statusUpdate`, {
      status: newStatus,
    });

    setAppointments((prevAppointments) =>
      prevAppointments.filter((appt) => appt._id !== appointmentId)
    );
  } catch (error) {
    console.error(`Error updating appointment status to ${newStatus}:`, error);
  }
};

const SupDeclined = () => {
  const [appointments, setAppointments] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const getDeclinedAppointments = async () => {
      const data = await fetchDeclinedAppointments();
      setAppointments(data);
    };
    getDeclinedAppointments();
  }, []);

  const filteredAppointments = appointments.filter((appointment) =>
    (appointment.vehicleId || "")
      .toString()
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  return (
    <Container>
      <Box display="flex" justifyContent="right" alignItems="center" mb={2}>
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
              <TableCell><strong>Vehicle ID</strong></TableCell>
              <TableCell><strong>Model</strong></TableCell>
              <TableCell><strong>Issue</strong></TableCell>
              <TableCell><strong>Exp. Delivery</strong></TableCell>
              <TableCell><strong>Status</strong></TableCell>
              <TableCell><strong>Actions</strong></TableCell>
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

                  {/* Status color */}
                  <TableCell>
                    <span
                      style={{
                        color:
                          appointment.status === "Reject2"
                            ? "red"
                            : "gray",
                        fontWeight: 500,
                        textTransform: "capitalize",
                      }}
                    >
                      {appointment.status}
                    </span>
                  </TableCell>

                  {/* Actions */}
                  <TableCell>
                    <Tooltip title="Accept Again">
                      <IconButton
                        color="success"
                        onClick={() =>
                          updateAppointmentStatus(appointment._id, "Confirmed", setAppointments)
                        }
                        sx={{ fontSize: 30 }}
                      >
                        <CheckCircleIcon sx={{ fontSize: 30 }} />
                      </IconButton>
                    </Tooltip>

                    <Tooltip title="Permanently Reject">
                      <IconButton
                        color="error"
                        onClick={() =>
                          updateAppointmentStatus(appointment._id, "PermanentlyRejected", setAppointments)
                        }
                        sx={{ fontSize: 30 }}
                      >
                        <CancelIcon sx={{ fontSize: 30 }} />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  No matching declined appointments
                </TableCell>
              </TableRow>
            )}
          </TableBody>

        </Table>
      </TableContainer>
    </Container>
  );
};

export default SupDeclined;

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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
} from "@mui/material";
import AssignmentIcon from "@mui/icons-material/Assignment";
import { lightBlue } from "@mui/material/colors";

const API_BASE_URL = "http://localhost:5000/api/appointments";

function TAcceptedWork() {
  const [appointments, setAppointments] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  const [openDialog, setOpenDialog] = useState(false);
  const [declineReason, setDeclineReason] = useState("");
  const [selectedAppointmentId, setSelectedAppointmentId] = useState(null);

  const [expandedWorkload, setExpandedWorkload] = useState({});
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
      "Are you sure you want to start this appointment?"
    );
    if (!isConfirmed) return; // If user cancels, do nothing

    try {
      await axios.put(`${API_BASE_URL}/${appointmentId}/tStatusUpdate`, {
        status: "InProgress",
      });

      // Update UI instantly
      setAppointments((prevAppointments) =>
        prevAppointments.map((appointment) =>
          appointment._id === appointmentId
            ? { ...appointment, status: "InProgress" }
            : appointment
        )
      );

      alert("✅ Appointment Started job!");
    } catch (error) {
      console.error("Error starting job:", error);
      alert("❌ Failed to start appointment.");
    }
  };

  const handleOpenDialog = (appointmentId) => {
    setSelectedAppointmentId(appointmentId);
    setDeclineReason("");
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedAppointmentId(null);
  };

  const handleConfirmDecline = async () => {
    try {
      await axios.put(
        `${API_BASE_URL}/${selectedAppointmentId}/tStatusUpdate`,
        {
          status: "Reject2",
          reason: declineReason,
        }
      );
      // Update frontend UI
      setAppointments((prevAppointments) =>
        prevAppointments.map((appointment) =>
          appointment._id === selectedAppointmentId
            ? { ...appointment, status: "Reject2", reason: declineReason }
            : appointment
        )
      );

      alert("❌ Appointment Declined!");
    } catch (error) {
      console.error("Error declining appointment:", error);
      alert("❌ Failed to decline appointment.");
    } finally {
      handleCloseDialog();
    }
  };
  const handleToggleWorkload = (appointmentId) => {
    setExpandedWorkload((prev) => ({
      ...prev,
      [appointmentId]: !prev[appointmentId],
    }));
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
                <strong>Issue</strong>
              </TableCell>
              <TableCell>
                <strong>Work Load</strong>
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
                  ["Accepted"].includes(appointment.status)
                )
                .map((appointment) => (
                  <React.Fragment key={appointment._id}>
                    <TableRow key={appointment._id}>
                      <TableCell>{appointment.vehicleId}</TableCell>
                      <TableCell>{appointment.vehicleNumber}</TableCell>
                      <TableCell>
                        {appointment.expectedDeliveryDate}
                        {/* {new Date(
                        appointment.appointmentDate
                      ).toLocaleDateString()} */}
                      </TableCell>
                      <TableCell>{appointment.issue}</TableCell>
                      <TableCell>
                        <IconButton
                          onClick={() => handleToggleWorkload(appointment._id)}
                        >
                          <AssignmentIcon />
                        </IconButton>
                      </TableCell>
                      <TableCell>
                        {appointment.status === "InProgress" ? (
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
                            Start
                          </Button>
                        )}
                      </TableCell>
                      <TableCell>
                        {appointment.status === "Reject2" ? (
                          <Button variant="contained" disabled>
                            Declined
                          </Button>
                        ) : (
                          <Button
                            variant="contained"
                            color="secondary"
                            onClick={() => handleOpenDialog(appointment._id)}
                            style={{ marginRight: "10px" }}
                          >
                            Decline
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                    {expandedWorkload[appointment._id] && (
                      <TableRow>
                        <TableCell colSpan={7} sx={{ textAlign: "center" }}>
                          <Box display="flex" justifyContent="center">
                            <Table
                              size="small"
                              sx={{
                                width: "50%",
                                backgroundColor: lightBlue[50],
                              }}
                            >
                              <TableHead>
                                <TableRow>
                                  <TableCell align="center">
                                    <strong>Step</strong>
                                  </TableCell>
                                  <TableCell align="center">
                                    <strong>Description</strong>
                                  </TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {appointment.workload.map((task, index) => (
                                  <TableRow key={task._id || index}>
                                    <TableCell>{task.step}</TableCell>
                                    <TableCell>{task.description}</TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </Box>
                        </TableCell>
                      </TableRow>
                    )}
                  </React.Fragment>
                ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  No appointments found
                </TableCell>
              </TableRow>
            )}
            {/* Decline Reason Dialog */}

            <Dialog open={openDialog} onClose={handleCloseDialog}>
              <DialogTitle>Decline Appointment</DialogTitle>
              <DialogContent>
                <TextField
                  autoFocus
                  margin="dense"
                  label="Reason for Decline"
                  type="text"
                  fullWidth
                  multiline
                  rows={3}
                  value={declineReason}
                  onChange={(e) => setDeclineReason(e.target.value)}
                  sx={{
                    "& .MuiInputBase-root": {
                      alignItems: "flex-start", // aligns text at the top
                      width: 500,
                    },
                  }}
                />
              </DialogContent>
              <DialogActions>
                <Button onClick={handleCloseDialog}>Cancel</Button>
                <Button
                  onClick={handleConfirmDecline}
                  color="error"
                  disabled={declineReason.trim() === ""}
                >
                  Confirm Decline
                </Button>
              </DialogActions>
            </Dialog>
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
}

export default TAcceptedWork;

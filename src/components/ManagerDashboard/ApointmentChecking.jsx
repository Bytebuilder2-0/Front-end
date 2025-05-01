import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Container, Box, Typography, TextField, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Paper, IconButton, Tooltip
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import DeatailsViewer from "./viewDeatails";
import WhatsAppButton from "../sub/WhatsAppButton";
import ConfirmDeleteDialog from "../ServiceManage/ConfirmDeleteDialog";
import SuccessSnackbar from "../ServiceManage/SuccessSnackbar";

const API_BASE_URL = "http://localhost:5000/api/appointments";

const ApointmentChecking = () => {
  const [appointments, setAppointments] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    appointment: null,
    actionType: "",
  });

  const [snackbar, setSnackbar] = useState({ open: false, message: "" });

  useEffect(() => {
    axios.get(API_BASE_URL)
      .then((res) => setAppointments(res.data.reverse().filter((appt) => appt.status === "Checking")))
      .catch((err) => console.error("Error fetching appointments:", err));
  }, []);

  const handleStatusUpdate = async (appointmentId, newStatus) => {
    try {
      await axios.put(`${API_BASE_URL}/${appointmentId}/statusUpdate`, { status: newStatus });
      setAppointments((prev) => prev.filter((appt) => appt._id !== appointmentId));

      const emoji = newStatus === "Pending" ? "\u2705" : "\u274C"; // Unicode emoji
      setSnackbar({
        open: true,
        message: `${emoji} Appointment ${newStatus === "Pending" ? "accepted" : "rejected"} successfully!`,
      });
    } catch (err) {
      console.error("Error updating status:", err);
    }
  };

  const handleClickAction = (appointment, type) => {
    setConfirmDialog({
      open: true,
      appointment,
      actionType: type,
    });
  };

  const handleConfirmAction = () => {
    if (confirmDialog.appointment) {
      const newStatus = confirmDialog.actionType === "Accept" ? "Pending" : "Reject1";
      handleStatusUpdate(confirmDialog.appointment._id, newStatus);
      setConfirmDialog({ open: false, appointment: null, actionType: "" });
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={6} sx={{ p: 3, borderRadius: "16px" }}>
        {/* Header */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h5" fontWeight="bold" color="#1976d2">
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
                {["Vehicle ID", "Model", "Appointment Details", "Contact", "Status", "Actions"].map((head) => (
                  <TableCell align="center" key={head}><strong>{head}</strong></TableCell>
                ))}
              </TableRow>
            </TableHead>

            <TableBody>
              {appointments.filter((a) => a.vehicleId?.toLowerCase().includes(searchTerm.toLowerCase()))
                .map((appointment) => (
                  <TableRow key={appointment._id}>
                    <TableCell align="center">{appointment.vehicleId}</TableCell>
                    <TableCell align="center">{appointment.model}</TableCell>
                    <TableCell align="center"><DeatailsViewer appointment={appointment} /></TableCell>
                    <TableCell align="center"><WhatsAppButton phone={appointment.contactNumber} /></TableCell>
                    <TableCell align="center">
                      <Typography sx={{
                        color:
                          appointment.status === "Checking" ? "orange" :
                          appointment.status === "Pending" ? "green" :
                          ["Cancelled", "Reject1"].includes(appointment.status) ? "red" : "gray",
                        fontWeight: 600, textTransform: "capitalize", fontSize: "0.9rem"
                      }}>
                        {appointment.status}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Tooltip title="Accept">
                        <IconButton color="success" onClick={() => handleClickAction(appointment, "Accept")}>
                          <CheckCircleIcon sx={{ fontSize: 26 }} />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Reject">
                        <IconButton color="error" onClick={() => handleClickAction(appointment, "Reject")}>
                          <CancelIcon sx={{ fontSize: 26 }} />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}

              {appointments.length === 0 && (
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

      {/* Confirm Dialog */}
      <ConfirmDeleteDialog
        open={confirmDialog.open}
        onClose={() => setConfirmDialog({ open: false, appointment: null, actionType: "" })}
        onConfirm={handleConfirmAction}
        itemName={`Appointment for ${confirmDialog.appointment?.vehicleId || ""}`}
        actionName={confirmDialog.actionType === "Accept" ? "Accept" : "Reject"}
      />

      {/* Success Snackbar */}
      <SuccessSnackbar
        open={snackbar.open}
        message={snackbar.message}
        onClose={() => setSnackbar({ open: false, message: "" })}
      />
    </Container>
  );
};

export default ApointmentChecking;

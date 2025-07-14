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
  IconButton,
  Tooltip,
  Button,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DeatailsViewer from "./viewDeatails";
import WhatsAppButton from "../sub/WhatsAppButton";
import ConfirmDeleteDialog from "../ServiceManage/ConfirmDeleteDialog";
import SuccessSnackbar from "../ServiceManage/SuccessSnackbar";
import { jwtDecode } from "jwt-decode";
import UpdateAppointmentDetailsDialog from "./UpdateAppointmentDetailsDialog"; // Import the new component for updating appointment details

const API_BASE_URL = "http://localhost:5000/api/appointments";
const token = localStorage.getItem("token");

let decoded = null;
if (token) {
  try {
    decoded = jwtDecode(token);
    console.log(decoded.id); // optional
  } catch (err) {
    console.error("Invalid token:", err);
  }
}

// config object you can reuse
const authConfig = {
  headers: {
    Authorization: `Bearer ${token}`,
  },
};

const ApointmentChecking = () => {
  const [appointments, setAppointments] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    appointment: null,
    actionType: "",
  });
  const [snackbar, setSnackbar] = useState({ open: false, message: "" });
  const [selectedAppointment, setSelectedAppointment] = useState(null); // To store selected appointment for editing
  const [openUpdateDialog, setOpenUpdateDialog] = useState(false); // To control the open state of the update dialog

  useEffect(() => {
    axios
      .get(API_BASE_URL, authConfig)
      .then((res) =>
        setAppointments(
          res.data.reverse().filter((appt) => appt.status === "Checking")
        )
      )
      .catch((err) => console.error("Error fetching appointments:", err));
  }, []);

  const handleStatusUpdate = async (appointmentId, newStatus) => {
    try {
      await axios.put(
        `${API_BASE_URL}/${appointmentId}/statusUpdate`,
        {
          status: newStatus,
        },
        authConfig
      );
      setAppointments((prev) =>
        prev.filter((appt) => appt._id !== appointmentId)
      );

      setSnackbar({
        open: true,
        message: `Appointment ${
          newStatus === "Pending" ? "accepted" : "rejected"
        } successfully!`,
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
      const newStatus =
        confirmDialog.actionType === "Accept" ? "Pending" : "Reject1";
      handleStatusUpdate(confirmDialog.appointment._id, newStatus);
      setConfirmDialog({ open: false, appointment: null, actionType: "" });
    }
  };

  const handleOpenUpdateDialog = (appointment) => {
    setSelectedAppointment(appointment); // Set the selected appointment to edit
    setOpenUpdateDialog(true); // Open the update dialog
  };

  const handleCloseUpdateDialog = () => {
    setOpenUpdateDialog(false); // Close the update dialog
    setSelectedAppointment(null); // Reset the selected appointment
  };

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
                {[
                  "Vehicle ID",
                  "Preferred Date",
                  "Appointment Details",
                  "Contact",
                  "Status",
                  "Actions",
                ].map((head) => (
                  <TableCell align="center" key={head}>
                    <strong>{head}</strong>
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>

            <TableBody>
              {appointments
                .filter((a) =>
                  String(a.vehicleId || "")
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase())
                )
                .map((appointment) => (
                  <TableRow key={appointment._id}>
                    <TableCell align="center">
                      {appointment.vehicleId}
                    </TableCell>
                    <TableCell align="center">
                      {new Date(appointment.preferredDate).toLocaleDateString()}
                    </TableCell>
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
                            appointment.status === "Checking"
                              ? "#3c4caaff"
                              : appointment.status === "Pending"
                              ? "green"
                              : ["Cancelled", "Reject1"].includes(
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
                      <Tooltip title="Accept">
                        <IconButton
                          color="success"
                          onClick={() =>
                            handleClickAction(appointment, "Accept")
                          }
                        >
                          <CheckCircleIcon sx={{ fontSize: 26 }} />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Reject">
                        <IconButton
                          color="error"
                          onClick={() =>
                            handleClickAction(appointment, "Reject")
                          }
                        >
                          <CancelIcon sx={{ fontSize: 26 }} />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Edit Appointment Details">
                        <IconButton
                          color="primary"
                          onClick={() => handleOpenUpdateDialog(appointment)}
                        >
                          <VisibilityIcon sx={{ fontSize: 22 }} />
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
        onClose={() =>
          setConfirmDialog({ open: false, appointment: null, actionType: "" })
        }
        onConfirm={handleConfirmAction}
        itemName={`Appointment for ${
          confirmDialog.appointment?.vehicleId || ""
        }`}
        actionName={confirmDialog.actionType === "Accept" ? "Accept" : "Reject"}
      />

      {/* Success Snackbar */}
      <SuccessSnackbar
        open={snackbar.open}
        message={snackbar.message}
        onClose={() => setSnackbar({ open: false, message: "" })}
      />

      {/* Update Appointment Details Dialog */}
      <UpdateAppointmentDetailsDialog
        appointment={selectedAppointment}
        open={openUpdateDialog}
        onClose={handleCloseUpdateDialog}
      />
    </Container>
  );
};

export default ApointmentChecking;

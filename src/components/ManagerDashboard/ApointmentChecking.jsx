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
  const [searchTerm, setSearchTerm] = useState(""); // For Vehicle ID search
  const [preferredDate, setPreferredDate] = useState(""); // For Preferred Date filter
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
      .then((res) => {
        // Sort appointments: Checking first, then Pending
        const sortedAppointments = res.data
          .filter((appt) => ["Checking", "Pending"].includes(appt.status))
          .sort((a, b) => {
            if (a.status === "Checking" && b.status !== "Checking") return -1;
            if (a.status !== "Checking" && b.status === "Checking") return 1;
            return 0;
          });
        setAppointments(sortedAppointments);
      })
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

      // Reload the page after status update
      window.location.reload();
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

  // Function to handle date input format and apply filtering based on full date, month, or day
  const getDateFilterType = (dateInput) => {
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/; // Full Date (YYYY-MM-DD)
    const monthRegex = /^\d{2}$/; // Month (MM)
    const dayRegex = /^\d{2}$/; // Day (DD)

    if (dateRegex.test(dateInput)) {
      return "full"; // Full date format (YYYY-MM-DD)
    } else if (monthRegex.test(dateInput)) {
      return "month"; // Month format (MM)
    } else if (dayRegex.test(dateInput)) {
      return "day"; // Day format (DD)
    } else {
      return "none"; // Invalid input
    }
  };

  // Filter appointments based on Vehicle ID and Preferred Date (Date, Month, or Day)
  const filteredAppointments = appointments.filter((appointment) => {
    const matchesVehicleId = String(appointment.vehicleId || "")
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    const dateFilterType = getDateFilterType(preferredDate);

    let matchesPreferredDate = true;

    if (dateFilterType === "full") {
      matchesPreferredDate =
        new Date(appointment.preferredDate).toISOString().split("T")[0] ===
        preferredDate;
    } else if (dateFilterType === "month") {
      const appointmentMonth = new Date(appointment.preferredDate)
        .toISOString()
        .slice(5, 7);
      matchesPreferredDate = appointmentMonth === preferredDate;
    } else if (dateFilterType === "day") {
      const appointmentDay = new Date(appointment.preferredDate)
        .toISOString()
        .slice(8, 10);
      matchesPreferredDate = appointmentDay === preferredDate;
    }

    return matchesVehicleId && matchesPreferredDate;
  });

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

          <Box display="flex" alignItems="center">
            <TextField
              label="Search by Vehicle ID"
              variant="outlined"
              size="small"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              sx={{ mr: 2 }}
            />

            <TextField
              label="Filter by Preferred Date"
              type="date"
              variant="outlined"
              size="small"
              value={preferredDate}
              onChange={(e) => setPreferredDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
              sx={{ width: 200 }}
            />
          </Box>
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
              {filteredAppointments.length > 0 ? (
                filteredAppointments.map((appointment) => (
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
                              ? "orange"
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
                      <Box
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                        gap={1}
                      >
                        {/* Edit Appointment Button */}
                        <Tooltip title="Edit Appointment Details">
                          <IconButton
                            color="primary"
                            onClick={() => handleOpenUpdateDialog(appointment)}
                          >
                            <VisibilityIcon sx={{ fontSize: 22 }} />
                          </IconButton>
                        </Tooltip>

                        {/* Accept Button - Only show if status is not "Pending" */}
                        {appointment.status !== "Pending" && (
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
                        )}

                        {/* Reject Button */}
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
                      </Box>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 5 }}>
                    <Typography variant="h6" color="textSecondary">
                      {searchTerm || preferredDate
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

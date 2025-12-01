import React, { useEffect, useState } from "react";
import axios from "axios";
import API_BASE_URL from "../../config/api";
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
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DeatailsViewer from "./viewDeatails";
import WhatsAppButton from "../sub/WhatsAppButton";
import ConfirmDeleteDialog from "../ServiceManage/ConfirmDeleteDialog";
import SuccessSnackbar from "../ServiceManage/SuccessSnackbar";
import { jwtDecode } from "jwt-decode";
import UpdateAppointmentDetailsDialog from "./UpdateAppointmentDetailsDialog";

const API_URL = `${API_BASE_URL}/appointments`;
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

const ApointmentChecking = () => {
  const [appointments, setAppointments] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [vehicleNumberSearch, setVehicleNumberSearch] = useState("");
  const [preferredDate, setPreferredDate] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    appointment: null,
    actionType: "",
  });
  const [snackbar, setSnackbar] = useState({ open: false, message: "" });
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [openUpdateDialog, setOpenUpdateDialog] = useState(false);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = () => {
    axios
      .get(API_URL, authConfig)
      .then((res) => {
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
  };

  const handleStatusUpdate = async (appointmentId, newStatus) => {
    try {
      await axios.put(
        `${API_URL}/${appointmentId}/statusUpdate`,
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
      setSnackbar({
        open: true,
        message: "Failed to update appointment status",
      });
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
    setSelectedAppointment(appointment);
    setOpenUpdateDialog(true);
  };

  const handleCloseUpdateDialog = () => {
    setOpenUpdateDialog(false);
    setSelectedAppointment(null);
  };

  const handleUpdateSuccess = (message) => {
    fetchAppointments(); // Refresh the appointments list
    setSnackbar({
      open: true,
      message: message || "Appointment updated successfully!",
    });
    handleCloseUpdateDialog();
  };

  const getDateFilterType = (dateInput) => {
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    const monthRegex = /^\d{2}$/;
    const dayRegex = /^\d{2}$/;

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

  const filteredAppointments = appointments.filter((appointment) => {
    const matchesVehicleId = String(appointment.vehicleId || "")
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    const matchesVehicleNumber = String(appointment.vehicleNumber || "")
      .toLowerCase()
      .includes(vehicleNumberSearch.toLowerCase());

    const matchesStatus =
      statusFilter === "all" ||
      appointment.status.toLowerCase() === statusFilter.toLowerCase();

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

    return (
      matchesVehicleId &&
      matchesVehicleNumber &&
      matchesStatus &&
      matchesPreferredDate
    );
  });

  return (
    <Container maxWidth="lg" sx={{ mt: 0, mb: 1 }}>
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
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              label="Filter by Status"
            >
              <MenuItem value="all">All Statuses</MenuItem>
              <MenuItem value="Checking">Checking</MenuItem>
              <MenuItem value="Pending">Pending</MenuItem>
            </Select>
          </FormControl>

          <TextField
            label="Filter by Date"
            type="date"
            variant="outlined"
            size="small"
            value={preferredDate}
            onChange={(e) => setPreferredDate(e.target.value)}
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
            <TableRow>
              <TableCell align="center">Vehicle ID</TableCell>
              <TableCell align="center">Vehicle Number</TableCell>
              <TableCell align="center">Preferred Date</TableCell>
              <TableCell align="center">Appointment Details</TableCell>
              <TableCell align="center">Contact</TableCell>
              <TableCell align="center">Status</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredAppointments.length > 0 ? (
              filteredAppointments.map((appointment) => (
                <TableRow key={appointment._id}>
                  <TableCell align="center">{appointment.vehicleId}</TableCell>
                  <TableCell align="center">
                    {appointment.vehicleNumber}
                  </TableCell>
                  <TableCell align="center">
                    {new Date(appointment.preferredDate).toLocaleDateString(
                      "en-LK",
                      {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      }
                    )}
                  </TableCell>
                  <TableCell align="center">
                    <DeatailsViewer appointment={appointment} />
                  </TableCell>
                  <TableCell align="center">
                    <WhatsAppButton
                      phone={appointment.contactNumber}
                      VNumber={appointment.vehicleNumber}
                    />
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
                    <Box
                      display="flex"
                      justifyContent="center"
                      alignItems="center"
                      gap={1}
                    >
                      <Tooltip title="Edit Appointment Details">
                        <IconButton
                          color="primary"
                          onClick={() => handleOpenUpdateDialog(appointment)}
                        >
                          <VisibilityIcon sx={{ fontSize: 22 }} />
                        </IconButton>
                      </Tooltip>

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
                <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                  <Typography variant="h6" color="text.secondary">
                    No Appointments Found
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

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

      <UpdateAppointmentDetailsDialog
        appointment={selectedAppointment}
        open={openUpdateDialog}
        onClose={handleCloseUpdateDialog}
        onSuccess={handleUpdateSuccess}
      />

      <SuccessSnackbar
        open={snackbar.open}
        message={snackbar.message}
        onClose={() => setSnackbar({ open: false, message: "" })}
        autoHideDuration={3000}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      />
    </Container>
  );
};

export default ApointmentChecking;

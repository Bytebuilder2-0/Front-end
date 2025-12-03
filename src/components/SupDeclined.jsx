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
  Typography,
} from "@mui/material";

import IssueViewer from "./sub/IssueView";
import WorkloadManager from "./sub/WorkloadManager";
import TechnicianAssignmentAndStatusUpdater from "./sub/TechnicianAssignmentAndStatusUpdater";
import WhatsAppButton from "./sub/WhatsAppButton";
import Reason from "./sub/Reason";
import CustomSnackbar from "./sub/CustomSnackbar";
import { useAuth } from "../context/AuthContext";

import API_BASE_URL from "../config/api";
const baseURL = API_BASE_URL.replace("/api", "");

// Fetch "Reject2" appointments confirmed by the current supervisor
const fetchDeclinedAppointments = async (supervisorId, token) => {
  try {
    const response = await axios.get(`${baseURL}/appointments`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data
      .reverse()
      .filter(
        (app) =>
          app.status === "Reject2" &&
          app.sconfirmedBy?.toString() === supervisorId
      );
  } catch (error) {
    console.error("Error fetching declined appointments:", error);
    return [];
  }
};

const SupDeclined = () => {
  const { user, token } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [snackbarInfo, setSnackbarInfo] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  useEffect(() => {
    if (!user || !token) return;

    const getDeclinedAppointments = async () => {
      const data = await fetchDeclinedAppointments(user.id, token);
      setAppointments(data);
    };

    getDeclinedAppointments();
    const interval = setInterval(getDeclinedAppointments, 5000);
    return () => clearInterval(interval);
  }, [user, token]);

  const filteredAppointments = appointments.filter((appointment) =>
    (appointment.vehicleId || "")
      .toString()
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const updateAppointmentInState = (updatedAppointment) => {
    setAppointments((prevAppointments) =>
      prevAppointments.map((appt) =>
        appt._id === updatedAppointment._id ? updatedAppointment : appt
      )
    );
  };

  const showSnackbar = (message, severity) => {
    setSnackbarInfo({
      open: true,
      message,
      severity,
    });
  };

  return (
    <Container>
      {/* Search Bar */}
      <Box
        display="flex"
        justifyContent="right"
        alignItems="center"
        mt={2}
        mb={2}
      >
        <TextField
          label="Search by Vehicle ID"
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </Box>

      {/* Table */}
      <TableContainer
        component={Paper}
        sx={{
          marginTop: 2,
          overflow: "auto",
          maxHeight: 400,
          borderRadius: 2,
          boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.05)",
        }}
      >
        <Table stickyHeader>
          <TableHead>
            <TableRow
              sx={{
                "& th": { fontWeight: "bold", backgroundColor: "#f5f5f5" },
              }}
            >
              <TableCell>Vehicle ID</TableCell>
              <TableCell>Model</TableCell>
              <TableCell>Issue</TableCell>
              <TableCell>Reason</TableCell>
              <TableCell>Workload</TableCell>
              <TableCell align="center">Re-Assign Technician</TableCell>
              <TableCell>WhatsApp</TableCell>
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
                  <TableCell>{appointment.vehicleId}</TableCell>
                  <TableCell>{appointment.model}</TableCell>
                  <TableCell>
                    <IssueViewer appointment={appointment} />
                  </TableCell>
                  <TableCell>
                    <Reason reason={appointment.reason} />
                  </TableCell>
                  <TableCell>
                    <WorkloadManager
                      appointment={appointment}
                      updateAppointment={updateAppointmentInState}
                      showSnackbar={showSnackbar}
                      token={token}
                    />
                  </TableCell>
                  <TableCell>
                    <TechnicianAssignmentAndStatusUpdater
                      appointment={appointment}
                      updateAppointment={updateAppointmentInState}
                      showSnackbar={showSnackbar}
                    />
                  </TableCell>
                  <TableCell>
                    <WhatsAppButton phone={appointment.contactNumber} />
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                  <Typography variant="h6" color="text.secondary">
                    No matching declined appointments
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <CustomSnackbar
        open={snackbarInfo.open}
        message={snackbarInfo.message}
        action={snackbarInfo.severity}
        onClose={() => setSnackbarInfo({ ...snackbarInfo, open: false })}
      />
    </Container>
  );
};

export default SupDeclined;

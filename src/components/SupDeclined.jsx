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
  TextField
} from "@mui/material";
import IssueViewer from "./sub/IssueView";
import WorkloadManager from "./sub/WorkloadManager";
import TechnicianAssignmentAndStatusUpdater from "./sub/TechnicianAssignmentAndStatusUpdater";
import WhatsAppButton from "./sub/WhatsAppButton";
import Reason from "./sub/Reason";
import CustomSnackbar from "./sub/CustomSnackbar";


// API Base URL
const baseURL=import.meta.env.VITE_API_BASE_URL;


// Fetch only "Reject2" appointments
const fetchDeclinedAppointments = async () => {
  try {
    const response = await axios.get(`${baseURL}/appointments`,{
      headers:{
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
    return response.data.reverse().filter((appt) => appt.status === "Reject2");
  } catch (error) {
    console.error("Error fetching declined appointments:", error);
    return [];
  }
};

// Update appointment status and remove from table

const SupDeclined = () => {
  const [appointments, setAppointments] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

    const [snackbarInfo, setSnackbarInfo] = useState({
        open: false,
        message: "",
        severity: "success", // or error,info,warning
      });

  useEffect(() => {
    const getDeclinedAppointments = async () => {
      const data = await fetchDeclinedAppointments();
      setAppointments(data);
    };
    getDeclinedAppointments();

    //Polling every 5 sec
  const interval = setInterval(getDeclinedAppointments, 5000);

  //Clear polling after component unmount
  return () => clearInterval(interval);

  }, []);

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
              <TableCell><strong>Reason</strong></TableCell>
              <TableCell><strong>Workload</strong></TableCell>
              <TableCell><strong>Assign.Tech</strong></TableCell>
        <TableCell><strong>WhatsApp</strong></TableCell>
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
               <Reason reason={appointment.reason}/>
                  </TableCell>
                  <TableCell>
                  <WorkloadManager   
                  appointment={appointment}
                      updateAppointment={updateAppointmentInState}
                      showSnackbar={showSnackbar}
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
                  <WhatsAppButton phone={appointment.contactNumber}/>
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

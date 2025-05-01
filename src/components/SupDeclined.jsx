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
  const updateAppointmentInState = (updatedAppointment) => {
    setAppointments((prevAppointments) =>
      prevAppointments.map((appt) =>
        appt._id === updatedAppointment._id ? updatedAppointment : appt
      )
    );
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
                  <WorkloadManager   appointment={appointment} btn_name="update"
                      updateAppointment={updateAppointmentInState}/>
                  </TableCell>
                  <TableCell>
                  <TechnicianAssignmentAndStatusUpdater
                      appointment={appointment}
                      updateAppointment={updateAppointmentInState}
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
    </Container>
  );
};

export default SupDeclined;

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
  Typography,
} from "@mui/material";
import IssueViewer from "./sub/IssueView";
import TechMessageView from "./sub/TechMessageView";
import SuggestionWriting from "./sub/SuggestionWriting";
import WorkloadManager from "./sub/WorkloadManager";
import WhatsAppButton from "./sub/WhatsAppButton";

// API Base URL
const API_BASE_URL = "http://localhost:5000/api/appointments";

// Fetch all appointments
const fetchAppointments = async () => {
  try {
    const response = await axios.get(API_BASE_URL);
    return response.data.reverse().filter((x) => x.status === "Accepted" || x.status==="InProgress"); // Show only Accepted appointments
  } catch (error) {
    console.error("Error fetching appointments:", error);
    return [];
  }
};

const SupInprogress = () => {
  const [appointments, setAppointments] = useState([]);


  useEffect(() => {
    const getAppointments = async () => {
  
      const data = await fetchAppointments();
      setAppointments(data);
 
    };
    getAppointments();
  }, []);

  const updateAppointmentInState = (updatedAppointment) => {
    setAppointments((prevAppointments) =>
      prevAppointments.map((appt) =>
        appt._id === updatedAppointment._id ? updatedAppointment : appt
      )
    );
  };

  return (
    <Container>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
        mt={2}
      >
      
      </Box>
      <TableContainer component={Paper} sx={{ marginTop: 2 }}>
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
                <strong>Description</strong>
              </TableCell>
              <TableCell>
                <strong>Tech.Messages</strong>
              </TableCell>
              <TableCell>
                <strong>Suggestions</strong>
              </TableCell>
              <TableCell>
                <strong>Update Workload</strong>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {appointments.map((appointment) => (
              <TableRow key={appointment._id}>
                <TableCell>{appointment.vehicleId}</TableCell>
                <TableCell>{appointment.vehicleNumber}</TableCell>
                <TableCell>
                  <IssueViewer issue={appointment.issue} />
                </TableCell>
                <TableCell>
                  <TechMessageView x={appointment.techMessage} />
                </TableCell>
                <TableCell>
                  {" "}
                  <SuggestionWriting
                    appointment={appointment}
                    updateAppointment={updateAppointmentInState}
                  />
                </TableCell>
                <TableCell> <WorkloadManager   appointment={appointment} btn_name="update"
                      updateAppointment={updateAppointmentInState}/></TableCell>
                      <TableCell><WhatsAppButton phone={appointment.contactNumber}/></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default SupInprogress;

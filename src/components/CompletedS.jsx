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
  Box,
  Typography,
  Container,
} from "@mui/material";

import IssueViewer from "./sub/IssueView";
import WhatsAppButton from "./sub/WhatsAppButton";
import BudgetReview from "./sub/BudgetReview";
import InvoiceView from "./sub/InvoiceView";

const API_BASE_URL = "http://localhost:5000/api/appointments";

const fetchAppointments = async () => {
  try {
    const response = await axios.get(API_BASE_URL);
    return response.data.filter((appt) => appt.status === "Task Done");
  } catch (error) {
    console.error("Error fetching appointments:", error);
    return [];
  }
};

function CompletedS() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getAppointments = async () => {
      setLoading(true);
      const data = await fetchAppointments();
      setAppointments(data);
      setLoading(false);
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
      >
        <Typography variant="h5" gutterBottom>
          Completed
        </Typography>
      </Box>
      <TableContainer component={Paper} sx={{ marginTop: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <strong>Vehicle ID</strong>
              </TableCell>
              <TableCell>
                <strong>Model</strong>
              </TableCell>
              <TableCell>
                <strong>Description</strong>
              </TableCell>
              <TableCell>
                <strong>Budget</strong>
              </TableCell>
              <TableCell>
                <strong>Invoice</strong>
              </TableCell>
              <TableCell>
                <strong>Payment</strong>
              </TableCell>
              <TableCell>
                <strong>Contact</strong>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {appointments.map((appointment) => (
              <TableRow key={appointment._id}>
                <TableCell>{appointment.vehicleId}</TableCell>
                <TableCell>{appointment.model}</TableCell>
                <TableCell>
                  <IssueViewer issue={appointment.issue} />
                </TableCell>
                <TableCell>
                  <BudgetReview
                    appointment={appointment}
                    btn_name="review"
                    updateAppointment={updateAppointmentInState}
                  />
                </TableCell>
                <TableCell>
                  <InvoiceView appointment={appointment}/>
                 
                </TableCell>
                <TableCell>{appointment.payment}</TableCell>
                <TableCell>
                  <WhatsAppButton phone={appointment.contactNumber} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
}

export default CompletedS;

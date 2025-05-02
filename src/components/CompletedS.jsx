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
  Container,
} from "@mui/material";

import IssueViewer from "./sub/IssueView";
import WhatsAppButton from "./sub/WhatsAppButton";
import BudgetReview from "./sub/BudgetReview";
import InvoiceView from "./sub/InvoiceView";
import CustomSnackbar from "./sub/CustomSnackbar";

const baseURL=import.meta.env.VITE_API_BASE_URL;


const fetchAppointments = async () => {
  try {
    const response = await axios.get(`${baseURL}/appointments`);
    return response.data.filter((appt) => appt.status === "Task Done");
  } catch (error) {
    console.error("Error fetching appointments:", error);
    return [];
  }
};

function CompletedS() {
  const [appointments, setAppointments] = useState([]);

  const [snackbarInfo, setSnackbarInfo] = useState({
      open: false,
      message: "",
      severity: "success", // or error,info,warning
    });
  


  useEffect(() => {
    const getAppointments = async () => {
    
      const data = await fetchAppointments();
      setAppointments(data);
     
    };
    getAppointments();
	//Polling every 5 sec
  const interval = setInterval(getAppointments, 5000);

  //Clear polling after component unmount
  return () => clearInterval(interval);

  }, []);

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
                    showSnackbar={showSnackbar}
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
      <CustomSnackbar
				open={snackbarInfo.open}
				message={snackbarInfo.message}
				action={snackbarInfo.severity}
				onClose={() => setSnackbarInfo({ ...snackbarInfo, open: false })}
			/>
    </Container>
  );
}

export default CompletedS;

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
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
} from "@mui/material";

import IssueViewer from "../sub/IssueView"; 
import WhatsAppButton from "../sub/WhatsAppButton"; 
import InvoiceView from "../sub/InvoiceView"; // Added InvoiceView here

const API_BASE_URL = "http://localhost:5000/api/appointments";

// Fetch appointments where payment is "Paid"
const fetchPaidAppointments = async () => {
  try {
    const response = await axios.get(API_BASE_URL);
    return response.data.filter((appt) => appt.status === "Paid");
  } catch (error) {
    console.error("Error fetching appointments:", error);
    return [];
  }
};

function ManagerHistory() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  useEffect(() => {
    const getAppointments = async () => {
      setLoading(true);
      const data = await fetchPaidAppointments();
      setAppointments(data);
      setLoading(false);
    };
    getAppointments();
  }, []);

  const handleClose = () => {
    setSelectedAppointment(null);
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
        <Typography variant="h4">Appointments History</Typography>
      </Box>

      <TableContainer component={Paper} sx={{ marginTop: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ padding: '8px 16px' }}><strong>Vehicle ID</strong></TableCell>
              <TableCell sx={{ padding: '8px 16px' }}><strong>Model</strong></TableCell>
              <TableCell sx={{ padding: '8px 16px' }}><strong>Contact</strong></TableCell>
              <TableCell sx={{ padding: '8px 16px' }}><strong>Invoice</strong></TableCell>
              <TableCell sx={{ padding: '8px 16px' }}><strong>Appointments Details</strong></TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {appointments.map((appointment) => (
              <TableRow key={appointment._id}>
                <TableCell sx={{ padding: '8px 16px' }}>{appointment.vehicleId}</TableCell>
                <TableCell sx={{ padding: '8px 16px' }}>{appointment.model}</TableCell>
                <TableCell sx={{ padding: '8px 16px' }}>
                  <WhatsAppButton phone={appointment.contactNumber} />
                </TableCell>
                <TableCell sx={{ padding: '8px 16px' }}>
                  <InvoiceView appointment={appointment} />
                </TableCell>
                <TableCell sx={{ padding: '8px 16px' }}>
                  <Button
                    variant="outlined"
                    sx={{ padding: '6px 12px' }}
                    onClick={() => setSelectedAppointment(appointment)}
                  >
                    View
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Dialog for Showing Appointment Details */}
      {selectedAppointment && (
       <Dialog open={!!selectedAppointment} onClose={handleClose} maxWidth="md" fullWidth>
       <DialogTitle>Appointment Details</DialogTitle>
       <DialogContent dividers>
         {/* Vehicle Info */}
         <Box mb={2}>
           <Typography variant="h6" color="primary"><strong>Vehicle Information</strong></Typography>
           <Typography><strong>Vehicle ID:</strong> {selectedAppointment.vehicleId}</Typography>
           <Typography><strong>Vehicle Number:</strong> {selectedAppointment.vehicleNumber}</Typography>
           <Typography><strong>Model:</strong> {selectedAppointment.model}</Typography>
         </Box>
     
         {/* Issue & Reason */}
         <Box mb={2}>
           <Typography variant="h6" color="primary"><strong>Issue Details</strong></Typography>
           <Typography><strong>Issue:</strong> {selectedAppointment.issue}</Typography>
           <Typography><strong>Reason:</strong> {selectedAppointment.reason || 'N/A'}</Typography>
         </Box>
     
         {/* Appointment Status */}
         <Box mb={2}>
           <Typography variant="h6" color="primary"><strong>Status Information</strong></Typography>
           <Typography><strong>Status:</strong> {selectedAppointment.status}</Typography>
           <Typography><strong>Preferred Date:</strong> {new Date(selectedAppointment.preferredDate).toLocaleDateString()}</Typography>
           <Typography><strong>Preferred Time:</strong> {selectedAppointment.preferredTime}</Typography>
           <Typography><strong>Expected Delivery Date:</strong> {new Date(selectedAppointment.expectedDeliveryDate).toLocaleDateString()}</Typography>
         </Box>
     
         {/* Contact Info */}
         <Box mb={2}>
           <Typography variant="h6" color="primary"><strong>Contact Information</strong></Typography>
           <Typography><strong>Contact Number:</strong> {selectedAppointment.contactNumber}</Typography>
         </Box>
     
         {/* Workload */}
         <Box mb={2}>
           <Typography variant="h6" color="primary"><strong>Workload Details</strong></Typography>
           {selectedAppointment.workload.length > 0 ? (
             selectedAppointment.workload.map((task, index) => (
               <Box key={index} sx={{ mb: 1 }}>
                 <Typography><strong>Step {task.step}:</strong> {task.description} ({task.status})</Typography>
               </Box>
             ))
           ) : (
             <Typography>No workload details available.</Typography>
           )}
         </Box>
     
         {/* Supervisor Message and Suggestion */}
         <Box mb={2}>
           <Typography variant="h6" color="primary"><strong>Technician's Feedback</strong></Typography>
           <Typography><strong>Technician Message:</strong> {selectedAppointment.techMessage || 'N/A'}</Typography>
           <Typography><strong>Suggestion:</strong> {selectedAppointment.suggestion || 'N/A'}</Typography>
         </Box>
       </DialogContent>
       <DialogActions>
         <Button onClick={handleClose} variant="contained" color="primary">
           Close
         </Button>
       </DialogActions>
     </Dialog>
     
      )}
    </Container>
  );
}

export default ManagerHistory;

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
} from "@mui/material";
import IssueViewer from "./sub/IssueView";
import InvoiceView from "./sub/InvoiceView";

const baseURL=import.meta.env.VITE_API_BASE_URL;
//const API_BASE_URL = "http://localhost:5000/api/appointments";

// Fetch only "Paid" appointments
const fetchPaidAppointments = async () => {
  try {
    const response = await axios.get(`${baseURL}/appointments`);
    return response.data.reverse().filter((appt) => appt.status === "Paid");
  } catch (error) {
    console.error("Error fetching paid appointments:", error);
    return [];
  }
};

const SupHistory = () => {
  const [appointments, setAppointments] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const getAppointments = async () => {
      const data = await fetchPaidAppointments();
      setAppointments(data);
    };
    getAppointments();
  }, []);

  const filteredAppointments = appointments.filter((appointment) =>
    (appointment.vehicleId || "")
      .toString()
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

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
              <TableCell><strong>Exp. Delivery</strong></TableCell>
              <TableCell>Invoice</TableCell>
              <TableCell><strong>Status</strong></TableCell>
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
                    {new Date(appointment.expectedDeliveryDate).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </TableCell>
                  <TableCell>
                    <InvoiceView appointment={appointment}/>
                  </TableCell>
                  <TableCell>
                    <span
                      style={{
                        color: "green",
                        fontWeight: 500,
                        textTransform: "capitalize",
                      }}
                    >
                      {appointment.status}
                    </span>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  No paid appointments
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default SupHistory;

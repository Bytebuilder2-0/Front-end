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
} from "@mui/material";

// API Base URL
const API_BASE_URL = "http://localhost:5000/api/appointments";

// Fetch all appointments
const fetchAppointments = async () => {
  try {
    const response = await axios.get(API_BASE_URL);
    return response.data.reverse().filter((x) => x.status === "Accepted"); // Show only Accepted appointments
  } catch (error) {
    console.error("Error fetching appointments:", error);
    return [];
  }
};

const SupInprogress=() =>{
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

  return (
    <TableContainer component={Paper} sx={{ marginTop: 2 }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell><strong>Vehicle ID</strong></TableCell>
            <TableCell><strong>Vehicle Number</strong></TableCell>
            <TableCell><strong>Description</strong></TableCell>
            <TableCell><strong>Technician Messages</strong></TableCell>
            <TableCell><strong>Suggestions</strong></TableCell>
            <TableCell><strong>Action</strong></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {appointments.map((appointment) => (
            <TableRow key={appointment._id}>
              <TableCell>{appointment.vehicleId}</TableCell>
              <TableCell>{appointment.vehicleNumber}</TableCell>
              <TableCell>{appointment.issue}</TableCell>
              <TableCell> {/* Empty row for Technician Messages */} </TableCell>
              <TableCell> {/* Empty row for Suggestions */} </TableCell>
              <TableCell> {/* Empty row for Actions */} </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default SupInprogress;

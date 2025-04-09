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
  Container,
  Box,
  Typography,
  TextField,
  List,
  ListItem,
  ListItemText,
  Divider,
} from "@mui/material";

const API_BASE_URL = "http://localhost:5000/api/appointments";

function TCompleted() {
  const [appointments, setAppointments] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCompletedJobs = async () => {
      try {
        const res = await axios.get(API_BASE_URL);
        const completedJobs = res.data.filter(
          (appointment) => appointment.status === "Assigned"
        );
        setAppointments(completedJobs);
      } catch (error) {
        console.error("Failed to fetch completed jobs", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCompletedJobs();
  }, []);

  const filteredAppointments = appointments.filter((appointment) =>
    (appointment.vehicleId || "")
      .toString()
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  return (
    <Container>
      <h2>Completed Works</h2>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h5" gutterBottom>
          Appointments
        </Typography>
        <TextField
          label="Search by Vehicle ID"
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </Box>

      <TableContainer component={Paper} elevation={3}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>Vehicle ID</strong></TableCell>
              <TableCell><strong>Vehicle Number</strong></TableCell>
              <TableCell><strong>Model</strong></TableCell>
              <TableCell><strong>Workload</strong></TableCell>
              <TableCell><strong>Date</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  Loading...
                </TableCell>
              </TableRow>
            ) : filteredAppointments.length > 0 ? (
              filteredAppointments.map((appointment) => (
                <TableRow key={appointment._id}>
                  <TableCell>{appointment.vehicleId}</TableCell>
                  <TableCell>{appointment.vehicleNumber}</TableCell>
                  <TableCell>{appointment.model}</TableCell>
                  <TableCell>
                    <List dense>
                      {appointment.workload?.filter((task) => task.status === "Completed").map((task) => (
                        <React.Fragment key={task.step}>
                          <ListItem>
                            <ListItemText
                              primary={`Step ${task.step}: ${task.description}`}
                              secondary={`Status: ${task.status}`}
                            />
                          </ListItem>
                          <Divider />
                        </React.Fragment>
                      ))}
                    </List>
                  </TableCell>
                  <TableCell>
                    {new Date(appointment.appointmentDate).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  No completed appointments found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
}

export default TCompleted;

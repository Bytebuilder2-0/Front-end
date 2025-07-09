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
  IconButton,
} from "@mui/material";
import AssignmentIcon from "@mui/icons-material/Assignment";
import { lightBlue } from "@mui/material/colors";

const API_BASE_URL = "http://localhost:5000/api/appointments";

function TCompleted() {
  const [appointments, setAppointments] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

   const [expandedWorkload, setExpandedWorkload] = useState({});

  useEffect(() => {
    const fetchCompletedJobs = async () => {
      try {
        const res = await axios.get(API_BASE_URL);
        const completedJobs = res.data.filter(
          (appointment) => appointment.status === "Task Done"
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

  const handleToggleWorkload = (appointmentId) => {
    setExpandedWorkload((prev) => ({
      ...prev,
      [appointmentId]: !prev[appointmentId],
    }));
  };

  const filteredAppointments = appointments.filter((appointment) =>
    (appointment.vehicleId || "")
      .toString()
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  return (
    <Container>
      <h2>Completed Works</h2>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
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
              <TableCell>
                <strong>Vehicle ID</strong>
              </TableCell>
              <TableCell>
                <strong>Vehicle Number</strong>
              </TableCell>
              <TableCell>
                <strong>Model</strong>
              </TableCell>
              <TableCell>
                <strong>Workload</strong>
              </TableCell>
              <TableCell>
                <strong>Date</strong>
              </TableCell>
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
                <React.Fragment key={appointment._id}>
                  <TableRow key={appointment._id}>
                    <TableCell>{appointment.vehicleId}</TableCell>
                    <TableCell>{appointment.vehicleNumber}</TableCell>
                    <TableCell>{appointment.model}</TableCell>
                    <TableCell>
                      <IconButton
                        onClick={() => handleToggleWorkload(appointment._id)}
                      >
                        <AssignmentIcon />
                      </IconButton>
                    </TableCell>
                    <TableCell>
                      {new Date(
                        appointment.appointmentDate
                      ).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                  {expandedWorkload[appointment._id] && (
                    <TableRow>
                      <TableCell colSpan={7} sx={{ textAlign: "center" }}>
                        <Box display="flex" justifyContent="center">
                          <Table
                            size="small"
                            sx={{
                              width: "50%",
                              backgroundColor: lightBlue[50],
                            }}
                          >
                            <TableHead>
                              <TableRow>
                                <TableCell align="center">
                                  <strong>Step</strong>
                                </TableCell>
                                <TableCell align="center">
                                  <strong>Description</strong>
                                </TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {appointment.workload.map((task, index) => (
                                <TableRow key={task._id || index}>
                                  <TableCell>{task.step}</TableCell>
                                  <TableCell>{task.description}</TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </Box>
                      </TableCell>
                    </TableRow>
                  )}
                </React.Fragment>
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

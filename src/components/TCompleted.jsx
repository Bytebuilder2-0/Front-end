import React, { useState, useEffect } from "react";
import axios from "axios";
import API_BASE_URL from "../config/api";
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
import { useAuth } from "../context/AuthContext";

const API_URL = `${API_BASE_URL}/appointments`;

function TCompleted() {
  const { user, token } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [expandedWorkload, setExpandedWorkload] = useState({});

  useEffect(() => {
    const fetchCompletedJobs = async () => {
      if (!token || !user?.technicianId) return;

      try {
        const res = await axios.get(API_URL, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        //  Filter only "Task Done" and assigned to this technician
        const completedJobs = res.data.filter(
          (appointment) =>
            appointment.status === "Task Done" &&
            appointment.tech?._id?.toString() === user.technicianId
        );

        setAppointments(completedJobs);
      } catch (error) {
        console.error("Failed to fetch completed jobs", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCompletedJobs();
  }, [token, user]);

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

      <TableContainer
        component={Paper}
        sx={{
          marginTop: 2,
          overflow: "auto",
          maxHeight: 400,
          borderRadius: 2,
          boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.05)",
        }}
      >
        <Table stickyHeader>
          <TableHead>
            <TableRow
              sx={{
                "& th": { fontWeight: "bold", backgroundColor: "#f5f5f5" },
              }}
            >
              <TableCell>Vehicle ID</TableCell>
              <TableCell>Vehicle Number</TableCell>
              <TableCell>Model</TableCell>
              <TableCell>Workload</TableCell>
              <TableCell>Exp.Date</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                  Loading...
                </TableCell>
              </TableRow>
            ) : filteredAppointments.length > 0 ? (
              filteredAppointments.map((appointment) => (
                <React.Fragment key={appointment._id}>
                  <TableRow
                    sx={{
                      "&:nth-of-type(odd)": { backgroundColor: "#fafafa" },
                      "&:hover": { backgroundColor: "#e0e0e0" },
                    }}
                  >
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
                        appointment.expectedDeliveryDate
                      ).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </TableCell>
                  </TableRow>

                  {expandedWorkload[appointment._id] && (
                    <TableRow>
                      <TableCell colSpan={6} sx={{ textAlign: "center" }}>
                        <Box display="flex" justifyContent="center">
                          <Table
                            size="small"
                            sx={{
                              width: "50%",
                              backgroundColor: lightBlue[50],
                              borderRadius: 1,
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
                                <TableRow
                                  key={task._id || index}
                                  sx={{
                                    "&:nth-of-type(odd)": {
                                      backgroundColor: "#f0f8ff",
                                    },
                                  }}
                                >
                                  <TableCell align="center">
                                    {task.step}
                                  </TableCell>
                                  <TableCell align="center">
                                    {task.description}
                                  </TableCell>
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
                <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
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

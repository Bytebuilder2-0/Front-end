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
  Button,
  IconButton,
  Typography,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import EditIcon from "@mui/icons-material/Edit";
import AssignmentIcon from "@mui/icons-material/Assignment";
import DoneOutlineIcon from "@mui/icons-material/DoneOutline";
import { lightBlue } from "@mui/material/colors";

const API_BASE_URL = "http://localhost:5000/api/appointments";

function TInprogress() {
  const [appointments, setAppointments] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  const [openDialog, setOpenDialog] = useState(false);
  const [technicianSuggestion, setTechnicianSuggestion] = useState("");
  const [selectedAppointmentId, setSelectedAppointmentId] = useState(null);
  const [expandedWorkload, setExpandedWorkload] = useState({});
  // Fetch appointments from backend  ..
  useEffect(() => {
    axios
      .get(API_BASE_URL)
      .then((response) => {
        setAppointments(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching appointments:", error);
        setLoading(false);
      });
  }, []);

  const filteredAppointments = appointments.filter((appointment) =>
    (appointment.vehicleId || "")
      .toString()
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const handleOpenDialog = async (appointmentId) => {
    // setSelectedAppointmentId(appointmentId);
    // setTechnicianSuggestion("hiii");
    // setOpenDialog(true);

    try {
      const response = await axios.get(
        `http://localhost:5000/api/appointments/${appointmentId}/techMessage`
      );
      setSelectedAppointmentId(appointmentId);
      setTechnicianSuggestion(response.data.techMessage); // Ensure fresh data is fetched
      setOpenDialog(true);
    } catch (error) {
      console.error("Error fetching workload:", error);
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedAppointmentId(null);
  };

  const handleTechnicianSuggestion = async () => {
    try {
      await axios.put(
        `${API_BASE_URL}/${selectedAppointmentId}/tSuggestionWrite`,
        {
          techMessage: technicianSuggestion,
        }
      );

      // Update frontend UI
      setAppointments((prevAppointments) =>
        prevAppointments.map((appointment) =>
          appointment._id === selectedAppointmentId
            ? { ...appointment, techMessage: technicianSuggestion }
            : appointment
        )
      );

      alert("Suggestion Message Send To The Manager!");
    } catch (error) {
      console.error("Error declining appointment:", error);
      alert("❌ Failed Message Send.");
    } finally {
      handleCloseDialog();
    }
  };
  const handleToggleWorkload = (appointmentId) => {
    setExpandedWorkload((prev) => ({
      ...prev,
      [appointmentId]: !prev[appointmentId],
    }));
  };

  const handleCompleteStep = async (appointmentId, taskId) => {
    try {
      await axios.put(
        `${API_BASE_URL}/${appointmentId}/workload/${taskId}`,
        {
          status: "Completed"
        }
      );

      setAppointments((prevAppointments) =>
        prevAppointments.map((appointment) => {
          if (appointment._id === appointmentId) {
            return {
              ...appointment,
              workload: appointment.workload.map((task) =>
                task._id === taskId ? { ...task, status: "Completed" } : task
              ),
            };
          }
          return appointment;
        })
      );
  
      alert("✅ Task marked as completed!");
    } catch (error) {
      console.error("Error completing step:", error.response?.data || error.message);
      alert("❌ Failed to complete the task.");
    }
  };
  
  
  
  
  
  

  return (
    <Container>
      <h2>Inprogress Works</h2>
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
                <strong>Description</strong>
              </TableCell>
              <TableCell>
                <strong>Suggestions</strong>
              </TableCell>
              <TableCell>
                <strong>Supervisor Message</strong>
              </TableCell>
              <TableCell>
                <strong>Status</strong>
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
              filteredAppointments
                .filter((appointment) =>
                  ["InProgress"].includes(appointment.status)
                )
                .map((appointment) => (
                  <React.Fragment key={appointment._id}>
                    <TableRow key={appointment._id}>
                      <TableCell>{appointment.vehicleId}</TableCell>
                      <TableCell>{appointment.vehicleNumber}</TableCell>
                      <TableCell>{appointment.issue}</TableCell>
                      <TableCell>
                        <IconButton
                          variant="contained"
                          endIcon={<SendIcon />}
                          onClick={() => handleOpenDialog(appointment._id)}
                          style={{ marginRight: "10px" }}
                        >
                          <EditIcon sx={{ fontSize: 28 }} />
                        </IconButton>
                      </TableCell>
                      <TableCell>{appointment.suggestion}</TableCell>
                      <TableCell>
                        <IconButton
                          onClick={() => handleToggleWorkload(appointment._id)}
                        >
                          <AssignmentIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                    {expandedWorkload[appointment._id] && (
                      <TableRow>
                      <TableCell colSpan={7} align="center"> 
                        <Table size="small" sx={{ width: '80%', margin: '0 auto', backgroundColor: lightBlue[50] }}>
                          <TableHead>
                            <TableRow>
                              <TableCell>Step</TableCell>
                              <TableCell>Description</TableCell>
                              <TableCell>Mark Complete</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {appointment.workload.map((task, index) => (
                              <TableRow key={task._id || index}>
                                <TableCell>{task.step}</TableCell>
                                <TableCell>{task.description}</TableCell>
                                <TableCell>
                                  {task.status === "Completed" ? (
                                    <Typography color="success.main">
                                      Completed
                                    </Typography>
                                  ) : (
                                    <Button
                                      variant="outlined"
                                      color="success"
                                      size="small"
                                      onClick={() =>
                                        handleCompleteStep(appointment._id, task._id || index)
                                      }
                                      startIcon={<DoneOutlineIcon />}
                                    >
                                      Complete
                                    </Button>
                                  )}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableCell>
                    </TableRow>
                    
                    )}
                  </React.Fragment>
                ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  No matching appointments
                </TableCell>
              </TableRow>
            )}
            {/* Decline Reason Dialog */}

            <Dialog open={openDialog} onClose={handleCloseDialog}>
              <DialogTitle>Suggection to supervisor</DialogTitle>
              <DialogContent>
                <TextField
                  autoFocus
                  margin="dense"
                  label="suggection"
                  type="text"
                  fullWidth
                  multiline
                  rows={3}
                  value={technicianSuggestion}
                  onChange={(e) => setTechnicianSuggestion(e.target.value)}
                  sx={{
                    "& .MuiInputBase-root": {
                      alignItems: "flex-start", // aligns text at the top
                      width: 500,
                    },
                  }}
                />
              </DialogContent>
              <DialogActions>
                <Button onClick={handleCloseDialog} color="error">
                  Cancel
                </Button>
                <Button
                  onClick={handleTechnicianSuggestion}
                  disabled={(technicianSuggestion || "").trim() === ""}
                >
                  Send
                </Button>
              </DialogActions>
            </Dialog>
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
}

export default TInprogress;

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
import { useAuth } from "../context/AuthContext";

const API_BASE_URL = "http://localhost:5000/api/appointments";

function TInprogress() {
	const { user, token } = useAuth();
	const [appointments, setAppointments] = useState([]);
	const [searchTerm, setSearchTerm] = useState("");
	const [loading, setLoading] = useState(true);
	const [openDialog, setOpenDialog] = useState(false);
	const [technicianSuggestion, setTechnicianSuggestion] = useState("");
	const [selectedAppointmentId, setSelectedAppointmentId] = useState(null);
	const [expandedWorkload, setExpandedWorkload] = useState({});

	useEffect(() => {
		const fetchAppointments = async () => {
			try {
				const response = await axios.get(API_BASE_URL, {
					headers: {
						Authorization: `Bearer ${token}`,
					},
				});

				const inprogressAppointments = response.data.filter(
					(appointment) =>
						appointment.status === "InProgress" &&
						appointment.tech?._id?.toString() === user?.technicianId
				);

				setAppointments(inprogressAppointments);
			} catch (error) {
				console.error("Error fetching appointments:", error);
			} finally {
				setLoading(false);
			}
		};

		if (token && user?.technicianId) {
			fetchAppointments();
		}
	}, [token, user]);

	const handleToggleWorkload = (appointmentId) => {
		setExpandedWorkload((prev) => ({
			...prev,
			[appointmentId]: !prev[appointmentId],
		}));
	};

	const handleOpenDialog = async (appointmentId) => {
		try {
			const response = await axios.get(`${API_BASE_URL}/${appointmentId}/techMessage`, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});
			setSelectedAppointmentId(appointmentId);
			setTechnicianSuggestion(response.data.techMessage || "");
			setOpenDialog(true);
		} catch (error) {
			console.error("Error fetching technician suggestion:", error);
		}
	};

	const handleCloseDialog = () => {
		setOpenDialog(false);
		setSelectedAppointmentId(null);
		setTechnicianSuggestion("");
	};

	const handleTechnicianSuggestion = async () => {
		try {
			await axios.put(
				`${API_BASE_URL}/${selectedAppointmentId}/tSuggestionWrite`,
				{ techMessage: technicianSuggestion },
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);

			setAppointments((prev) =>
				prev.map((appointment) =>
					appointment._id === selectedAppointmentId
						? { ...appointment, techMessage: technicianSuggestion }
						: appointment
				)
			);

			alert("Suggestion message sent to the supervisor.");
		} catch (error) {
			console.error("Error sending suggestion:", error);
			alert("Failed to send suggestion.");
		} finally {
			handleCloseDialog();
		}
	};

	const handleCompleteStep = async (appointmentId, taskId) => {
		try {
			await axios.put(
				`${API_BASE_URL}/${appointmentId}/workload/${taskId}`,
				{ status: "Completed" },
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);

			setAppointments((prev) =>
				prev.map((appointment) =>
					appointment._id === appointmentId
						? {
								...appointment,
								workload: appointment.workload.map((task) =>
									task._id === taskId ? { ...task, status: "Completed" } : task
								),
						  }
						: appointment
				)
			);

			alert("Task marked as completed!");
		} catch (error) {
			console.error("Error completing task:", error);
			alert("Failed to complete the task.");
		}
	};

	const handleAllStepsComplete = async (appointmentId) => {
		const confirm = window.confirm("Mark entire appointment as completed?");
		if (!confirm) return;

		try {
			await axios.put(
				`${API_BASE_URL}/${appointmentId}/tStatusUpdate`,
				{ status: "Task Done" },
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);

			setAppointments((prev) =>
				prev.map((appointment) =>
					appointment._id === appointmentId
						? { ...appointment, status: "Task Done" }
						: appointment
				)
			);

			alert("Appointment marked as completed.");
		} catch (error) {
			console.error("Error completing appointment:", error);
			alert("Failed to complete appointment.");
		}
	};

	const filteredAppointments = appointments.filter((appointment) =>
		(appointment.vehicleId || "")
			.toString()
			.toLowerCase()
			.includes(searchTerm.toLowerCase())
	);

	return (
		<Container>
			<h2>Inprogress Works</h2>
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
								<strong>Workload</strong>
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
									<TableRow>
										<TableCell>{appointment.vehicleId}</TableCell>
										<TableCell>{appointment.vehicleNumber}</TableCell>
										<TableCell>{appointment.issue}</TableCell>
										<TableCell>
											<IconButton onClick={() => handleOpenDialog(appointment._id)}>
												<EditIcon sx={{ fontSize: 28 }} />
											</IconButton>
										</TableCell>
										<TableCell>
											<IconButton onClick={() => handleToggleWorkload(appointment._id)}>
												<AssignmentIcon />
											</IconButton>
										</TableCell>
									</TableRow>

									{expandedWorkload[appointment._id] && (
										<TableRow>
											<TableCell colSpan={6} align="center">
												<Table
													size="small"
													sx={{
														width: "80%",
														margin: "0 auto",
														backgroundColor: lightBlue[50],
													}}
												>
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
																				handleCompleteStep(
																					appointment._id,
																					task._id || index
																				)
																			}
																			startIcon={<DoneOutlineIcon />}
																		>
																			Complete
																		</Button>
																	)}
																</TableCell>
															</TableRow>
														))}
														{appointment.workload.length > 0 && (
															<TableRow>
																<TableCell colSpan={3} align="center">
																	<Button
																		variant="contained"
																		color="primary"
																		onClick={() =>
																			handleAllStepsComplete(appointment._id)
																		}
																		disabled={
																			!appointment.workload.every(
																				(task) => task.status === "Completed"
																			)
																		}
																	>
																		All Steps Done
																	</Button>
																</TableCell>
															</TableRow>
														)}
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
									No in-progress appointments found.
								</TableCell>
							</TableRow>
						)}

						<Dialog open={openDialog} onClose={handleCloseDialog}>
							<DialogTitle>Suggestion to Supervisor</DialogTitle>
							<DialogContent>
								<TextField
									autoFocus
									margin="dense"
									label="Suggestion"
									type="text"
									fullWidth
									multiline
									rows={3}
									value={technicianSuggestion}
									onChange={(e) => setTechnicianSuggestion(e.target.value)}
									sx={{ width: 500 }}
								/>
							</DialogContent>
							<DialogActions>
								<Button onClick={handleCloseDialog} color="error">
									Cancel
								</Button>
								<Button
									onClick={handleTechnicianSuggestion}
									disabled={technicianSuggestion.trim() === ""}
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

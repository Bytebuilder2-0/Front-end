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
import EditIcon from "@mui/icons-material/Edit";
import AssignmentIcon from "@mui/icons-material/Assignment";
import DoneOutlineIcon from "@mui/icons-material/DoneOutline";
import { useAuth } from "../context/AuthContext";
import ConfirmationDialog from "./sub/Confirmation"; //Import your reusable confirmation dialog

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

	// For Task Completion Confirmation
	const [openTaskConfirm, setOpenTaskConfirm] = useState(false);
	const [taskToComplete, setTaskToComplete] = useState({
		appointmentId: null,
		taskId: null,
	});

	// For Entire Appointment Completion Confirmation
	const [openAllStepsConfirm, setOpenAllStepsConfirm] = useState(false);
	const [appointmentToComplete, setAppointmentToComplete] = useState(null);

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
		} catch (error) {
			console.error("Error sending suggestion:", error);
		} finally {
			handleCloseDialog();
		}
	};

	//  Handle Task Completion Confirmation
	const openTaskCompletionConfirm = (appointmentId, taskId) => {
		setTaskToComplete({ appointmentId, taskId });
		setOpenTaskConfirm(true);
	};

	const handleTaskCompletionConfirm = async () => {
		const { appointmentId, taskId } = taskToComplete;
		if (!appointmentId || !taskId) return;

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
		} catch (error) {
			console.error("Error completing task:", error);
		} finally {
			setOpenTaskConfirm(false);
			setTaskToComplete({ appointmentId: null, taskId: null });
		}
	};

	//  Handle Entire Appointment Completion Confirmation
	const openAllStepsCompletionConfirm = (appointmentId) => {
		setAppointmentToComplete(appointmentId);
		setOpenAllStepsConfirm(true);
	};

	const handleAllStepsCompletionConfirm = async () => {
		if (!appointmentToComplete) return;

		try {
			await axios.put(
				`${API_BASE_URL}/${appointmentToComplete}/tStatusUpdate`,
				{ status: "Task Done" },
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);

			setAppointments((prev) =>
				prev.map((appointment) =>
					appointment._id === appointmentToComplete
						? { ...appointment, status: "Task Done" }
						: appointment
				)
			);
		} catch (error) {
			console.error("Error completing appointment:", error);
		} finally {
			setOpenAllStepsConfirm(false);
			setAppointmentToComplete(null);
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
						<TableRow sx={{ "& th": { fontWeight: "bold", backgroundColor: "#f5f5f5" } }}>
							<TableCell>Vehicle ID</TableCell>
							<TableCell>Vehicle Number</TableCell>
							<TableCell>Description</TableCell>
							<TableCell>Suggestions</TableCell>
							<TableCell>Workload</TableCell>
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

									{/* Expanded Workload Table */}
									{expandedWorkload[appointment._id] && (
										<TableRow>
											<TableCell colSpan={6} sx={{ backgroundColor: "#f0f8ff" }}>
												<Table
													size="small"
													sx={{
														width: "80%",
														margin: "0 auto",
														backgroundColor: "#f5faff",
														borderRadius: 1,
														boxShadow: "0 2px 5px rgba(0,0,0,0.05)",
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
															<TableCell align="center">
																<strong>Mark Complete</strong>
															</TableCell>
														</TableRow>
													</TableHead>
													<TableBody>
														{appointment.workload.map((task, index) => (
															<TableRow
																key={task._id || index}
																sx={{
																	"&:nth-of-type(odd)": {
																		backgroundColor: "#fafafa",
																	},
																}}
															>
																<TableCell align="center">{task.step}</TableCell>
																<TableCell align="center">{task.description}</TableCell>
																<TableCell align="center">
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
																				openTaskCompletionConfirm(
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
																			openAllStepsCompletionConfirm(appointment._id)
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
								<TableCell colSpan={6} align="center" sx={{ py: 4 }}>
									No in-progress appointments found.
								</TableCell>
							</TableRow>
						)}

						{/* Suggestion Dialog */}
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

			{/* Confirmation Dialog for Task Completion */}
			<ConfirmationDialog
				open={openTaskConfirm}
				title="Complete Task"
				message="Are you sure you want to mark this task as completed?"
				onConfirm={handleTaskCompletionConfirm}
				onCancel={() => setOpenTaskConfirm(false)}
			/>

			{/* Confirmation Dialog for Entire Appointment Completion */}
			<ConfirmationDialog
				open={openAllStepsConfirm}
				title="Complete Appointment"
				message="Are you sure you want to mark the entire appointment as completed?"
				onConfirm={handleAllStepsCompletionConfirm}
				onCancel={() => setOpenAllStepsConfirm(false)}
			/>
		</Container>
	);
}

export default TInprogress;

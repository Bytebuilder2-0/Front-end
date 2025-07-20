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
	Button,
	Box,
	Typography,
	TextField,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	IconButton,
} from "@mui/material";
import AssignmentIcon from "@mui/icons-material/Assignment";
import { lightBlue } from "@mui/material/colors";
import { useAuth } from "../context/AuthContext";

const API_BASE_URL = "http://localhost:5000/api/appointments";

function TAcceptedWork() {
	const { user, token } = useAuth();
	const [appointments, setAppointments] = useState([]);
	const [searchTerm, setSearchTerm] = useState("");
	const [loading, setLoading] = useState(true);
	const [openDialog, setOpenDialog] = useState(false);
	const [declineReason, setDeclineReason] = useState("");
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

				const assignedToMe = response.data.filter(
					(appointment) =>
						appointment.status === "Accepted" &&
						appointment.tech?._id?.toString() === user?.technicianId
				);

				setAppointments(assignedToMe);
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

	const handleConfirm = async (appointmentId) => {
		const confirm = window.confirm("Start this appointment?");
		if (!confirm) return;

		try {
			await axios.put(
				`${API_BASE_URL}/${appointmentId}/tStatusUpdate`,
				{ status: "InProgress" },
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);

			setAppointments((prev) =>
				prev.map((a) => (a._id === appointmentId ? { ...a, status: "InProgress" } : a))
			);

			alert("Appointment marked as In Progress!");
		} catch (error) {
			console.error("Error starting appointment:", error);
			alert("Failed to start appointment.");
		}
	};

	const handleOpenDialog = (appointmentId) => {
		setSelectedAppointmentId(appointmentId);
		setDeclineReason("");
		setOpenDialog(true);
	};

	const handleCloseDialog = () => {
		setOpenDialog(false);
		setSelectedAppointmentId(null);
	};

	const handleConfirmDecline = async () => {
		try {
			await axios.put(
				`${API_BASE_URL}/${selectedAppointmentId}/tStatusUpdate`,
				{
					status: "Reject2",
					reason: declineReason,
				},
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);

			setAppointments((prev) =>
				prev.map((a) =>
					a._id === selectedAppointmentId
						? { ...a, status: "Reject2", reason: declineReason }
						: a
				)
			);

			alert("Appointment Declined!");
		} catch (error) {
			console.error("Error declining appointment:", error);
			alert("Failed to decline appointment.");
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

	const filteredAppointments = appointments.filter((appointment) =>
		(appointment.vehicleId || "")
			.toString()
			.toLowerCase()
			.includes(searchTerm.toLowerCase())
	);

	return (
		<Container>
			<h2>Assigned Works</h2>

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
							<TableCell>Delivery Date</TableCell>
							<TableCell>Issue</TableCell>
							<TableCell>Workload</TableCell>
							<TableCell>Start</TableCell>
							<TableCell>Decline</TableCell>
						</TableRow>
					</TableHead>

					<TableBody>
						{loading ? (
							<TableRow>
								<TableCell colSpan={7} align="center" sx={{ py: 4 }}>
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
										<TableCell>
											{new Date(appointment.expectedDeliveryDate).toLocaleDateString(
												"en-US",
												{
													year: "numeric",
													month: "short",
													day: "numeric",
												}
											)}
										</TableCell>
										<TableCell>{appointment.issue}</TableCell>
										<TableCell>
											<IconButton onClick={() => handleToggleWorkload(appointment._id)}>
												<AssignmentIcon />
											</IconButton>
										</TableCell>
										<TableCell>
											{appointment.status === "InProgress" ? (
												<Button variant="contained" disabled>
													In Progress
												</Button>
											) : (
												<Button
													variant="contained"
													color="primary"
													onClick={() => handleConfirm(appointment._id)}
												>
													Start
												</Button>
											)}
										</TableCell>
										<TableCell>
											{appointment.status === "Reject2" ? (
												<Button variant="contained" disabled>
													Declined
												</Button>
											) : (
												<Button
													variant="contained"
													color="error"
													onClick={() => handleOpenDialog(appointment._id)}
												>
													Decline
												</Button>
											)}
										</TableCell>
									</TableRow>

									{expandedWorkload[appointment._id] && (
										<TableRow>
											<TableCell colSpan={7} sx={{ backgroundColor: "#f0f8ff" }}>
												<Box display="flex" justifyContent="center">
													<Table
														size="small"
														sx={{
															width: "60%",
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
								<TableCell colSpan={7} align="center" sx={{ py: 4 }}>
									No appointments found
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</TableContainer>

			{/* Decline Dialog */}
			<Dialog open={openDialog} onClose={handleCloseDialog}>
				<DialogTitle>Decline Appointment</DialogTitle>
				<DialogContent>
					<TextField
						autoFocus
						margin="dense"
						label="Reason for Decline"
						type="text"
						fullWidth
						multiline
						rows={3}
						value={declineReason}
						onChange={(e) => setDeclineReason(e.target.value)}
						sx={{ width: 500 }}
					/>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleCloseDialog}>Cancel</Button>
					<Button
						onClick={handleConfirmDecline}
						color="error"
						disabled={declineReason.trim() === ""}
					>
						Confirm Decline
					</Button>
				</DialogActions>
			</Dialog>
		</Container>
	);
}

export default TAcceptedWork;

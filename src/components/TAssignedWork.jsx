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

function TAssignedWork() {
	const { user, token } = useAuth();
	const [appointments, setAppointments] = useState([]);
	const [searchTerm, setSearchTerm] = useState("");
	const [loading, setLoading] = useState(true);

	const [openDialog, setOpenDialog] = useState(false);
	const [declineReason, setDeclineReason] = useState("");
	const [selectedAppointmentId, setSelectedAppointmentId] = useState(null);

	const [expandedWorkload, setExpandedWorkload] = useState({});

	// Fetch appointments from backend
	useEffect(() => {
		axios
			.get(API_BASE_URL, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			})
			.then((response) => {
				setAppointments(response.data);
				setLoading(false);
			})
			.catch((error) => {
				console.error("Error fetching appointments:", error);
				setLoading(false);
			});
	}, []);

	// Function to confirm appointment
	const handleConfirm = async (appointmentId) => {
		const isConfirmed = window.confirm(
			"Are you sure you want to confirm this appointment?"
		);
		if (!isConfirmed) return; // If user cancels, do nothing

		try {
			await axios.put(
				`${API_BASE_URL}/${appointmentId}/tStatusUpdate`,
				{ status: "Accepted" },
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);

			// Update UI instantly
			setAppointments((prevAppointments) =>
				prevAppointments.map((appointment) =>
					appointment._id === appointmentId
						? { ...appointment, status: "Accepted" }
						: appointment
				)
			);

			alert(" Appointment Confirmed!");
		} catch (error) {
			console.error("Error confirming appointment:", error);
			alert(" Failed to confirm appointment.");
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

			// Update frontend UI
			setAppointments((prevAppointments) =>
				prevAppointments.map((appointment) =>
					appointment._id === selectedAppointmentId
						? { ...appointment, status: "Reject2", reason: declineReason }
						: appointment
				)
			);

			alert(" Appointment Declined!");
		} catch (error) {
			console.error("Error declining appointment:", error);
			alert(" Failed to decline appointment.");
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

	const filteredAppointments = appointments
		// .filter((appointment) => {
		// 	console.log("🔍 Checking appointment:");
		// 	console.log("• appointment.tech:", appointment.tech?.toString());
		// 	console.log("• user.technicianId:", user?.technicianId);
		// 	console.log("• appointment.status:", appointment.status);
		// 	const match =
		// 		appointment.tech?.toString() === user?.technicianId &&
		// 		appointment.status === "Waiting for Technician Confirmation";
		// 	console.log("→ match:", match);
		// 	return match;
		// })
		.filter((appointment) =>
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
							<TableCell>Appointment Date</TableCell>
							<TableCell>Work Load</TableCell>
							<TableCell>Status</TableCell>
							<TableCell>Actions</TableCell>
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
							filteredAppointments
								.filter(
									(x) =>
										x.tech?._id?.toString() === user.technicianId &&
										x.status === "Waiting for Technician Confirmation"
								)
								.map((appointment) => (
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
											<TableCell>
												<IconButton onClick={() => handleToggleWorkload(appointment._id)}>
													<AssignmentIcon />
												</IconButton>
											</TableCell>
											<TableCell>
												{appointment.status === "Accepted" ? (
													<span style={{ color: "green", fontWeight: "bold" }}>
														Accepted
													</span>
												) : appointment.status === "Reject2" ? (
													<span style={{ color: "red", fontWeight: "bold" }}>
														Declined
													</span>
												) : (
													<span style={{ color: "orange", fontWeight: "bold" }}>
														Waiting
													</span>
												)}
											</TableCell>
											<TableCell>
												{appointment.status === "Accepted" ? (
													<Button variant="contained" disabled>
														{appointment.status}
													</Button>
												) : (
													<Button
														variant="contained"
														color="primary"
														onClick={() => handleConfirm(appointment._id)}
														sx={{ mr: 1 }}
													>
														Accept
													</Button>
												)}
												{appointment.status === "Reject2" ? (
													<Button variant="contained" disabled>
														Declined
													</Button>
												) : (
													<Button
														variant="contained"
														color="secondary"
														onClick={() => handleOpenDialog(appointment._id)}
													>
														Decline
													</Button>
												)}
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
																		<TableCell align="center">{task.step}</TableCell>
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
									No appointments found
								</TableCell>
							</TableRow>
						)}

						{/* Decline Reason Dialog */}
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
									sx={{
										"& .MuiInputBase-root": {
											alignItems: "flex-start",
											width: 500,
										},
									}}
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
					</TableBody>
				</Table>
			</TableContainer>
		</Container>
	);
}

export default TAssignedWork;

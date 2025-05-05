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
	IconButton,
	Tooltip,
} from "@mui/material";

import CheckCircleIcon from "@mui/icons-material/CheckCircle";

import IssueViewer from "./sub/IssueView";
import ConfirmationDialog from "./sub/Confirmation";
import CustomSnackbar from "./sub/CustomSnackbar";

// API Base URL
const baseURL = import.meta.env.VITE_API_BASE_URL;

// Fetch only "Pending" appointments
const fetchAppointments = async () => {
	try {
		const response = await axios.get(`${baseURL}/appointments`);

		return response.data.reverse().filter((appointment_obj) => appointment_obj.status === "Pending");
	} catch (error) {
		console.error("Error fetching appointments:", error);

		//Array returning, so that app won't crashed
		return [];
	}
};

// Update appointment status and remove from current table
const updateAppointmentStatus = async (appointmentId, newStatus, setAppointments) => {
	try {
		await axios.put(`${baseURL}/appointments/${appointmentId}/statusUpdate`, {
			status: newStatus,
		});

		// Remove updated appointment
		setAppointments((appointments) => {
			return appointments.filter((appointment_obj) => appointment_obj._id !== appointmentId);
		});
	} catch (error) {
		console.error(`Error updating appointment status to ${newStatus}:`, error);
	}
};

const InitialCheck = () => {
	//All appointments
	const [appointments, setAppointments] = useState([]);

	const [searchTerm, setSearchTerm] = useState("");

	const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);

	const [selectedAppointmentId, setSelectedAppointmentId] = useState(null);

	const [snackbarInfo, setSnackbarInfo] = useState({
		open: false,
		message: "",
		severity: "success", //Status
	});

	//Runs only in every intial mount of the component
	useEffect(() => {
		const getAppointments = async () => {
			const data = await fetchAppointments();
			setAppointments(data);
		};
		getAppointments();

		//Refresh every 5 sec
		const interval = setInterval(getAppointments, 5000);

		//Runs when unmounting the component
		return () => clearInterval(interval);
	}, []);

	const filteredAppointments = appointments.filter((appointment) =>
		(appointment.vehicleId || "").toLowerCase().includes(searchTerm.toLowerCase())
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
			<TableContainer component={Paper} sx={{ marginTop: 2, overflow: "auto", maxHeight: 400 }}>
				<Table stickyHeader>
					<TableHead>
						<TableRow>
							<TableCell>
								<strong>Vehicle ID</strong>
							</TableCell>
							<TableCell>
								<strong>Model</strong>
							</TableCell>
							<TableCell>
								<strong>Issue</strong>
							</TableCell>
							<TableCell>
								<strong>Exp.Delivery</strong>
							</TableCell>
							<TableCell>
								<strong>Status</strong>
							</TableCell>
							<TableCell>
								<strong>Action</strong>
							</TableCell>
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

									{/*Status with color */}
									<TableCell>
										<span
											style={{
												color:
													appointment.status === "Pending"
														? "orange"
														: appointment.status === "Confirmed"
														? "green"
														: "gray",
												fontWeight: 500,
												textTransform: "capitalize",
											}}
										>
											{appointment.status}
										</span>
									</TableCell>

									<TableCell>
										<Tooltip title="Accept">
											<IconButton
												color="success"
												onClick={() => {
													// save which appointment you clicked
													setSelectedAppointmentId(appointment._id);
													// open the confirmation dialog
													setConfirmDialogOpen(true);
												}}
												sx={{ fontSize: 30 }}
											>
												<CheckCircleIcon sx={{ fontSize: 30 }} />
											</IconButton>
										</Tooltip>
									</TableCell>
								</TableRow>
							))
						) : (
							//If no Filtered Items
							<TableRow>
								<TableCell colSpan={6} align="center">
									No Appointments Founded
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</TableContainer>
			<ConfirmationDialog
				open={confirmDialogOpen}
				title="Confirm Appointment"
				message="Are you sure you want to confirm this appointment?"
				onConfirm={async () => {
					await updateAppointmentStatus(selectedAppointmentId, "Confirmed", setAppointments);
					setConfirmDialogOpen(false);

					// after success, show snackbar
					setSnackbarInfo({
						open: true,
						message: "Appointment Confirmed Successfully!",
						severity: "success",
					});
				}}
				onCancel={() => {
					setConfirmDialogOpen(false);

					//after failure
					setSnackbarInfo({
						open: true,
						message: "Appointment not accepted",
						severity: "error",
					});
				}}
			/>

			<CustomSnackbar
				open={snackbarInfo.open}
				//change without lossing other info in the object
				onClose={() => setSnackbarInfo({ ...snackbarInfo, open: false })}
				message={snackbarInfo.message}
				action={snackbarInfo.severity}
			/>
		</Container>
	);
};

export default InitialCheck;

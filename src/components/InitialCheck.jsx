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
	Snackbar,
	
} from "@mui/material";
import MuiAlert from '@mui/material/Alert';

//mui icons
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

//Components
import IssueViewer from "./sub/IssueView";
import ConfirmationDialog from "./sub/Confirmation";

// API Base URL
const API_BASE_URL = "http://localhost:5000/api/appointments";

// Fetch only "Pending" appointments
const fetchAppointments = async () => {
	try {
		//full axios response object
		const response = await axios.get(API_BASE_URL);

		// Fetch only pending ones -- Array of json objects
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
		await axios.put(`${API_BASE_URL}/${appointmentId}/statusUpdate`, {
			status: newStatus,
		});

		setAppointments(
			(prevAppointments) => prevAppointments.filter((appt) => appt._id !== appointmentId) // Remove updated appointment
		);
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
	const [snackbarOpen, setSnackbarOpen] = useState(false);
	const [snackbarMessage, setSnackbarMessage] = useState("");

	useEffect(() => {
		const getAppointments = async () => {
			const data = await fetchAppointments();
			setAppointments(data);
		};
		getAppointments();
	}, []);

	const filteredAppointments = appointments.filter((appointment) =>
		(appointment.vehicleId || "").toString().toLowerCase().includes(searchTerm.toLowerCase())
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
			<TableContainer component={Paper} sx={{ marginTop: 2 }}>
				<Table>
					<TableHead>
						<TableRow>
             <TableCell></TableCell>
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
							filteredAppointments.map((appointment,index) => (
								<TableRow key={appointment._id}>
                  <TableCell>{index+1}</TableCell>
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

									{/*  Status with color */}
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
													setSelectedAppointmentId(appointment._id); // save which appointment you clicked
													setConfirmDialogOpen(true); // open the confirmation dialog
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
							<TableRow>
								<TableCell colSpan={6} align="center">
									No matching appointments
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
					setSnackbarMessage("Appointment Confirmed Successfully!");
					setSnackbarOpen(true);
				}}
				onCancel={() => setConfirmDialogOpen(false)}
			/>

			<Snackbar
				open={snackbarOpen}
				autoHideDuration={3000}
				onClose={() => setSnackbarOpen(false)}
				anchorOrigin={{ vertical: "top", horizontal: "right" }} // top right corner
				sx={{ top: 80 }} // add top margin
			>
				<MuiAlert
					onClose={() => setSnackbarOpen(false)}
					severity="success" // success = green, error = red, warning = yellow
					sx={{ width: "100%", bgcolor: "success.main", color: "white" }}
					variant="filled" // makes it filled color
				>
					{snackbarMessage}
				</MuiAlert>
			</Snackbar>
		</Container>
	);
};

export default InitialCheck;

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
	Typography,
	Container,
	TextField,
	Box,

} from "@mui/material";
import WorkloadManager from "./sub/WorkloadManager";
import IssueViewer from "./sub/IssueView";
import TechnicianAssignmentAndStatusUpdater from "./sub/TechnicianAssignmentAndStatusUpdater";
import CustomSnackbar from "./sub/CustomSnackbar";

// API Base URL
const baseURL=import.meta.env.VITE_API_BASE_URL;
//const API_BASE_URL = "http://localhost:5000/api/appointments";

// Fetch all appointments
const fetchAppointments = async () => {
	try {
		const response = await axios.get(`${baseURL}/appointments`);
		return response.data
			.reverse()
			.filter((x) => x.status === "Confirmed" || x.status === "Waiting for Technician Confirmation"); // Latest first
	} catch (error) {
		console.error("Error fetching appointments:", error);
		return [];
	}
};

// Main Appointment Data Component
function AppointmentData() {
	const [appointments, setAppointments] = useState([]);
	const [searchTerm, setSearchTerm] = useState("");



	const [snackbarInfo, setSnackbarInfo] = useState({
		open: false,
		message: "",
		severity: "success", // or "error", "info", etc.
	});

	useEffect(() => {
		const getAppointments = async () => {
	
			const data = await fetchAppointments();
			setAppointments(data);
			
		};
		getAppointments();

		const interval = setInterval(getAppointments, 5000);
		return () => clearInterval(interval);
	}, []);

	const updateAppointmentInState = (updatedAppointment) => {
		setAppointments((prevAppointments) =>
			prevAppointments.map((appt) => (appt._id === updatedAppointment._id ? updatedAppointment : appt))
		);
	};
	const showSnackbar = (message, severity = "success") => {
		setSnackbarInfo({
			open: true,
			message,
			severity,
		});
	};

	const filteredAppointments = appointments.filter((appointment) =>
		(appointment.vehicleId || "").toString().toLowerCase().includes(searchTerm.toLowerCase())
	);

	return (
		<Container>
			<Box display="flex" justifyContent="right" alignItems="center" mt={2} mb={2}>
				<TextField
					label="Search by Vehicle ID"
					variant="outlined"
					size="small"
					value={searchTerm}
					onChange={(e) => setSearchTerm(e.target.value)}
				/>
			</Box>

			<TableContainer component={Paper} elevation={3}
			  sx={{
				maxHeight: 400, // Adjust the height according to the number of rows you want to display
				overflowY: 'auto', // Enable vertical scroll when content overflows
			  }}
			>
				<Table stickyHeader>
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
								<strong>Issue</strong>
							</TableCell>
							<TableCell>
								<strong>Workload</strong>
							</TableCell>
							<TableCell>
								<strong>Assign Technician</strong>
							</TableCell>
						</TableRow>
					</TableHead>
      
					<TableBody>
            
						{filteredAppointments.length > 0 ? (
							filteredAppointments.map((appointment) => (
								<TableRow key={appointment._id}>
									<TableCell>{appointment.vehicleId}</TableCell>
									<TableCell>{appointment.vehicleNumber}</TableCell>
									<TableCell>{appointment.model}</TableCell>
									<TableCell>
										<IssueViewer issue={appointment.issue} />
									</TableCell>
									<TableCell>
										<WorkloadManager
											appointment={appointment}
											updateAppointment={updateAppointmentInState}
											showSnackbar={showSnackbar}
										/>
									</TableCell>
									<TableCell>
										<TechnicianAssignmentAndStatusUpdater
											appointment={appointment}
											updateAppointment={updateAppointmentInState}
											showSnackbar={showSnackbar}
										/>
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
			<CustomSnackbar
				open={snackbarInfo.open}
				message={snackbarInfo.message}
				severity={snackbarInfo.severity}
				onClose={() => setSnackbarInfo({ ...snackbarInfo, open: false })}
			/>
		</Container>
	);
}

export default AppointmentData;

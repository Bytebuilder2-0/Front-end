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
	TextField,
	Box,Typography
} from "@mui/material";

import WorkloadManager from "./sub/WorkloadManager";
import IssueViewer from "./sub/IssueView";
import TechnicianAssignmentAndStatusUpdater from "./sub/TechnicianAssignmentAndStatusUpdater";
import CustomSnackbar from "./sub/CustomSnackbar";

import { useAuth } from "../context/AuthContext";

// API Base URL
const baseURL = import.meta.env.VITE_API_BASE_URL;

// Fetch all appointments(status=confirmed,waiting for technician confirmation)
const fetchAppointments = async (supervisorId, token) => {
	try {
		const response = await axios.get(`${baseURL}/appointments`, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});
		return response.data
			.reverse()
			.filter(
				(x) =>
					x.sconfirmedBy?.toString() === supervisorId &&
					(x.status === "Confirmed" || x.status === "Waiting for Technician Confirmation")
			); // Latest first
	} catch (error) {
		console.error("Error fetching appointments:", error);
		return [];
	}
};

// Main Appointment Data Component
function AppointmentData() {
	const { user, token } = useAuth();
	const [appointments, setAppointments] = useState([]);
	const [searchTerm, setSearchTerm] = useState("");

	const [snackbarInfo, setSnackbarInfo] = useState({
		open: false,
		message: "",
		severity: "success", // or error,info,warning
	});

	useEffect(() => {
		if (!user || !token) return;

		const getAppointments = async () => {
			const data = await fetchAppointments(user.id, token);
			setAppointments(data);
		};
		getAppointments();
		//Polling every 5 sec
		const interval = setInterval(getAppointments, 5000);

		//Clear polling after component unmount
		return () => clearInterval(interval);
	}, [user, token]);

	//Child components appointment get updated, will reflect that back in parent witout refreshing
	const updateAppointmentInState = (updatedAppointment) => {
		setAppointments((prevAppointments) =>
			prevAppointments.map((appt) =>
				appt._id === updatedAppointment._id ? updatedAppointment : appt
			)
		);
	};

	const showSnackbar = (message, severity) => {
		setSnackbarInfo({
			open: true,
			message,
			severity,
		});
	};

	const filteredAppointments = appointments.filter((appointment) =>
		(appointment.vehicleId || "")
			.toString()
			.toLowerCase()
			.includes(searchTerm.toLowerCase())
	);

	return (
		<Container>
			{/* Search Bar */}
			<Box display="flex" justifyContent="right" alignItems="center" mt={2} mb={2}>
				<TextField
					label="Search by Vehicle ID"
					variant="outlined"
					size="small"
					value={searchTerm}
					onChange={(e) => setSearchTerm(e.target.value)}
				/>
			</Box>

			{/* Table */}
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
							<TableCell>Model</TableCell>
							<TableCell>Issue</TableCell>
							<TableCell>Workload</TableCell>
							<TableCell>Assign Technician</TableCell>
						</TableRow>
					</TableHead>

					<TableBody>
						{filteredAppointments.length > 0 ? (
							filteredAppointments.map((appointment) => (
								<TableRow
									key={appointment._id}
									sx={{
										"&:nth-of-type(odd)": { backgroundColor: "#fafafa" },
										"&:hover": { backgroundColor: "#e0e0e0" },
									}}
								>
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
											token={token}
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
								<TableCell colSpan={6} align="center" sx={{ py: 4 }}>
									<Typography variant="h6" color="text.secondary">
										No matching appointments
									</Typography>
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</TableContainer>

			<CustomSnackbar
				open={snackbarInfo.open}
				message={snackbarInfo.message}
				action={snackbarInfo.severity}
				onClose={() => setSnackbarInfo({ ...snackbarInfo, open: false })}
			/>
		</Container>
	);
}

export default AppointmentData;

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
	Typography,
} from "@mui/material";

import IssueViewer from "./sub/IssueView";
import TechMessageView from "./sub/TechMessageView";
import SuggestionWriting from "./sub/SuggestionWriting";
import WorkloadManager from "./sub/WorkloadManager";
import WhatsAppButton from "./sub/WhatsAppButton";
import CustomSnackbar from "./sub/CustomSnackbar";

import { useAuth } from "../context/AuthContext";

const baseURL = import.meta.env.VITE_API_BASE_URL;

// Fetch appointments with status Confirmed or Waiting for Technician Confirmation
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
					(x.status === "Accepted" || x.status === "InProgress")
			);
	} catch (error) {
		console.error("Error fetching appointments:", error);
		return [];
	}
};

const SupInprogress = () => {
	const { user, token } = useAuth();
	const [appointments, setAppointments] = useState([]);
	const [searchTerm, setSearchTerm] = useState("");

	const [snackbarInfo, setSnackbarInfo] = useState({
		open: false,
		message: "",
		severity: "success",
	});

	useEffect(() => {
		if (!user || !token) return;

		const getAppointments = async () => {
			const data = await fetchAppointments(user.id, token);
			setAppointments(data);
		};
		getAppointments();

		const interval = setInterval(getAppointments, 5000);

		return () => clearInterval(interval);
	}, [user, token]);

	const updateAppointmentInState = (updatedAppointment) => {
		setAppointments((prevAppointments) =>
			prevAppointments.map((appt) =>
				appt._id === updatedAppointment._id ? updatedAppointment : appt
			)
		);
	};

	const filteredAppointments = appointments.filter((appointment) =>
		(appointment.vehicleId || "")
			.toString()
			.toLowerCase()
			.includes(searchTerm.toLowerCase())
	);

	const showSnackbar = (message, severity) => {
		setSnackbarInfo({
			open: true,
			message,
			severity,
		});
	};

	return (
		<Container>
			<Box display="flex" justifyContent="right" alignItems="center" mb={2} mt={2}>
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
				<Table stickyHeader aria-label="appointment table">
					<TableHead>
						<TableRow sx={{ "& th": { fontWeight: "bold", backgroundColor: "#f5f5f5" } }}>
							<TableCell>Vehicle ID</TableCell>
							<TableCell>Vehicle Number</TableCell>
							<TableCell>Description</TableCell>
							<TableCell>Tech. Messages</TableCell>
							<TableCell>Suggestions</TableCell>
							<TableCell>Update Workload</TableCell>
							<TableCell>WhatsApp</TableCell>
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
									<TableCell>
										<IssueViewer issue={appointment.issue} />
									</TableCell>
									<TableCell>
										<TechMessageView x={appointment.techMessage} />
									</TableCell>
									<TableCell>
										<SuggestionWriting
											appointment={appointment}
											updateAppointment={updateAppointmentInState}
											showSnackbar={showSnackbar}
										/>
									</TableCell>
									<TableCell>
										<WorkloadManager
											appointment={appointment}
											updateAppointment={updateAppointmentInState}
											showSnackbar={showSnackbar}
										/>
									</TableCell>
									<TableCell>
										<WhatsAppButton phone={appointment.contactNumber} />
									</TableCell>
								</TableRow>
							))
						) : (
							<TableRow>
								<TableCell colSpan={7} align="center" sx={{ py: 4 }}>
									<Typography variant="h6" color="text.secondary">
										No Appointments Found
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
};

export default SupInprogress;

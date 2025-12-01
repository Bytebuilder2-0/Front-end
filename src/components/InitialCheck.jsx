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
	Typography,
} from "@mui/material";

import CheckCircleIcon from "@mui/icons-material/CheckCircle";

import IssueViewer from "./sub/IssueView";
import ConfirmationDialog from "./sub/Confirmation";
import CustomSnackbar from "./sub/CustomSnackbar";
import { useAuth } from "../context/AuthContext"; //  use the Auth context
import DeatailsViewer from "./ManagerDashboard/viewDeatails";

import API_BASE_URL from '../config/api';
const baseURL = API_BASE_URL.replace('/api', '');

const fetchAppointments = async (token) => {
	try {
		const response = await axios.get(`${baseURL}/appointments`, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});
		return response.data
			.reverse()
			.filter((appointment) => appointment.status === "Pending");
	} catch (error) {
		console.error("Error fetching appointments:", error);
		return [];
	}
};

const updateAppointmentStatus = async (
	appointmentId,
	newStatus,
	supervised,
	setAppointments,
	token
) => {
	try {
		await axios.put(
			`${baseURL}/appointments/${appointmentId}/statusUpdate`,
			{ status: newStatus },
			{ headers: { Authorization: `Bearer ${token}` } }
		);

		await axios.put(
			`${baseURL}/appointments/${appointmentId}/superby`,
			{ sconfirmedBy: supervised },
			{ headers: { Authorization: `Bearer ${token}` } }
		);

		setAppointments((appointments) =>
			appointments.filter((a) => a._id !== appointmentId)
		);
	} catch (error) {
		console.error(`Error updating appointment status to ${newStatus}:`, error);
	}
};

const InitialCheck = () => {
	const [appointments, setAppointments] = useState([]);
	const [searchTerm, setSearchTerm] = useState("");
	const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
	const [selectedAppointmentId, setSelectedAppointmentId] = useState(null);
	const [snackbarInfo, setSnackbarInfo] = useState({
		open: false,
		message: "",
		severity: "success",
	});

	const { user, token } = useAuth(); // grab from context

	useEffect(() => {
		const getAppointments = async () => {
			if (token) {
				const data = await fetchAppointments(token);
				setAppointments(data);
			}
		};

		getAppointments();
		const interval = setInterval(getAppointments, 5000);
		return () => clearInterval(interval);
	}, [token]);

	const filteredAppointments = appointments.filter((appointment) =>
		String(
			typeof appointment.vehicleId === "object"
				? appointment.vehicleId?.vehicleNumber || ""
				: appointment.vehicleId || ""
		)
			.toLowerCase()
			.includes(searchTerm.toLowerCase())
	);

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
				<Table stickyHeader>
					<TableHead>
						<TableRow sx={{ "& th": { fontWeight: "bold", backgroundColor: "#f5f5f5" } }}>
							<TableCell>Vehicle ID</TableCell>
							<TableCell>Model</TableCell>
							<TableCell>Issue</TableCell>
							<TableCell>Exp.Delivery</TableCell>
							<TableCell>Status</TableCell>
							<TableCell>Action</TableCell>
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
									<TableCell>{appointment.model}</TableCell>
									<TableCell>
										<IssueViewer appointment={appointment} />
									</TableCell>
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
													setSelectedAppointmentId(appointment._id);
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
							<TableRow>
								<TableCell colSpan={6} align="center" sx={{ py: 4 }}>
									<Typography variant="h6" color="text.secondary">
										No Appointments Found
									</Typography>
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
					if (!user || !user.id) {
						console.error("User not authenticated.");
						return;
					}
					await updateAppointmentStatus(
						selectedAppointmentId,
						"Confirmed",
						user.id,
						setAppointments,
						token
					);
					setConfirmDialogOpen(false);
					setSnackbarInfo({
						open: true,
						message: "Appointment Confirmed Successfully!",
						severity: "success",
					});
				}}
				onCancel={() => {
					setConfirmDialogOpen(false);
					setSnackbarInfo({
						open: true,
						message: "Appointment not accepted",
						severity: "error",
					});
				}}
			/>

			<CustomSnackbar
				open={snackbarInfo.open}
				onClose={() => setSnackbarInfo({ ...snackbarInfo, open: false })}
				message={snackbarInfo.message}
				action={snackbarInfo.severity}
			/>
		</Container>
	);
};

export default InitialCheck;

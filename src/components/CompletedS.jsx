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
	Box,
	Container,
	TextField,
	Typography,
	Button,
} from "@mui/material";

import IssueViewer from "./sub/IssueView";
import WhatsAppButton from "./sub/WhatsAppButton";
import BudgetReview from "./sub/BudgetReview";
import InvoiceView from "./sub/InvoiceView";
import CustomSnackbar from "./sub/CustomSnackbar";
import ConfirmationDialog from "./sub/Confirmation";
import { useAuth } from "../context/AuthContext";

import API_BASE_URL from '../config/api';
const baseURL = API_BASE_URL.replace('/api', '');

const fetchAppointments = async (supervisorId, token) => {
	try {
		const response = await axios.get(`${baseURL}/appointments`, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});
		return response.data.filter(
			(appt) =>
				appt.status === "Task Done" && appt.sconfirmedBy?.toString() === supervisorId
		);
	} catch (error) {
		console.error("Error fetching appointments:", error);
		return [];
	}
};

const updateAppointmentStatus = async (appointmentId, token) => {
	try {
		const res = await axios.put(
			`${baseURL}/appointments/${appointmentId}/statusUpdate`,
			{ status: "Paid" },
			{ headers: { Authorization: `Bearer ${token}` } }
		);
		return res.data;
	} catch (error) {
		console.error("Error updating appointment status to Paid:", error);
		throw error;
	}
};

function CompletedS() {
	const { user, token } = useAuth();
	const [appointments, setAppointments] = useState([]);
	const [searchTerm, setSearchTerm] = useState("");

	const [snackbarInfo, setSnackbarInfo] = useState({
		open: false,
		message: "",
		severity: "success",
	});

	const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
	const [selectedAppointmentId, setSelectedAppointmentId] = useState(null);

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

	//  EXACTLY LIKE WORKLOAD FLOW
	const updateAppointmentInState = (updatedAppointment) => {
		setAppointments((prevAppointments) =>
			prevAppointments.map((appt) =>
				appt._id === updatedAppointment._id ? updatedAppointment : appt
			)
		);
	};

	const removeAppointmentFromState = (appointmentId) => {
		setAppointments((prevAppointments) =>
			prevAppointments.filter((appt) => appt._id !== appointmentId)
		);
	};

	const showSnackbar = (message, severity) => {
		setSnackbarInfo({ open: true, message, severity });
	};

	const filteredAppointments = appointments.filter((appointment) =>
		String(appointment.vehicleId || "")
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
							<TableCell>Description</TableCell>
							<TableCell>Budget</TableCell>
							<TableCell>Invoice</TableCell>
							<TableCell>Contact</TableCell>
							<TableCell>Billing</TableCell>
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
										<BudgetReview
											appointment={appointment}
											btn_name="Review"
											updateAppointment={updateAppointmentInState} //SAME AS WORKLOAD
											showSnackbar={showSnackbar}
										/>
									</TableCell>
									<TableCell>
										<InvoiceView appointment={appointment} />
									</TableCell>
									<TableCell>
										<WhatsAppButton
											phone={appointment.contactNumber}
											VNumber={appointment.vehicleNumber}
										/>
									</TableCell>
									<TableCell>
										<Button
											variant="contained"
											color="success"
											size="small"
											onClick={() => {
												setSelectedAppointmentId(appointment._id);
												setConfirmDialogOpen(true);
											}}
										>
											Settled
										</Button>
									</TableCell>
								</TableRow>
							))
						) : (
							<TableRow>
								<TableCell colSpan={7} align="center" sx={{ py: 4 }}>
									<Typography variant="h6" color="text.secondary">
										No matching appointments found
									</Typography>
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</TableContainer>

			<ConfirmationDialog
				open={confirmDialogOpen}
				title="Confirm Payment"
				message="Are you sure you want to mark this appointment as Paid?"
				onConfirm={async () => {
					try {
						const updated = await updateAppointmentStatus(selectedAppointmentId, token);
						removeAppointmentFromState(updated._id);
						showSnackbar("Appointment marked as Paid!", "success");
					} catch {
						showSnackbar("Failed to update status", "error");
					}
					setConfirmDialogOpen(false);
				}}
				onCancel={() => {
					setConfirmDialogOpen(false);
					setSnackbarInfo({
						open: true,
						message: "Appointment not Paid",
						severity: "error",
					});
				}}
			/>

			<CustomSnackbar
				open={snackbarInfo.open}
				message={snackbarInfo.message}
				action={snackbarInfo.severity}
				onClose={() => setSnackbarInfo({ ...snackbarInfo, open: false })}
			/>
		</Container>
	);
}

export default CompletedS;

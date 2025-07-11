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
} from "@mui/material";

import IssueViewer from "./sub/IssueView";
import WhatsAppButton from "./sub/WhatsAppButton";
import BudgetReview from "./sub/BudgetReview";
import InvoiceView from "./sub/InvoiceView";
import CustomSnackbar from "./sub/CustomSnackbar";

import { useAuth } from "../context/AuthContext";

const baseURL = import.meta.env.VITE_API_BASE_URL;

const fetchAppointments = async (supervisorId, token) => {
	try {
		const response = await axios.get(`${baseURL}/appointments`, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});
		return response.data.filter(
			(appt) =>
				appt.status === "Task Done" &&
				appt.sconfirmedBy?.toString() === supervisorId
		);
	} catch (error) {
		console.error("Error fetching appointments:", error);
		return [];
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

	const showSnackbar = (message, severity) => {
		setSnackbarInfo({ open: true, message, severity });
	};

	const filteredAppointments = appointments.filter((appointment) =>
		(appointment.vehicleId || "").toLowerCase().includes(searchTerm.toLowerCase())
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

			<TableContainer component={Paper} sx={{ marginTop: 2 }}>
				<Table>
					<TableHead>
						<TableRow>
							<TableCell><strong>Vehicle ID</strong></TableCell>
							<TableCell><strong>Model</strong></TableCell>
							<TableCell><strong>Description</strong></TableCell>
							<TableCell><strong>Budget</strong></TableCell>
							<TableCell><strong>Invoice</strong></TableCell>
							<TableCell><strong>Payment</strong></TableCell>
							<TableCell><strong>Contact</strong></TableCell>
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
										<BudgetReview
											appointment={appointment}
											btn_name="Review"
											updateAppointment={updateAppointmentInState}
											showSnackbar={showSnackbar}
										/>
									</TableCell>
									<TableCell>
										<InvoiceView appointment={appointment} />
									</TableCell>
									<TableCell>{appointment.payment}</TableCell>
									<TableCell>
										<WhatsAppButton phone={appointment.contactNumber} />
									</TableCell>
								</TableRow>
							))
						) : (
							<TableRow>
								<TableCell colSpan={7} align="center">
									No matching appointments found
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

export default CompletedS;

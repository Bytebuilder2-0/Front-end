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
import InvoiceView from "./sub/InvoiceView";
import { useAuth } from "../context/AuthContext";

const baseURL = import.meta.env.VITE_API_BASE_URL;

// Fetch "Paid" appointments confirmed by the current supervisor
const fetchPaidAppointments = async (supervisorId, token) => {
	try {
		const response = await axios.get(`${baseURL}/appointments`, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});
		return response.data
			.reverse()
			.filter(
				(appt) => appt.status === "Paid" && appt.sconfirmedBy?.toString() === supervisorId
			);
	} catch (error) {
		console.error("Error fetching paid appointments:", error);
		return [];
	}
};

const SupHistory = () => {
	const { user, token } = useAuth();
	const [appointments, setAppointments] = useState([]);
	const [searchTerm, setSearchTerm] = useState("");

	useEffect(() => {
		if (!user || !token) return;

		const getAppointments = async () => {
			const data = await fetchPaidAppointments(user.id, token);
			setAppointments(data);
		};

		getAppointments();
	}, [user, token]);

	const filteredAppointments = appointments.filter((appointment) =>
		(appointment.vehicleId || "")
			.toString()
			.toLowerCase()
			.includes(searchTerm.toLowerCase())
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
				<Table stickyHeader aria-label="paid appointments table">
					<TableHead>
						<TableRow sx={{ "& th": { fontWeight: "bold", backgroundColor: "#f5f5f5" } }}>
							<TableCell>Vehicle ID</TableCell>
							<TableCell>Model</TableCell>
							<TableCell>Issue</TableCell>
							<TableCell>Exp. Delivery</TableCell>
							<TableCell>Invoice</TableCell>
							<TableCell>Status</TableCell>
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
										<IssueViewer issue={appointment.issue} />
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
										<InvoiceView appointment={appointment} />
									</TableCell>
									<TableCell>
										<span
											style={{
												color:
													appointment.status === "Paid"
														? "#4caf50"
														: appointment.status === "Pending"
														? "#ff9800"
														: "#9e9e9e",
												fontWeight: 500,
												textTransform: "capitalize",
											}}
										>
											{appointment.status}
										</span>
									</TableCell>
								</TableRow>
							))
						) : (
							<TableRow>
								<TableCell colSpan={6} align="center" sx={{ py: 4 }}>
									<Typography variant="h6" color="text.secondary">
										No paid appointments
									</Typography>
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</TableContainer>
		</Container>
	);
};

export default SupHistory;

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

			<TableContainer component={Paper} sx={{ marginTop: 2 }}>
				<Table>
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
								<strong>Exp. Delivery</strong>
							</TableCell>
							<TableCell>
								<strong>Invoice</strong>
							</TableCell>
							<TableCell>
								<strong>Status</strong>
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
												color: "green",
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
								<TableCell colSpan={6} align="center">
									No paid appointments
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

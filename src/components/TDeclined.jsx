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
	Box,
	Typography,
	TextField,
} from "@mui/material";
import { useAuth } from "../context/AuthContext";

const API_BASE_URL = "http://localhost:5000/api/appointments";

function TDeclined() {
	const { user, token } = useAuth(); //Ensure user and token are retrieved properly
	const [appointments, setAppointments] = useState([]);
	const [searchTerm, setSearchTerm] = useState("");
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		if (!token || !user) return; //  Block fetching if user is not authenticated

		axios
			.get(API_BASE_URL, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			})
			.then((response) => {
				setAppointments(response.data);
				setLoading(false);
			})
			.catch((error) => {
				console.error("Error fetching appointments:", error);
				setLoading(false);
			});
	}, [token, user]);

	// Filter by status and technician match
	const filteredAppointments = appointments
		.filter(
			(app) =>
				app.status === "Reject2" &&
				app.tech?._id?.toString() === user?.technicianId
		)
		.filter((appointment) =>
			(appointment.vehicleId || "")
				.toString()
				.toLowerCase()
				.includes(searchTerm.toLowerCase())
		);

	return (
		<Container>
			<h2>Declined Works</h2>
			<Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
				<Typography variant="h5" gutterBottom>
					Appointments
				</Typography>
				<TextField
					label="Search by Vehicle ID"
					variant="outlined"
					size="small"
					value={searchTerm}
					onChange={(e) => setSearchTerm(e.target.value)}
				/>
			</Box>

			<TableContainer component={Paper} elevation={3}>
				<Table>
					<TableHead>
						<TableRow>
							<TableCell><strong>Vehicle ID</strong></TableCell>
							<TableCell><strong>Vehicle Number</strong></TableCell>
							<TableCell><strong>Service Description</strong></TableCell>
							<TableCell><strong>Decline Reason</strong></TableCell>
							<TableCell><strong>Date</strong></TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{loading ? (
							<TableRow>
								<TableCell colSpan={6} align="center">
									Loading...
								</TableCell>
							</TableRow>
						) : filteredAppointments.length > 0 ? (
							filteredAppointments.map((appointment) => (
								<TableRow key={appointment._id}>
									<TableCell>{appointment.vehicleId}</TableCell>
									<TableCell>{appointment.vehicleNumber}</TableCell>
									<TableCell>{appointment.issue}</TableCell>
									<TableCell>{appointment.reason}</TableCell>
									<TableCell>
										{new Date(appointment.appointmentDate).toLocaleDateString()}
									</TableCell>
								</TableRow>
							))
						) : (
							<TableRow>
								<TableCell colSpan={6} align="center">
									No declined appointments found
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</TableContainer>
		</Container>
	);
}

export default TDeclined;

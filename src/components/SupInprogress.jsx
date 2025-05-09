import React, { useEffect, useState } from "react";
import axios from "axios";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Container, Box,TextField } from "@mui/material";

import IssueViewer from "./sub/IssueView";
import TechMessageView from "./sub/TechMessageView";
import SuggestionWriting from "./sub/SuggestionWriting";
import WorkloadManager from "./sub/WorkloadManager";
import WhatsAppButton from "./sub/WhatsAppButton";
import CustomSnackbar from "./sub/CustomSnackbar";

// API Base URL
const baseURL = import.meta.env.VITE_API_BASE_URL;

// Fetch all appointments(status=Accepted,Inprogress)
const fetchAppointments = async () => {
	try {
		const response = await axios.get(`${baseURL}/appointments`,{
			headers:{
				Authorization: `Bearer ${localStorage.getItem('token')}`
			}
		});
		return response.data.reverse().filter((x) => x.status === "Accepted" || x.status === "InProgress");
	} catch (error) {
		console.error("Error fetching appointments:", error);
		return [];
	}
};

const SupInprogress = () => {
	const [appointments, setAppointments] = useState([]);
	const [searchTerm, setSearchTerm] = useState("");

	const [snackbarInfo, setSnackbarInfo] = useState({
		open: false,
		message: "",
		severity: "success", // or error,info,warning
	});

	useEffect(() => {
		const getAppointments = async () => {
			const data = await fetchAppointments();
			setAppointments(data);
		};
		getAppointments();
		//Polling every 5 sec
		const interval = setInterval(getAppointments, 5000);

		//Clear polling after component unmount
		return () => clearInterval(interval);
	}, []);

	//Child components appointment get updated, will reflect that back in parent witout refreshing
	const updateAppointmentInState = (updatedAppointment) => {
		setAppointments((prevAppointments) =>
			prevAppointments.map((appt) => (appt._id === updatedAppointment._id ? updatedAppointment : appt))
		);
	};

	const filteredAppointments = appointments.filter((appointment) =>
		(appointment.vehicleId || "").toLowerCase().includes(searchTerm.toLowerCase())
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
			<Box display="flex" justifyContent="space-between" alignItems="center" mb={2} mt={2}></Box>
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
							<TableCell>
								<strong>Vehicle ID</strong>
							</TableCell>
							<TableCell>
								<strong>Vehicle Number</strong>
							</TableCell>
							<TableCell>
								<strong>Description</strong>
							</TableCell>
							<TableCell>
								<strong>Tech.Messages</strong>
							</TableCell>
							<TableCell>
								<strong>Suggestions</strong>
							</TableCell>
							<TableCell>
								<strong>Update Workload</strong>
							</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{filteredAppointments.length > 0 ? (
							filteredAppointments.map((appointment) => (
								<TableRow key={appointment._id}>
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
							//If no Filtered Items
							<TableRow>
								<TableCell colSpan={6} align="center">
									No Appointments Founded
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

import React, { useState, useEffect } from "react";
import axios from "axios";
import { Select, MenuItem, Button, TableCell, Box } from "@mui/material";
import ConfirmationDialog from "./Confirmation"; // Import your confirmation dialog

import API_BASE_URL from '../../config/api';
const baseURL = API_BASE_URL.replace('/api', '');

const TechnicianAssignmentAndStatusUpdater = ({
	appointment,
	updateAppointment,
	showSnackbar, // already passed from parent
}) => {
	const [technicians, setTechnicians] = useState([]);
	const [selectedTechnician, setSelectedTechnician] = useState(
		appointment?.tech?._id || ""
	);
	const [status, setStatus] = useState(appointment.status);
	const [techAssigned, setTechAssigned] = useState(Boolean(appointment.tech));
	const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);

	useEffect(() => {
		async function fetchTechnicians() {
			try {
				const response = await axios.get(`${baseURL}/technicians`, {
					headers: {
						Authorization: `Bearer ${localStorage.getItem("token")}`,
					},
				});
				setTechnicians(response.data);
			} catch (error) {
				console.error("Error fetching technicians:", error);
			}
		}
		fetchTechnicians();
	}, []);

	const handleTechnicianChange = async (event) => {
		const technicianId = event.target.value;
		setSelectedTechnician(technicianId);

		try {
			await axios.put(
				`${baseURL}/appointments/${appointment._id}/assign2`,
				{ technicianId },
				{ headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
			);

			setTechAssigned(Boolean(technicianId));
			updateAppointment({
				...appointment,
				tech: technicians.find((tech) => tech._id === technicianId),
			});

			showSnackbar("Technician Added", "success");
		} catch (error) {
			console.error("Error assigning technician:", error);
		}
	};

	const handleStatusUpdate = async () => {
		try {
			await axios.put(
				`${baseURL}/appointments/${appointment._id}/statusUpdate`,
				{ status: "Waiting for Technician Confirmation" },
				{ headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
			);

			setStatus("Waiting for Technician Confirmation");
			updateAppointment({
				...appointment,
				status: "Waiting for Technician Confirmation",
			});

			showSnackbar("Sent to Technician for review", "success");
		} catch (error) {
			console.error("Error updating status:", error);
		}
	};

	return (
		<TableCell
			sx={{
				verticalAlign: "middle",
				py: 0.5,
				borderBottom: "none",
			}}
		>
			<Box
				sx={{
					display: "flex",
					alignItems: "center",
					gap: 1,
					width: "100%",
				}}
			>
				<Select
					value={selectedTechnician}
					onChange={handleTechnicianChange}
					displayEmpty
					variant="outlined"
					disabled={status === "Waiting for Technician Confirmation"}
					sx={{
						height: 36,
						minWidth: 160,
						"& .MuiOutlinedInput-notchedOutline": {
							borderColor: "rgba(0,0,0,0.23)",
						},
						"&:hover .MuiOutlinedInput-notchedOutline": {
							borderColor: "#459328",
						},
						"&.Mui-focused .MuiOutlinedInput-notchedOutline": {
							borderColor: "#459328",
						},
					}}
				>
					<MenuItem value="">Sel.Technician</MenuItem>
					{!technicians.length &&
						techAssigned &&
						appointment.tech &&
						appointment.tech._id && (
							<MenuItem value={appointment.tech._id}>
								{appointment.tech.employee_id}
							</MenuItem>
						)}
					{technicians.length > 0 ? (
						technicians.map((tech) => (
							<MenuItem key={tech._id} value={tech._id}>
								{tech.employee_id}
							</MenuItem>
						))
					) : (
						<MenuItem disabled>No Technicians Available</MenuItem>
					)}
				</Select>

				<Button
					variant="contained"
					color="success"
					onClick={() => setConfirmDialogOpen(true)}
					disabled={!techAssigned || status === "Waiting for Technician Confirmation"}
					sx={{
						height: 36,
						minWidth: 110,
						whiteSpace: "nowrap",
						px: 1.5,
						textTransform: "none",
					}}
				>
					{status === "Waiting for Technician Confirmation" ? "Pending" : "Confirm"}
				</Button>
			</Box>

			<ConfirmationDialog
				open={confirmDialogOpen}
				title="Send to Technician"
				message="Are you sure you want to send this appointment to the technician for confirmation?"
				onConfirm={async () => {
					await handleStatusUpdate();
					setConfirmDialogOpen(false);
				}}
				onCancel={() => {
					setConfirmDialogOpen(false);
					showSnackbar("Appointment not Assigned", "error"); //FIXED
				}}
			/>
		</TableCell>
	);
};

export default TechnicianAssignmentAndStatusUpdater;

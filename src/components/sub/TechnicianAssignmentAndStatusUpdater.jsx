import React, { useState, useEffect } from "react";
import axios from "axios";
import { Select, MenuItem, Button } from "@mui/material";
import Grid from "@mui/material/Grid2";

const TechnicianAssignmentAndStatusUpdater = ({ appointment, updateAppointment, showSnackbar }) => {
	const [technicians, setTechnicians] = useState([]);
	const [selectedTechnician, setSelectedTechnician] = useState(appointment?.tech || "");
	const [status, setStatus] = useState(appointment.status);
	const [techAssigned, setTechAssigned] = useState(Boolean(appointment.tech));



	// Fetch technician list when the component mounts
	useEffect(() => {
		async function fetchTechnicians() {
			try {
				const response = await axios.get("http://localhost:5000/api/technicians");
				setTechnicians(response.data);
			
			} catch (error) {
				console.error("Error fetching technicians:", error);
			}
		}
		fetchTechnicians();
	}, []);

	// Fetch the appointment status when the component mounts

	const handleTechnicianChange = async (event) => {
		const technicianId = event.target.value;
		setSelectedTechnician(technicianId);

		try {
			await axios.put(`http://localhost:5000/api/appointments/${appointment._id}/assign2`, {
				technicianId,
			});

			setTechAssigned(Boolean(technicianId));
			updateAppointment({ ...appointment, tech: technicianId });

			showSnackbar("Technician Added", "success");
		} catch (error) {
			console.error("Error assigning technician:", error);
		}
	};

	// Update status to "Waiting for Technician Confirmation"
	const handleStatusUpdate = async () => {
		if (!techAssigned || status === "Waiting for Technician Confirmation") return;

		try {
			await axios.put(`http://localhost:5000/api/appointments/${appointment._id}/statusUpdate`, {
				status: "Waiting for Technician Confirmation",
			});

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
		<Grid container spacing={2}>
			{/* Technician Selection */}
			<Grid item xs={12} sm={6} display="flex" alignItems="center">
				<Select
					value={selectedTechnician}
					onChange={handleTechnicianChange}
					displayEmpty
					fullWidth
					disabled={status === "Waiting for Technician Confirmation"}
				>
					<MenuItem value="">Sel.Technician</MenuItem>

					{technicians.length > 0 ? (
						technicians.map((tech) => (
							<MenuItem key={tech._id} value={tech._id}>
								{tech.employee_id} - {tech.technician_id}
							</MenuItem>
						))
					) : (
						<MenuItem disabled>No Technicians Available</MenuItem>
					)}
				</Select>
			</Grid>

			{/* Status Update Button */}
			<Grid item xs={12} sm={6} display="flex" alignItems="center">
				<Button
					variant="contained"
					color="success"
					onClick={handleStatusUpdate}
					disabled={!techAssigned || status === "Waiting for Technician Confirmation"}
					fullWidth
				>
					{status === "Waiting for Technician Confirmation" ? "Pending" : "Confirm"}
				</Button>
			</Grid>
		</Grid>
	);
};

export default TechnicianAssignmentAndStatusUpdater;

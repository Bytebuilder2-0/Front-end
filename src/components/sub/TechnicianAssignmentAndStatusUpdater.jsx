import React, { useState, useEffect } from "react";
import axios from "axios";
import { Select, MenuItem, Button } from "@mui/material";
import Grid from "@mui/material/Grid2";

const baseURL=import.meta.env.VITE_API_BASE_URL;

const TechnicianAssignmentAndStatusUpdater = ({ appointment, updateAppointment, showSnackbar }) => {
	//All technicians
	const [technicians, setTechnicians] = useState([]);

	//Technician mongoDb Id
	const [selectedTechnician, setSelectedTechnician] = useState(appointment?.tech?._id || "");

	const [status, setStatus] = useState(appointment.status);
	const [techAssigned, setTechAssigned] = useState(Boolean(appointment.tech));

	//Fetch technician list when the component mounts
	useEffect(() => {
		async function fetchTechnicians() {
			try {
				const response = await axios.get(`${baseURL}/technicians`,{
					headers:{
						Authorization: `Bearer ${localStorage.getItem('token')}`
					}
				});
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
			await axios.put(`${baseURL}/appointments/${appointment._id}/assign2`, {
				technicianId,
			},{
				headers:{
					Authorization: `Bearer ${localStorage.getItem('token')}`
				}
			});

			setTechAssigned(Boolean(technicianId));
			updateAppointment({
				...appointment,
				tech: technicians.find((tech) => tech._id === technicianId), // full object
			});

			showSnackbar("Technician Added", "success");
		} catch (error) {
			console.error("Error assigning technician:", error);
		}
	};

	// Update status to "Waiting for Technician Confirmation"
	const handleStatusUpdate = async () => {
		if (!techAssigned || status === "Waiting for Technician Confirmation") return;

		try {
			await axios.put(`${baseURL}/appointments/${appointment._id}/statusUpdate`, {
				status: "Waiting for Technician Confirmation",
			},{
				headers:{
					Authorization: `Bearer ${localStorage.getItem('token')}`
				}
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

            {/* Fallback: Show assigned technician immediately if available */}
            {!technicians.length && techAssigned && appointment.tech && appointment.tech._id && (
            <MenuItem value={appointment.tech._id}>
              {appointment.tech.employee_id} - {appointment.tech.technician_id}
            </MenuItem>
          )}


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

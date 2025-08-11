import { Typography, Box, Divider } from "@mui/material";
import React, { useState, useEffect } from "react";
import AppointDetails from "./AppointDetails";
import NoAppointment from "./NoAppointment";
import VehicleDetails from "./VehicleDetails";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";

const UserWelcome = () => {
	const { user, token } = useAuth();
	const [hasAppointments, setHasAppointments] = useState(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		// Guard clause to prevent null access
		if (!user || !user.id) return;

		const checkAppointments = async () => {
			try {
				const API_URL = `http://localhost:5000/api/appointments/user/${user.id}`;

				const response = await axios.get(API_URL, {
					headers: {
						Authorization: `Bearer ${token}`,
					},
				});

				const validAppointments = response.data.data.filter(
					(appointment) => !["Cancelled", "Paid", "All done"].includes(appointment.status)
				);

				setHasAppointments(validAppointments.length > 0);
			} catch (err) {
				console.error("Error checking appointments:", err);
				setHasAppointments(false);
			} finally {
				setLoading(false);
			}
		};

		checkAppointments();
	}, [user?.id, token]);

	if (!user || !user.id) {
		return <Typography variant="h6">User not authenticated.</Typography>;
	}

	if (loading) {
		return <Typography>Loading...</Typography>;
	}

	return (
		<Box sx={{ p: 3, maxWidth: "auto", margin: "10 auto" }}>
			{/* Welcome Header */}
			<Typography
				variant="h3"
				gutterBottom
				sx={{
					fontFamily: '"Poppins", sans-serif',
					fontWeight: 780,
					letterSpacing: "-1px",
				}}
			>
				Welcome to Garage24 !!
			</Typography>

			<Typography
				variant="body1"
				sx={{
					mb: 3,
					color: "text.secondary",
					fontSize: "20px",
				}}
			>
				We are here to keep your vehicles running smoothly.
			</Typography>

			<Divider sx={{ my: 5, borderBottomWidth: 3 }} />

			{/* Conditional rendering of components */}
			{hasAppointments ? (
				<AppointDetails userId={user.id} />
			) : (
				<NoAppointment userId={user.id} />
			)}

			<Divider sx={{ my: 6, borderBottomWidth: 3 }} />

			<VehicleDetails userId={user.id} />
		</Box>
	);
};

export default UserWelcome;

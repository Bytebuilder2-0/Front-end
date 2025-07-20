import React, { useEffect, useState } from "react";
import {
	Typography,
	ListItemIcon,
	Box,
	List,
	ListItem,
	ListItemText,
	Divider,
	Stack,
	Grid,
	Button,
} from "@mui/material";
import {
	CheckCircle as CheckCircleIcon,
	Description as ServiceIcon,
	DirectionsCar as VehicleIcon,
	ConfirmationNumber as IdIcon,
	ModelTraining as ModelIcon,
	Task,
	CheckCircle,
} from "@mui/icons-material";
import { green } from "@mui/material/colors";

import axios from "axios";
import { loadStripe } from "@stripe/stripe-js";

const baseURL = import.meta.env.VITE_API_BASE_URL;

const stripePromise = loadStripe(
	"pk_test_51Rl8A92E8JZ0nXeqBkKSyzbSZnPa4fHYeEe8TF2ApdVDI8BDRoDDD5u4EIgPLuNkRMHyZvq47KqNf4fPbqMrGDwa004pUMyJfU"
);

const AppointmentDone = ({ appointment }) => {
	const tasks = appointment.workload || [];
	const completedTasks = tasks.filter((task) => task.status === "Completed");

	const [budget, setBudget] = useState(null);

	// ✅ Fetch budget exactly like in InvoiceView
	useEffect(() => {
		const fetchBudget = async () => {
			try {
				const response = await axios.get(`${baseURL}/budget/${appointment._id}/view`, {
					headers: {
						Authorization: `Bearer ${localStorage.getItem("token")}`,
					},
				});
				setBudget(response.data || {});
			} catch (error) {
				console.error("Error fetching budget:", error);
				setBudget({ totalAmount: 0 });
			}
		};

		fetchBudget();
	}, [appointment._id]);

	// ✅ Use totalAmount like InvoiceView
	const totalAmount = budget?.totalAmount || 0;
	const isBudgetSet = totalAmount > 0;

	const handlePayment = async () => {
		try {
			const { data } = await axios.post(
				"http://localhost:5000/api/payment/create-checkout-session",
				{ appointmentId: appointment._id }
			);

			const stripe = await stripePromise;
			await stripe.redirectToCheckout({ sessionId: data.id });
		} catch (error) {
			console.error("Payment Error:", error);
		}
	};

	return (
		<Box sx={{ padding: "20px" }}>
			{/* Appointment Header */}
			<Typography
				gutterBottom
				sx={{
					fontWeight: 600,
					fontSize: 35,
					marginBottom: "1px",
				}}
			>
				Appointment Details
			</Typography>
			<Typography variant="caption" sx={{ color: "green" }}>
				Appointment - Completed
			</Typography>

			<Divider sx={{ mb: 6 }} />

			<Grid container spacing={2} sx={{ mb: 3 }}>
				{/* Vehicle ID */}
				<Grid item xs={12} md={4}>
					<Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
						<IdIcon color="primary" sx={{ mr: 1 }} />
						<Typography>
							<strong>Vehicle ID:</strong> {appointment.vehicleId || "N/A"}
						</Typography>
					</Box>
				</Grid>

				{/* Service */}
				<Grid item xs={12} md={4}>
					<Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
						<ServiceIcon color="primary" sx={{ mr: 1 }} />
						<Typography>
							<strong>Service:</strong> {appointment.services || "N/A"}
						</Typography>
					</Box>
				</Grid>

				{/* Model & Plate Number */}
				<Grid item xs={12} md={4}>
					<Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
						<ModelIcon color="primary" sx={{ mr: 1 }} />
						<Typography>
							<strong>Model:</strong> {appointment.model || "N/A"}
						</Typography>
					</Box>
					<Box sx={{ display: "flex", alignItems: "center" }}>
						<VehicleIcon color="primary" sx={{ mr: 1 }} />
						<Typography>
							<strong>Plate Number:</strong> {appointment.vehicleNumber || "N/A"}
						</Typography>
					</Box>
				</Grid>
			</Grid>

			<Divider sx={{ my: 3 }} />

			{/* Payment & Tasks Completed Box */}
			<Box
				sx={{
					backgroundColor: green[50],
					p: 2,
					borderRadius: 1,
					mb: 3,
					borderLeft: `4px solid ${green[500]}`,
				}}
			>
				<Stack direction="row" alignItems="center" spacing={1} mb={1}>
					<CheckCircleIcon sx={{ color: green[800] }} />
					<Typography
						variant="subtitle1"
						sx={{ color: green[800], fontWeight: "bold", fontSize: "23px" }}
					>
						Tasks completed!
					</Typography>
				</Stack>
				<Typography variant="body2" sx={{ mb: 2 }}>
					Your vehicle is ready for pickup. Please complete the payment and leave
					feedback.
				</Typography>

				<Button
					variant="contained"
					onClick={handlePayment}
					sx={{ ml: 2 }}
					disabled={!isBudgetSet} // ✅ Disabled if totalAmount = 0
				>
					Make The Payment
				</Button>

				{!isBudgetSet && (
					<Typography
						variant="body2"
						sx={{ color: "red", mt: 1, ml: 2, fontStyle: "italic" }}
					>
						Budget has not been assigned by the supervisor yet.
					</Typography>
				)}
			</Box>

			{/* Completed Tasks List */}
			<Typography
				variant="subtitle2"
				gutterBottom
				sx={{ mt: 5, fontWeight: "bold", fontSize: "17px" }}
			>
				<Task sx={{ verticalAlign: "middle", mr: 1 }} />
				Services Performed
			</Typography>
			<List dense>
				{completedTasks.map((task, index) => (
					<ListItem key={index} sx={{ pl: 0 }}>
						<ListItemIcon sx={{ minWidth: 36 }}>
							<CheckCircle sx={{ color: green[500] }} />
						</ListItemIcon>
						<ListItemText
							primary={task.description}
							secondary={task.completedBy ? `Completed by: ${task.completedBy}` : null}
						/>
					</ListItem>
				))}
			</List>

			<Divider sx={{ my: 2 }} />
		</Box>
	);
};

export default AppointmentDone;

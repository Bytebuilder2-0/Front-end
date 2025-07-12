// No "use client" directive needed for Vite React projects

import { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent, CardHeader, Typography, Box, useTheme } from "@mui/material";
import Grid from "@mui/material/Grid"; // Standard Grid import
import DashboardIcon from "@mui/icons-material/Dashboard"; // MUI Icon for Total
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty"; // MUI Icon for Pending
import CheckCircleIcon from "@mui/icons-material/CheckCircle"; // MUI Icon for Confirmed
import TrendingUpIcon from "@mui/icons-material/TrendingUp"; // MUI Icon for trend indicator

// For Vite, environment variables are accessed via import.meta.env and typically start with VITE_
const baseURL = import.meta.env.VITE_API_BASE_URL;

const StatusSummary = () => {
	const theme = useTheme(); // Use MUI theme for consistent styling

	const [counts, setCounts] = useState({
		total: 0,
		pending: 0,
		confirmed: 0,
	});

	useEffect(() => {
		const fetchCounts = async () => {
			try {
				const response = await axios.get(`${baseURL}/appointments/statusCounts`, {
					headers: {
						Authorization: `Bearer ${localStorage.getItem("token")}`,
					},
				});
				setCounts(response.data);
			} catch (error) {
				console.error("Error fetching appointment counts:", error);
			}
		};
		fetchCounts();
	}, []); // Empty dependency array means this effect runs once after the initial render

	const statusData = [
		{
			title: "Total Appointments",
			subheader: "Overall count of all appointments",
			count: counts.total,
			icon: <DashboardIcon sx={{ fontSize: 40 }} />, // Using MUI Icon
			color: theme.palette.primary.light, // Example color from theme
		},
		{
			title: "Pending Appointments",
			subheader: "Appointments awaiting confirmation",
			count: counts.pending,
			icon: <HourglassEmptyIcon sx={{ fontSize: 40 }} />, // Using MUI Icon
			color: theme.palette.warning.light,
		},
		{
			title: "Confirmed Appointments",
			subheader: "Appointments successfully confirmed",
			count: counts.confirmed,
			icon: <CheckCircleIcon sx={{ fontSize: 40 }} />, // Using MUI Icon
			color: theme.palette.success.light,
		},
	];

	return (
		<Box sx={{ flexGrow: 1, p: 3 }}>
			<Grid container spacing={4} justifyContent="center">
				{statusData.map((data, index) => (
					<Grid item xs={12} sm={6} md={4} key={index}>
						<Card
							sx={{
								height: "100%",
								display: "flex",
								flexDirection: "column",
								justifyContent: "space-between",
								backgroundColor: data.color, // Use dynamic color from theme
								color: theme.palette.getContrastText(data.color), // Ensure text is readable
								borderRadius: theme.shape.borderRadius * 2, // More rounded corners
								boxShadow: theme.shadows[4], // Deeper shadow
								transition: "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
								"&:hover": {
									transform: "translateY(-5px)", // Lift on hover
									boxShadow: theme.shadows[8],
								},
							}}
						>
							<CardHeader
								title={
									<Typography variant="h6" component="div" sx={{ fontWeight: "bold" }}>
										{data.title}
									</Typography>
								}
								subheader={
									<Typography variant="body2" sx={{ opacity: 0.8 }}>
										{data.subheader}
									</Typography>
								}
								sx={{ pb: 0, pt: 2 }}
							/>
							<CardContent
								sx={{
									display: "flex",
									alignItems: "center",
									justifyContent: "space-between",
									pt: 1,
									pb: 2,
								}}
							>
								<Box sx={{ display: "flex", alignItems: "center" }}>
									<Typography
										variant="h3"
										component="div"
										sx={{ marginRight: 1, fontWeight: "bold" }}
									>
										{String(data.count).padStart(2, "0")}
									</Typography>
									{/* Using MUI Icon for trend indicator */}
									<TrendingUpIcon sx={{ fontSize: 24 }} />
								</Box>
								<Box
									sx={{
										display: "flex",
										alignItems: "center",
										justifyContent: "center",
										p: 1,
										borderRadius: "50%",
									}}
								>
									{data.icon}
								</Box>
							</CardContent>
						</Card>
					</Grid>
				))}
			</Grid>
		</Box>
	);
};

export default StatusSummary;

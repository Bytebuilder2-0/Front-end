"use client";

import { useState } from "react";
import {
	Button,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	Typography,
	Divider,
	IconButton,
	Tooltip,
	Grid,
	Box,
	List,
	ListItem,
	Paper,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";

const IssueViewer = ({ appointment }) => {
	const [open, setOpen] = useState(false);
	const [selectedTab, setSelectedTab] = useState("overview");

	if (!appointment) return null;

	const handleTabChange = (tabName) => {
		setSelectedTab(tabName);
	};

	// Simplified helper function (copy logic removed)
	const renderDetail = (label, value) => {
		if (!value && value !== 0) return null;
		return (
			<Grid item xs={12} sm={6} sx={{ display: "flex", alignItems: "center" }}>
				<Typography variant="body1">
					<Typography component="span" fontWeight="medium">
						{label}:
					</Typography>{" "}
					{value}
				</Typography>
			</Grid>
		);
	};

	// Reusable Paper
	const SectionPaper = ({ title, children }) => (
		<Paper elevation={1} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
			<Typography variant="h6" color="primary.main" mb={2}>
				{title}
			</Typography>
			{children}
		</Paper>
	);

	return (
		<>
			<Tooltip title="View Appointment Details" arrow>
				<IconButton sx={{ color: "text.secondary" }} onClick={() => setOpen(true)}>
					<VisibilityIcon sx={{ fontSize: 22 }} />
				</IconButton>
			</Tooltip>

			<Dialog open={!!open} onClose={() => setOpen(false)} maxWidth="md" fullWidth>
				<DialogTitle sx={{ fontWeight: "bold", color: "primary.main", pb: 1 }}>
					Appointment Details
				</DialogTitle>
				<Divider />
				<DialogContent dividers sx={{ p: 0 }}>
					{/* Tabs Navigation */}
					<Box
						sx={{
							borderBottom: 1,
							borderColor: "divider",
							display: "flex",
							justifyContent: "flex-start",
							overflowX: "auto",
						}}
					>
						<Button
							onClick={() => handleTabChange("overview")}
							sx={{
								textTransform: "none",
								borderRadius: 0,
								borderBottom: selectedTab === "overview" ? "2px solid" : "none",
								borderColor: "primary.main",
								color: selectedTab === "overview" ? "primary.main" : "text.secondary",
								fontWeight: selectedTab === "overview" ? "bold" : "normal",
								py: 1.5,
								px: 3,
								"&:hover": { bgcolor: "action.hover" },
							}}
						>
							Overview
						</Button>
						<Button
							onClick={() => handleTabChange("customer")}
							sx={{
								textTransform: "none",
								borderRadius: 0,
								borderBottom: selectedTab === "customer" ? "2px solid" : "none",
								borderColor: "primary.main",
								color: selectedTab === "customer" ? "primary.main" : "text.secondary",
								fontWeight: selectedTab === "customer" ? "bold" : "normal",
								py: 1.5,
								px: 3,
								"&:hover": { bgcolor: "action.hover" },
							}}
						>
							Customer Info
						</Button>
					</Box>

					{/* Tab Content */}
					<Box sx={{ p: 3 }}>
						{/* ✅ Overview Tab */}
						{selectedTab === "overview" && (
							<Grid container spacing={0}>
								{/* Vehicle Info */}
								{(appointment.vehicleId ||
									appointment.vehicleNumber ||
									appointment.model) && (
									<Grid item xs={12}>
										<SectionPaper title="Vehicle Information">
											<Grid container spacing={1}>
												{renderDetail("Vehicle ID", appointment.vehicleId)}
												{renderDetail("Vehicle Number", appointment.vehicleNumber)}
												{renderDetail("Model", appointment.model)}
											</Grid>
										</SectionPaper>
									</Grid>
								)}

								{/* Issue Info */}
								{(appointment.issue || appointment.reason) && (
									<Grid item xs={12}>
										<SectionPaper title="Issue Details">
											<Grid container spacing={1}>
												{renderDetail("Issue", appointment.issue)}
												{renderDetail("Reason", appointment.reason)}
											</Grid>
										</SectionPaper>
									</Grid>
								)}

								{/* Services */}
								{Array.isArray(appointment.services) &&
									appointment.services.length > 0 && (
										<Grid item xs={12}>
											<SectionPaper title="Services Selected">
												<List dense>
													{appointment.services.map((service, idx) => (
														<ListItem key={idx}>
															<Typography variant="body1">{service}</Typography>
														</ListItem>
													))}
												</List>
											</SectionPaper>
										</Grid>
									)}

								{/* Workload */}
								{Array.isArray(appointment.workload) &&
									appointment.workload.length > 0 && (
										<Grid item xs={12}>
											<SectionPaper title="Workload Details">
												<List dense>
													{appointment.workload.map((task, idx) => (
														<ListItem key={idx}>
															<Typography variant="body1">
																<Typography component="span" fontWeight="medium">
																	Step {task.step}:
																</Typography>{" "}
																{task.description} ({task.status})
															</Typography>
														</ListItem>
													))}
												</List>
											</SectionPaper>
										</Grid>
									)}

								{/* ✅ Date Info (moved to Overview) */}
								{(appointment.preferredDate ||
									appointment.preferredTime ||
									appointment.expectedDeliveryDate) && (
									<Grid item xs={12}>
										<SectionPaper title="Date Information">
											<Grid container spacing={1}>
												{renderDetail(
													"Preferred Date",
													appointment.preferredDate
														? new Date(appointment.preferredDate).toLocaleDateString()
														: undefined
												)}
												{renderDetail("Preferred Time", appointment.preferredTime)}
												{renderDetail(
													"Expected Delivery",
													appointment.expectedDeliveryDate
														? new Date(
																appointment.expectedDeliveryDate
														  ).toLocaleDateString()
														: undefined
												)}
											</Grid>
										</SectionPaper>
									</Grid>
								)}
							</Grid>
						)}

						{/* ✅ Customer Info Tab */}
						{selectedTab === "customer" && (
							<Grid container spacing={0}>
								{(appointment.userId?.name || appointment.userId?.email) && (
									<Grid item xs={12}>
										<SectionPaper title="Customer Information">
											<Grid container spacing={1}>
												{renderDetail("Name", appointment.userId?.name)}
												{renderDetail("Email", appointment.userId?.email || "N/A")}
											</Grid>
										</SectionPaper>
									</Grid>
								)}

								{appointment.contactNumber && (
									<Grid item xs={12}>
										<SectionPaper title="Contact Information">
											<Grid container spacing={1}>
												{renderDetail("Contact Number", appointment.contactNumber)}
											</Grid>
										</SectionPaper>
									</Grid>
								)}
							</Grid>
						)}
					</Box>
				</DialogContent>

				<DialogActions sx={{ p: 3 }}>
					<Button onClick={() => setOpen(false)} variant="contained" color="error">
						Close
					</Button>
				</DialogActions>
			</Dialog>
		</>
	);
};

export default IssueViewer;

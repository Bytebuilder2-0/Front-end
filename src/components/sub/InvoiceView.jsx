import React, { useState } from "react";
import ReceiptIcon from "@mui/icons-material/Receipt";
import axios from "axios";
import {
	Dialog,
	DialogTitle,
	DialogContent,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Paper,
	Button,
	Box,
	Typography,
	Grid,
	Divider,
} from "@mui/material";

const baseURL = import.meta.env.VITE_API_BASE_URL;

function InvoiceView({ appointment }) {
	const [open, setOpen] = useState(false);
	const [budget, setBudget] = useState(null);

	const fetchBudget = async () => {
		try {
			const response = await axios.get(`${baseURL}/budget/${appointment._id}/view`, {
				headers: {
					Authorization: `Bearer ${localStorage.getItem("token")}`,
				},
			});
			setBudget(response.data || {});
			setOpen(true);
		} catch (error) {
			console.error("Error fetching budget:", error);
			setBudget({ amountAllocations: [] });
		}
	};

	return (
		<>
			<ReceiptIcon
				fontSize="large"
				style={{ cursor: "pointer", color: "#33383E" }}
				onClick={fetchBudget}
			/>

			<Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="md">
				{/* Header Section */}
				<DialogTitle
					sx={{
						textAlign: "center",
						pb: 1,
						pt: 3,
						backgroundColor: "#f8f9fa",
						borderBottom: "1px solid #e0e0e0",
					}}
				>
					<Box display="flex" alignItems="center" justifyContent="center" gap={2}>
						<img
							src="/assets/garage.jpg"
							alt="Garage24 Logo"
							style={{
								maxWidth: "120px",
								height: "auto",
								borderRadius: "6px",
								boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
							}}
						/>
						<Typography
							variant="h4"
							sx={{ fontWeight: "bold", color: "#33383E", letterSpacing: "0.5px" }}
						>
							Invoice
						</Typography>
					</Box>
				</DialogTitle>

				{/* Business & Invoice Info */}
				<Box sx={{ px: 4, pt: 3, pb: 1, bgcolor: "#fff" }}>
					<Grid container spacing={2} alignItems="center">
						<Grid item xs={12} sm={6}>
							<Typography
								variant="h5"
								sx={{ fontWeight: "bold", color: "#33383E", mb: 1 }}
							>
								Garage24
							</Typography>
							<Typography variant="body2" color="#33383E">
								<strong>Tel:</strong> 0770188325
							</Typography>
							<Typography variant="body2" color="#33383E">
								<strong>Address:</strong> 123 Main Street, Colombo, Sri Lanka
							</Typography>
						</Grid>
						<Grid item xs={12} sm={6} sx={{ textAlign: { xs: "center", sm: "right" } }}>
							{budget?._id && (
								<Typography
									variant="h6"
									sx={{ fontWeight: "bold", color: "#428BCA", mb: 1 }}
								>
									Invoice #{budget._id}
								</Typography>
							)}
							{appointment?.preferredDate && (
								<Typography variant="body2" color="#33383E">
									Date: {new Date().toLocaleDateString()}
								</Typography>
							)}
						</Grid>
					</Grid>
				</Box>

				<Divider sx={{ my: 2 }} />

				{/* Table Section */}
				<DialogContent>
					{budget ? (
						<TableContainer
							component={Paper}
							elevation={2}
							sx={{ borderRadius: "8px", overflow: "hidden" }}
						>
							<Table>
								<TableHead sx={{ backgroundColor: "#459328" }}>
									<TableRow>
										<TableCell sx={{ color: "#fff", fontWeight: "bold" }}>Step</TableCell>
										<TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
											Description
										</TableCell>
										<TableCell align="right" sx={{ color: "#fff", fontWeight: "bold" }}>
											Amount (LKR)
										</TableCell>
									</TableRow>
								</TableHead>
								<TableBody>
									{(budget.amountAllocations || []).map((item, index) => (
										<TableRow
											key={index}
											sx={{
												"&:nth-of-type(odd)": { backgroundColor: "#f9f9f9" },
											}}
										>
											<TableCell sx={{ color: "#33383E" }}>{item.step}</TableCell>
											<TableCell sx={{ color: "#33383E" }}>{item.des}</TableCell>
											<TableCell align="right" sx={{ color: "#33383E" }}>
												LKR {item.amount}
											</TableCell>
										</TableRow>
									))}
									<TableRow
										sx={{
											backgroundColor: "#e8f5e9",
										}}
									>
										<TableCell colSpan={2} sx={{ fontWeight: "bold", color: "#33383E" }}>
											Total
										</TableCell>
										<TableCell
											align="right"
											sx={{ fontWeight: "bold", color: "#459328" }}
										>
											LKR {budget.totalAmount || 0}
										</TableCell>
									</TableRow>
								</TableBody>
							</Table>
						</TableContainer>
					) : (
						<Typography sx={{ textAlign: "center", mt: 2 }} color="#33383E">
							Loading...
						</Typography>
					)}
				</DialogContent>

				{/* Close Button */}
				<Box
					sx={{
						display: "flex",
						justifyContent: "center",
						p: 2,
						borderTop: "1px solid #e0e0e0",
						bgcolor: "#f8f9fa",
					}}
				>
					<Button
						onClick={() => setOpen(false)}
						color="error"
						variant="contained"
						sx={{
							width: "100px",
							fontWeight: "bold",
							textTransform: "none",
							borderRadius: "6px",
						}}
					>
						Close
					</Button>
				</Box>
			</Dialog>
		</>
	);
}

export default InvoiceView;

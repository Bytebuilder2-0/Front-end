import React, { useState } from "react";
import axios from "axios";
import { Button, Modal, Box, TextField, Typography } from "@mui/material";
import { Add } from "@mui/icons-material";

import API_BASE_URL from '../../config/api';
const baseURL = API_BASE_URL.replace('/api', '');

const BudgetReview = ({ appointment, updateAppointment, btn_name, showSnackbar }) => {
	const [openBudgetModal, setOpenBudgetModal] = useState(false);
	const [budgetAllocations, setBudgetAllocations] = useState([]);

	//  Fetch fresh data before opening
	const handleOpenBudget = async () => {
		if (!appointment?._id) {
			console.error("No appointment found");
			return;
		}

		try {
			const response = await axios.get(`${baseURL}/budget/${appointment._id}/view`, {
				headers: {
					Authorization: `Bearer ${localStorage.getItem("token")}`,
				},
			});
			setBudgetAllocations(response.data.amountAllocations || []);
			setOpenBudgetModal(true);
		} catch (error) {
			console.error("Error fetching budget:", error);
		}
	};

	const handleCloseModals = () => {
		setOpenBudgetModal(false);
	};

	const handleBudgetChange = (index, value) => {
		const updated = [...budgetAllocations];
		const parsedValue = parseFloat(value);
		updated[index].amount = !isNaN(parsedValue) && parsedValue > 0 ? parsedValue : 0;
		setBudgetAllocations(updated);
	};

	const addWorkloadStep = () => {
		setBudgetAllocations((x) => [...x, { step: x.length + 1, des: "", amount: 0 }]);
	};

	//  Same logic as workload submit
	const handleBudgetSubmit = async () => {
		if (!appointment?._id) return;

		try {
			// Update each step individually (same as your original code)
			for (const allocation of budgetAllocations) {
				await axios.put(
					`${baseURL}/budget/${appointment._id}/update`,
					{
						step: allocation.step,
						amount: allocation.amount,
						des: allocation.des,
					},
					{
						headers: {
							Authorization: `Bearer ${localStorage.getItem("token")}`,
						},
					}
				);
			}

			setOpenBudgetModal(false);

			//  Re-fetch updated appointment to sync with parent
			const { data } = await axios.get(`${baseURL}/appointments/${appointment._id}`, {
				headers: {
					Authorization: `Bearer ${localStorage.getItem("token")}`,
				},
			});

			updateAppointment(data); // Updates parent state properly
			setBudgetAllocations(data.amountAllocations || []);

			showSnackbar("Budget Reviewed", "success");
		} catch (error) {
			console.error("Error updating budget:", error);
			showSnackbar("Failed to update budget", "error");
		}
	};

	return (
		<>
			<Button
				variant="contained"
				sx={{ backgroundColor: "#333834" }}
				onClick={handleOpenBudget}
			>
				{btn_name}
			</Button>

			<Modal open={openBudgetModal} onClose={handleCloseModals}>
				<Box
					sx={{
						position: "absolute",
						top: "50%",
						left: "50%",
						transform: "translate(-50%, -50%)",
						width: 500,
						bgcolor: "white",
						boxShadow: 24,
						p: 4,
						borderRadius: 2,
					}}
				>
					<Typography variant="h6" gutterBottom>
						Budget Review for {appointment?.vehicleNumber}
					</Typography>

					{budgetAllocations.map((item, index) => (
						<Box
							key={index}
							sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}
						>
							<Typography variant="body1">{item.step}</Typography>
							<TextField
								label="Description"
								variant="outlined"
								size="small"
								value={item.des}
								onChange={(e) => {
									const updated = [...budgetAllocations];
									updated[index].des = e.target.value;
									setBudgetAllocations(updated);
								}}
								sx={{ width: "60%" }}
							/>

							<TextField
								label="Amount (LKR)"
								variant="outlined"
								size="small"
								type="number"
								value={item.amount}
								onChange={(e) => handleBudgetChange(index, e.target.value)}
								sx={{ width: "40%" }}
							/>
						</Box>
					))}

					<Button
						startIcon={<Add />}
						variant="contained"
						color="primary"
						fullWidth
						onClick={addWorkloadStep}
						sx={{ mt: 2 }}
					>
						Add Step
					</Button>

					<Box sx={{ display: "flex", justifyContent: "space-between", marginTop: 2 }}>
						<Button
							variant="contained"
							color="success"
							onClick={handleBudgetSubmit}
							sx={{ width: "48%" }}
						>
							Submit
						</Button>
						<Button
							variant="contained"
							color="error"
							onClick={() => {
								handleCloseModals();
								showSnackbar("Nothing Changed", "warning");
							}}
							sx={{ width: "48%" }}
						>
							Cancel
						</Button>
					</Box>
				</Box>
			</Modal>
		</>
	);
};

export default BudgetReview;

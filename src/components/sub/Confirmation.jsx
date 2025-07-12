import React from "react";
import {
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	Button,
	Typography,
} from "@mui/material";

const ConfirmationDialog = ({ open, title, message, onConfirm, onCancel }) => {
	return (
		<Dialog
			open={open}
			onClose={onCancel}
			sx={{
				"& .MuiDialog-paper": {
					borderRadius: 3,
					boxShadow: "0 8px 24px rgba(0, 0, 0, 0.2)",
					padding: 2,
					minWidth: 350,
				},
			}}
		>
			<DialogTitle
				sx={{
					fontSize: "1.5rem",
					fontWeight: 600,
					color: "#2E7D32", // greenish
				}}
			>
				{title || "Confirmation"}
			</DialogTitle>

			<DialogContent>
				<Typography sx={{ fontSize: "1rem", color: "#555" }}>
					{message || "Are you sure you want to proceed?"}
				</Typography>
			</DialogContent>

			<DialogActions sx={{ justifyContent: "flex-end", padding: "16px" }}>
				<Button
					onClick={onCancel}
					variant="outlined"
					color="error"
					sx={{
						textTransform: "none",
						borderRadius: 2,
						"&:hover": {
							backgroundColor: "#fdecea",
						},
					}}
				>
					Cancel
				</Button>
				<Button
					onClick={onConfirm}
					variant="contained"
					color="success"
					sx={{
						textTransform: "none",
						borderRadius: 2,
						boxShadow: "none",
						"&:hover": {
							backgroundColor: "#1B5E20",
						},
					}}
				>
					Confirm
				</Button>
			</DialogActions>
		</Dialog>
	);
};

export default ConfirmationDialog;

import React from "react";
import { Snackbar, Alert } from "@mui/material";

const CustomSnackbar = ({
	open,
	onClose,
	message,
	action = "success", // success, error, warning, info
	duration = 2000,
	position = { vertical: "top", horizontal: "right" },
}) => {
	return (
		<Snackbar
			open={open}
			autoHideDuration={duration}
			onClose={onClose}
			anchorOrigin={position}
		>
			<Alert
				onClose={onClose}
				severity={action}
				variant="filled"
				sx={{ width: "100%", mt: 5 }}
			>
				{message}
			</Alert>
		</Snackbar>
	);
};

export default CustomSnackbar;

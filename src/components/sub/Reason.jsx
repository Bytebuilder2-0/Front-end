import React, { useState } from "react";
import FeedbackIcon from "@mui/icons-material/Feedback";
import { Tooltip, IconButton, Modal, Box, Typography, Button } from "@mui/material";

const Reason = ({ reason }) => {
	const [open, setOpen] = useState(false);

	return (
		<>
			<Tooltip title="View Reason" arrow>
				<IconButton
					sx={{ color: "black" }}
					onClick={() => setOpen(true)}
					aria-label="View Reason for rejection"
				>
					<FeedbackIcon />
				</IconButton>
			</Tooltip>
			<Modal open={open} onClose={() => setOpen(false)}>
				<Box
					sx={{
						position: "absolute",
						top: "50%",
						left: "50%",
						transform: "translate(-50%, -50%)",
						width: 400,
						bgcolor: "white",
						boxShadow: 24,
						p: 4,
						borderRadius: 3,
						border: "3px solid #33383E",
					}}
				>
					<Typography
						variant="h5"
						sx={{
							display: "flex",
							alignItems: "center",
							gap: 1,
							fontWeight: "bold",
							color: "error.main",
							mb: 2,
						}}
					>
						Reason for Rejection
					</Typography>
					<Typography
						sx={{
							fontSize: "1rem",
							color: "text",
							lineHeight: 1.6,
							mb: 3,
							px: 1,
						}}
					>
						{reason || "No Reasons provided"}
					</Typography>
					<Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
						<Button
							variant="contained"
							color="error"
							onClick={() => setOpen(false)}
							sx={{
								textTransform: "none",
								fontWeight: "bold",
								px: 3,
								py: 1,
								borderRadius: 2,
								boxShadow: 3,
								transition: "0.3s",
								"&:hover": {
									backgroundColor: "error.dark",
									boxShadow: 6,
								},
							}}
						>
							Close
						</Button>
            </Box>
				</Box>
			</Modal>
		</>
	);
};

export default Reason;

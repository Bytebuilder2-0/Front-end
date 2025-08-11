import { useState } from "react";
import { Button, Modal, Box, Typography } from "@mui/material";

const TechMessageView = ({ x }) => {
	const [open, setOpen] = useState(false);

	return (
		<>
			<Button
				variant="outlined"
				color="success"
				sx={{ backgroundColor: "#33383E23", color: "#33383E" }}
				onClick={() => setOpen(true)}
			>
				View
			</Button>

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
							mb: 2,
						}}
					>
						Technician's Message
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
						{x || "No issue provided"}
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

export default TechMessageView;

import React from "react";
import {
	Box,
	Card,
	CardContent,
	CardHeader,
	CardActions,
	Typography,
	Button,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle"; // ✅ MUI Icon

export default function PaymentSuccess() {
	return (
		<Box
			sx={{
				display: "flex",
				minHeight: "100vh",
				alignItems: "center",
				justifyContent: "center",
				bgcolor: "grey.100",
				p: 2,
			}}
		>
			<Card sx={{ maxWidth: 400, textAlign: "center", p: 2 }}>
				<CardHeader
					avatar={
						<CheckCircleIcon sx={{ color: "success.main", fontSize: 60, mx: "auto" }} />
					}
					title={
						<Typography variant="h5" fontWeight="bold" mt={2}>
							Payment Successful!
						</Typography>
					}
					subheader="Your payment has been processed successfully. Thank you for your purchase!"
				/>
				<CardContent>
					<Typography variant="body2" color="text.secondary">
						You will receive a confirmation email shortly.
					</Typography>
				</CardContent>
				<CardActions sx={{ justifyContent: "center" }}>
					<Button variant="contained" color="primary" href="/">
						Go to Home
					</Button>
				</CardActions>
			</Card>
		</Box>
	);
}

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
import CancelIcon from "@mui/icons-material/Cancel"; // MUI icon

export default function PaymentCancel() {
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
					avatar={<CancelIcon sx={{ color: "error.main", fontSize: 60 }} />}
					title={
						<Typography variant="h5" fontWeight="bold" mt={2}>
							Payment Canceled
						</Typography>
					}
					subheader="Your payment was canceled. No charges have been made."
				/>
				<CardContent>
					<Typography variant="body2" color="text.secondary">
						If you encountered an issue, please try again or contact support.
					</Typography>
				</CardContent>
				<CardActions sx={{ justifyContent: "center", flexDirection: "column", gap: 1 }}>
					<Button variant="contained" color="primary" href="/">
						Go to Home
					</Button>
					{/* Uncomment if you want the Try Again button */}
					{/* 
          <Button variant="outlined" color="primary" href="/checkout">
            Try Again
          </Button> 
          */}
				</CardActions>
			</Card>
		</Box>
	);
}

import React, { useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  CardActions,
  Typography,
  Button,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

// Replace with your actual API base URL or environment variable
import API_BASE_URL from "../../config/api";

export default function PaymentSuccess() {
  const { appointmentId } = useParams();

  useEffect(() => {
    if (appointmentId) {
      axios
        .put(`${API_BASE_URL}/payment/update-status`, { appointmentId })
        .then((res) => console.log(" Payment updated:", res.data))
        .catch((err) => console.error(" Error updating payment:", err));
    }
  }, [appointmentId]);

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
            <CheckCircleIcon
              sx={{ color: "success.main", fontSize: 60, mx: "auto" }}
            />
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

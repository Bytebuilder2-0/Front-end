import React, { useEffect, useState } from "react";
import axios from "axios";
import API_BASE_URL from "../../config/api";
import {
  Typography,
  Paper,
  Divider,
  Box,
  CircularProgress,
  List,
  ListItem,
  Chip,
  useTheme,
  Grid,
  Stack,
  Avatar,
  Tooltip,
} from "@mui/material";
import {
  History as HistoryIcon,
  DirectionsCar,
  Build,
  CalendarToday, // Used for delivery date
  AttachMoney, // Used for payment
  EventAvailable, // Used for service date
  LocalShipping, // New: for vehicle number clarity
} from "@mui/icons-material";
import { useAuth } from "../../context/AuthContext";
import CreditScoreIcon from "@mui/icons-material/CreditScore";
import { format } from "date-fns";

const UserHistory = () => {
  const theme = useTheme();
  const { user, token } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [paymentData, setPaymentData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAppointmentsAndPayments = async () => {
      if (!user?.id) return;

      try {
        setLoading(true);
        const API_URL = `${API_BASE_URL}/appointments/user/${user.id}`;
        const response = await axios.get(API_URL, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const appointmentsData = response.data?.data || [];
        const filteredAppointments = appointmentsData.filter(
          (appt) => appt && ["All done", "Paid"].includes(appt.status)
        );

        setAppointments(filteredAppointments);

        const paymentMap = {};
        await Promise.all(
          filteredAppointments.map(async (app) => {
            try {
              const budgetRes = await axios.get(
                `${API_BASE_URL}/budget/${app._id}/view`,
                {
                  headers: { Authorization: `Bearer ${token}` },
                }
              );
              paymentMap[app._id] = budgetRes.data?.totalAmount || "N/A";
            } catch (err) {
              paymentMap[app._id] = "N/A";
            }
          })
        );

        setPaymentData(paymentMap);
      } catch (error) {
        console.error("Error fetching appointments:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointmentsAndPayments();
  }, [user?.id, token]);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!appointments || appointments.length === 0) {
    return (
      <Paper
        elevation={0}
        sx={{
          p: 4,
          textAlign: "center",
          borderRadius: 3,
          bgcolor:
            theme.palette.mode === "dark"
              ? "rgba(255, 255, 255, 0.05)"
              : "rgba(0, 0, 0, 0.02)",
        }}
      >
        <HistoryIcon sx={{ fontSize: 60, color: "text.secondary", mb: 2 }} />
        <Typography variant="h6" color="text.secondary" gutterBottom>
          No payment history found
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Your completed and paid appointments will appear here.
        </Typography>
      </Paper>
    );
  }

  return (
    <Box sx={{ padding: 3 }}>
      <Typography
        variant="h6"
        fontWeight={700}
        gutterBottom
        sx={{
          fontWeight: 600,
          fontSize: 30,
          marginBottom: "1px",
        }}
      >
        Your Service History
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 3 }}>
        All your completed and paid service appointments are listed below.
      </Typography>
      <Divider sx={{ mb: 4 }} />

      <List sx={{ width: "100%", p: 0 }}>
        {appointments.map((appointment) => (
          <Paper
            key={appointment._id}
            elevation={4} // Increased elevation
            sx={{
              mb: 3,
              p: 3,
              borderRadius: "16px", // More rounded corners
              borderLeft: `6px solid ${theme.palette.success.main}`, // Thicker success border

              position: "relative", // For absolute positioning of status chip
              overflow: "hidden",
            }}
          >
            {/* Status Chip at top right */}
            <Chip
              label="Paid"
              color="success"
              size="small"
              sx={{
                position: "absolute",
                top: 16,
                right: 16,
                fontWeight: 600,
              }}
            />

            <Stack direction="row" alignItems="center" spacing={2} mb={2}>
              <Avatar
                sx={{
                  bgcolor: theme.palette.primary.main,
                  width: 56,
                  height: 56,
                }}
              >
                <DirectionsCar sx={{ fontSize: 32 }} />
              </Avatar>
              <Box>
                <Typography variant="h6" fontWeight={700} color="text.primary">
                  {appointment.model || "Vehicle Service"}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {appointment.preferredDate
                    ? format(
                        new Date(appointment.preferredDate),
                        "MMM d, yyyy "
                      )
                    : "N/A"}
                </Typography>
              </Box>
            </Stack>

            <Divider sx={{ my: 2 }} />

            <Grid container spacing={3} alignItems="flex-start">
              {/* Vehicle Details */}
              <Grid item xs={12} sm={6}>
                <Stack direction="row" spacing={1.5} alignItems="center">
                  <Avatar
                    sx={{
                      bgcolor: theme.palette.grey[100],
                      width: 36,
                      height: 36,
                    }}
                  >
                    <LocalShipping
                      fontSize="small"
                      sx={{ color: theme.palette.text.secondary }}
                    />
                  </Avatar>
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Vehicle Number
                    </Typography>
                    <Typography variant="body1" fontWeight={600}>
                      {appointment.vehicleNumber || "Not specified"}
                    </Typography>
                  </Box>
                </Stack>
              </Grid>

              {/* Delivery Date */}
              <Grid item xs={12} sm={6}>
                <Stack direction="row" spacing={1.5} alignItems="center">
                  <Avatar
                    sx={{
                      bgcolor: theme.palette.grey[100],
                      width: 36,
                      height: 36,
                    }}
                  >
                    <CalendarToday
                      fontSize="small"
                      sx={{ color: theme.palette.text.secondary }}
                    />
                  </Avatar>
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Delivery Date
                    </Typography>
                    <Typography variant="body1" fontWeight={600}>
                      {appointment.expectedDeliveryDate
                        ? format(
                            new Date(appointment.expectedDeliveryDate),
                            "MMM d, yyyy"
                          )
                        : "Not specified"}
                    </Typography>
                  </Box>
                </Stack>
              </Grid>

              {/* Services List */}
              <Grid item xs={12}>
                <Stack direction="row" spacing={1.5} alignItems="flex-start">
                  <Avatar
                    sx={{
                      bgcolor: theme.palette.grey[100],
                      width: 36,
                      height: 36,
                      mt: 0.5,
                    }}
                  >
                    <Build
                      fontSize="small"
                      sx={{ color: theme.palette.text.secondary }}
                    />
                  </Avatar>
                  <Box>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      mb={0.5}
                    >
                      Services Provided
                    </Typography>
                    <Stack
                      direction="row"
                      flexWrap="wrap"
                      useFlexGap
                      spacing={1}
                    >
                      {appointment.services.map((service, index) => (
                        <Chip
                          key={index}
                          label={service}
                          size="medium" // Medium size chips
                          variant="outlined" // Filled for more prominence
                          color="info" // A distinct color for services
                          sx={{ fontWeight: 500 }}
                        />
                      ))}
                    </Stack>
                  </Box>
                </Stack>
              </Grid>

              {/* Payment Information */}
              <Grid item xs={12}>
                <Divider sx={{ my: 2 }} />
                <Stack
                  direction="row"
                  justifyContent="flex-end"
                  alignItems="center"
                  spacing={1.5}
                >
                  <AttachMoney
                    sx={{ color: theme.palette.success.main, fontSize: 24 }}
                  />
                  <Typography
                    variant="h6"
                    fontWeight={700}
                    color="text.primary"
                  >
                    Total :{" "}
                    {paymentData[appointment._id] !== undefined
                      ? `Rs. ${paymentData[appointment._id]}`
                      : "N/A"}
                  </Typography>
                </Stack>
              </Grid>
            </Grid>
          </Paper>
        ))}
      </List>
    </Box>
  );
};

export default UserHistory;

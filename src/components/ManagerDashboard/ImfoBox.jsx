import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  Box,
  useMediaQuery,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import { jwtDecode } from "jwt-decode";
import {
  HourglassEmpty, // New Jobs
  Build, // Ongoing Jobs
  CheckCircle, // Completed Jobs
  Cancel, // Cancelled Jobs
  ListAlt, // Total Appointments
} from "@mui/icons-material";

const baseURL = "http://localhost:5000/api";

const StatusSummary = () => {
  const isSmallScreen = useMediaQuery("(max-width:600px)");
  const [counts, setCounts] = useState({
    total: 0,
    pending: 0,
    checking: 0,
    confirmed: 0,
    rejected: 0,
    accepted: 0,
    inProgress: 0,
    taskDone: 0,
    paid: 0,
    waiting: 0,
    allDone: 0,
    cancelled: 0,
  });

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const response = await axios.get(
          `${baseURL}/appointments/statusCountsc`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        setCounts({
          total: response.data.total || 0,
          pending: response.data.pending || 0,
          checking: response.data.checking || 0,
          confirmed: response.data.confirmed || 0,
          rejected: response.data.reject2 || 0,
          accepted: response.data.accepted || 0,
          inProgress: response.data.inProgress || 0,
          taskDone: response.data["task done"] || 0,
          paid: response.data.paid || 0,
          waiting: response.data.waiting || 0,
          allDone: response.data["all done"] || 0,
          cancelled: response.data.cancelled || 0,
        });
      } catch (error) {
        console.error("Error fetching appointment counts:", error);
      }
    };

    fetchCounts();
  }, []);

  // Calculate category totals
  const newJobCount = counts.pending + counts.checking;
  const ongoingJobCount =
    counts.confirmed +
    counts.waiting +
    counts.accepted +
    counts.inProgress +
    counts.rejected;
  const completedJobCount = counts.taskDone + counts.paid + counts.allDone;
  const cancelledJobCount = counts.cancelled;

  const statusData = [
    {
      title: "Total Appointments",
      count: counts.total,
      icon: <ListAlt fontSize="large" />,
      color: "#7E57C2", // Purple
      details: null,
    },
    {
      title: "New Jobs",
      count: newJobCount,
      icon: <HourglassEmpty fontSize="large" />,
      color: "#FFA726", // Orange
      details: [
        { label: "Pending", value: counts.pending },
        { label: "Checking", value: counts.checking },
      ],
    },
    {
      title: "Ongoing Jobs",
      count: ongoingJobCount,
      icon: <Build fontSize="large" />,
      color: "#42A5F5", // Blue
      details: [
        { label: "Confirmed", value: counts.confirmed },
        { label: "Waiting", value: counts.waiting },
        { label: "Accepted", value: counts.accepted },
        { label: "In Progress", value: counts.inProgress },
        { label: "Rejected", value: counts.rejected },
      ],
    },
    {
      title: "Completed Jobs",
      count: completedJobCount,
      icon: <CheckCircle fontSize="large" />,
      color: "#66BB6A", // Green
      details: [
        { label: "Task Done", value: counts.taskDone },
        { label: "Paid", value: counts.paid },
        { label: "All Done", value: counts.allDone },
      ],
    },
    {
      title: "Cancelled Jobs",
      count: cancelledJobCount,
      icon: <Cancel fontSize="large" />,
      color: "#EF5350", // Red
      details: [{ label: "Cancelled", value: counts.cancelled }],
    },
  ];

  return (
    <Grid container spacing={isSmallScreen ? 1 : 2} mb={2} mt={1}>
      {statusData.map((data, index) => (
        <Grid item xs={12} sm={6} md={2} key={index}>
          {" "}
          {/* Changed md value from 2.4 to 2 for equal width */}
          <Card
            sx={{
              backgroundColor: `${data.color}10`,
              color: data.color,
              height: "100%",
              minHeight: "200px",
              display: "flex",
              flexDirection: "column",
              boxShadow: 3,
              borderRadius: "12px",
              transition: "transform 0.3s",
              "&:hover": {
                transform: "translateY(-5px)",
                boxShadow: 6,
              },
            }}
          >
            <CardHeader
              avatar={
                <Box
                  sx={{
                    backgroundColor: `${data.color}20`,
                    width: 50,
                    height: 50,
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {data.icon}
                </Box>
              }
              title={
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: "bold",
                    fontSize: isSmallScreen ? "1rem" : "1.1rem",
                  }}
                >
                  {data.title}
                </Typography>
              }
              sx={{
                pt: 2,
                px: 2,
              }}
            />
            <CardContent
              sx={{
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "space-between",
                pt: 0,
                flexGrow: 1,
                px: 2,
                pb: "16px !important",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "flex-end" }}>
                <Typography
                  variant="h3"
                  sx={{
                    marginRight: 2,
                    fontWeight: "bold",
                    fontSize: isSmallScreen ? "2rem" : "2.5rem",
                    lineHeight: 1,
                    color: data.color,
                  }}
                >
                  {String(data.count).padStart(2, "0")}
                </Typography>
                {data.details && (
                  <Box
                    sx={{
                      mb: 1,
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    {data.details.map((detail, i) => (
                      <Typography
                        key={i}
                        variant="caption"
                        sx={{
                          display: "block",
                          fontSize: isSmallScreen ? "0.6rem" : "0.7rem",
                          lineHeight: 1.5,
                          color: "text.secondary",
                        }}
                      >
                        <Box component="span" sx={{ fontWeight: "bold" }}>
                          {detail.label}:
                        </Box>{" "}
                        {detail.value}
                      </Typography>
                    ))}
                  </Box>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default StatusSummary;

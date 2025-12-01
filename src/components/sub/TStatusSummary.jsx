import React, { useEffect, useState } from "react";
import axios from "axios";
import API_BASE_URL from "../../config/api";
import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  CardMedia,
  Box,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import { useAuth } from "../../context/AuthContext";

const API_URL = `${API_BASE_URL}/appointments`;

const TechStatusSummary = () => {
  const { user, token } = useAuth();

  const [counts, setCounts] = useState({
    TAccepted: 0,
    TInProgress: 0,
    TCompleted: 0,
  });
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  useEffect(() => {
    // Don't run until auth is loaded
    if (!token || !user?.technicianId) return;

    const fetchAndAggregate = async () => {
      setLoading(true);
      setErr(null);

      try {
        const res = await axios.get(API_URL, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const techId = user.technicianId?.toString();

        const myAppts = res.data.filter(
          (appt) => appt.tech?._id?.toString() === techId
        );

        const norm = (s) => (s || "").trim().toUpperCase();

        const ACCEPTED_STATUSES = ["ACCEPTED"];
        const INPROG_STATUSES = ["INPROGRESS"];
        const COMPLETED_STATUSES = ["TASK DONE"];

        const totals = myAppts.reduce(
          (acc, appt) => {
            const s = norm(appt.status);
            if (ACCEPTED_STATUSES.includes(s)) acc.TAccepted += 1;
            else if (INPROG_STATUSES.includes(s)) acc.TInProgress += 1;
            else if (COMPLETED_STATUSES.includes(s)) acc.TCompleted += 1;
            return acc;
          },
          { TAccepted: 0, TInProgress: 0, TCompleted: 0 }
        );

        setCounts(totals);
      } catch (error) {
        console.error("Error fetching technician appointments:", error);
        setErr(error);
      } finally {
        setLoading(false);
      }
    };

    fetchAndAggregate();
  }, [token, user?.technicianId]);

  const statusData = [
    {
      key: "accepted",
      title: "Accepted",
      subheader: "Waiting to Start",
      count: counts.TAccepted,
      image: "/assets/purchase.png.png",
    },
    {
      key: "inProgress",
      title: "In Progress",
      subheader: "You’re Working On",
      count: counts.TInProgress,
      image: "/assets/inpro.png",
    },
    {
      key: "completed",
      title: "Completed",
      subheader: "Jobs Finished",
      count: counts.TCompleted,
      image: "/assets/success.jpg",
    },
  ];

  if (!token || !user?.technicianId) {
    return (
      <Typography variant="body2" color="error">
        Technician not identified (no token or technicianId).
      </Typography>
    );
  }

  if (loading) {
    return <Typography variant="body2">Loading technician status…</Typography>;
  }

  if (err) {
    return (
      <Typography color="error" variant="body2">
        Could not load technician dashboard.
      </Typography>
    );
  }

  return (
    <Grid container gap={4} mb={1} mt={1} justifyContent="center">
      {statusData.map((data) => (
        <Grid width="22%" key={data.key}>
          <Card sx={{ backgroundColor: "#33383E23", color: "#33383E" }}>
            <CardHeader
              title={data.title}
              subheader={data.subheader}
              sx={{ pb: 0, pt: 1 }}
            />
            <CardContent
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                pt: 1,
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Typography variant="h4" sx={{ marginRight: 1 }}>
                  {String(data.count ?? 0).padStart(2, "0")}
                </Typography>
                {/* Optional trend / arrow. Remove if not meaningful */}
                <CardMedia
                  component="img"
                  sx={{ height: 20, width: 20 }}
                  image="/assets/up.png"
                  alt="trend arrow"
                />
              </Box>
              <CardMedia
                component="img"
                sx={{ height: 70, width: 70 }}
                image={data.image}
                alt={`${data.title} icon`}
              />
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default TechStatusSummary;

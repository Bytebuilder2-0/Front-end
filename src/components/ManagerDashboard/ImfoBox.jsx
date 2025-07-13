import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  CardMedia,
  Box,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import { jwtDecode } from "jwt-decode"; // add

const baseURL = "http://localhost:5000/api";

const token = localStorage.getItem("token"); // add
let decoded = null;

if (token) {
  try {
    decoded = jwtDecode(token);
    console.log(decoded.id); // optional
  } catch (err) {
    console.error("Invalid token:", err);
    decoded = null;
  }
}

const StatusSummary = () => {
  const [counts, setCounts] = useState({
    total: 0,
    pending: 0,
    confirmed: 0,
    checking: 0, //  added new count
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
        ); // fixed backtick & URL typo
        setCounts(response.data);
      } catch (error) {
        console.error("Error fetching appointment counts:", error);
      }
    };

    fetchCounts();
  }, []);

  const statusData = [
    {
      title: "Total",
      subheader: "Total Appointment Count",
      count: counts.total,
      image: "/assets/purchase.png.png",
    },
      {
      title: "Checking", //  new card
      subheader: "Checking Appointment Count",
      count: counts.checking,
      image: "https://cdn-icons-png.flaticon.com/512/3500/3500833.png", //  use an appropriate icon
    },
    {
      title: "Pending",
      subheader: "Pending Appointment Count",
      count: counts.pending,
      image: "/assets/inpro.png",
    },
    {
      title: "Confirmed",
      subheader: "Confirmed Appointment Count",
      count: counts.confirmed,
      image: "/assets/success.jpg",
    },
  
  ];

  return (
    <Grid container gap={7} mb={1} mt={1} justifyContent="center">
      {statusData.map((data, index) => (
        <Grid width="25%" key={index}>
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
                  {String(data.count).padStart(2, "0")}
                </Typography>
                <CardMedia
                  component="img"
                  sx={{ height: 20, width: 20 }}
                  image="/assets/up.png"
                  alt="Card Image"
                />
              </Box>

              <CardMedia
                component="img"
                sx={{ height: 70, width: 70 }}
                image={data.image}
                alt="Card Image"
              />
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default StatusSummary;

import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent, CardHeader, Typography } from "@mui/material";
import { Grid} from "@mui/material";


const StatusSummary = () => {
  const [counts, setCounts] = useState({
    total: 0,
    pending: 0,
    confirmed: 0,
 
  });

  useEffect(() => {
    const fetchCounts = async () => {
      try {
      //  const response = await axios.get("http://localhost:5000/api/appointments/statusCounts");
        setCounts(response.data);
      } catch (error) {
        console.error("Error fetching appointment counts:", error);
      }
    };

    fetchCounts();
  }, []);

  return (
    <Grid container spacing={5} mb={3} justifyContent="center">
      <Grid item xs={12} sm={6} md={4}>
        <Card sx={{ backgroundColor: "", color: "#" }}>
            <CardHeader  title="Total" subheader="Pending Appointment Count"/>
          <CardContent>
            <Typography variant="h6">Total</Typography>
            <Typography variant="h4">{counts.total}</Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
        <Card sx={{ backgroundColor: "orange", color: "#fff" }}>
          <CardContent>
            <Typography variant="h6">Pending</Typography>
            <Typography variant="h4">{counts.pending}</Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
        <Card sx={{ backgroundColor: "green", color: "#fff" }}>
          <CardContent>
            <Typography variant="h6">Confirmed</Typography>
            <Typography variant="h4">{counts.confirmed}</Typography>
          </CardContent>
        </Card>
      </Grid>
    
    </Grid>
  );
};

export default StatusSummary;

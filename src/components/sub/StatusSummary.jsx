import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent, CardHeader, Typography ,CardMedia,Box} from "@mui/material";
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

  const statusData = [
    {
      title: "Total",
      subheader: "Pending Appointment Count",
      count: counts.total,
      image: "/assets/purchase.png.png",
      status: "Total",
    },
    {
      title: "Pending",
      subheader: "Pending Appointment Count",
      count: counts.pending,
      image: "/assets/inpro.png",
      status: "Pending",
    },
    {
      title: "Confirmed",
      subheader: "Confirmed Appointment Count",
      count: counts.confirmed,
      image: "/assets/success.jpg",
      status: "Confirmed",
    },
  ];

  return (
    <Grid container spacing={5} mb={3} mt={3} justifyContent="center">
    {statusData.map((data, index) => (
      <Grid item xs={12} sm={6} md={4} key={index}>
        <Card sx={{ backgroundColor: "", color: "#" }}>
          <CardHeader title={data.title} subheader={data.subheader} />
          <CardContent sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", pl: 6, pr: 6 }}>
            <div>
              <Typography variant="h6">{data.status}</Typography>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h4" sx={{ marginRight: 1 }}>{data.count}</Typography>
                <CardMedia
                  component="img"
                  sx={{ height: 20, width: 20 }}
                  image="/assets/up.png"
                  alt="Card Image"
                />
              </Box>
            </div>
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

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

  return (
    <Grid container spacing={5} mb={3} justifyContent="center">
      <Grid item xs={12} sm={6} md={4}>
        <Card sx={{ backgroundColor: "", color: "#" }}>
            <CardHeader  title="Total" subheader="Pending Appointment Count"/>
          <CardContent sx={{ display: "flex",alignItems:"center" ,justifyContent: "space-between", pl: 6,
    pr: 6 }}>
            <div>
            <Typography variant="h6">Total</Typography>

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h4" sx={{ marginRight: 1 }}>{counts.total}</Typography>
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
        sx={{ height:70, width: 70 }}
        image="/assets/purchase.png.png"
        alt="Card Image"
      />
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

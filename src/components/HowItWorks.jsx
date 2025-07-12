import React from "react";
import { Box, Typography, Grid } from "@mui/material";

const steps = [
  {
    image: "/assets/man2.webp", // Replace with real paths
    title: "Choose YOUR SERVICE",
    
  },
  {
    image: "/assets/man2.webp",
    title: "Make an APPOINTMENT",
    
  },
  {
    image: "/assets/car.png",
    title: "We’ll take YOUR CAR for repair",

  },
];

const HowItWorks = () => {
  return (
    <Box sx={{ textAlign: "center", py: 8, backgroundColor: "#fff" }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        How It Works
      </Typography>
      <Typography variant="body1" color="text.secondary" gutterBottom>
        These few steps will help return your car to a working condition
      </Typography>
      <Box
        sx={{
          width: 60,
          height: 3,
          backgroundColor: "red",
          mx: "auto",
          mb: 6,
        }}
      />
      <Grid container spacing={4} justifyContent="center">
        {steps.map((step, index) => (
          <Grid item xs={12} md={4} key={index}>
            <Box sx={{ position: "relative", textAlign: "center" }}>
              {/* Faint background number */}
              <Typography
                sx={{
                  fontSize: "100px",
                  fontWeight: "bold",
                  color: "rgba(0, 0, 0, 0.05)",
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  zIndex: 0,
                }}
              >
                {step.number}
              </Typography>
              {/* Foreground content */}
              <img
                src={step.image}
                alt={step.title}
                style={{
                  width: "100px",
                  height: "100px",
                  zIndex: 1,
                  position: "relative",
                }}
              />
              <Typography
                variant="subtitle1"
                sx={{ fontWeight: 500, mt: 2, zIndex: 1, position: "relative" }}
              >
                {step.title}
              </Typography>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default HowItWorks;

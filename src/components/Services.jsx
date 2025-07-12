import React from "react";
import { Box, Typography, Grid, Paper, Divider } from "@mui/material";

const services = [
  {
    category: "Core Mechanical Services",
    items: [
      "Full Engine Diagnostics & Repairs",
      "Transmission Services (Auto / Manual)",
      "Brake System Inspection & Replacement",
      "Suspension & Steering Repairs",
      "Battery Testing and Replacement",
    ],
  },
  {
    category: "Luxury & Cosmetic",
    items: [
      "Premium Car Wash & Detailing (Interior + Exterior)",
      "Ceramic Coating",
      "Alloy wheel Restoration / Upgrades",
      "Leather Conditioning",
      "Headlight Restoration",
    ],
  },
  {
    category: "Advanced Electronics & Diagnostics",
    items: [
      "OBD-II Scanning",
      "ECU Reflashing",
      "ADAS Calibration",
      "Key Programming",
      "Electrical System Troubleshooting",
      "Battery Management Systems for Hybrids/EVs",
    ],
  },
  {
    category: "Customer Convenience",
    items: [
      "Online Booking & Service History Tracking",
      "Pickup & Drop-off",
      "Live Service Updates",
      "Digital Inspection Reports",
    ],
  },
  {
    category: "Preventive & Routine Maintenance",
    items: [
      "Periodic Oil & Filter Changes (Synthetic options)",
      "Fluid Checks & Top-ups (Coolant, Brake, Transmission)",
      "Tire Rotation, Balancing, and Wheel Alignment",
      "Multi-point Vehicle Health Checkups",
      "Scheduled Manufacturer-Recommended Services",
    ],
  },
  {
    category: "HVAC, EV, Hybrid & Comfort System Services",
    items: [
      "AC & Climate Control Diagnostics",
      "Heater Core Servicing",
      "High-Voltage Battery Diagnostics & Repair",
      "EV Charging Station Maintenance",
      "Cabin Filter Replacement",
    ],
  },
];

const Services = () => {
  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      <Typography variant="h3" align="center" fontWeight="bold" gutterBottom>
        Our Services
      </Typography>
      <Divider sx={{ my: 3 }} />

      <Grid container spacing={3} justifyContent="center">
        {services.map((section, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Paper
              elevation={3}
              sx={{
                p: 3,
                borderRadius: 2,
                height: "100%",
                maxWidth: "100%",
                minHeight: 150, // Ensures uniformity
                mx: "auto",
              }}
            >
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                {section.category}
              </Typography>
              <ul style={{ paddingLeft: "1.2rem", margin: 0 }}>
                {section.items.map((item, idx) => (
                  <li key={idx}>
                    <Typography variant="body2">{item}</Typography>
                  </li>
                ))}
              </ul>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Services;

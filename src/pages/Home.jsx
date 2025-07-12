import React from "react";
import ResponsiveCarousel from "../components/MaterialUICarousel";
import { Box, Typography, Grid, Checkbox } from "@mui/material";
import Navbar from "../components/Navbar";

import CheckBoxIcon from "@mui/icons-material/CheckBox";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import HowItWorks from "../components/HowItWorks";
import FeedbackSlider from "../components/FeedbackSlider";
import Footer from "../components/Footer";
import Services from "../components/Services";
import { GlobalStyles } from "@mui/material";


const aboutItems = [
  {
    title: "We Make It Easy",
    description:
      "Make a booking online 24/7. Our mechanics are available from Monday to Saturday from 8:00AM to 5:00PM.",
  },
  {
    title: "CWORKS Parts",
    description:
      "CWORKS parts are specifically made according to the vehicle's manufacturer specifications and therefore make finding parts for the specific vehicle much easier.",
  },
  {
    title: "Fair And Transparent Pricing",
    description:
      "We offer fair and transparent pricing and provide estimates upfront for many services across many vehicle brands and models. Make your booking with confidence.",
  },
  {
    title: "Happiness Guaranteed",
    description:
      "At Garage24, we collaborate exclusively with top-rated technicians. Every service comes with the trusted Garage24 assurance, ensuring quality you can rely on.",
  },
];

const HomePage = () => {
  return (
    <>
      <Navbar />
      <GlobalStyles
  styles={{
    html: {
      scrollBehavior: "smooth",
    },
  }}
/>


      <ResponsiveCarousel />

      {/* ABOUT SECTION BELOW */}
      <Box sx={{ py: 6, px: { xs: 2, sm: 6, md: 12 }, bgcolor: "#fafafa" }}>
        <Typography variant="h4" gutterBottom fontWeight="bold">
          Why Choose Garage24?
        </Typography>

        <Grid container spacing={4}>
          {aboutItems.map((item, index) => (
            <Grid item xs={12} sm={6} key={index}>
              <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2 }}>
                <Checkbox
                  icon={<CheckBoxOutlineBlankIcon />}
                  checkedIcon={<CheckBoxIcon />}
                  checked
                  sx={{
                    color: "success.main",
                    "&.Mui-checked": {
                      color: "success.main",
                    },
                    p: 0.5,
                  }}
                />
                <Box>
                  <Typography variant="subtitle1" fontWeight="bold">
                    {item.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {item.description}
                  </Typography>
                </Box>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Box>
      <div id="services">
        <Services />
      </div>

      <HowItWorks/>
      {/* <FeedbackSlider/> */}
      <div id ="contact">
      <Footer/>
          </div>
    </>
  );
};

export default HomePage;

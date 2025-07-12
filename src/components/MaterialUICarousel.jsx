import React from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { Box, Typography, Button } from "@mui/material";
import { Link } from "react-router-dom";

const slideData = [
  {
    image: "/assets/garagebg.jpeg",
    isIntro: true, // Intro slide
  },
  {
    image: "/assets/mount.jpg",
    title: "Premium Car Service",
    description: "Get full diagnostics and expert repair.",
  },
  {
    image: "/assets/fungi.jpg",
    title: "Complete Car Wash",
    description: "Shine and polish like brand new.",
  },
  {
    image: "/assets/tree.jpg",
    title: "Tyre & Brake Check",
    description: "Safety starts with strong foundations.",
  },
  {
    image: "/assets/tree.jpg",
    title: "Tyre & Brake Check",
    description: "Safety starts with strong foundations.",
  },
  {
    image: "/assets/tree.jpg",
    title: "A/C repairing",
    description: "Cool and comfortable drives.",
  },
  {
    image: "/assets/tree.jpg",
    title: "Body Wash",
    description: "Give your car a fresh look.",
  },
];

const responsive = {
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 1,
  },
  tablet: {
    breakpoint: { max: 1024, min: 600 },
    items: 1,
  },
  mobile: {
    breakpoint: { max: 600, min: 0 },
    items: 1,
  },
};

const ResponsiveCarousel = () => {
  return (
    <Box sx={{ maxWidth: "100%", mx: "auto", mt: 0 }}>
      <Carousel
        responsive={responsive}
        autoPlay
        infinite
        arrows
        showDots
        autoPlaySpeed={4000}
        keyBoardControl
        containerClass="carousel-container"
        itemClass="carousel-item-padding-40-px"
      >
        {slideData.map((item, index) => (
          <Box
            key={index}
            sx={{
              height: { xs: "60vh", md: "80vh" },
              backgroundImage: `url(${item.image})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              color: "white",
              position: "relative",
            }}
          >
            <Box
              sx={{
                bgcolor: "rgba(0, 0, 0, 0.19)",
                p: 4,
                borderRadius: 2,
                textAlign: "center",
                maxWidth: "90%",
              }}
            >
              {item.isIntro ? (
                <>
                 <>
  <Typography
    variant="h2"
    fontWeight="bold"
    gutterBottom
    sx={{
      fontSize: { xs: "2.5rem", md: "4rem" },
      textShadow: "3px 3px 6px rgba(0,0,0,0.8)",
    }}
  >
    Welcome to Garage24
  </Typography>

  <Typography
    variant="h6"
    sx={{
      mt: 1,
      fontSize: { xs: "1rem", md: "1.2rem" },
      fontWeight: 400,
    }}
  >
    New here? click below to register and get started!
  </Typography>

  <Button
    variant="contained"
    color="primary"
    size="large"
    component={Link}
    to="/SignupPage"
    sx={{ mt: 3 }}
  >
    Register Now
  </Button>
</>

                </>
              ) : (
                <>
                  <Typography variant="h4" gutterBottom>
                    {item.title}
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    {item.description}
                  </Typography>
                  <Button variant="contained" color="secondary">
                    Book Now
                  </Button>
                </>
              )}
            </Box>
          </Box>
        ))}
      </Carousel>
    </Box>
  );
};

export default ResponsiveCarousel;

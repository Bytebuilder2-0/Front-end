import Carousel from "react-multi-carousel"
import "react-multi-carousel/lib/styles.css"
import { Box, Typography, Button, Container, Chip } from "@mui/material"
import { Link } from "react-router-dom"
import PlayArrowIcon from "@mui/icons-material/PlayArrow"
import StarIcon from "@mui/icons-material/Star"

const slideData = [
  {
    image: "/assets/garagebg.jpeg",
    isIntro: true,
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
    title: "A/C Repairing",
    description: "Cool and comfortable drives.",
  },
  {
    image: "/assets/tree.jpg",
    title: "Body Wash",
    description: "Give your car a fresh look.",
  },
]

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
}

const ResponsiveCarousel = () => {
  return (
    <Box sx={{ maxWidth: "100%", mx: "auto", mt: 0, position: "relative" }}>
      <Carousel
        responsive={responsive}
        autoPlay
        infinite
        arrows
        showDots
        autoPlaySpeed={5000}
        keyBoardControl
        containerClass="carousel-container"
        itemClass="carousel-item-padding-40-px"
        dotListClass="custom-dot-list-style"
      >
        {slideData.map((item, index) => (
          <Box
            key={index}
            sx={{
              height: { xs: "70vh", md: "90vh" },
              backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.6)), url(${item.image})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              color: "white",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <Container maxWidth="lg">
              <Box
                sx={{
                  textAlign: "center",
                  maxWidth: "800px",
                  mx: "auto",
                  position: "relative",
                  zIndex: 2,
                }}
              >
                {item.isIntro ? (
                  <>
                    <Chip
                      icon={<StarIcon />}
                      label="Premium Auto Service"
                      sx={{
                        mb: 4,
                        bgcolor: "rgba(255,255,255,0.2)",
                        color: "white",
                        fontWeight: "bold",
                        fontSize: "1rem",
                        px: 2,
                        py: 1,
                        backdropFilter: "blur(10px)",
                        border: "1px solid rgba(255,255,255,0.3)",
                      }}
                    />
                    <Typography
                      variant="h1"
                      sx={{
                        fontWeight: 900,
                        mb: 3,
                        fontSize: { xs: "3rem", md: "5rem" },
                        textShadow: "0 4px 20px rgba(0,0,0,0.5)",
                        background: "linear-gradient(45deg, #ffffff, #f0f0f0)",
                        backgroundClip: "text",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                      }}
                    >
                      Welcome to Garage24
                    </Typography>
                    <Typography
                      variant="h5"
                      sx={{
                        mb: 5,
                        fontSize: { xs: "1.2rem", md: "1.5rem" },
                        fontWeight: 300,
                        opacity: 0.9,
                        maxWidth: "600px",
                        mx: "auto",
                        lineHeight: 1.6,
                      }}
                    >
                      New here? Click below to register and get started with premium automotive services!
                    </Typography>
                    <Box sx={{ display: "flex", gap: 3, justifyContent: "center", flexWrap: "wrap" }}>
                      <Button
                        variant="contained"
                        size="large"
                        component={Link}
                        to="/SignupPage"
                        startIcon={<PlayArrowIcon />}
                        sx={{
                          px: 4,
                          py: 2,
                          fontSize: "1.1rem",
                          fontWeight: "bold",
                          background: "linear-gradient(45deg, #2196F3, #21CBF3)",
                          boxShadow: "0 8px 25px rgba(33, 150, 243, 0.3)",
                          "&:hover": {
                            background: "linear-gradient(45deg, #1976D2, #1CB5E0)",
                            transform: "translateY(-2px)",
                            boxShadow: "0 12px 35px rgba(33, 150, 243, 0.4)",
                          },
                          transition: "all 0.3s ease",
                        }}
                      >
                        Register Now
                      </Button>
                      <Button
                        variant="outlined"
                        size="large"
                        sx={{
                          px: 4,
                          py: 2,
                          fontSize: "1.1rem",
                          fontWeight: "bold",
                          borderColor: "white",
                          color: "white",
                          backdropFilter: "blur(10px)",
                          "&:hover": {
                            borderColor: "white",
                            backgroundColor: "rgba(255,255,255,0.1)",
                            transform: "translateY(-2px)",
                          },
                          transition: "all 0.3s ease",
                        }}
                      >
                        Learn More
                      </Button>
                    </Box>
                  </>
                ) : (
                  <>
                    <Typography
                      variant="h3"
                      sx={{
                        fontWeight: 700,
                        mb: 2,
                        fontSize: { xs: "2rem", md: "3rem" },
                        textShadow: "0 2px 10px rgba(0,0,0,0.5)",
                      }}
                    >
                      {item.title}
                    </Typography>
                    <Typography
                      variant="h6"
                      sx={{
                        mb: 4,
                        fontSize: { xs: "1.1rem", md: "1.3rem" },
                        opacity: 0.9,
                      }}
                    >
                      {item.description}
                    </Typography>
                    <Button
                      variant="contained"
                      size="large"
                      sx={{
                        px: 4,
                        py: 2,
                        fontSize: "1.1rem",
                        fontWeight: "bold",
                        background: "linear-gradient(45deg, #FF6B6B, #FF8E53)",
                        boxShadow: "0 8px 25px rgba(255, 107, 107, 0.3)",
                        "&:hover": {
                          background: "linear-gradient(45deg, #FF5252, #FF7043)",
                          transform: "translateY(-2px)",
                          boxShadow: "0 12px 35px rgba(255, 107, 107, 0.4)",
                        },
                        transition: "all 0.3s ease",
                      }}
                    >
                      Book Now
                    </Button>
                  </>
                )}
              </Box>
            </Container>
          </Box>
        ))}
      </Carousel>
    </Box>
  )
}

export default ResponsiveCarousel

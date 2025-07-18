import { Box, Typography, Grid, Paper, Container, Chip } from "@mui/material"
import BuildIcon from "@mui/icons-material/Build"
import CarRepairIcon from "@mui/icons-material/CarRepair"
import ElectricCarIcon from "@mui/icons-material/ElectricCar"
import SupportAgentIcon from "@mui/icons-material/SupportAgent"
import ScheduleIcon from "@mui/icons-material/Schedule"
import AcUnitIcon from "@mui/icons-material/AcUnit"

const services = [
  {
    category: "Core Mechanical Services",
    icon: <BuildIcon sx={{ fontSize: 40, color: "#2196F3" }} />,
    color: "#E3F2FD",
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
    icon: <CarRepairIcon sx={{ fontSize: 40, color: "#9C27B0" }} />,
    color: "#F3E5F5",
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
    icon: <ElectricCarIcon sx={{ fontSize: 40, color: "#FF9800" }} />,
    color: "#FFF3E0",
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
    icon: <SupportAgentIcon sx={{ fontSize: 40, color: "#4CAF50" }} />,
    color: "#E8F5E8",
    items: [
      "Online Booking & Service History Tracking",
      "Pickup & Drop-off",
      "Live Service Updates",
      "Digital Inspection Reports",
    ],
  },
  {
    category: "Preventive & Routine Maintenance",
    icon: <ScheduleIcon sx={{ fontSize: 40, color: "#F44336" }} />,
    color: "#FFEBEE",
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
    icon: <AcUnitIcon sx={{ fontSize: 40, color: "#00BCD4" }} />,
    color: "#E0F2F1",
    items: [
      "AC & Climate Control Diagnostics",
      "Heater Core Servicing",
      "High-Voltage Battery Diagnostics & Repair",
      "EV Charging Station Maintenance",
      "Cabin Filter Replacement",
    ],
  },
]

const Services = () => {
  return (
    <Box
      sx={{
        py: { xs: 8, md: 12 },
        background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
        position: "relative",
      }}
    >
      <Container maxWidth="xl">
        {/* Section Header */}
        <Box sx={{ textAlign: "center", mb: 8 }}>
          
          <Typography
            variant="h3"
            sx={{
              fontWeight: 800,
              mb: 2,
              fontSize: { xs: "2.5rem", md: "3.5rem" },
              background: "linear-gradient(45deg, #1976d2, #42a5f5)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Our Services
          </Typography>
          <Typography
            variant="h6"
            color="text.secondary"
            sx={{
              maxWidth: 600,
              mx: "auto",
              lineHeight: 1.6,
              fontSize: { xs: "1rem", md: "1.25rem" },
            }}
          >
            Comprehensive automotive solutions for every need
          </Typography>
        </Box>

        {/* Services Grid */}
        <Grid container spacing={4}>
          {services.map((section, index) => (
            <Grid item xs={12} sm={6} lg={4} key={index}>
              <Paper
                elevation={0}
                sx={{
                  p: 4,
                  borderRadius: 4,
                  height: "100%",
                  background: "rgba(255, 255, 255, 0.9)",
                  backdropFilter: "blur(10px)",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                  transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                  position: "relative",
                  overflow: "hidden",
                  "&::before": {
                    content: '""',
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    height: "4px",
                    background: `linear-gradient(90deg, ${section.icon.props.color}, ${section.icon.props.color}80)`,
                  },
                  "&:hover": {
                    transform: "translateY(-8px)",
                    boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
                    "& .service-icon": {
                      transform: "scale(1.1) rotate(5deg)",
                    },
                  },
                }}
              >
                {/* Icon */}
                <Box
                  className="service-icon"
                  sx={{
                    width: 80,
                    height: 80,
                    borderRadius: "50%",
                    bgcolor: section.color,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mb: 3,
                    transition: "all 0.3s ease",
                    boxShadow: "0 8px 25px rgba(0,0,0,0.1)",
                  }}
                >
                  {section.icon}
                </Box>

                {/* Category Title */}
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 700,
                    mb: 3,
                    color: "text.primary",
                    fontSize: "1.1rem",
                  }}
                >
                  {section.category}
                </Typography>

                {/* Service Items */}
                <Box component="ul" sx={{ pl: 0, m: 0, listStyle: "none" }}>
                  {section.items.map((item, idx) => (
                    <Box
                      component="li"
                      key={idx}
                      sx={{
                        display: "flex",
                        alignItems: "flex-start",
                        mb: 1.5,
                        "&::before": {
                          content: '"✓"',
                          color: section.icon.props.color,
                          fontWeight: "bold",
                          marginRight: 2,
                          fontSize: "1.1rem",
                        },
                      }}
                    >
                      <Typography
                        variant="body2"
                        sx={{
                          color: "text.secondary",
                          lineHeight: 1.6,
                          fontSize: "0.9rem",
                        }}
                      >
                        {item}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  )
}

export default Services

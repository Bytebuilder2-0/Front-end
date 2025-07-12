import React from "react";
import {
  Box,
  Typography,
  Link,
  Stack,
  Divider,
  IconButton,
} from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import FacebookIcon from "@mui/icons-material/Facebook";

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: "#424242",
        color: "#fff",
        pt: 6,
        pb: 3,
        px: { xs: 3, md: 12 },
        textAlign: "center",
      }}
    >
      {/* Contact Info */}
      <Typography variant="h6" gutterBottom fontWeight="bold">
        Contact Info
      </Typography>
      <Stack spacing={1} alignItems="center" mb={1}>
        <Stack direction="row" spacing={1} justifyContent="center">
          <LocationOnIcon fontSize="small" />
          <Link
            href="https://www.google.com/maps?q=190,Galle+Road,Kaluthara,Sri+Lanka"
            target="_blank"
            rel="noopener noreferrer"
            underline="none"
            color="inherit"
            sx={{
      transition: "color 0.3s",
      "&:hover": {
        color: "#4caf50", // or any color like "primary.main"
      },
    }}
          >
            190, Galle Road, Kaluthara, Sri Lanka
          </Link>
        </Stack>

        <Stack direction="row" spacing={1} justifyContent="center">
          <PhoneIcon fontSize="small" />
          <Link href="tel:+94112343243" underline="none" color="inherit"
          sx={{
      transition: "color 0.3s",
      "&:hover": {
        color: "#4caf50", // or any color like "primary.main"
      },
    }}>
          
            +94 11 234 3243
          </Link>
        </Stack>
<Stack direction="row" spacing={1} justifyContent="center">
  <EmailIcon fontSize="small" />
  <Link
    href="mailto:info@garage24.lk"
    underline="none"
    color="inherit"
    sx={{
      transition: "color 0.3s",
      "&:hover": {
        color: "#4caf50", // or any color like "primary.main"
      },
    }}
  >
    info@garage24.lk
  </Link>
</Stack>

      </Stack>

      {/* Opening Hours */}
      <Typography variant="h6" gutterBottom fontWeight="bold" mt={3}>
        Opening Hours
      </Typography>
      <Stack direction="row" spacing={1} justifyContent="center" mb={4}>
        <AccessTimeIcon fontSize="small" />
        <Typography>
          Monday–Saturday: 8:00 AM – 5:00 PM
        </Typography>
      </Stack>

      <Divider sx={{ borderColor: "#666", mb: 2, mx: "auto", width: "80%" }} />

      {/* Bottom Row */}
      <Stack spacing={2} alignItems="center">
        <Typography variant="body2" color="gray">
          © 2024 garage24. All Rights Reserved.
        </Typography>
        <IconButton
          href="https://www.facebook.com/"
          target="_blank"
          rel="noopener"
          sx={{
            backgroundColor: "#3b5998",
            color: "white",
            "&:hover": {
              backgroundColor: "#2d4373",
            },
          }}
        >
          <FacebookIcon />
        </IconButton>
      </Stack>
    </Box>
  );
};

export default Footer;

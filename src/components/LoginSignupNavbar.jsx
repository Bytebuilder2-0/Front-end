import { AppBar, Toolbar, Typography, Button, Box, Container } from "@mui/material"
import { Link } from "react-router-dom"
import HomeIcon from "@mui/icons-material/Home"
import LoginIcon from "@mui/icons-material/Login"
import PersonAddIcon from "@mui/icons-material/PersonAdd"

const LoginSignupNavbar = () => {
  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        background: "rgba(255, 255, 255, 0.95)",
        backdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(0,0,0,0.1)",
        color: "text.primary",
      }}
    >
      <Container maxWidth="xl">
        <Toolbar sx={{ py: 1 }}>
          {/* Logo Section */}
          <Box sx={{ flexGrow: 1, display: "flex", alignItems: "center" }}>
            <Link to="/" style={{ textDecoration: "none", display: "flex", alignItems: "center" }}>
              <img
                src="/assets/image.png"
                alt="Garage24 Logo"
                style={{
                  height: 45,
                  marginRight: 12,
                }}
              />
              {/* <Typography
                variant="h6"
                sx={{
                  fontWeight: 800,
                  background: "linear-gradient(45deg, #667eea, #764ba2)",
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  display: { xs: "none", sm: "block" },
                }}
              >
                Garage24
              </Typography> */}
            </Link>
          </Box>

          {/* Navigation Buttons */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Button
              component={Link}
              to="/"
              startIcon={<HomeIcon />}
              sx={{
                color: "text.primary",
                fontWeight: "600",
                px: 2,
                py: 1,
                borderRadius: 2,
                "&:hover": {
                  backgroundColor: "rgba(102, 126, 234, 0.1)",
                },
                transition: "all 0.3s ease",
              }}
            >
              Home
            </Button>
            <Button
              component={Link}
              to="/Loginpage"
              startIcon={<LoginIcon />}
              sx={{
                color: "text.primary",
                fontWeight: "600",
                px: 2,
                py: 1,
                borderRadius: 2,
                "&:hover": {
                  backgroundColor: "rgba(102, 126, 234, 0.1)",
                },
                transition: "all 0.3s ease",
              }}
            >
              Login
            </Button>
            <Button
              component={Link}
              to="/SignupPage"
              startIcon={<PersonAddIcon />}
              variant="contained"
              sx={{
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                color: "white",
                fontWeight: "600",
                px: 3,
                py: 1,
                borderRadius: 2,
                boxShadow: "0 4px 15px rgba(102, 126, 234, 0.3)",
                "&:hover": {
                  background: "linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)",
                  transform: "translateY(-1px)",
                  boxShadow: "0 6px 20px rgba(102, 126, 234, 0.4)",
                },
                transition: "all 0.3s ease",
              }}
            >
              Sign Up
            </Button>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  )
}

export default LoginSignupNavbar

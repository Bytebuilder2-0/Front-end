"use client"

import { useState } from "react"
import { Link } from "react-router-dom"
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container,
  IconButton,
  Drawer,
  List,
  ListItem,
  useMediaQuery,
  useTheme,
} from "@mui/material"
import MenuIcon from "@mui/icons-material/Menu"
import LoginIcon from "@mui/icons-material/Login"
import BuildIcon from "@mui/icons-material/Build"
import ContactMailIcon from "@mui/icons-material/ContactMail"

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false)
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("md"))

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen)
  }

  const navItems = [
    { label: "Services", href: "#services", icon: <BuildIcon /> },
    { label: "Contact Us", href: "#contact", icon: <ContactMailIcon /> },
    { label: "Login", href: "/Loginpage", icon: <LoginIcon />, isButton: true },
  ]

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: "center", pt: 2 }}>
      <Typography variant="h6" sx={{ my: 2, fontWeight: "bold", color: "primary.main" }}>
        Garage24
      </Typography>
      <List>
        {navItems.map((item) => (
          <ListItem key={item.label} disablePadding>
            <Button
              component={item.href.startsWith("#") ? "a" : Link}
              to={item.href.startsWith("#") ? undefined : item.href}
              href={item.href.startsWith("#") ? item.href : undefined}
              fullWidth
              startIcon={item.icon}
              sx={{
                justifyContent: "flex-start",
                px: 3,
                py: 2,
                color: item.isButton ? "primary.main" : "text.primary",
                fontWeight: item.isButton ? "bold" : "normal",
              }}
            >
              {item.label}
            </Button>
          </ListItem>
        ))}
      </List>
    </Box>
  )

  return (
    <>
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          background: "linear-gradient(135deg, #3f51b5 0%, #1a237e 100%)",
          backdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(255,255,255,0.1)",
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
                    height: 70,
                    marginRight: 0,
                    marginLeft: -200,
                    filter: "brightness(1.1)",
                  }}
                />
              
              </Link>
            </Box>

            {/* Navigation */}
            {!isMobile && (
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                {navItems.map((item) => (
                  <Button
                    key={item.label}
                    component={item.href.startsWith("#") ? "a" : Link}
                    to={item.href.startsWith("#") ? undefined : item.href}
                    href={item.href.startsWith("#") ? item.href : undefined}
                    startIcon={item.icon}
                    variant={item.isButton ? "contained" : "text"}
                    sx={{
                      color: item.isButton ? "primary.main" : "white",
                      fontWeight: "600",
                      px: 3,
                      py: 1,
                      mx: 0.5,
                      borderRadius: 2,
                      backgroundColor: item.isButton ? "white" : "transparent",
                      "&:hover": {
                        backgroundColor: item.isButton ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.1)",
                        transform: "translateY(-1px)",
                      },
                      transition: "all 0.3s ease",
                    }}
                  >
                    {item.label}
                  </Button>
                ))}
              </Box>
            )}

            {/* Mobile Menu Button */}
            {isMobile && (
              <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="start"
                onClick={handleDrawerToggle}
                sx={{
                  backgroundColor: "rgba(255,255,255,0.1)",
                  "&:hover": {
                    backgroundColor: "rgba(255,255,255,0.2)",
                  },
                }}
              >
                <MenuIcon />
              </IconButton>
            )}
          </Toolbar>
        </Container>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: 280,
            background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
          },
        }}
      >
        {drawer}
      </Drawer>
    </>
  )
}

export default Navbar

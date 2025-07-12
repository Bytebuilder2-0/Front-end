
import { useState } from "react"
import { Link } from "react-router-dom";
import { AppBar, Toolbar, Typography, Button, Box, Avatar, Menu, MenuItem, IconButton, Link as MuiLink } from "@mui/material"
import { AccountCircle, Business } from "@mui/icons-material"
import handleLogoutClick from "../utils/logout"

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [anchorEl, setAnchorEl] = useState(null)

  const handleLogin = () => {
    setIsLoggedIn(true)
    console.log("User logged in")
  }

  const handleLogout = () => {
    setIsLoggedIn(false)
    setAnchorEl(null)
    console.log("User logged out")
  }

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  return (
    <AppBar position="static" sx={{ backgroundColor: "#0660f3d3" }}>
      <Toolbar>
        {/* Company Logo Section */}
         <Box sx={{ flexGrow: 1 }}>
          <Link to="/">
            <img
              src="/public/assets/frame.jpg"
              alt="Logo"
              style={{ height: 40 }}
            />
          </Link>
        </Box>
        {/* <Box sx={{ display: "flex", alignItems: "center", flexGrow: 1 }}>
          <Business sx={{ mr: 1, fontSize: 28 }} />
          <Typography
            variant="h6"
            component="div"
            sx={{
              fontWeight: "bold",
              letterSpacing: 1,
            }}
          >
          
          </Typography>
        </Box> */}

        {/* Navigation Links (Optional) */}
       <Box>
          <Button color="inherit" component={Link} to="/Loginpage" sx={{ marginRight: 2 }}>
            Login
          </Button>
          {/* <Button color="inherit" component={Link} to="/SignupPage" sx={{ marginRight: 2 }}>
            Sign Up
          </Button> */}
          <Button
            color="inherit"
            onClick={handleLogoutClick} // Attach the logout function here
            sx={{ marginRight: 2 }}
          >
            Logout
          </Button>
        </Box>




        {/* <Box sx={{ display: { xs: "none", md: "flex" }, mr: 2 }}>
          
          <Button color="inherit" sx={{ mx: 1 }}>
            About
          </Button>
          <Button color="inherit" sx={{ mx: 1 }}>
            Services
          </Button>
          <Button color="inherit" sx={{ mx: 1 }}>
            Contact
          </Button>
          <Button color="inherit" component={Link} to="/Loginpage" sx={{ marginRight: 2 }}>
            Login
          </Button>
        </Box> */}

        {/* Authentication Section
        <Box sx={{ display: "flex", alignItems: "center" }}>
          {!isLoggedIn ? (
            <Button
              color="inherit"
              variant="outlined"
              onClick={handleLogin}
              sx={{
                borderColor: "white",
                "&:hover": {
                  borderColor: "white",
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                },
              }}
            >
              Login
            </Button>
          ) : (
            <>
              <IconButton
                size="large"
                edge="end"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenuOpen}
                color="inherit"
              >
                <Avatar sx={{ width: 32, height: 32, backgroundColor: "#f50057" }}>
                  <AccountCircle />
                </Avatar>
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
              >
                <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
                <MenuItem onClick={handleMenuClose}>My Account</MenuItem>
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
              </Menu>
            </>
          )}
        </Box> */}
      </Toolbar>
    </AppBar>
  )
}

export default Navbar

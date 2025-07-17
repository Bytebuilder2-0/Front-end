

"use client"

import { useState, useContext } from "react"
import {
  TextField,
  Button,
  Box,
  Typography,
  Avatar,
  Paper,
  Container,
  InputAdornment,
  IconButton,
  Chip,
  Fade,
  Slide,
} from "@mui/material"
import axios from "axios"
import { Link, useNavigate } from "react-router-dom"
import { AuthContext } from "../context/AuthContext"
import LoginSignupNavbar from "../components/LoginSignupNavbar"
import { LockOpen, Email, Visibility, VisibilityOff, DirectionsCar, Security, Speed } from "@mui/icons-material"
import { jwtDecode } from "jwt-decode"

const Loginpage = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const { login } = useContext(AuthContext)

  const handleLogin = async (e) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/auth/login`, {
        email,
        password,
      })

      const { token } = response.data
      login(token)
      const decoded = jwtDecode(token)
      const userRole = decoded.role?.toLowerCase()

      if (userRole === "manager") navigate("/ManagerDashboard")
      else if (userRole === "technician") navigate("/TDashboard")
      else if (userRole === "customer") navigate("/User")
      else if (userRole === "supervisor") navigate("/SInitial")
      else navigate("/unauthorized")
    } catch (err) {
      setError(err.response?.data?.message || "Login failed")
    } finally {
      setIsLoading(false)
    }
  }

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  const features = [
    { icon: <DirectionsCar />, text: "Premium Service" },
    { icon: <Security />, text: "Secure Platform" },
    { icon: <Speed />, text: "Quick Booking" },
  ]

  return (
    <>
      <LoginSignupNavbar />
      <Box
        sx={{
          minHeight: "100vh",
          background: "linear-gradient(135deg, #82b1ff 0%, #1a237e 100%)",
          position: "relative",
          overflow: "hidden",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: `url('/assets/man2.webp')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            opacity: 0.1,
            zIndex: 0,
          },
        }}
      >
        <Container
          maxWidth="lg"
          sx={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            position: "relative",
            zIndex: 1,
            py: 4,
          }}
        >
          <Box
            sx={{
              display: "flex",
              width: "100%",
              alignItems: "center",
              gap: { xs: 0, md: 8 },
              flexDirection: { xs: "column", md: "row" },
            }}
          >
            {/* Left Side - Welcome Section */}
            <Fade in timeout={1000}>
              <Box
                sx={{
                  flex: 1,
                  color: "white",
                  textAlign: { xs: "center", md: "left" },
                  mb: { xs: 4, md: 0 },
                }}
              >
                <Typography
                  variant="h2"
                  sx={{
                    fontWeight: 900,
                    mb: 2,
                    fontSize: { xs: "2.5rem", md: "3.5rem" },
                    textShadow: "0 4px 20px rgba(0,0,0,0.3)",
                    background: "linear-gradient(45deg, #ffffff, #f0f0f0)",
                    backgroundClip: "text",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  Welcome Back to
                  <br />
                  Garage24
                </Typography>
                <Typography
                  variant="h6"
                  sx={{
                    mb: 4,
                    opacity: 0.9,
                    fontSize: { xs: "1.1rem", md: "1.3rem" },
                    lineHeight: 1.6,
                  }}
                >
                  Your trusted automotive service partner. Sign in to access your dashboard and manage your vehicle
                  services.
                </Typography>

                {/* Features */}
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mb: 4 }}>
                  {features.map((feature, index) => (
                    <Slide key={index} direction="right" in timeout={1000 + index * 200}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                        <Box
                          sx={{
                            width: 50,
                            height: 50,
                            borderRadius: "50%",
                            background: "rgba(255,255,255,0.2)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            backdropFilter: "blur(10px)",
                          }}
                        >
                          {feature.icon}
                        </Box>
                        <Typography variant="body1" fontWeight="600">
                          {feature.text}
                        </Typography>
                      </Box>
                    </Slide>
                  ))}
                </Box>

                <Chip
                  label="Trusted by 10,000+ customers"
                  sx={{
                    bgcolor: "rgba(255,255,255,0.2)",
                    color: "white",
                    fontWeight: "bold",
                    backdropFilter: "blur(10px)",
                    border: "1px solid rgba(255,255,255,0.3)",
                  }}
                />
              </Box>
            </Fade>

            {/* Right Side - Login Form */}
            <Slide direction="left" in timeout={800}>
              <Paper
                elevation={24}
                sx={{
                  width: { xs: "100%", sm: 450, md: 500 },
                  background: "rgba(255, 255, 255, 0.95)",
                  backdropFilter: "blur(20px)",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                  borderRadius: 4,
                  overflow: "hidden",
                  position: "relative",
                  "&::before": {
                    content: '""',
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    height: "4px",
                    background: "linear-gradient(90deg, #82b1ff, #1a237e)",
                  },
                }}
              >
                <Box sx={{ p: { xs: 4, sm: 6 } }}>
                  {/* Header */}
                  <Box sx={{ textAlign: "center", mb: 4 }}>
                    <Avatar
                      sx={{
                        width: 80,
                        height: 80,
                        mx: "auto",
                        mb: 2,
                        background: "linear-gradient(135deg, #82b1ff 0%, #1a237e 100%)",
                        boxShadow: "0 8px 25px rgba(102, 126, 234, 0.3)",
                      }}
                    >
                      <LockOpen sx={{ fontSize: 40 }} />
                    </Avatar>
                    <Typography
                      variant="h4"
                      sx={{
                        fontWeight: 700,
                        mb: 1,
                        background: "linear-gradient(45deg, #82b1ff, #1a237e)",
                        backgroundClip: "text",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                      }}
                    >
                      Sign In
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      Access your Garage24 account
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Don't have an account?{" "}
                      <Link
                        to="/SignupPage"
                        style={{
                          textDecoration: "none",
                          color: "#667eea",
                          fontWeight: "bold",
                        }}
                      >
                        Sign Up Here
                      </Link>
                    </Typography>
                  </Box>

                  {/* Form */}
                  <Box component="form" onSubmit={handleLogin}>
                    <TextField
                      label="Email Address"
                      type="email"
                      fullWidth
                      margin="normal"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required 
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Email sx={{ color: "text.secondary" }} />
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        mb: 2,
                        "& .MuiOutlinedInput-root": {
                          borderRadius: 2,
                          "&:hover fieldset": {
                            borderColor: "#82b1ff",
                          },
                          "&.Mui-focused fieldset": {
                            borderColor: "#82b1ff",
                          },
                        },
                        "& .MuiInputLabel-root.Mui-focused": {
                          color: "#82b1ff",
                        },
                      }}
                    />

                    <TextField
                      label="Password"
                      type={showPassword ? "text" : "password"}
                      fullWidth
                      margin="normal"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <LockOpen sx={{ color: "text.secondary" }} />
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton onClick={handleTogglePasswordVisibility} edge="end">
                              {showPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        mb: 3,
                        "& .MuiOutlinedInput-root": {
                          borderRadius: 2,
                          "&:hover fieldset": {
                            borderColor: "#82b1ff",
                          },
                          "&.Mui-focused fieldset": {
                            borderColor: "#82b1ff",
                          },
                        },
                        "& .MuiInputLabel-root.Mui-focused": {
                          color: "#82b1ff",
                        },
                      }}
                    />

                    {error && (
                      <Typography
                        color="error"
                        sx={{
                          mb: 2,
                          p: 2,
                          bgcolor: "rgba(244, 67, 54, 0.1)",
                          borderRadius: 2,
                          border: "1px solid rgba(244, 67, 54, 0.2)",
                        }}
                      >
                        {error}
                      </Typography>
                    )}

                    <Button
                      type="submit"
                      fullWidth
                      variant="contained"
                      disabled={isLoading}
                      sx={{
                        py: 2,
                        mb: 3,
                        fontSize: "1.1rem",
                        fontWeight: "bold",
                        borderRadius: 2,
                        background: "linear-gradient(135deg, #82b1ff 0%, #1a237e 100%)",
                        boxShadow: "0 8px 25px rgba(102, 126, 234, 0.3)",
                        "&:hover": {
                          background: "linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)",
                          transform: "translateY(-2px)",
                          boxShadow: "0 12px 35px rgba(102, 126, 234, 0.4)",
                        },
                        "&:disabled": {
                          background: "rgba(0,0,0,0.12)",
                        },
                        transition: "all 0.3s ease",
                      }}
                    >
                      {isLoading ? "Signing In..." : "Sign In"}
                    </Button>

                    <Box sx={{ textAlign: "center" }}>
                      <Link
                        to="/forgot-password"
                        style={{
                          textDecoration: "none",
                          color: "#82b1ff",
                          fontWeight: "600",
                          fontSize: "0.9rem",
                        }}
                      >
                        Forgot your password?
                      </Link>
                    </Box>
                  </Box>
                </Box>

                {/* Bottom Decoration */}
                <Box
                  sx={{
                    height: 60,
                    background: "linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Typography variant="caption" color="text.secondary" fontWeight="600">
                    Secure Login 
                  </Typography>
                </Box>
              </Paper>
            </Slide>
          </Box>
        </Container>
      </Box>
    </>
  )
}

export default Loginpage

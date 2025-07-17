import { useState } from "react"
import {
  TextField,
  Button,
  Box,
  Typography,
  Avatar,
  Paper,
  Container,
  InputAdornment,
  Fade,
  Slide,
  Chip,
} from "@mui/material"
import { Email, LockReset, Password, VpnKey } from "@mui/icons-material"
import { Link } from "react-router-dom"
import axios from "axios"
import LoginSignupNavbar from "../components/LoginSignupNavbar"

const ForgotPasswordPage = () => {
  const [step, setStep] = useState(1)
  const [email, setEmail] = useState("")
  const [otp, setOtp] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleEmailSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setMessage("")
    setIsLoading(true)

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/auth/forgot-password`, { email })
      setMessage(response.data.message)
      setStep(2)
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleResetSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setMessage("")
    setIsLoading(true)

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.")
      setIsLoading(false)
      return
    }

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/auth/reset-password`, {
        email,
        otp,
        newPassword,
        confirmPassword,
      })
      setMessage(response.data.message)
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong.")
    } finally {
      setIsLoading(false)
    }
  }

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
            {/* Left Side */}
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
                  Forgot Your Password?
                </Typography>
                <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
                  {step === 1
                    ? "No worries! Enter your email and we’ll send an OTP."
                    : "Enter the OTP sent to your email and reset your password."}
                </Typography>

                <Chip
                  label="Reset with ease & security"
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

            {/* Right Side */}
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
                      <LockReset sx={{ fontSize: 40 }} />
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
                      {step === 1 ? "Send OTP" : "Reset Password"}
                    </Typography>
                  </Box>

                  <Box component="form" onSubmit={step === 1 ? handleEmailSubmit : handleResetSubmit}>
                    {/* Email Input */}
                    <TextField
                      label="Email Address"
                      type="email"
                      fullWidth
                      margin="normal"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      disabled={step === 2}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Email sx={{ color: "text.secondary" }} />
                          </InputAdornment>
                        ),
                      }}
                    />

                    {/* OTP & Password Section */}
                    {step === 2 && (
                      <>
                        <TextField
                          label="Enter OTP"
                          type="text"
                          fullWidth
                          margin="normal"
                          value={otp}
                          onChange={(e) => setOtp(e.target.value)}
                          required
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <VpnKey sx={{ color: "text.secondary" }} />
                              </InputAdornment>
                            ),
                          }}
                        />
                        <TextField
                          label="New Password"
                          type="password"
                          fullWidth
                          margin="normal"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          required
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <Password sx={{ color: "text.secondary" }} />
                              </InputAdornment>
                            ),
                          }}
                        />
                        <TextField
                          label="Confirm Password"
                          type="password"
                          fullWidth
                          margin="normal"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          required
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <Password sx={{ color: "text.secondary" }} />
                              </InputAdornment>
                            ),
                          }}
                        />
                      </>
                    )}

                    {message && (
                      <Typography color="primary" sx={{ mb: 2, mt: 2 }}>
                        {message}
                      </Typography>
                    )}
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
                        mt: 2,
                        py: 2,
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
                      }}
                    >
                      {isLoading ? "Processing..." : step === 1 ? "Send OTP" : "Reset Password"}
                    </Button>

                    <Box sx={{ textAlign: "center", mt: 3 }}>
                      <Link to="/Loginpage" style={{ color: "#82b1ff", fontWeight: "600" }}>
                        Back to Login
                      </Link>
                    </Box>
                  </Box>
                </Box>
              </Paper>
            </Slide>
          </Box>
        </Container>
      </Box>
    </>
  )
}

export default ForgotPasswordPage

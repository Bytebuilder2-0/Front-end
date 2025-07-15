"use client"

import React, { useState } from "react"
import {
  CardContent,
  CardHeader,
  TextField,
  Button,
  Avatar,
  IconButton,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Grid,
  Divider,
  Alert,
  Snackbar,
  Container,
  Paper,
  Fade,
  Chip,
} from "@mui/material"
import {
  PhotoCamera,
  Delete,
  Save,
  Cancel,
  Person,
  Email,
  Phone,
  Warning,
  Edit,
  Security,
  Verified,
} from "@mui/icons-material"

export default function ProfileEdit() {
  const [profile, setProfile] = useState({
    name: "John Doe",
    email: "john.doe@example.com",
    mobile: "+1 (555) 123-4567",
    profilePicture: "/placeholder.svg?height=120&width=120",
  })

  const [originalProfile, setOriginalProfile] = useState({ ...profile })
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" })
  const [errors, setErrors] = useState({})

  const handleInputChange = (field) => (event) => {
    setProfile((prev) => ({
      ...prev,
      [field]: event.target.value,
    }))
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }))
    }
  }

  const handleProfilePictureChange = (event) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setProfile((prev) => ({
          ...prev,
          profilePicture: e.target?.result,
        }))
      }
      reader.readAsDataURL(file)
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!profile.name.trim()) {
      newErrors.name = "Name is required"
    }

    if (!profile.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profile.email)) {
      newErrors.email = "Please enter a valid email address"
    }

    if (!profile.mobile.trim()) {
      newErrors.mobile = "Mobile number is required"
    } else if (!/^[+]?[1-9][\d]{0,15}$/.test(profile.mobile.replace(/[\s\-()]/g, ""))) {
      newErrors.mobile = "Please enter a valid mobile number"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSave = () => {
    if (validateForm()) {
      setOriginalProfile({ ...profile })
      setSnackbar({
        open: true,
        message: "Profile updated successfully!",
        severity: "success",
      })
    }
  }

  const handleCancel = () => {
    setProfile({ ...originalProfile })
    setErrors({})
  }

  const handleDeleteProfile = () => {
    setDeleteDialogOpen(false)
    setSnackbar({
      open: true,
      message: "Profile deleted successfully!",
      severity: "success",
    })
  }

  const hasChanges =
    profile.name !== originalProfile.name ||
    profile.email !== originalProfile.email ||
    profile.mobile !== originalProfile.mobile ||
    profile.profilePicture !== originalProfile.profilePicture

  const features = [
    { icon: <Security />, text: "Secure Profile" },
    { icon: <Verified />, text: "Verified Account" },
    { icon: <Edit />, text: "Easy Updates" },
  ]

  return (
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
          background: `url('/placeholder.svg?height=1080&width=1920')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          opacity: 0.1,
          zIndex: 0,
        },
      }}
    >
      <Container
        maxWidth="xl"
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          position: "relative",
          zIndex: 1,
          py: { xs: 2, md: 4 },
        }}
      >
        <Box
          sx={{
            display: "flex",
            width: "100%",
            alignItems: "center",
            gap: { xs: 0, lg: 6 },
            flexDirection: { xs: "column", lg: "row" },
          }}
        >
          {/* Left Side - Welcome Section */}
          <Fade in timeout={1000}>
            <Box
              sx={{
                flex: { xs: "none", lg: 1 },
                color: "white",
                textAlign: { xs: "center", lg: "left" },
                mb: { xs: 3, lg: 0 },
                display: { xs: "block", lg: "block" },
              }}
            >
              <Typography
                variant="h2"
                sx={{
                  fontWeight: 900,
                  mb: 2,
                  fontSize: { xs: "2rem", sm: "2.5rem", md: "3rem", lg: "3.5rem" },
                  textShadow: "0 4px 20px rgba(0,0,0,0.3)",
                  background: "linear-gradient(45deg, #ffffff, #f0f0f0)",
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Manage Your
                <br />
                Profile
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  mb: 3,
                  opacity: 0.9,
                  fontSize: { xs: "1rem", md: "1.2rem" },
                  lineHeight: 1.6,
                  display: { xs: "none", sm: "block" },
                }}
              >
                Update your personal information and keep your account secure with our easy-to-use profile editor.
              </Typography>

              {/* Features - Hidden on mobile for space */}
              <Box sx={{ display: { xs: "none", md: "flex" }, flexDirection: "column", gap: 2, mb: 3 }}>
                {features.map((feature, index) => (
                  <Fade key={index} in timeout={1000 + index * 200}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                      <Box
                        sx={{
                          width: 45,
                          height: 45,
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
                  </Fade>
                ))}
              </Box>

              <Chip
                label="Trusted & Secure"
                sx={{
                  bgcolor: "rgba(255,255,255,0.2)",
                  color: "white",
                  fontWeight: "bold",
                  backdropFilter: "blur(10px)",
                  border: "1px solid rgba(255,255,255,0.3)",
                  display: { xs: "none", sm: "inline-flex" },
                }}
              />
            </Box>
          </Fade>

          {/* Right Side - Profile Form */}
          <Fade in timeout={800}>
            <Paper
              elevation={24}
              sx={{
                width: { xs: "100%", sm: "90%", md: "600px", lg: "700px" },
                maxWidth: "100%",
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
              <CardHeader
                sx={{
                  textAlign: "center",
                  pb: 2,
                  pt: { xs: 3, sm: 4 },
                  px: { xs: 2, sm: 4 },
                }}
                title={
                  <Box>
                    <Avatar
                      sx={{
                        width: { xs: 60, sm: 80 },
                        height: { xs: 60, sm: 80 },
                        mx: "auto",
                        mb: 2,
                        background: "linear-gradient(135deg, #82b1ff 0%, #1a237e 100%)",
                        boxShadow: "0 8px 25px rgba(102, 126, 234, 0.3)",
                      }}
                    >
                      <Edit sx={{ fontSize: { xs: 30, sm: 40 } }} />
                    </Avatar>
                    <Typography
                      variant="h4"
                      sx={{
                        fontWeight: 700,
                        mb: 1,
                        fontSize: { xs: "1.5rem", sm: "2rem" },
                        background: "linear-gradient(45deg, #82b1ff, #1a237e)",
                        backgroundClip: "text",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                      }}
                    >
                      Edit Profile
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Update your personal information and account settings
                    </Typography>
                  </Box>
                }
              />

              <CardContent sx={{ px: { xs: 2, sm: 4, md: 6 }, pb: { xs: 2, sm: 4 } }}>
                <Grid container spacing={{ xs: 3, md: 4 }}>
                  {/* Profile Picture Section */}
                  <Grid item xs={12} md={4}>
                    <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
                      <Avatar
                        src={profile.profilePicture}
                        sx={{
                          width: { xs: 100, sm: 120 },
                          height: { xs: 100, sm: 120 },
                          border: "4px solid rgba(130, 177, 255, 0.3)",
                        }}
                      >
                        <Person sx={{ fontSize: { xs: 50, sm: 60 } }} />
                      </Avatar>

                      <input
                        accept="image/*"
                        style={{ display: "none" }}
                        id="profile-picture-upload"
                        type="file"
                        onChange={handleProfilePictureChange}
                      />
                      <label htmlFor="profile-picture-upload">
                        <IconButton
                          color="primary"
                          aria-label="upload picture"
                          component="span"
                          sx={{
                            background: "linear-gradient(135deg, #82b1ff 0%, #1a237e 100%)",
                            color: "white",
                            boxShadow: "0 8px 25px rgba(102, 126, 234, 0.3)",
                            "&:hover": {
                              background: "linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)",
                              transform: "translateY(-2px)",
                              boxShadow: "0 12px 35px rgba(102, 126, 234, 0.4)",
                            },
                            transition: "all 0.3s ease",
                          }}
                        >
                          <PhotoCamera />
                        </IconButton>
                      </label>

                      <Typography
                        variant="caption"
                        color="text.secondary"
                        textAlign="center"
                        sx={{ fontSize: { xs: "0.7rem", sm: "0.75rem" } }}
                      >
                        Click to upload new picture
                      </Typography>
                    </Box>
                  </Grid>

                  {/* Form Fields Section */}
                  <Grid item xs={12} md={8}>
                    <Grid container spacing={{ xs: 2, sm: 3 }}>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Full Name"
                          value={profile.name}
                          onChange={handleInputChange("name")}
                          error={!!errors.name}
                          helperText={errors.name}
                          InputProps={{
                            startAdornment: <Person sx={{ mr: 1, color: "action.active" }} />,
                          }}
                          sx={{
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
                      </Grid>

                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Email Address"
                          type="email"
                          value={profile.email}
                          onChange={handleInputChange("email")}
                          error={!!errors.email}
                          helperText={errors.email}
                          InputProps={{
                            startAdornment: <Email sx={{ mr: 1, color: "action.active" }} />,
                          }}
                          sx={{
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
                      </Grid>

                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Mobile Number"
                          value={profile.mobile}
                          onChange={handleInputChange("mobile")}
                          error={!!errors.mobile}
                          helperText={errors.mobile}
                          InputProps={{
                            startAdornment: <Phone sx={{ mr: 1, color: "action.active" }} />,
                          }}
                          sx={{
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
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>

                <Divider sx={{ my: { xs: 3, md: 4 } }} />

                {/* Action Buttons */}
                <Box
                  display="flex"
                  gap={2}
                  flexDirection={{ xs: "column", sm: "row" }}
                  justifyContent="space-between"
                  alignItems={{ xs: "stretch", sm: "center" }}
                >
                  <Box display="flex" gap={2} flexDirection={{ xs: "column", sm: "row" }}>
                    <Button
                      variant="contained"
                      startIcon={<Save />}
                      onClick={handleSave}
                      disabled={!hasChanges}
                      sx={{
                        py: { xs: 1.5, sm: 1.2 },
                        px: { xs: 3, sm: 4 },
                        fontSize: { xs: "0.9rem", sm: "1rem" },
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
                      Save Changes
                    </Button>

                    <Button
                      variant="outlined"
                      startIcon={<Cancel />}
                      onClick={handleCancel}
                      disabled={!hasChanges}
                      sx={{
                        py: { xs: 1.5, sm: 1.2 },
                        px: { xs: 3, sm: 4 },
                        borderColor: "#82b1ff",
                        color: "#82b1ff",
                        borderRadius: 2,
                        "&:hover": {
                          borderColor: "#1a237e",
                          backgroundColor: "rgba(130, 177, 255, 0.1)",
                        },
                      }}
                    >
                      Cancel
                    </Button>
                  </Box>

                  <Button
                    variant="outlined"
                    color="error"
                    startIcon={<Delete />}
                    onClick={() => setDeleteDialogOpen(true)}
                    sx={{
                      py: { xs: 1.5, sm: 1.2 },
                      px: { xs: 3, sm: 4 },
                      borderRadius: 2,
                    }}
                  >
                    Delete Profile
                  </Button>
                </Box>
              </CardContent>

              {/* Bottom Decoration */}
              <Box
                sx={{
                  height: { xs: 50, sm: 60 },
                  background: "linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Typography variant="caption" color="text.secondary" fontWeight="600">
                  🔒 Secure Profile Management
                </Typography>
              </Box>
            </Paper>
          </Fade>
        </Box>
      </Container>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            background: "rgba(255, 255, 255, 0.95)",
            backdropFilter: "blur(20px)",
          },
        }}
      >
        <DialogTitle sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Warning color="error" />
          Delete Profile
        </DialogTitle>

        <DialogContent>
          <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
            This action cannot be undone!
          </Alert>

          <Typography>
            Are you sure you want to delete your profile? This will permanently remove all your data and you won't be
            able to recover it.
          </Typography>
        </DialogContent>

        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setDeleteDialogOpen(false)} sx={{ borderRadius: 2 }}>
            Cancel
          </Button>
          <Button
            onClick={handleDeleteProfile}
            color="error"
            variant="contained"
            startIcon={<Delete />}
            sx={{ borderRadius: 2 }}
          >
            Delete Profile
          </Button>
        </DialogActions>
      </Dialog>

      {/* Success/Error Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
      >
        <Alert
          onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
          severity={snackbar.severity}
          sx={{ width: "100%", borderRadius: 2 }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  )
}

      
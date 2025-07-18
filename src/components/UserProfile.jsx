"use client"

import { useEffect, useState } from "react"
import {
  Container,
  Box,
  Typography,
  Avatar,
  TextField,
  Button,
  Grid,
  IconButton,
  CardContent,
  Fade,
  Slide,
  Zoom,
  Alert,
  LinearProgress,
  Chip,
  Divider,
  Paper,
  InputAdornment,
} from "@mui/material"
import {
  CameraAlt as CameraAltIcon,
  ArrowBack as ArrowBackIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Lock as LockIcon,
  AccountCircle as AccountCircleIcon,
} from "@mui/icons-material"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

const UserProfile = ({ userId, onBack }) => {
  const [user, setUser] = useState(null)
  const [editMode, setEditMode] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    userName: "",
    email: "",
    phone: "",
    password: "",
    profilePhoto: null,
  })
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [previewImage, setPreviewImage] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    fetchUserProfile()
  }, [])

  const fetchUserProfile = async () => {
    try {
      setLoading(true)
      const res = await axios.get("http://localhost:5000/api/user/profile", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      const userData = res.data?.user
      if (!userData) return
      setUser(userData)
      setFormData({
        userName: userData.userName || "",
        email: userData.email || "",
        phone: userData.phone || "",
        password: "",
        profilePhoto: null,
      })
    } catch (err) {
      console.error("Failed fetching user profile:", err)
      toast.error("Failed to load profile data")
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value, files } = e.target
    if (name === "profilePhoto") {
      const file = files[0]
      setFormData({ ...formData, profilePhoto: file })
      if (file) {
        const reader = new FileReader()
        reader.onload = (e) => setPreviewImage(e.target.result)
        reader.readAsDataURL(file)
      }
    } else {
      setFormData({ ...formData, [name]: value })
    }
  }

  const handleUpdate = async (e) => {
    e.preventDefault()
    setLoading(true)
    const payload = new FormData()
    payload.append("userName", formData.userName)
    payload.append("email", formData.email)
    payload.append("phone", formData.phone)
    if (formData.password) {
      payload.append("password", formData.password)
    }
    if (formData.profilePhoto) {
      payload.append("profilePhoto", formData.profilePhoto)
    }

    try {
      const res = await axios.put("http://localhost:5000/api/user/profile", payload, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "multipart/form-data",
        },
      })
      setUser(res.data.user)
      setEditMode(false)
      setPreviewImage(null)
      toast.success("Profile updated successfully!", {
        position: "top-right",
        autoClose: 3000,
      })
    } catch (err) {
      console.error("Update failed", err)
      toast.error("Failed to update profile")
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    setLoading(true)
    try {
      await axios.delete("http://localhost:5000/api/user/profile", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      localStorage.removeItem("token")
      toast.success("Profile deleted successfully!")
      setTimeout(() => {
        navigate("/SignupPage")
      }, 2000)
    } catch (err) {
      console.error("Delete failed", err)
      toast.error("Profile deletion failed!")
    } finally {
      setLoading(false)
    }
  }

  const handleProfilePhotoClick = () => {
    document.getElementById("profilePhotoInput").click()
  }

  if (!user && loading) {
    return (
      <Box
        sx={{
          minHeight: "80vh",
          background: "linear-gradient(135deg, #82b1ff 0%, #1a237e 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
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
        <Paper
          elevation={24}
          sx={{
            p: 4,
            background: "rgba(255, 255, 255, 0.95)",
            backdropFilter: "blur(20px)",
            borderRadius: 4,
            textAlign: "center",
            position: "relative",
            zIndex: 1,
          }}
        >
          <LinearProgress sx={{ mb: 2, borderRadius: 2 }} />
          <Typography variant="h6" color="primary">
            Loading profile...
          </Typography>
        </Paper>
      </Box>
    )
  }

  if (!user) {
    return (
      <Box
        sx={{
          minHeight: "80vh",
          background: "linear-gradient(135deg, #82b1ff 0%, #1a237e 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Alert
          severity="error"
          sx={{
            background: "rgba(255, 255, 255, 0.95)",
            backdropFilter: "blur(20px)",
            borderRadius: 2,
          }}
        >
          Failed to load user profile. Please try again.
        </Alert>
      </Box>
    )
  }

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
          position: "relative",
          zIndex: 1,
          py: 4,
        }}
      >
        {/* Header with back button */}
        <Fade in timeout={600}>
          <Box sx={{ display: "flex", alignItems: "center", mb: 4 }}>
            <IconButton
              onClick={onBack}
              sx={{
                mr: 2,
                background: "rgba(255, 255, 255, 0.2)",
                backdropFilter: "blur(10px)",
                color: "white",
                "&:hover": {
                  background: "rgba(255, 255, 255, 0.3)",
                  transform: "translateY(-2px)",
                },
              }}
            >
              <ArrowBackIcon />
            </IconButton>
            <Typography
              variant="h3"
              sx={{
                fontWeight: 900,
                color: "white",
                textShadow: "0 4px 20px rgba(0,0,0,0.3)",
                background: "linear-gradient(45deg, #ffffff, #f0f0f0)",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              {editMode ? "Edit Profile" : "My Profile"}
            </Typography>
          </Box>
        </Fade>

        <Grid container spacing={4}>
          {/* Profile Card */}
          <Grid item xs={12} md={4}>
            <Fade in timeout={800}>
              <Paper
                elevation={24}
                sx={{
                  background: "rgba(255, 255, 255, 0.95)",
                  backdropFilter: "blur(20px)",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                  borderRadius: 4,
                  overflow: "hidden",
                  height: "fit-content",
                }}
              >
                <CardContent sx={{ textAlign: "center", p: 4 }}>
                  <Box sx={{ position: "relative", display: "inline-block", mb: 3 }}>
                    <Avatar
                      src={previewImage || user.profilePhoto || "/default-profile.png"}
                      sx={{
                        width: 140,
                        height: 140,
                        margin: "0 auto",
                        border: "6px solid",
                        borderColor: "primary.main",
                        cursor: editMode ? "pointer" : "default",
                        boxShadow: "0 8px 25px rgba(102, 126, 234, 0.3)",
                        transition: "all 0.3s ease",
                        "&:hover": editMode
                          ? {
                              transform: "scale(1.05)",
                              boxShadow: "0 12px 35px rgba(102, 126, 234, 0.4)",
                            }
                          : {},
                      }}
                      onClick={editMode ? handleProfilePhotoClick : undefined}
                    />
                    {editMode && (
                      <Zoom in timeout={300}>
                        <IconButton
                          sx={{
                            position: "absolute",
                            bottom: 5,
                            right: 5,
                            background: "linear-gradient(135deg, #82b1ff 0%, #1a237e 100%)",
                            color: "white",
                            boxShadow: "0 4px 15px rgba(102, 126, 234, 0.3)",
                            "&:hover": {
                              background: "linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)",
                              transform: "scale(1.1)",
                            },
                          }}
                          onClick={handleProfilePhotoClick}
                        >
                          <CameraAltIcon />
                        </IconButton>
                      </Zoom>
                    )}
                  </Box>

                  <Typography
                    variant="h4"
                    sx={{
                      fontWeight: 700,
                      mb: 2,
                      background: "linear-gradient(45deg, #82b1ff, #1a237e)",
                      backgroundClip: "text",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                    }}
                  >
                    {user.userName}
                  </Typography>

                  <Chip
                    label="Active User"
                    sx={{
                      mb: 3,
                      background: "linear-gradient(135deg, #4caf50 0%, #2e7d32 100%)",
                      color: "white",
                      fontWeight: "bold",
                      boxShadow: "0 4px 15px rgba(76, 175, 80, 0.3)",
                    }}
                  />

                  <Divider sx={{ my: 3, background: "rgba(130, 177, 255, 0.3)" }} />

                  <Box sx={{ textAlign: "left" }}>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        mb: 2,
                        p: 2,
                        borderRadius: 2,
                        background: "rgba(130, 177, 255, 0.1)",
                      }}
                    >
                      <EmailIcon sx={{ mr: 2, color: "primary.main" }} />
                      <Typography variant="body1" color="text.primary" fontWeight="500">
                        {user.email}
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        p: 2,
                        borderRadius: 2,
                        background: "rgba(130, 177, 255, 0.1)",
                      }}
                    >
                      <PhoneIcon sx={{ mr: 2, color: "primary.main" }} />
                      <Typography variant="body1" color="text.primary" fontWeight="500">
                        {user.phone}
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Paper>
            </Fade>
          </Grid>

          {/* Profile Details/Edit Form */}
          <Grid item xs={12} md={8}>
            <Slide direction="left" in timeout={800}>
              <Paper
                elevation={24}
                sx={{
                  background: "rgba(255, 255, 255, 0.95)",
                  backdropFilter: "blur(20px)",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                  borderRadius: 4,
                  overflow: "hidden",
                }}
              >
                <CardContent sx={{ p: 4 }}>
                  {!editMode ? (
                    // View Mode
                    <Box>
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
                          <AccountCircleIcon sx={{ fontSize: 40 }} />
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
                          Profile Information
                        </Typography>
                      </Box>

                      <Grid container spacing={3}>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            fullWidth
                            label="Full Name"
                            value={user.name || user.userName}
                            InputProps={{
                              readOnly: true,
                              startAdornment: (
                                <InputAdornment position="start">
                                  <PersonIcon sx={{ color: "primary.main" }} />
                                </InputAdornment>
                              ),
                            }}
                            sx={{
                              "& .MuiOutlinedInput-root": {
                                background: "rgba(130, 177, 255, 0.05)",
                                "&:hover": {
                                  background: "rgba(130, 177, 255, 0.1)",
                                },
                              },
                            }}
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            fullWidth
                            label="Email Address"
                            value={user.email}
                            InputProps={{
                              readOnly: true,
                              startAdornment: (
                                <InputAdornment position="start">
                                  <EmailIcon sx={{ color: "primary.main" }} />
                                </InputAdornment>
                              ),
                            }}
                            sx={{
                              "& .MuiOutlinedInput-root": {
                                background: "rgba(130, 177, 255, 0.05)",
                                "&:hover": {
                                  background: "rgba(130, 177, 255, 0.1)",
                                },
                              },
                            }}
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            fullWidth
                            label="Phone Number"
                            value={user.phone}
                            InputProps={{
                              readOnly: true,
                              startAdornment: (
                                <InputAdornment position="start">
                                  <PhoneIcon sx={{ color: "primary.main" }} />
                                </InputAdornment>
                              ),
                            }}
                            sx={{
                              "& .MuiOutlinedInput-root": {
                                background: "rgba(130, 177, 255, 0.05)",
                                "&:hover": {
                                  background: "rgba(130, 177, 255, 0.1)",
                                },
                              },
                            }}
                          />
                        </Grid>
                      </Grid>

                      <Box sx={{ mt: 4, display: "flex", gap: 2, flexWrap: "wrap", justifyContent: "center" }}>
                        <Button
                          variant="contained"
                          startIcon={<EditIcon />}
                          onClick={() => setEditMode(true)}
                          size="large"
                          sx={{
                            py: 2,
                            px: 4,
                            fontSize: "1.1rem",
                            fontWeight: "bold",
                            borderRadius: 3,
                            background: "linear-gradient(135deg, #82b1ff 0%, #1a237e 100%)",
                            boxShadow: "0 8px 25px rgba(102, 126, 234, 0.3)",
                            "&:hover": {
                              background: "linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)",
                              transform: "translateY(-2px)",
                              boxShadow: "0 12px 35px rgba(102, 126, 234, 0.4)",
                            },
                          }}
                        >
                          Edit Profile
                        </Button>
                        <Button
                          variant="outlined"
                          color="error"
                          startIcon={<DeleteIcon />}
                          onClick={() => setConfirmDelete(true)}
                          size="large"
                          sx={{
                            py: 2,
                            px: 4,
                            fontSize: "1.1rem",
                            fontWeight: "bold",
                            borderRadius: 3,
                            borderWidth: 2,
                            "&:hover": {
                              borderWidth: 2,
                              transform: "translateY(-2px)",
                              boxShadow: "0 8px 25px rgba(244, 67, 54, 0.3)",
                            },
                          }}
                        >
                          Delete Account
                        </Button>
                      </Box>

                      {/* Delete Confirmation */}
                      {confirmDelete && (
                        <Fade in timeout={300}>
                          <Alert
                            severity="warning"
                            sx={{
                              mt: 3,
                              background: "rgba(255, 193, 7, 0.1)",
                              border: "1px solid rgba(255, 193, 7, 0.3)",
                              borderRadius: 2,
                            }}
                            action={
                              <Box>
                                <Button
                                  color="error"
                                  size="small"
                                  onClick={handleDelete}
                                  disabled={loading}
                                  sx={{ fontWeight: "bold" }}
                                >
                                  Yes, Delete
                                </Button>
                                <Button
                                  size="small"
                                  onClick={() => setConfirmDelete(false)}
                                  sx={{ ml: 1, fontWeight: "bold" }}
                                >
                                  Cancel
                                </Button>
                              </Box>
                            }
                          >
                            <Typography fontWeight="bold">
                              Are you sure you want to permanently delete your account?
                            </Typography>
                          </Alert>
                        </Fade>
                      )}
                    </Box>
                  ) : (
                    // Edit Mode
                    <Box component="form" onSubmit={handleUpdate}>
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
                          <EditIcon sx={{ fontSize: 40 }} />
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
                          Edit Profile Information
                        </Typography>
                      </Box>

                      {loading && (
                        <LinearProgress
                          sx={{
                            mb: 3,
                            borderRadius: 2,
                            height: 6,
                            background: "rgba(130, 177, 255, 0.2)",
                          }}
                        />
                      )}

                      <Grid container spacing={3}>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            fullWidth
                            label="Full Name"
                            name="userName"
                            value={formData.userName}
                            onChange={handleInputChange}
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  <PersonIcon sx={{ color: "primary.main" }} />
                                </InputAdornment>
                              ),
                            }}
                            sx={{
                              "& .MuiOutlinedInput-root": {
                                background: "rgba(130, 177, 255, 0.05)",
                                "&:hover": {
                                  background: "rgba(130, 177, 255, 0.1)",
                                },
                                "&.Mui-focused": {
                                  background: "rgba(130, 177, 255, 0.1)",
                                },
                              },
                            }}
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            fullWidth
                            label="Email Address"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  <EmailIcon sx={{ color: "primary.main" }} />
                                </InputAdornment>
                              ),
                            }}
                            sx={{
                              "& .MuiOutlinedInput-root": {
                                background: "rgba(130, 177, 255, 0.05)",
                                "&:hover": {
                                  background: "rgba(130, 177, 255, 0.1)",
                                },
                                "&.Mui-focused": {
                                  background: "rgba(130, 177, 255, 0.1)",
                                },
                              },
                            }}
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            fullWidth
                            label="Phone Number"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  <PhoneIcon sx={{ color: "primary.main" }} />
                                </InputAdornment>
                              ),
                            }}
                            sx={{
                              "& .MuiOutlinedInput-root": {
                                background: "rgba(130, 177, 255, 0.05)",
                                "&:hover": {
                                  background: "rgba(130, 177, 255, 0.1)",
                                },
                                "&.Mui-focused": {
                                  background: "rgba(130, 177, 255, 0.1)",
                                },
                              },
                            }}
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            fullWidth
                            label="New Password (Optional)"
                            name="password"
                            type="password"
                            value={formData.password}
                            onChange={handleInputChange}
                            helperText="Leave blank to keep current password"
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  <LockIcon sx={{ color: "primary.main" }} />
                                </InputAdornment>
                              ),
                            }}
                            sx={{
                              "& .MuiOutlinedInput-root": {
                                background: "rgba(130, 177, 255, 0.05)",
                                "&:hover": {
                                  background: "rgba(130, 177, 255, 0.1)",
                                },
                                "&.Mui-focused": {
                                  background: "rgba(130, 177, 255, 0.1)",
                                },
                              },
                            }}
                          />
                        </Grid>
                      </Grid>

                      {/* Hidden file input */}
                      <input
                        type="file"
                        name="profilePhoto"
                        id="profilePhotoInput"
                        hidden
                        accept="image/*"
                        onChange={handleInputChange}
                      />

                      <Box sx={{ mt: 4, display: "flex", gap: 2, flexWrap: "wrap", justifyContent: "center" }}>
                        <Button
                          type="submit"
                          variant="contained"
                          startIcon={<SaveIcon />}
                          disabled={loading}
                          size="large"
                          sx={{
                            py: 2,
                            px: 4,
                            fontSize: "1.1rem",
                            fontWeight: "bold",
                            borderRadius: 3,
                            background: "linear-gradient(135deg, #82b1ff 0%, #1a237e 100%)",
                            boxShadow: "0 8px 25px rgba(102, 126, 234, 0.3)",
                            "&:hover": {
                              background: "linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)",
                              transform: "translateY(-2px)",
                              boxShadow: "0 12px 35px rgba(102, 126, 234, 0.4)",
                            },
                          }}
                        >
                          {loading ? "Saving..." : "Save Changes"}
                        </Button>
                        <Button
                          variant="outlined"
                          startIcon={<CancelIcon />}
                          onClick={() => {
                            setEditMode(false)
                            setPreviewImage(null)
                            setFormData({
                              userName: user.userName || "",
                              email: user.email || "",
                              phone: user.phone || "",
                              password: "",
                              profilePhoto: null,
                            })
                          }}
                          disabled={loading}
                          size="large"
                          sx={{
                            py: 2,
                            px: 4,
                            fontSize: "1.1rem",
                            fontWeight: "bold",
                            borderRadius: 3,
                            borderWidth: 2,
                            "&:hover": {
                              borderWidth: 2,
                              transform: "translateY(-2px)",
                              boxShadow: "0 8px 25px rgba(102, 126, 234, 0.3)",
                            },
                          }}
                        >
                          Cancel
                        </Button>
                      </Box>
                    </Box>
                  )}
                </CardContent>
              </Paper>
            </Slide>
          </Grid>
        </Grid>
      </Container>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
        toastStyle={{
          background: "rgba(255, 255, 255, 0.95)",
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(255, 255, 255, 0.2)",
          borderRadius: "12px",
        }}
      />
    </Box>
  )
}

export default UserProfile

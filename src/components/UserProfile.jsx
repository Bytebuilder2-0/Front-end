import React, { useEffect, useState } from "react";
import {
  Container,
  Box,
  Typography,
  Avatar,
  TextField,
  Button,
  Paper,
  Grid,
  IconButton,
} from "@mui/material";
import CameraAltIcon from "@mui/icons-material/CameraAlt"; // Camera Icon
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Import useNavigate for redirection
import { toast, ToastContainer } from "react-toastify"; // Import react-toastify
import "react-toastify/dist/ReactToastify.css"; // Import the CSS for styling

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    userName: "",
    email: "",
    phone: "",
    password: "",
    profilePhoto: null,
  });
  const [formErrors, setFormErrors] = useState({
    userName: "",
    email: "",
    phone: "",
    password: "",
  });
  const [confirmDelete, setConfirmDelete] = useState(false); // Track whether to show confirmation
  const navigate = useNavigate(); // Initialize navigate

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/user/profile", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const userData = res.data?.user;
      if (!userData) return;
      setUser(userData);
      setFormData({
        userName: userData.userName || "",
        email: userData.email || "",
        phone: userData.phone || "",
        password: "",
        profilePhoto: null,
      });
    } catch (err) {
      console.error("fail fetching user profile:", err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "profilePhoto") {
      setFormData({ ...formData, profilePhoto: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const validateForm = () => {
    let isValid = true;
    let errors = { userName: "", email: "", phone: "", password: "" };

    // Validate userName
    if (!formData.userName) {
      errors.userName = "Name is required!";
      isValid = false;
    }

    // Validate email
    if (!formData.email) {
      errors.email = "Email is required!";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Email is invalid!";
      isValid = false;
    }

    // Validate phone
    if (!formData.phone) {
      errors.phone = "Phone number is required!";
      isValid = false;
    } else if (!/^\d{10}$/.test(formData.phone)) {
      errors.phone = "Phone number should be 10 digits!";
      isValid = false;
    }

    // Validate password (optional, but you can add more rules)
    if (!formData.password) {
      errors.password = "Password is required!";
      isValid = false;
    } else if (formData.password.length < 6) {
      errors.password = "Password must be at least 6 characters!";
      isValid = false;
    }

    setFormErrors(errors); // Set errors to be displayed on the form
    return isValid;
  };

  const handleUpdate = async (e) => {
    e.preventDefault(); // Prevent the default form submission

    if (!validateForm()) return; // Only proceed if the form is valid

    const payload = new FormData();
    payload.append("userName", formData.userName);
    payload.append("email", formData.email);
    payload.append("phone", formData.phone);
    payload.append("password", formData.password);

    // If the user selected a new profile photo, add it to FormData
    if (formData.profilePhoto) {
      payload.append("profilePhoto", formData.profilePhoto);
    }

    try {
      // Make the API call to update the profile (Cloudinary handles the image upload)
      const res = await axios.put("http://localhost:5000/api/user/profile", payload, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "multipart/form-data",
        },
      });

      // Handle success - Update the user state with the new profile data
      setUser(res.data.user);
      setEditMode(false); // Exit the edit mode

      // Show a success toast
      toast.success("Profile updated successfully!", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored", // Optional: Use colorful theme
      });
    } catch (err) {
      console.error("Update failed", err);
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete("http://localhost:5000/api/user/profile", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      localStorage.removeItem("token");

      // Show the success toast after profile deletion
      toast.success("Profile deleted successfully!", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored", // Optional: Use colorful theme
      });

      // Redirect to Sign-up page after deletion
      setTimeout(() => {
        navigate("/SignupPage"); // Redirect to Sign-up page
      }, 2000); // Delay navigation for a smoother user experience
    } catch (err) {
      console.error("Delete failed", err);
      toast.error("Profile deletion failed!", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
    }
  };

  const toggleConfirmDelete = () => {
    setConfirmDelete(!confirmDelete); // Toggle the confirmation message visibility
  };

  const handleProfilePhotoClick = () => {
    document.getElementById("profilePhotoInput").click(); // Trigger file input click
  };

  if (!user) return <Typography>Loading...</Typography>;

  return (
    <Box sx={{ py: 8, background: "linear-gradient(to right, #83a4d4, #b6fbff)" }}>
      <Container maxWidth="sm">
        <Paper
          elevation={4}
          sx={{
            p: 4,
            borderRadius: 4,
            backdropFilter: "blur(10px)",
            backgroundColor: "rgba(255, 255, 255, 0.9)",
          }}
        >
          {!editMode ? (
            <Box textAlign="center">
              <Avatar
                src={user.profilePhoto || "/default-profile.png"}
                sx={{ width: 100, height: 100, margin: "0 auto", mb: 2 }}
              />
              <Typography variant="h5" fontWeight="bold">
                {user.userName}
              </Typography>
              <Typography>{user.email}</Typography>
              <Typography> {user.phone}</Typography>

              <Grid container spacing={2} justifyContent="center" sx={{ mt: 3 }}>
                <Grid item>
                  <Button variant="contained" onClick={() => setEditMode(true)}>
                    Edit Profile
                  </Button>
                  
                </Grid>
                <Grid item>
                  <Button variant="outlined" color="error" onClick={toggleConfirmDelete}>
                    Delete Profile
                  </Button>
                </Grid>
              </Grid>

              {/* Show confirmation message if 'confirmDelete' is true */}
              {confirmDelete && (
                <Box sx={{ mt: 2, textAlign: "center" }}>
                  <Typography sx={{ color: "red" }}>Are you sure you want to delete your account?</Typography>
                  <Grid container spacing={2} justifyContent="center" sx={{ mt: 2 }}>
                    <Grid item>
                      <Button
                        variant="contained"
                        color="error"
                        onClick={handleDelete} // Proceed with delete if Yes
                      >
                        Yes, Delete
                      </Button>
                    </Grid>
                    <Grid item>
                      <Button
                        variant="outlined"
                        onClick={toggleConfirmDelete} // Hide confirmation if No
                      >
                        No, Cancel
                      </Button>
                    </Grid>
                  </Grid>
                </Box>
              )}
            </Box>
          ) : (
            <Box component="form" onSubmit={handleUpdate}>
              <Typography variant="h6" gutterBottom>
                Edit Profile
              </Typography>

              <Box textAlign="center" mb={3}>
                <Avatar
                  src={
                    formData.profilePhoto
                      ? URL.createObjectURL(formData.profilePhoto)
                      : user.profilePhoto || "/default-profile.png"
                  }
                  alt="Profile Preview"
                  sx={{
                    width: 100,
                    height: 100,
                    margin: "0 auto",
                    border: "3px solid #ccc",
                    cursor: "pointer", // Make avatar clickable
                  }}
                  onClick={handleProfilePhotoClick} // Trigger file input click on avatar
                />
                <IconButton
                  sx={{ position: "absolute", top: "70px", left: "35px" }}
                  onClick={handleProfilePhotoClick} // Trigger file input click on camera icon
                >
                  <CameraAltIcon sx={{ fontSize: 30, color: "#fff", backgroundColor: "rgba(0,0,0,0.6)", borderRadius: "50%" }} />
                </IconButton>
                <Typography variant="subtitle1" mt={1}>
                  {user.userName}
                </Typography>
              </Box>

              {/* Name */}
              <TextField
                fullWidth
                label="Name"
                name="userName"
                value={formData.userName}
                onChange={handleInputChange}
                sx={{ mb: 2 }}
                error={formErrors.userName !== ""}
                helperText={formErrors.userName}
              />

              {/* Email */}
              <TextField
                fullWidth
                label="Email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                sx={{ mb: 2 }}
                error={formErrors.email !== ""}
                helperText={formErrors.email}
              />

              {/* Phone */}
              <TextField
                fullWidth
                label="Phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                sx={{ mb: 2 }}
                error={formErrors.phone !== ""}
                helperText={formErrors.phone}
              />

              {/* Password */}
              <TextField
                fullWidth
                label="New Password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleInputChange}
                sx={{ mb: 2 }}
                error={formErrors.password !== ""}
                helperText={formErrors.password}
              />

              <Box sx={{ mb: 2 }}>
                {/* Hidden file input */}
                <input
                  type="file"
                  name="profilePhoto"
                  id="profilePhotoInput"
                  hidden
                  accept="image/*"
                  onChange={handleInputChange}
                />
              </Box>

              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Button fullWidth type="submit" variant="contained">
                    Save
                  </Button>
                </Grid>
                <Grid item xs={6}>
                  <Button
                    fullWidth
                    variant="outlined"
                    color="secondary"
                    onClick={() => setEditMode(false)}
                  >
                    Cancel
                  </Button>
                </Grid>
              </Grid>
            </Box>
          )}
        </Paper>
      </Container>

      {/* Toast Container for notifications */}
      <ToastContainer />
    </Box>
  );
};

export default UserProfile;

import React, { useState } from 'react';
import { useSignup } from '../hooks/useSignup';
import { useAuthContext } from '../hooks/useAuthContext';
import { useNavigate } from 'react-router-dom';
import {
  TextField, Button, Container, Typography, Avatar, MenuItem,
  Grid, Paper, InputAdornment, IconButton, Checkbox, FormControlLabel,
  Box
} from '@mui/material';
import { Visibility, VisibilityOff, AddCircleOutlined } from '@mui/icons-material'; 
import axios from 'axios';
import LoginSignupNavbar from '../components/LoginSignupNavbar';

const roles = ["customer", "technician", "manager", "Supervisor"];

const Signup = () => {
  const [formData, setFormData] = useState({
    email: '',
    fullName: '',
    userName: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: 'customer',
    roleId: '',
    termsAccepted: false,  // To track whether the checkbox is checked
  
  });


  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const{ signup, error, isLoading } = useSignup();

   const isSpecialRole = ['technician', 'manager', 'Supervisor'].includes(formData.role);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCheckboxChange = (e) => {
    setFormData({ ...formData, termsAccepted: e.target.checked });
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.email.includes('@')) newErrors.email = "Invalid email";
    if (!formData.fullName.trim()) newErrors.fullName = "Full name required";
    if (!formData.userName.trim()) newErrors.userName = "Username required";
    if (!formData.phone.match(/^\d{10}$/)) newErrors.phone = "Phone must be 10 digits";
    if (formData.password.length < 6) newErrors.password = "Password must be at least 6 characters";
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = "Passwords do not match";
    if (isSpecialRole && !formData.roleId.trim()) newErrors.roleId = `${formData.role} ID required`;
    if (!formData.termsAccepted) newErrors.termsAccepted = "You must accept the terms and conditions"; // Validation for checkbox
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      const payload = {
        ...formData,
        roleId: isSpecialRole ? formData.roleId : undefined,
      };
      console.log(payload);
     // await signup(formData.email, formData.fullName, formData.userName, formData.phone, formData.password, formData.confirmPassword, formData.role);
 

      const res = await axios.post('http://localhost:4880/api/auth/register', payload);
      alert('Signup successful!');
      console.log(res);
      setFormData({
        email: '',
        fullName: '',
        userName: '',
        phone: '',
        password: '',
        confirmPassword: '',
        role: 'customer',
        roleId: '',
        termsAccepted: false, // Reset checkbox after form submission
      });
    } catch (err) {
      console.error(err);
      console.log(err);
      alert(err.response?.data?.message || 'Signup failed');

    }
  };

  const avatarStyle = {backgroundColor: '#9CE178', color: '#fff' }; //rgb(47 154 78) ekata danna 

  return (
    <>
    <LoginSignupNavbar />
    <Container maxWidth="sm">
      <Paper style={{ padding: 20, height: '78vh', width: 405, borderRadius: 0, margin: "30px auto" }}>
        <Grid align="center" item xs={10} mb={2}>
          <Avatar sx={{ width: 50, height: 50 }} style={avatarStyle}><AddCircleOutlined /></Avatar>
          <Typography variant="h5" gutterBottom>
            Create an Account
          </Typography>
        </Grid>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth name="email" label="Email" value={formData.email}
                onChange={handleChange} error={!!errors.email}
                helperText={errors.email}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth name="fullName" label="Full Name" value={formData.fullName}
                onChange={handleChange} error={!!errors.fullName}
                helperText={errors.fullName}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth name="userName" label="Username" value={formData.userName}
                onChange={handleChange} error={!!errors.userName}
                helperText={errors.userName}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth name="phone" label="Phone Number" value={formData.phone}
                onChange={handleChange} error={!!errors.phone}
                helperText={errors.phone}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth name="password" label="Password" type={showPassword ? 'text' : 'password'}
                value={formData.password} onChange={handleChange} error={!!errors.password}
                helperText={errors.password}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPassword(!showPassword)}>
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth name="confirmPassword" label="Confirm Password" type={showPassword ? 'text' : 'password'}
                value={formData.confirmPassword} onChange={handleChange} error={!!errors.confirmPassword}
                helperText={errors.confirmPassword}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth select name="role" label="Role" value={formData.role}
                onChange={handleChange}
              >
                {roles.map((role) => (
                  <MenuItem key={role} value={role}>{role}</MenuItem>
                ))}
              </TextField>
            </Grid>

            {isSpecialRole && (
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  name="roleId"
                  label={`${formData.role} ID`}
                  value={formData.roleId}
                  onChange={handleChange}
                  error={!!errors.roleId}
                  helperText={errors.roleId}
                />
              </Grid>
            )}

            {/* Checkbox for Terms and Conditions */}
            <Grid item xs={12}>
              <FormControlLabel
                control={<Checkbox checked={formData.termsAccepted} onChange={handleCheckboxChange} />}
                label="I accept the terms and conditions"
              />
              {errors.termsAccepted && (
                <Typography color="error" variant="body2">{errors.termsAccepted}</Typography>
              )}
            </Grid>

          
          
            <Grid item xs={5} align="center">
              <Button fullWidth variant="contained" color="primary" type="submit">
                Sign Up
              </Button>
            </Grid>
            
          </Grid>
        </form>
      </Paper>
    </Container>
    </>
  );
};

export default Signup;

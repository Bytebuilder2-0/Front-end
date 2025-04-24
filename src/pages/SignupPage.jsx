import React, { useState } from 'react';
import {
  TextField, Button, Container, Typography, MenuItem,
  Grid, Paper, InputAdornment, IconButton
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import axios from 'axios';

const roles = ["customer", "technician", "manager", "Supervisor", "admin"];

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
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  const isSpecialRole = ['technician', 'manager', 'Supervisor'].includes(formData.role);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
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
        // You can optionally send roleId only for those roles
        roleId: isSpecialRole ? formData.roleId : undefined,
      };

      const res = await axios.post('http://localhost:5000/api/auth/signup', payload);
      alert('Signup successful!');
      setFormData({
        email: '',
        fullName: '',
        userName: '',
        phone: '',
        password: '',
        confirmPassword: '',
        role: 'customer',
        roleId: '',
      });
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Signup failed');
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} style={{ padding: 24, marginTop: 40, borderRadius: 16 }}>
        <Typography variant="h5" gutterBottom>
          Create an Account
        </Typography>
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

            <Grid item xs={12}>
              <Button fullWidth variant="contained" color="primary" type="submit">
                Sign Up
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
};

export default Signup;

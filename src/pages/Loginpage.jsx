import React, { useState } from 'react';
import { TextField, Button, Box, Typography } from '@mui/material';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';  // 👈 import useNavigate

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();  // 👈 create navigate function

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await axios.post('http://localhost:4880/api/auth/login', {
        email,
        password
      });

      const { token, role } = response.data;

      // Save token and role
      localStorage.setItem('token', token);
      localStorage.setItem('role', role);

      // Navigate based on role
      if (role === 'manager') {
        navigate('/ManagerDashboard');
      } else if (role === 'technician') {
        navigate('/TDashboard');
      } else if (role === 'customer') {
        navigate('/User');
      } else if (role === 'supervisor') {
        navigate('/Super');
      } else {
        navigate('/User');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleLogin}
      sx={{ maxWidth: 400, mx: 'auto', mt: 10, p: 3, border: '1px solid #ccc', borderRadius: 2 }}
    >
      <Typography variant="h5" align="center" gutterBottom>Login</Typography>
      <TextField
        label="Email"
        type="email"
        fullWidth
        margin="normal"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <TextField
        label="Password"
        type="password"
        fullWidth
        margin="normal"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      {error && <Typography color="error" sx={{ mt: 1 }}>{error}</Typography>}
      <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
        Login
      </Button>
      <Box sx={{ mt: 2, textAlign: 'center' }}>
        <Link to="#" underline="none">Forgot password?</Link>
      </Box>
    </Box>
  );
};

export default LoginForm;

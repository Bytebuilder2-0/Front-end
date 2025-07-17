import React, { useEffect, useState } from 'react';
import {
  Avatar,
  Button,
  Container,
  TextField,
  Typography,
  Stack,
  IconButton,
  Box,
  CircularProgress,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';

const ProfilePage = () => {
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({ email: '', userName: '', phone: '', profilePhoto: '' });
  const [preview, setPreview] = useState('');
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token'); // Adjust based on your auth strategy

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/user/profile',form , {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProfile(res.data.user);
      setForm({
        email: res.data.user.email || '',
        userName: res.data.user.name || '',
        phone: res.data.user.phone || '',
        profilePhoto: res.data.user.profilePhoto || '',
      });
      setPreview(res.data.user.profilePhoto || '');
    } catch (err) {
      console.error('Failed to fetch profile:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setPreview(reader.result);
        setForm((prev) => ({ ...prev, profilePhoto: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    try {
      await axios.put('http://localhost:5000/api/user/profile', form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert('Profile updated');
      fetchProfile();
    } catch (err) {
      console.error('Update failed:', err);
      alert('Update failed');
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete your profile?')) return;
    try {
      await axios.delete('http://localhost:5000/api/user/profile', {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert('Profile deleted');
      localStorage.removeItem('token');
      window.location.href = '/login'; // Redirect to login or landing
    } catch (err) {
      console.error('Delete failed:', err);
      alert('Delete failed');
    }
  };

  if (loading) return <CircularProgress sx={{ mt: 10, mx: 'auto', display: 'block' }} />;

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Typography variant="h5" gutterBottom>
        My Profile
      </Typography>

      <Stack spacing={2}>
        <Box display="flex" alignItems="center" gap={2}>
          <Avatar src={preview} sx={{ width: 64, height: 64 }} />
          <Button variant="outlined" component="label">
            Upload Photo
            <input type="file" hidden accept="image/*" onChange={handlePhotoChange} />
          </Button>
        </Box>

        <TextField
          name="userName"
          label="Full Name"
          value={form.userName}
          onChange={handleChange}
          fullWidth
        />
        <TextField
          name="email"
          label="Email"
          value={form.email}
          onChange={handleChange}
          fullWidth
        />
        <TextField
          name="phone"
          label="Phone"
          value={form.phone}
          onChange={handleChange}
          fullWidth
        />

        <Stack direction="row" spacing={2}>
          <Button variant="contained" color="primary" onClick={handleSave}>
            Save Changes
          </Button>
          <IconButton color="error" onClick={handleDelete}>
            <DeleteIcon />
          </IconButton>
        </Stack>
      </Stack>
    </Container>
  );
};

export default ProfilePage;

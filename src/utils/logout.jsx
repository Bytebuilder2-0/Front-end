import axios from 'axios';

const handleLogout = async () => {
  const token = localStorage.getItem('token');

  try {
    await axios.post('http://localhost:5000/api/auth/logout', {}, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    localStorage.removeItem('token');
    window.location.href = '/login'; // Or navigate programmatically
  } catch (err) {
    console.error('Logout error:', err.response?.data || err.message);
  }
};

export default handleLogout;
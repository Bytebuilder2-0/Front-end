// utils/logout.jsx
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const useLogout = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    const token = localStorage.getItem('token');

    try {
      await axios.post('http://localhost:4880/api/auth/logout', {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      localStorage.removeItem('token');
      navigate('/login');
    } catch (err) {
      console.error('Logout error:', err.response?.data || err.message);
    }
  };

  return handleLogout;
};

export default useLogout;

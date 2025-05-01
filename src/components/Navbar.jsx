import React from 'react';
import { AppBar, Toolbar, Button, Box } from '@mui/material';
import { Link } from 'react-router-dom';
import { logout } from '../utils/logout';

const Navbar = () => {
  return (
    <AppBar position="static" sx={{ backgroundColor: 'rgba(0, 0, 0, 0.7)' }}>
      <Toolbar>
        <Box sx={{ flexGrow: 1 }}>
          <Link to="/">
            <img
              src="/assets/garage.jpg"
              alt="Logo"
              style={{ height: 40 }}
            />
          </Link>
        </Box>
        <Box>
          <Button color="inherit" component={Link} to="/Loginpage" sx={{ marginRight: 2 }}>
            Login
          </Button>
          <Button color="inherit" component={Link} to="/SignupPage"sx={{ marginRight: 2 }}>
            Sign Up
          </Button>
          <Button color="inherit" component={Link} to="/logout" sx={{ marginRight: 2 }}>
        Logout
      </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;

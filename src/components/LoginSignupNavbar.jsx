import React from 'react';
import { AppBar, Toolbar, Button, Box } from '@mui/material';
import { Link } from 'react-router-dom';

const LoginSignupNavbar = () => {
  return (
    <AppBar position="static" sx={{ backgroundColor: '#558b2f' }}>
      <Toolbar>
        <Box sx={{ flexGrow: 1 }}>
          <Link to="/">
            <img
              src="/assets/resized-garage24.png"
              alt="Logo"
              style={{ height: 40 }}
            />
          </Link>
        </Box>
        <Box>
          <Button color="inherit" component={Link} to="/VehicleForm">
            Add Vehicle
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default LoginSignupNavbar;

import React from 'react';
import { AppBar, Toolbar, Button, Box } from '@mui/material';
import { Link } from 'react-router-dom';

const LoginSignupNavbar = () => {
  return (
    <AppBar position="static" sx={{ backgroundColor: ' #9CE178' }}>
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
        {/* <Box>
          <Button color="inherit" component={Link} to="/Loginpage" sx={{ marginRight: 2 }}>
            Login
          </Button>
          <Button color="inherit" component={Link} to="/SignupPage">
            Sign Up
          </Button>
        </Box> */}
      </Toolbar>
    </AppBar>
  );
};

export default LoginSignupNavbar;

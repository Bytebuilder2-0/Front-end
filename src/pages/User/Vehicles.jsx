import React from 'react';
import AllVehicles from '../../components/WelcomeUser/AllVehicles';
import UserMiniDrawer from '../../components/ui/UserMiniDrawer'
import { Box, Toolbar } from '@mui/material';

function Vehicles() {
 

  return (
    <>
     <Box sx={{ display: 'flex' }}>
    <UserMiniDrawer />
    <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
     <Toolbar/>
     <AllVehicles  />
     </Box>
     </Box>

    </>
  )
}

export default Vehicles;

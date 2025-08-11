import React from 'react';
import FormVehicle from '../../components/WelcomeUser/FormVehicle';
import UserMiniDrawer from '../../components/ui/UserMiniDrawer'
import { Box, Toolbar } from '@mui/material';

function VehicleRegister() {
 

  return (
    <>
     <Box sx={{ display: 'flex' }}>
    <UserMiniDrawer />
    <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
     <Toolbar/>
     <FormVehicle  />
     </Box>
     </Box>

    </>
  )
}

export default VehicleRegister;

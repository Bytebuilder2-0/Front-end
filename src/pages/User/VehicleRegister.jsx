import React from 'react';
import FormVehicle from '../../components/WelcomeUser/FormVehicle';
import UserMiniDrawer from '../../components/ui/UserMiniDrawer'
import { Box, Toolbar } from '@mui/material';

function VehicleRegister() {
 
  //Hardcode UserId
  const userId = "67d873693913311df6a32a25"; 
  return (
    <>
     <Box sx={{ display: 'flex' }}>
    <UserMiniDrawer userId={userId}/>
    <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
     <Toolbar/>
     <FormVehicle userId={userId} />
     </Box>
     </Box>

    </>
  )
}

export default VehicleRegister;

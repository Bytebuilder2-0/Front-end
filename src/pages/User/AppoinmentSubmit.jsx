import React from 'react';
import AppointmentForm from '../../components/Appointement/AppoinmentForm' 
import UserMiniDrawer from '../../components/ui/UserMiniDrawer'
import { Box, Toolbar } from '@mui/material';

function AppointmentSubmit() {
 
  //Hardcode UserId
  const userId = "680e27c048a060dca4041bb5"; 
  return (
    <>
     <Box sx={{ display: 'flex' }}>
    <UserMiniDrawer userId={userId}/>
    <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
     <Toolbar/>
     <AppointmentForm userId={userId} />
     </Box>
     </Box>

    </>
  )
}

export default AppointmentSubmit;

import React from 'react';
import AppointmentForm from '../../components/Appointement/AppoinmentForm' 
import UserMiniDrawer from '../../components/ui/UserMiniDrawer'
import { Box, Toolbar } from '@mui/material';

function AppointmentSubmit() {
 
  //Hardcode UserId
  const userId = "67d873693913311df6a32a25"; 
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

import React from 'react';
import AppointmentForm from '../../components/AppoinmentForm' 
import UserMiniDrawer from '../../components/ui/UserMiniDrawer'
import { Box, Toolbar } from '@mui/material';

function AppointmentSubmit() {
 
  //Hardcode UserId
  const userId = "67c35eec60d77944a4fe5cf3"; 
  return (
    <>
     <Box sx={{ display: 'flex' }}>
    <UserMiniDrawer />
    <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
     <Toolbar/>
     <AppointmentForm userId={userId} />
     </Box>
     </Box>

    </>
  )
}

export default AppointmentSubmit;

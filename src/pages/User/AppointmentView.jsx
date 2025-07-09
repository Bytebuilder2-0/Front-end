import AppointmentStatus from '../../components/AppoinmentStatus/AppointmetStatus';
import { Box,Toolbar } from "@mui/material";
import UserMiniDrawer from "../../components/ui/UserMiniDrawer";


function AppointmentView(){

  const userId = "67d873693913311df6a32a25"; 

      return (
        <>
        <Box sx={{ display: 'flex' }}>
        <UserMiniDrawer userId={userId}/>
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar/>
        
         <AppointmentStatus />
         </Box>
        </Box>
    
        </>


      );
  }

export default AppointmentView;


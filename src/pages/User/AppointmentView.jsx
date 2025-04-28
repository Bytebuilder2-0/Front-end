import AppointmentStatus from '../../components/AppoinmentStatus/AppointmetStatus';
import { Box,Toolbar } from "@mui/material";
import UserMiniDrawer from "../../components/ui/UserMiniDrawer";


function AppointmentView(){

  const userId = "680e27c048a060dca4041bb5"; 

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


import AppointmentData from "../../components/AppintmentData";
import { Box,Toolbar } from "@mui/material";
import UserMiniDrawer from "../../components/ui/UserMiniDrawer";

function UserDashboard() {
  
  return (
     <>
    <Box sx={{ display: 'flex' }}>
       <UserMiniDrawer />
       <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar/>
       </Box>
     </Box>
     </>
  );
}

export default UserDashboard;

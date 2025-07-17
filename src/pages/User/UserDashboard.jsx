import { Box,Toolbar } from "@mui/material";
import UserMiniDrawer from "../../components/ui/UserMiniDrawer";
import UserWelcome from "../../components/WelcomeUser/UserWelcome";

function UserDashboard() {


  return (
     <>
    <Box sx={{ display: 'flex' }}>
       <UserMiniDrawer  />
       <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar/>
        <UserWelcome />
       </Box>
     </Box>
     </>
  );
}

export default UserDashboard;

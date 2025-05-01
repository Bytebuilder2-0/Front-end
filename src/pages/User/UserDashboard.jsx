import { Box,Toolbar } from "@mui/material";
import UserMiniDrawer from "../../components/ui/UserMiniDrawer";
import UserWelcome from "../../components/WelcomeUser/UserWelcome";

function UserDashboard() {

  const userId = "67c35ede60d77944a4fe5cf1"; 
  
  return (
     <>
    <Box sx={{ display: 'flex' }}>
       <UserMiniDrawer userId={userId} />
       <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar/>
        <UserWelcome userId={userId}/>
       </Box>
     </Box>
     </>
  );
}

export default UserDashboard;

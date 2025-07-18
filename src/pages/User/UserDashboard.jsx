import { Box, Toolbar } from "@mui/material";
import UserMiniDrawer from "../../components/ui/UserMiniDrawer";
import UserWelcome from "../../components/WelcomeUser/UserWelcome";
import { useAuth } from "../../context/AuthContext";

function UserDashboard() {
  // Extract user from AuthContext
  const { user } = useAuth();

  // Extract userId from the user object
  const userId = user?.id;

  return (
    <>
      <Box sx={{ display: 'flex' }}>
        <UserMiniDrawer />
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          <Toolbar />
          {/* Pass userId to UserWelcome component */}
          {userId ? <UserWelcome userId={userId} /> : <div>Loading...</div>}
        </Box>
      </Box>
    </>
  );
}

export default UserDashboard;

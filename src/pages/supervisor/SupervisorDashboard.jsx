import AppointmentData from "../../components/AppintmentData";
import { Box,Toolbar } from "@mui/material";
import MiniDrawer from "../../components/ui/MiniDrawer";

function SupervisorDashboard() {
  return (
     <>
    <Box sx={{ display: 'flex' }}>
       <MiniDrawer />
       <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar/>
    <AppointmentData/>
       </Box>
     </Box>
     </>
  );
}

export default SupervisorDashboard;

import { Box,Toolbar } from "@mui/material";
import UserMiniDrawer from "../../components/ui/UserMiniDrawer";
import UserHistory from "../../components/UserHistory/UserHisory";

function PaidHistory() {


  return (
     <>
        <Box sx={{ display: 'flex' }}>
    <UserMiniDrawer />
    <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
     <Toolbar/>
     <UserHistory  />
     </Box>
     </Box>

    
     </>
  );
}

export default PaidHistory;

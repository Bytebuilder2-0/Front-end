import { Box,Toolbar } from "@mui/material";
import UserMiniDrawer from "../../components/ui/UserMiniDrawer";
import FeedbackAll from "../../components/UserFeedback/FeedbackAll";

function FeedBackUser(){

      return (
        <>
        <Box sx={{ display: 'flex' }}>
        <UserMiniDrawer />
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar/>

         <FeedbackAll />
         </Box>
        </Box>
    
        </>


      );
  }

export default FeedBackUser;


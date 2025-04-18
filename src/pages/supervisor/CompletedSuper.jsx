import CompletedS from "../../components/CompletedS";
import { Box,Toolbar } from "@mui/material";
import MiniDrawer from "../../components/ui/MiniDrawer";

function CompletedSuper(){
return(
    <Box sx={{ display: 'flex' }}>
    <MiniDrawer />
    <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
     <Toolbar/>
     <CompletedS/>
    </Box>
  </Box>
  
    
);
}

export default CompletedSuper;
import React from 'react'
import SupInprogress from '../../components/SupInprogress'
import { Box,Toolbar,Divider} from "@mui/material";
import MiniDrawer from "../../components/ui/MiniDrawer";
import PathNaming from '../../components/sub/PathNaming';

function Inprogress() {
  return (
  <>
 <Box sx={{ display: 'flex' }}>
    <MiniDrawer />
    <Box component="main" sx={{ flexGrow: 1, pl:3,pr:3 }}>
     <Toolbar/>
     <PathNaming label="Inprogress" path="Supervisor/Inprogress"/>
       <Divider/>
 <SupInprogress/>
    </Box>
  </Box>
  </>
  )
}

export default Inprogress
import React from 'react'
import SupInprogress from '../../components/SupInprogress'
import { Box,Toolbar } from "@mui/material";
import MiniDrawer from "../../components/ui/MiniDrawer";

function Inprogress() {
  return (
  <>
 <Box sx={{ display: 'flex' }}>
    <MiniDrawer />
    <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
     <Toolbar/>
 <SupInprogress/>
    </Box>
  </Box>
  </>
  )
}

export default Inprogress
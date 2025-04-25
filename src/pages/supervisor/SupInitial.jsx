import React from 'react'
import InitialCheck from '../../components/InitialCheck'
import { Box,Toolbar } from "@mui/material";
import MiniDrawer from "../../components/ui/MiniDrawer";
import StatusSummary from '../../components/sub/StatusSummary';

const SupInitial = () => {
  return (
    <>
    <Box sx={{ display: 'flex' }}>
       <MiniDrawer />
       <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
       <Toolbar/>
       <StatusSummary/>
    <InitialCheck/>
       </Box>
     </Box>
     </>
  )
}

export default SupInitial

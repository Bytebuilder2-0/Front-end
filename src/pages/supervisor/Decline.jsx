import React from 'react'
import { Box,Toolbar,Divider } from '@mui/material'
import PathNaming from '../../components/sub/PathNaming'
import MiniDrawer from '../../components/ui/MiniDrawer'
import SupDeclined from '../../components/SupDeclined'


function Decline() {
  return (
    <Box sx={{ display: 'flex' }}>
    <MiniDrawer />
    <Box component="main" sx={{ flexGrow: 1, pl:3,pr:3 }}>
     <Toolbar/>
     <PathNaming label="Declined.." path="Supervisor/Declined"/>
       <Divider/>
        <SupDeclined/>
    </Box>
  </Box>
  )
}

export default Decline
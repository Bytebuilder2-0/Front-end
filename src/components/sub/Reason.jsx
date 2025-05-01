import React, { useState } from "react";
import FeedbackIcon from '@mui/icons-material/Feedback';
import {
    Tooltip,IconButton,Modal,Box,Typography,Button
} from '@mui/material'


const Reason=({reason})=>{

    const [open,setOpen]=useState(false);

    return(
        <>
   
        <Tooltip title="View Reason" arrow>
             <IconButton
              sx={{ color: "black" }}
               onClick={() => setOpen(true)}
               aria-label="View Reason for rejection"
             >
               <FeedbackIcon/>
             </IconButton>
           </Tooltip>
           <Modal open={open} onClose={() => setOpen(false)}>
             <Box
               sx={{
                 position: "absolute",
                 top: "50%",
                 left: "50%",
                 transform: "translate(-50%, -50%)",
                 width: 400,
                 bgcolor: "white",
                 boxShadow: 24,
                 p: 4,
                 borderRadius: 2,
               }}
             >
               <Typography variant="h6">Reason for Rejection</Typography>
               <Typography>{reason || "No Reasons provided"}</Typography>
               <Button
                 variant="contained"
                 color="error"
                 onClick={() => setOpen(false)}
                 sx={{ mt: 2 }}
               >
                 Close
               </Button>
             </Box>
           </Modal>
         </>
    );

}

export default Reason;
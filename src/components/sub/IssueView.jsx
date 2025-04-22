import { useState } from "react";
import { Button, Modal, Box, Typography, IconButton,Tooltip } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";

const IssueViewer = ({ issue }) => {
  const [open, setOpen] = useState(false);

  return (
    <>
   
   <Tooltip title="View Issue" arrow>
        <IconButton
          color="primary"
          onClick={() => setOpen(true)}
          aria-label="View Vehicle Issue"
        >
          <VisibilityIcon />
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
          <Typography variant="h6">Issue Details</Typography>
          <Typography>{issue || "No issue provided"}</Typography>
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
};

export default IssueViewer;

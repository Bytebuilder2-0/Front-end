import { useState } from "react";
import { Button, Modal, Box, Typography } from "@mui/material";

const TechMessageView = ({ x }) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button variant="contained" color="primary" onClick={() => setOpen(true)}>
        View
      </Button>

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
          <Typography variant="h6">Technician's Message</Typography>
          <Typography>{x || "No issue provided"}</Typography>
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

export default TechMessageView;

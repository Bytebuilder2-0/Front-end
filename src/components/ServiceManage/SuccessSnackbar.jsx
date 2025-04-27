import React from "react";
import { Snackbar, Alert } from "@mui/material";

const SuccessSnackbar = ({ open, message, onClose }) => {
  return (
    <Snackbar
      open={open}
      autoHideDuration={3000} // Snackbar automatically disappears after 3 seconds
      onClose={onClose}
      anchorOrigin={{ vertical: "bottom", horizontal: "center" }} // Position: bottom center
    >
      <Alert
        onClose={onClose}
        severity="success" // Green success alert
        sx={{ width: "100%" }}
        variant="filled"
      >
        {message}
      </Alert>
    </Snackbar>
  );
};

export default SuccessSnackbar;

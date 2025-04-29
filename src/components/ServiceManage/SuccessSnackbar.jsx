import React from "react";
import { Snackbar, Alert } from "@mui/material";

const SuccessSnackbar = ({ open, message, onClose }) => {
  return (
    <Snackbar
      open={open}
      autoHideDuration={3000}
      onClose={onClose}
      anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
    >
      <Alert
        onClose={onClose}
        severity="success"
        variant="filled"
        sx={{
          width: "100%",
          textAlign: "center",
          fontWeight: "bold",
        }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
};

export default SuccessSnackbar;

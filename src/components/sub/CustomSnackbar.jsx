import React from "react";
import { Snackbar, Alert } from "@mui/material";

const CustomSnackbar = ({
  open,
  onClose,
  message,
  action = "success", // success, error, warning, info
  duration = 3000,
  position = { vertical: "top", horizontal: "right" },
}) => {
  return (
    <Snackbar
      open={open}
      autoHideDuration={duration}
      onClose={onClose}
      anchorOrigin={position}
      sx={{
        "& .MuiSnackbarContent-root": {
          mt: 2, // top margin
        },
      }}
    >
      <Alert
        onClose={onClose}
        severity={action}
        variant="filled"
        sx={{ width: "100%" }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
};

export default CustomSnackbar;

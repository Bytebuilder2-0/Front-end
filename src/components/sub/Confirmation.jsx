//ConfirmationDialog.jsx
import React from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from "@mui/material";

const ConfirmationDialog = ({ open, title, message, onConfirm, onCancel }) => {
  return (
    <Dialog open={open} onClose={onCancel}>
      <DialogTitle>{title || "Confirmation"}</DialogTitle>
      <DialogContent>
        <Typography>{message || "Are you sure you want to proceed?"}</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel} color="error">
          Cancel
        </Button>
        <Button onClick={onConfirm} color="success" variant="contained">
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmationDialog;

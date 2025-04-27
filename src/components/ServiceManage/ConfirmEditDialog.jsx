import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Button,
} from "@mui/material";

const ConfirmEditDialog = ({ open, onClose, onConfirm, itemName, editedName }) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Confirm Edit</DialogTitle>
      <DialogContent>
        <Typography>
          Are you sure you want to change the service name from{" "}
          <strong style={{ color: "crimson" }}>{itemName}</strong> to{" "}
          <strong style={{ color: "crimson" }}>{editedName}</strong>?
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={onConfirm} color="success" variant="contained">
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmEditDialog;

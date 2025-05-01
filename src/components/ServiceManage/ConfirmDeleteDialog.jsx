import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Button,
} from "@mui/material";

const ConfirmDeleteDialog = ({ open, onClose, onConfirm, itemName, actionName }) => {
  // Decide button color based on action
  const isAcceptAction = actionName?.toLowerCase() === "accept";

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle sx={{ fontWeight: "bold", color: isAcceptAction ? "green" : "crimson" }}>
        Confirm {actionName || "Action"}
      </DialogTitle>
      <DialogContent>
        <Typography sx={{ mt: 1 }}>
          Are you sure you want to {actionName ? actionName.toLowerCase() : "perform this action"}{" "}
          <strong style={{ color: isAcceptAction ? "green" : "crimson" }}>
            {itemName}
          </strong>?
        </Typography>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} color="primary" variant="outlined">
          Cancel
        </Button>
        <Button
          onClick={onConfirm}
          variant="contained"
          color={isAcceptAction ? "success" : "error"} // ✅ Accept -> green | Reject -> red
        >
          {actionName || "Confirm"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDeleteDialog;

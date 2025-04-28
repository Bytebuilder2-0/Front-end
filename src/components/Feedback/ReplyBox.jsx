// src/components/Feedback/ReplyBox.jsx

import { useState } from "react";
import { TextField, Button, Box } from "@mui/material";
import SuccessSnackbar from "../ServiceManage/SuccessSnackbar";
import ConfirmEditDialog from "../ServiceManage/ConfirmEditDialog"; // ✅ import your Confirm Dialog

const ReplyBox = ({ feedback, onUpdateReply }) => {
  const [reply, setReply] = useState(feedback.reply || "");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);

  const handleReplySubmit = () => {
    // Open confirmation dialog first
    setConfirmDialogOpen(true);
  };

  const handleConfirmEdit = async () => {
    try {
      await onUpdateReply(reply); // Submit reply
      setSnackbarOpen(true);      // Show success snackbar
      setConfirmDialogOpen(false); // Close confirm dialog
    } catch (error) {
      console.error("Error updating reply:", error);
    }
  };

  const handleCancelEdit = () => {
    setConfirmDialogOpen(false); // Close dialog if cancelled
  };

  return (
    <Box
      sx={{
        backgroundColor: "#f9f9f9",
        p: 2,
        borderRadius: "12px",
        mt: 2,
      }}
    >
      <TextField
        label="Reply"
        value={reply}
        onChange={(e) => setReply(e.target.value)}
        fullWidth
        multiline
        rows={2}
        sx={{ mb: 2 }}
        size="small"
      />
      <Button
        variant="contained"
        color="primary"
        onClick={handleReplySubmit} // ✅ open confirm dialog
        fullWidth
        sx={{ fontWeight: "bold" }}
      >
        Submit Reply
      </Button>

      {/* ✅ Confirmation Dialog */}
      <ConfirmEditDialog
        open={confirmDialogOpen}
        onClose={handleCancelEdit}
        onConfirm={handleConfirmEdit}
        itemName={feedback.reply || "empty reply"}
        editedName={reply}
      />

      {/* ✅ Success Snackbar */}
      <SuccessSnackbar
        open={snackbarOpen}
        message="Reply submitted successfully!"
        onClose={() => setSnackbarOpen(false)}
      />
    </Box>
  );
};

export default ReplyBox;

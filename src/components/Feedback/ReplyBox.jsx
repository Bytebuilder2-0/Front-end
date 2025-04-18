import { useState } from "react";
import { TextField, Button, Box } from "@mui/material";

const ReplyBox = ({ feedback, onUpdateReply }) => {
  const [reply, setReply] = useState(feedback.reply || "");

  const handleReplySubmit = async () => {
    if (!reply.trim()) return;

    try {
      await onUpdateReply(reply); // ✅ Ensure this function is correctly passed
    } catch (error) {
      console.error("Error updating reply:", error);
    }
  };

  return (
    <Box>
      <TextField
        label="Reply"
        value={reply}
        onChange={(e) => setReply(e.target.value)}
        fullWidth
        sx={{ mt: 1 }}
      />
      <Button
        variant="contained"
        color="primary"
        onClick={handleReplySubmit}
        sx={{ mt: 1 }}
      >
        Submit Reply
      </Button>
    </Box>
  );
};

export default ReplyBox;

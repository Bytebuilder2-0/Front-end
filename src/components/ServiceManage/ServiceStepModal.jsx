import React, { useState } from "react";
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from "@mui/material";
import { Add, Delete } from "@mui/icons-material";

const ServiceStepModal = ({ open, onClose, onSave, initialSteps }) => {
  const [steps, setSteps] = useState(initialSteps || []);

  // Snackbar controls
  const [successSnackbarOpen, setSuccessSnackbarOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  // Dialog control states
  const [confirmDeleteIndex, setConfirmDeleteIndex] = useState(null);
  const [confirmSaveOpen, setConfirmSaveOpen] = useState(false);

  // Add a new step
  const handleAddStep = () => {
    setSteps((prev) => [
      ...prev,
      { step: prev.length + 1, description: "" }
    ]);
  };

  // Request to delete a step
  const handleRequestDeleteStep = (index) => {
    setConfirmDeleteIndex(index);
  };

  // Confirm deleting a step
  const handleConfirmDeleteStep = () => {
    if (confirmDeleteIndex !== null) {
      setSteps((prev) =>
        prev
          .filter((_, i) => i !== confirmDeleteIndex)
          .map((s, i) => ({ ...s, step: i + 1 }))
      );
      setSuccessMessage("Step deleted successfully!");
      setSuccessSnackbarOpen(true);
    }
    setConfirmDeleteIndex(null);
  };

  // Handle typing in description fields
  const handleDescriptionChange = (index, value) => {
    setSteps((prev) =>
      prev.map((s, i) => (i === index ? { ...s, description: value } : s))
    );
  };

  // Open save confirmation dialog
  const handleRequestSaveSteps = () => {
    setConfirmSaveOpen(true);
  };

  // Confirm saving steps
  const handleConfirmSaveSteps = () => {
    const filteredSteps = steps.filter((step) => step.description.trim() !== "");

    setSteps(filteredSteps); // 🔥 Update UI immediately by removing empty inputs

    onSave(filteredSteps); // Save only non-empty steps to backend
    setSuccessMessage("Steps saved successfully!");
    setSuccessSnackbarOpen(true);
    setConfirmSaveOpen(false);
  };

  // Close snackbar and modal
  const handleSnackbarClose = () => {
    setSuccessSnackbarOpen(false);
    onClose();
  };

  return (
    <>
      {/* Main Modal */}
      <Modal open={open} onClose={onClose}>
        <Box sx={{
          position: "absolute", top: "50%", left: "50%",
          transform: "translate(-50%, -50%)",
          bgcolor: "background.paper", p: 4, borderRadius: 2, width: 400
        }}>
          <Typography variant="h6" gutterBottom>Service Steps</Typography>

          {/* Steps list */}
          {steps.map((step, index) => (
            <Box key={index} sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
              <Typography>{step.step}.</Typography>
              <TextField
                fullWidth
                size="small"
                label="Description"
                value={step.description}
                onChange={(e) => handleDescriptionChange(index, e.target.value)}
              />
              <IconButton color="error" onClick={() => handleRequestDeleteStep(index)}>
                <Delete />
              </IconButton>
            </Box>
          ))}

          {/* Add Step Button */}
          <Button
            fullWidth
            startIcon={<Add />}
            variant="contained"
            onClick={handleAddStep}
            sx={{ mt: 2 }}
          >
            Add Step
          </Button>

          {/* Save and Cancel Buttons */}
          <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
            <Button
              variant="contained"
              color="success"
              sx={{ width: "48%" }}
              onClick={handleRequestSaveSteps}
            >
              Save
            </Button>
            <Button
              variant="contained"
              color="error"
              sx={{ width: "48%" }}
              onClick={onClose}
            >
              Cancel
            </Button>
          </Box>
        </Box>
      </Modal>

      {/* Confirm Delete Step Dialog */}
      <Dialog open={confirmDeleteIndex !== null} onClose={() => setConfirmDeleteIndex(null)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this step?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDeleteIndex(null)}>Cancel</Button>
          <Button onClick={handleConfirmDeleteStep} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Confirm Save Steps Dialog */}
      <Dialog open={confirmSaveOpen} onClose={() => setConfirmSaveOpen(false)}>
        <DialogTitle>Confirm Save</DialogTitle>
        <DialogContent>
          Are you sure you want to save all the steps?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmSaveOpen(false)}>Cancel</Button>
          <Button onClick={handleConfirmSaveSteps} color="success" variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Success Snackbar */}
      <Snackbar
        open={successSnackbarOpen}
        autoHideDuration={2000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity="success"
          sx={{ width: "100%" }}
          variant="filled"
        >
          {successMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default ServiceStepModal;

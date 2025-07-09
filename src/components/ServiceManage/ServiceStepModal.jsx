import React, { useState } from "react";
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
} from "@mui/material";
import { Add, Delete } from "@mui/icons-material";
import ConfirmDeleteDialog from "./ConfirmDeleteDialog";
import ConfirmEditDialog from "./ConfirmEditDialog";
import SuccessSnackbar from "./SuccessSnackbar";

const ServiceStepModal = ({ open, onClose, onSave, initialSteps }) => {
  const [steps, setSteps] = useState(initialSteps || []);
  const [confirmDeleteIndex, setConfirmDeleteIndex] = useState(null);
  const [confirmSaveOpen, setConfirmSaveOpen] = useState(false);
  const [successSnackbarOpen, setSuccessSnackbarOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const handleAddStep = () => {
    setSteps((prev) => [
      ...prev,
      { step: prev.length + 1, description: "" }
    ]);
  };

  const handleRequestDeleteStep = (index) => {
    setConfirmDeleteIndex(index);
  };

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

  const handleRequestSaveSteps = () => {
    setConfirmSaveOpen(true);
  };

  const handleConfirmSaveSteps = () => {
    const filteredSteps = steps.filter((step) => step.description.trim() !== "");

    setSteps(filteredSteps);
    onSave(filteredSteps);
    setSuccessMessage("Steps saved successfully!");
    setSuccessSnackbarOpen(true);
    setConfirmSaveOpen(false);
  };

  const handleSnackbarClose = () => {
    setSuccessSnackbarOpen(false);
    onClose();
  };

  return (
    <>
      <Modal open={open} onClose={onClose}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "background.paper",
            p: 4,
            borderRadius: 3,
            width: 400,
            boxShadow: 10,
          }}
        >
          <Typography variant="h6" gutterBottom fontWeight="bold">
            Service Steps
          </Typography>

          {steps.map((step, index) => (
            <Box key={index} sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
              <Typography>{step.step}.</Typography>
              <TextField
                fullWidth
                size="small"
                label="Description"
                value={step.description}
                onChange={(e) => {
                  const newSteps = [...steps];
                  newSteps[index].description = e.target.value;
                  setSteps(newSteps);
                }}
                sx={{ backgroundColor: "#f9f9f9", borderRadius: 2 }}
              />
              <IconButton color="error" onClick={() => handleRequestDeleteStep(index)}>
                <Delete />
              </IconButton>
            </Box>
          ))}

          <Button
            fullWidth
            variant="contained"
            sx={{ mt: 2, borderRadius: 2 }}
            onClick={handleAddStep}
          >
            Add Step
          </Button>

          <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
            <Button
              variant="contained"
              color="success"
              sx={{ width: "48%", borderRadius: 2 }}
              onClick={handleRequestSaveSteps}
            >
              Save
            </Button>
            <Button
              variant="contained"
              color="error"
              sx={{ width: "48%", borderRadius: 2 }}
              onClick={onClose}
            >
              Cancel
            </Button>
          </Box>
        </Box>
      </Modal>

      {/* Confirm Delete Dialog */}
      <ConfirmDeleteDialog
        open={confirmDeleteIndex !== null}
        onClose={() => setConfirmDeleteIndex(null)}
        onConfirm={handleConfirmDeleteStep}
        itemName={`Step ${confirmDeleteIndex !== null ? confirmDeleteIndex + 1 : ""}`}
      />

      {/* Confirm Save Dialog */}
      <ConfirmEditDialog
        open={confirmSaveOpen}
        onClose={() => setConfirmSaveOpen(false)}
        onConfirm={handleConfirmSaveSteps}
        itemName="Steps"
        editedName="Saved"
      />

      {/* Success Snackbar */}
      <SuccessSnackbar
        open={successSnackbarOpen}
        message={successMessage}
        onClose={handleSnackbarClose}
      />
    </>
  );
};

export default ServiceStepModal;

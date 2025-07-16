import React, { useState } from "react";
import {
  ListItem,
  ListItemText,
  Checkbox,
  TextField,
  Button,
  Box,
} from "@mui/material";
import ConfirmDeleteDialog from "./ConfirmDeleteDialog";
import ConfirmEditDialog from "./ConfirmEditDialog";
import ServiceStepModal from "./ServiceStepModal";
import { updateServiceSteps } from "./serviceApi";

const ServiceItem = ({
  service,
  onToggle,
  onDelete,
  onUpdate,
  editingId,
  setEditingId,
  isActionInProgress,
}) => {
  const [editedName, setEditedName] = useState(service.name);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [editConfirmDialogOpen, setEditConfirmDialogOpen] = useState(false);
  const [stepModalOpen, setStepModalOpen] = useState(false);
  const [serviceSteps, setServiceSteps] = useState(service.steps || []);
  const [stepsAdded, setStepsAdded] = useState(
    service.steps && service.steps.length > 0
  );

  const isEditing = editingId === service._id;

  const handleStartEditing = () => {
    setEditingId(service._id);
    setEditedName(service.name);
  };

  const handleCancelEditing = () => {
    setEditingId(null);
    setEditedName(service.name);
  };

  const handleSave = () => {
    if (editedName.trim() && editedName !== service.name) {
      setEditConfirmDialogOpen(true);
    } else {
      setEditingId(null);
    }
  };

  const handleEditConfirmed = () => {
    onUpdate(service._id, editedName);
    setEditConfirmDialogOpen(false);
  };

  const handleStepSave = async (steps) => {
    setServiceSteps(steps);
    await updateServiceSteps(service._id, steps);
    setStepsAdded(true);
    setStepModalOpen(false);
  };

  return (
    <>
      <ListItem
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 2,
        }}
      >
        <Checkbox
          checked={service.selected}
          onChange={() => onToggle(service._id, service.selected)}
          disabled={isActionInProgress || isEditing}
        />

        {isEditing ? (
          <TextField
            value={editedName}
            onChange={(e) => setEditedName(e.target.value)}
            size="small"
            sx={{ flex: 1, marginRight: 2 }}
          />
        ) : (
          <ListItemText
            primary={service.name}
            sx={{
              color: service.selected ? "green" : "black",
              flex: 1,
              marginRight: 2,
            }}
          />
        )}

        <Box display="flex" gap={1}>
          {isEditing ? (
            <>
              <Button
                variant="outlined"
                color="success"
                size="small"
                onClick={handleSave}
                disabled={isActionInProgress}
                sx={{ minWidth: "100px" }}
              >
                Save
              </Button>
              <Button
                variant="outlined"
                color="error"
                size="small"
                onClick={handleCancelEditing}
                disabled={isActionInProgress}
                sx={{ minWidth: "100px" }}
              >
                Cancel
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="outlined"
                color="primary"
                size="small"
                onClick={handleStartEditing}
                disabled={isActionInProgress || editingId !== null}
                sx={{ minWidth: "100px" }}
              >
                Edit
              </Button>
              <Button
                variant="outlined"
                color="secondary"
                size="small"
                onClick={() => setStepModalOpen(true)}
                disabled={isActionInProgress || editingId !== null}
                sx={{ minWidth: "100px" }}
              >
                {stepsAdded ? "Edit Steps" : "Add Step"}
              </Button>
              <Button
                variant="outlined"
                color="error"
                size="small"
                onClick={() => setConfirmDialogOpen(true)}
                disabled={isActionInProgress || editingId !== null}
                sx={{ minWidth: "100px" }}
              >
                Delete
              </Button>
            </>
          )}
        </Box>
      </ListItem>

      <ConfirmDeleteDialog
        open={confirmDialogOpen}
        onClose={() => setConfirmDialogOpen(false)}
        onConfirm={() => {
          onDelete(service._id, service.name);
          setConfirmDialogOpen(false);
        }}
        itemName={service.name}
      />

      <ConfirmEditDialog
        open={editConfirmDialogOpen}
        onClose={() => setEditConfirmDialogOpen(false)}
        onConfirm={handleEditConfirmed}
        itemName={service.name}
        editedName={editedName}
      />

      <ServiceStepModal
        open={stepModalOpen}
        onClose={() => setStepModalOpen(false)}
        onSave={handleStepSave}
        initialSteps={serviceSteps}
        disabled={isActionInProgress}
      />
    </>
  );
};

export default ServiceItem;

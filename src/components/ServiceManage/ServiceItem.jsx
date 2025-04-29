import React, { useState } from "react";
import { ListItem, ListItemText, Checkbox, TextField, Button, Box } from "@mui/material";
import ConfirmDeleteDialog from "./ConfirmDeleteDialog";
import ConfirmEditDialog from "./ConfirmEditDialog";
import ServiceStepModal from "./ServiceStepModal"; // Import Step Modal
import { updateServiceSteps } from "./serviceApi"; // Import API

const ServiceItem = ({ service, onToggle, onDelete, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(service.name);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [editConfirmDialogOpen, setEditConfirmDialogOpen] = useState(false);

  // Step-related states
  const [stepModalOpen, setStepModalOpen] = useState(false);
  const [serviceSteps, setServiceSteps] = useState(service.steps || []);
  const [stepsAdded, setStepsAdded] = useState(service.steps && service.steps.length > 0); // Check if steps already exist

  // Save edited service name
  const handleSave = () => {
    if (editedName.trim() && editedName !== service.name) {
      setEditConfirmDialogOpen(true);
    }
  };

  const handleEditConfirmed = () => {
    onUpdate(service._id, editedName);
    setEditConfirmDialogOpen(false);
    setIsEditing(false);
  };

  // Save steps to backend
  const handleStepSave = async (steps) => {
    setServiceSteps(steps);
    await updateServiceSteps(service._id, steps);
    setStepsAdded(true); // Mark that steps are added
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
        {/* Checkbox */}
        <Checkbox
          checked={service.selected}
          onChange={() => onToggle(service._id, service.selected)}
        />

        {/* Service Name / Editing Field */}
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

        {/* Action Buttons */}
        <Box display="flex" gap={1}>
          {/* Edit / Save Button */}
          <Button
            variant="outlined"
            color={isEditing ? "success" : "primary"}
            size="small"
            onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
            sx={{ minWidth: "100px" }}
          >
            {isEditing ? "Save" : "Edit"}
          </Button>

          {/* Add Step / Edit Steps Button */}
          <Button
            variant="outlined"
            color="secondary"
            size="small"
            onClick={() => setStepModalOpen(true)}
            sx={{ minWidth: "100px" }}
          >
            {stepsAdded ? "Edit Steps" : "Add Step"}
          </Button>

          {/* Delete Button */}
          <Button
            variant="outlined"
            color="error"
            size="small"
            onClick={() => setConfirmDialogOpen(true)}
            sx={{ minWidth: "100px" }}
          >
            Delete
          </Button>
        </Box>
      </ListItem>

      {/* Confirm Delete Dialog */}
      <ConfirmDeleteDialog
        open={confirmDialogOpen}
        onClose={() => setConfirmDialogOpen(false)}
        onConfirm={() => {
          onDelete(service._id, service.name);
          setConfirmDialogOpen(false);
        }}
        itemName={service.name}
      />

      {/* Confirm Edit Dialog */}
      <ConfirmEditDialog
        open={editConfirmDialogOpen}
        onClose={() => setEditConfirmDialogOpen(false)}
        onConfirm={handleEditConfirmed}
        itemName={service.name}
        editedName={editedName}
      />

      {/* Service Step Modal */}
      <ServiceStepModal
        open={stepModalOpen}
        onClose={() => setStepModalOpen(false)}
        onSave={handleStepSave}
        initialSteps={serviceSteps}
      />
    </>
  );
};

export default ServiceItem;

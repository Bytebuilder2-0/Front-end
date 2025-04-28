// components/ServiceItem.jsx
import React, { useState } from "react";
import { ListItem, ListItemText, Checkbox, TextField, Button, Box } from "@mui/material";
import ConfirmDeleteDialog from "./ConfirmDeleteDialog";
import ConfirmEditDialog from "./ConfirmEditDialog";

const ServiceItem = ({ service, onToggle, onDelete, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(service.name);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [editConfirmDialogOpen, setEditConfirmDialogOpen] = useState(false);

  const handleSave = () => {
    if (editedName.trim() && editedName !== service.name) {
      setEditConfirmDialogOpen(true);  // Show confirmation dialog for editing
    }
  };

  const handleEditConfirmed = () => {
    onUpdate(service._id, editedName);
    setEditConfirmDialogOpen(false);
    setIsEditing(false);  // Close the editing mode
  };

  return (
    <>
      <ListItem>
        <Checkbox
          checked={service.selected}
          onChange={() => onToggle(service._id, service.selected)}  // Trigger toggle
        />
        {isEditing ? (
          <TextField
            value={editedName}
            onChange={(e) => setEditedName(e.target.value)}
            size="small"
            style={{ flex: 1, marginRight: "10px" }}
          />
        ) : (
          <ListItemText
            primary={service.name}
            style={{
              color: service.selected ? "green" : "black",
              flex: 1,
              marginRight: "10px",
            }}
          />
        )}
        <Box display="flex" gap={1}>
          <Button
            variant="outlined"
            color={isEditing ? "success" : "primary"}
            size="small"
            onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
          >
            {isEditing ? "Save" : "Edit"}
          </Button>
          <Button
            variant="outlined"
            color="error"
            size="small"
            onClick={() => setConfirmDialogOpen(true)}  // Open delete confirmation
          >
            Delete
          </Button>
        </Box>
      </ListItem>

      {/* Confirmation dialogs for delete and edit */}
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
    </>
  );
};

export default ServiceItem;

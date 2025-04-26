import React, { useState } from "react";
import {
  ListItem,
  ListItemText,
  Checkbox,
  TextField,
  Button,
  Box,
} from "@mui/material";
import ConfirmDeleteDialog from "./ConfirmDeleteDialog";  // For Delete
import ConfirmEditDialog from "./ConfirmEditDialog";      // For Edit Confirmation

const ServiceItem = ({ service, onToggle, onDelete, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(service.name);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [editConfirmDialogOpen, setEditConfirmDialogOpen] = useState(false); // Edit confirmation dialog state

  const handleSave = () => {
    if (editedName.trim() && editedName !== service.name) {
      setEditConfirmDialogOpen(true); // Show confirmation dialog before updating
    }
  };

  // Confirm Edit: Update the service name
  const handleEditConfirmed = () => {
    onUpdate(service._id, editedName);
    setEditConfirmDialogOpen(false);
    setIsEditing(false); // Close edit mode after confirmation
  };

  return (
    <>
      <ListItem
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {/* Toggle selected */}
        <Checkbox
          checked={service.selected}
          onChange={() => onToggle(service._id, service.selected)}
        />

        {/* Editable Name Field */}
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

        {/* Action Buttons */}
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
            onClick={() => setConfirmDialogOpen(true)}
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
    </>
  );
};

export default ServiceItem;

import React, { useState } from "react";
import {
  ListItem,
  ListItemText,
  Checkbox,
  TextField,
  Button,
  Box,
} from "@mui/material";
import ConfirmDeleteDialog from "./confirmDeleteDialog"; // ✅ Imported lowercase filename version

const ServiceItem = ({ service, onToggle, onDelete, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(service.name);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false); // Confirm dialog state

  // Save name update
  const handleSave = () => {
    if (editedName.trim() && editedName !== service.name) {
      onUpdate(service._id, editedName);
    }
    setIsEditing(false);
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
        {/* Checkbox to toggle selected */}
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

      {/* Delete Confirmation Dialog */}
      <ConfirmDeleteDialog
        open={confirmDialogOpen}
        onClose={() => setConfirmDialogOpen(false)}
        onConfirm={() => {
          onDelete(service._id);
          setConfirmDialogOpen(false);
        }}
        itemName={service.name}
      />
    </>
  );
};

export default ServiceItem;

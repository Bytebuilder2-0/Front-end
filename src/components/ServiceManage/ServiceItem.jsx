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

const ServiceItem = ({ service, onToggle, onDelete, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(service.name);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);

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
        {/* Toggle selected */}
        <Checkbox
          checked={service.selected}
          onChange={() => onToggle(service._id, service.selected)}
        />

        {/* Edit mode vs display */}
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

      {/* Confirm Dialog */}
      <ConfirmDeleteDialog
        open={confirmDialogOpen}
        onClose={() => setConfirmDialogOpen(false)}
        onConfirm={() => {
          onDelete(service._id, service.name); // Pass name too for Snackbar
          setConfirmDialogOpen(false);
        }}
        itemName={service.name}
      />
    </>
  );
};

export default ServiceItem;

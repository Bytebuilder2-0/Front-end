import React, { useState } from "react";
import {
  ListItem,
  ListItemText,
  Checkbox,
  TextField,
  Button,
  Box,
} from "@mui/material";

const ServiceItem = ({ service, onToggle, onDelete, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(service.name);

  const handleSave = () => {
    if (typeof onUpdate !== "function") {
      console.error("❌ onUpdate is not a function");
      return;
    }

    if (editedName.trim() && editedName !== service.name) {
      onUpdate(service._id, editedName);
    }
    setIsEditing(false);
  };

  return (
    <ListItem
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <Checkbox
        checked={service.selected}
        onChange={() => onToggle(service._id, service.selected)}
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
          onClick={() => onDelete(service._id)}
        >
          Delete
        </Button>
      </Box>
    </ListItem>
  );
};

export default ServiceItem;

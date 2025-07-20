import React, { useState } from "react";
import { ListItem, TextField, Button, Box, Typography } from "@mui/material";
import ConfirmDeleteDialog from "./ConfirmDeleteDialog";
import ConfirmEditDialog from "./ConfirmEditDialog";

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

  return (
    <>
      <ListItem
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 2,
          p: 2,
          borderBottom: "1px solid rgba(0, 0, 0, 0.08)",
          backgroundColor: "background.paper",
          position: "relative",
          pl: 4, // Add padding to accommodate bullet point
          "&::before": {
            content: '""',
            position: "absolute",
            left: "16px",
            top: "50%",
            transform: "translateY(-50%)",
            width: "8px",
            height: "8px",
            borderRadius: "50%",
            backgroundColor: service.selected
              ? "primary.main"
              : "text.secondary",
          },
        }}
      >
        <Box sx={{ display: "flex", flex: 1, gap: 2, alignItems: "center" }}>
          {isEditing ? (
            <TextField
              value={editedName}
              onChange={(e) => setEditedName(e.target.value)}
              size="small"
              fullWidth
              variant="outlined"
              sx={{ flex: 1 }}
              autoFocus
            />
          ) : (
            <Typography
              variant="body1"
              sx={{
                color: service.selected ? "primary.main" : "text.primary",
                fontWeight: service.selected ? "bold" : "normal",
                flex: 1,
              }}
            >
              {service.name}
            </Typography>
          )}
        </Box>

        <Box display="flex" gap={1} justifyContent="flex-end">
          <Button
            variant="contained"
            color="primary" // Force blue color
            onClick={() => onToggle(service._id, service.selected)}
            disabled={isActionInProgress || isEditing}
            sx={{
              minWidth: "100px",
              textTransform: "none",
              fontWeight: "medium",
              backgroundColor: "#1976d2", // Blue background
              color: "white", // White text
              "&:hover": {
                backgroundColor: "#1565c0", // Darker blue on hover
              },
              "&.Mui-disabled": {
                backgroundColor: "rgba(25, 118, 210, 0.5)", // Disabled state
                color: "rgba(255, 255, 255, 0.5)",
              },
            }}
          >
            {service.selected ? "Remove" : "Add"}
          </Button>

          {isEditing ? (
            <>
              <Button
                variant="contained"
                color="success"
                onClick={handleSave}
                disabled={isActionInProgress || !editedName.trim()}
                sx={{
                  minWidth: "100px",
                  textTransform: "none",
                  fontWeight: "medium",
                }}
              >
                Save
              </Button>
              <Button
                variant="outlined"
                color="primary"
                onClick={handleCancelEditing}
                disabled={isActionInProgress}
                sx={{
                  minWidth: "100px",
                  textTransform: "none",
                  fontWeight: "medium",
                }}
              >
                Cancel
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="contained" // Changed from "outlined" to "contained" for solid background
                color="success" // Uses MUI's success color (green)
                onClick={handleStartEditing}
                disabled={
                  isActionInProgress || editingId !== null || service.selected
                }
                sx={{
                  minWidth: "100px",
                  textTransform: "none",
                  fontWeight: "medium",
                  backgroundColor: "success.main", // Green background (MUI success color)
                  color: "white", // White text
                  "&:hover": {
                    backgroundColor: "success.dark", // Darker green on hover (if not disabled)
                  },
                  "&.Mui-disabled": {
                    // Style when disabled
                    backgroundColor: "rgba(76, 175, 80, 0.5)", // Semi-transparent green
                    color: "rgba(255, 255, 255, 0.5)", // Semi-transparent white
                  },
                }}
              >
                Edit
              </Button>
              <Button
                variant="contained" // Changed from "outlined" to "contained" for solid background
                color="error"
                onClick={() => setConfirmDialogOpen(true)}
                disabled={
                  isActionInProgress || editingId !== null || service.selected
                }
                sx={{
                  minWidth: "100px",
                  textTransform: "none",
                  fontWeight: "medium",
                  backgroundColor: "error.main", // Red background (MUI error color)
                  color: "white", // White text
                  "&:hover": {
                    backgroundColor: "error.dark", // Darker red on hover (if not disabled)
                  },
                  "&.Mui-disabled": {
                    // Style when disabled
                    backgroundColor: "rgba(211, 47, 47, 0.5)", // Semi-transparent red
                    color: "rgba(255, 255, 255, 0.5)", // Semi-transparent white
                  },
                }}
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
    </>
  );
};

export default ServiceItem;

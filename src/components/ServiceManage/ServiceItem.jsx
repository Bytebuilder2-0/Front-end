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
          borderBottom: "1px solid rgba(0, 0, 0, 0.12)",
          backgroundColor: "background.paper",
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
                color: service.selected ? "success.main" : "text.primary",
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
            variant={service.selected ? "contained" : "outlined"}
            color={service.selected ? "success" : "primary"}
            onClick={() => onToggle(service._id, service.selected)}
            disabled={isActionInProgress || isEditing}
            sx={{ minWidth: "100px" }}
          >
            {service.selected ? "Remove" : "add"}
          </Button>

          {isEditing ? (
            <>
              <Button
                variant="contained"
                color="primary"
                onClick={handleSave}
                disabled={isActionInProgress || !editedName.trim()}
                sx={{ minWidth: "100px" }}
              >
                save
              </Button>
              <Button
                variant="outlined"
                color="secondary"
                onClick={handleCancelEditing}
                disabled={isActionInProgress}
                sx={{ minWidth: "100px" }}
              >
                cancel
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="outlined"
                color="info"
                onClick={handleStartEditing}
                disabled={isActionInProgress || editingId !== null}
                sx={{ minWidth: "100px" }}
              >
                edit
              </Button>
              <Button
                variant="outlined"
                color="error"
                onClick={() => setConfirmDialogOpen(true)}
                disabled={isActionInProgress || editingId !== null}
                sx={{ minWidth: "100px" }}
              >
                delete
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

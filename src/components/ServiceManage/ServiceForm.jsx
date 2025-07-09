import React, { useState } from "react";
import { TextField, Button, Box } from "@mui/material";

const ServiceForm = ({ onAdd }) => {
  const [name, setName] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    await onAdd(name);
    setName("");
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        display: "flex",
        gap: 2,
        mb: 4,
      }}
    >
      <TextField
        label="New Service"
        variant="outlined"
        value={name}
        onChange={(e) => setName(e.target.value)}
        fullWidth
        sx={{
          backgroundColor: "white",
          borderRadius: 2,
        }}
      />
      <Button
        type="submit"
        variant="contained"
        color="primary"
        sx={{
          borderRadius: "8px",
          fontWeight: "bold",
          textTransform: "none",
          px: 3,
          '&:hover': {
            backgroundColor: "#1565c0",
          },
        }}
      >
        Add
      </Button>
    </Box>
  );
};

export default ServiceForm;

import React, { useState } from "react";
import { TextField, Button, Box } from "@mui/material";

const ServiceForm = ({ onAdd, disabled }) => {
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
        disabled={disabled}
        sx={{
          backgroundColor: "white",
          borderRadius: 2,
          boxShadow: 1,
          "& .MuiOutlinedInput-root": {
            "& fieldset": {
              borderColor: "#e0e0e0", // Static border color
            },
            "&:hover fieldset": {
              borderColor: "#5da3e8ff", // Same as normal state to prevent hover effect
            },
            "&.Mui-focused fieldset": {
              borderColor: "#1976d2", // Keep focus color (optional)
            },
          },
        }}
      />
      <Button
        type="submit"
        variant="contained"
        color="primary"
        disabled={disabled}
        sx={{
          borderRadius: "8px",
          fontWeight: "bold",
          textTransform: "none",
          px: 3,
          boxShadow: 1,
          "&:hover": {
            backgroundColor: "#1565c0",
            boxShadow: 2,
          },
        }}
      >
        ADD
      </Button>
    </Box>
  );
};

export default ServiceForm;

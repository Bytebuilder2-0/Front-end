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
      style={{ display: "flex", gap: "10px", marginBottom: "20px" }}
    >
      <TextField
        label="New Service "
        variant="outlined"
        value={name}
        onChange={(e) => setName(e.target.value)}
        fullWidth
      />
      <Button type="submit" variant="contained" color="primary">
        Add
      </Button>
    </Box>
  );
};

export default ServiceForm;

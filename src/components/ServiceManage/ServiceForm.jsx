import React, { useState } from "react";
import { TextField, Button, Box, MenuItem } from "@mui/material";

const ServiceForm = ({ onAdd }) => {
  const [name, setName] = useState("");
  const [type, setType] = useState("customer");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    await onAdd(name, type);
    setName("");
    setType("customer");
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      style={{ display: "flex", gap: "10px", marginBottom: "20px" }}
    >
      <TextField
        label="New Service or Technicians"
        variant="outlined"
        value={name}
        onChange={(e) => setName(e.target.value)}
        fullWidth
      />
      <TextField
        select
        label="Type"
        value={type}
        onChange={(e) => setType(e.target.value)}
        style={{ width: "300px" }}
      >
        <MenuItem value="customer">Customer issue</MenuItem>
        <MenuItem value="garage">Techanican</MenuItem>
      </TextField>
      <Button type="submit" variant="contained" color="primary">
        Add
      </Button>
    </Box>
  );
};

export default ServiceForm;

import React, { useEffect, useState } from "react";
import {
  fetchServices,
  addService,
  toggleService,
  deleteService,
  updateService,
} from "./serviceApi";
import ServiceList from "./ServiceList";
import ServiceForm from "./ServiceForm";
import { Container, Typography, Paper } from "@mui/material";
import SuccessSnackbar from "./SuccessSnackbar";

const ServiceManager = () => {
  const [services, setServices] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  useEffect(() => {
    fetchServices().then(setServices);
  }, []);

  const handleToggle = async (id, selected) => {
    await toggleService(id, !selected);
    setServices((prev) =>
      prev.map((service) =>
        service._id === id ? { ...service, selected: !selected } : service
      )
    );
    setSnackbarMessage("Service status updated successfully.");
    setSnackbarOpen(true);
  };

  const handleAdd = async (name) => {
    const tempId = Date.now(); // Temporary ID
  
    // Add temporary service to UI
    setServices((prev) => [...prev, { _id: tempId, name, selected: false }]);
  
    try {
      const newService = await addService(name); // Call API to actually add
      if (newService && newService._id) {
        setServices((prev) =>
          prev.map((service) =>
            service._id === tempId ? newService : service // Replace temp with real service
          )
        );
        setSnackbarMessage(`"${name}" added successfully.`);
      } else {
        // API failed, remove temp
        setServices((prev) => prev.filter((service) => service._id !== tempId));
        setSnackbarMessage("Error adding service.");
      }
    } catch (error) {
      setServices((prev) => prev.filter((service) => service._id !== tempId));
      setSnackbarMessage("Error adding service.");
    }
    
    setSnackbarOpen(true); // Always open snackbar
  };

  const handleDelete = async (id, name) => {
    await deleteService(id);
    setServices((prev) => prev.filter((service) => service._id !== id));
    setSnackbarMessage(`"${name}" deleted successfully.`);
    setSnackbarOpen(true);
  };

  const handleUpdate = async (id, name) => {
    const updated = await updateService(id, name);
    if (updated && updated.name) {
      setServices((prev) =>
        prev.map((service) =>
          service._id === id ? { ...service, name: updated.name } : service
        )
      );
      setSnackbarMessage(`"${name}" updated successfully.`);
      setSnackbarOpen(true);
    } else {
      setSnackbarMessage("Error updating service.");
      setSnackbarOpen(true);
    }
  };

  return (
    <Container maxWidth="md" sx={{ px: { xs: 2, md: 4 } }}>
      <Paper
        elevation={3}
        sx={{
          p: { xs: 2, md: 3 },
          mt: { xs: 2, md: 4 },
          width: "100%",
          boxSizing: "border-box",
        }}
      >
        <Typography variant="h4" align="center" gutterBottom>
          Add New Service
        </Typography>
        <ServiceForm onAdd={handleAdd} />

        <Typography variant="h5" sx={{ mt: 3 }}>
          Services
        </Typography>
        <ServiceList
          services={services}
          onToggle={handleToggle}
          onDelete={handleDelete}
          onUpdate={handleUpdate}
        />
      </Paper>

      <SuccessSnackbar
        open={snackbarOpen}
        message={snackbarMessage}
        onClose={() => setSnackbarOpen(false)}
      />
    </Container>
  );
};

export default ServiceManager;

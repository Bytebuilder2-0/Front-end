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
    // Temporarily add the service to the list for instant feedback (optimistic update)
    const tempService = { _id: Date.now(), name, selected: false }; // Temporary ID for immediate UI update
  
    // Update the services state immediately with the new service
    setServices((prev) => [...prev, tempService]);
  
    try {
      // Wait for the actual API response
      const newService = await addService(name); // Call API to add service
  
      // Check if the service was added successfully
      if (newService && newService._id) {
        // Update the service with actual data (only if successful)
        setSnackbarMessage(`"${name}" added successfully.`);
      } else {
        // If the API returned no data or failed, remove the temporary service and show the error
        setServices((prev) => prev.filter((service) => service._id !== tempService._id));
        setSnackbarMessage("Error adding service.");
      }
    } catch (error) {
      // If there’s any error in the API call, remove the temporary service and show error
      setServices((prev) => prev.filter((service) => service._id !== tempService._id));
      setSnackbarMessage("Error adding service.");
    }
  
    // Open the snackbar for success or error message
    setSnackbarOpen(true);
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

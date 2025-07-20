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
import { Container, Typography, Paper, Box } from "@mui/material";
import SuccessSnackbar from "./SuccessSnackbar";

const ServiceManager = () => {
  const [services, setServices] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [isActionInProgress, setIsActionInProgress] = useState(false);

  useEffect(() => {
    fetchServices().then((data) => {
      // Sort by createdAt (newest first) if data exists
      const sorted = data
        ? [...data].sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
          )
        : [];
      setServices(sorted);
    });
  }, []);

  const handleToggle = async (id, selected) => {
    setIsActionInProgress(true);
    try {
      await toggleService(id, !selected);
      setServices((prev) =>
        prev.map((service) =>
          service._id === id ? { ...service, selected: !selected } : service
        )
      );
      setSnackbarMessage("Service status updated successfully.");
      setSnackbarOpen(true);
    } finally {
      setIsActionInProgress(false);
    }
  };

  const handleAdd = async (name) => {
    setIsActionInProgress(true);
    const tempId = Date.now();

    // Prepend the new service at the beginning of the array
    setServices((prev) => [{ _id: tempId, name, selected: false }, ...prev]);

    try {
      const newService = await addService(name);
      if (newService && newService._id) {
        // Replace temp ID with real ID while keeping it at the top
        setServices((prev) => [
          { ...newService, selected: false },
          ...prev.filter((service) => service._id !== tempId),
        ]);
        setSnackbarMessage(`"${name}" added successfully.`);
      } else {
        // Remove if API call fails
        setServices((prev) => prev.filter((service) => service._id !== tempId));
        setSnackbarMessage("Error adding service.");
      }
    } catch (error) {
      setServices((prev) => prev.filter((service) => service._id !== tempId));
      setSnackbarMessage("Error adding service.");
    }

    setSnackbarOpen(true);
    setIsActionInProgress(false);
  };
  const handleDelete = async (id, name) => {
    setIsActionInProgress(true);
    try {
      await deleteService(id);
      setServices((prev) => prev.filter((service) => service._id !== id));
      setSnackbarMessage(`"${name}" deleted successfully.`);
      setSnackbarOpen(true);
    } finally {
      setIsActionInProgress(false);
    }
  };

  const handleUpdate = async (id, name) => {
    setIsActionInProgress(true);
    try {
      const updated = await updateService(id, name);
      if (updated && updated.name) {
        setServices((prev) =>
          prev.map((service) =>
            service._id === id ? { ...service, name: updated.name } : service
          )
        );
        setSnackbarMessage(`"${name}" updated successfully.`);
      } else {
        setSnackbarMessage("Error updating service.");
      }
      setSnackbarOpen(true);
      setEditingId(null);
    } finally {
      setIsActionInProgress(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 5, mb: 5 }}>
      <Paper
        elevation={5}
        sx={{
          p: 4,
          backgroundColor: "#f9fafb",
          borderRadius: "12px",
          border: "1px solid #e0e0e0",
        }}
      >
        <Box mb={3}>
          <Typography
            variant="h4"
            align="center"
            sx={{
              fontWeight: "bold",
              color: "#3f51b5",
              letterSpacing: 1,
              mb: 1,
            }}
          >
            Manage Services
          </Typography>
          <Typography
            variant="subtitle1"
            align="center"
            sx={{ color: "text.secondary" }}
          >
            Add, Edit, and Organize Your Services Easily
          </Typography>
        </Box>

        <ServiceForm onAdd={handleAdd} disabled={isActionInProgress} />

        <Typography variant="h5" sx={{ mt: 4, mb: 2 }} fontWeight="bold">
          Your Services
        </Typography>

        {services.length === 0 ? (
          <Box
            sx={{
              textAlign: "center",
              py: 5,
              backgroundColor: "#f5f5f5",
              borderRadius: "12px",
              border: "1px dashed #e0e0e0",
            }}
          >
            <Typography variant="h6" color="textSecondary">
              No services available
            </Typography>
          </Box>
        ) : (
          <ServiceList
            services={services}
            onToggle={handleToggle}
            onDelete={handleDelete}
            onUpdate={handleUpdate}
            editingId={editingId}
            setEditingId={setEditingId}
            isActionInProgress={isActionInProgress}
          />
        )}
      </Paper>

      <SuccessSnackbar
        open={snackbarOpen}
        message={snackbarMessage}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      />
    </Container>
  );
};

export default ServiceManager;

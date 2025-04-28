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
    setServices((prev) => [...prev, { _id: tempId, name, selected: false }]);
    try {
      const newService = await addService(name);
      if (newService && newService._id) {
        setServices((prev) =>
          prev.map((service) =>
            service._id === tempId ? newService : service
          )
        );
        setSnackbarMessage(`"${name}" added successfully.`);
      } else {
        setServices((prev) => prev.filter((service) => service._id !== tempId));
        setSnackbarMessage("Error adding service.");
      }
    } catch (error) {
      setServices((prev) => prev.filter((service) => service._id !== tempId));
      setSnackbarMessage("Error adding service.");
    }
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
    } else {
      setSnackbarMessage("Error updating service.");
    }
    setSnackbarOpen(true);
  };

  return (
    <Container maxWidth="md" sx={{ px: { xs: 2, md: 4 } }}>
      <Paper
        elevation={4}
        sx={{
          p: { xs: 3, md: 5 },
          mt: { xs: 3, md: 5 },
          width: "100%",
          boxSizing: "border-box",
          borderRadius: 4,
          background: "linear-gradient(135deg, #f5f7fa 0%,rgb(250, 253, 254) 100%)",
        }}
      >
        <Typography variant="h4" align="center" gutterBottom fontWeight="bold">
          Manage Services
        </Typography>

        <ServiceForm onAdd={handleAdd} />

        <Typography variant="h5" sx={{ mt: 4, mb: 2 }} fontWeight="bold">
          Your Services
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

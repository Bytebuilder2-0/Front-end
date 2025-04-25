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
import {
  Container,
  Typography,
  Paper,
  Snackbar,
  Alert,
} from "@mui/material";

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
  };

  const handleAdd = async (name, type) => {
    const newService = await addService(name, type);
    if (newService && newService._id) {
      setServices((prev) => [...prev, newService]);
    } else {
      setServices((prev) => [
        ...prev,
        { ...newService, _id: new Date().toISOString() },
      ]);
    }
  };

  const handleDelete = async (id, name) => {
    await deleteService(id);
    setServices((prev) => prev.filter((service) => service._id !== id));

    // ✅ Show Snackbar after deletion
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
    }
  };

  const customerServices = services.filter((s) => s.type === "customer");
  const garageServices = services.filter((s) => s.type === "garage");

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} style={{ padding: "20px", marginTop: "20px" }}>
        <Typography variant="h4" align="center" gutterBottom>
          Add New Service
        </Typography>
        <ServiceForm onAdd={handleAdd} />

        <Typography variant="h5" style={{ marginTop: "20px" }}>
          Customer Services
        </Typography>
        <ServiceList
          services={customerServices}
          onToggle={handleToggle}
          onDelete={handleDelete}
          onUpdate={handleUpdate}
        />

        <Typography variant="h5" style={{ marginTop: "20px" }}>
          Garage Services
        </Typography>
        <ServiceList
          services={garageServices}
          onToggle={handleToggle}
          onDelete={handleDelete}
          onUpdate={handleUpdate}
        />
      </Paper>

      {/* ✅ Snackbar Message */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity="success"
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default ServiceManager;

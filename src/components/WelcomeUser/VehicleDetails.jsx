import { Typography, Box, CircularProgress } from "@mui/material";
import axios from "axios";
import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import VehicleFound from "./VehicleFound";
import NoVehicles from "./NoVehicles";
import API_BASE_URL from "../../config/api";

const VehicleDetails = () => {
  const { user, token } = useAuth();
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVehicles = async () => {
      if (!user || !user.id || !token) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const API_URL = `${API_BASE_URL}/appointments/vehicles/${user.id}`;
        const response = await axios.get(API_URL, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // Ensure we always have an array, even if response.data is null/undefined
        const vehiclesData = Array.isArray(response.data) ? response.data : [];
        setVehicles(vehiclesData);

        // Reset error state on success
        setError(null);
      } catch (err) {
        setVehicles([]);
      } finally {
        setLoading(false);
      }
    };

    fetchVehicles();
  }, [user?.id, token]);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 2, textAlign: "center" }}>
        <Typography color="error">Error: {error}</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ mb: 4 }}>
      <Typography
        variant="h6"
        sx={{ mb: 3, fontWeight: "bold", fontSize: "22px" }}
      >
        Your Vehicles
      </Typography>

      {vehicles.length > 0 ? (
        <VehicleFound vehicles={vehicles} />
      ) : (
        <NoVehicles />
      )}
    </Box>
  );
};

export default VehicleDetails;

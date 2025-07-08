import axios from "axios";
import { jwtDecode } from "jwt-decode";

const API_URL = "http://localhost:5000/api/servicesManage";
const token = localStorage.getItem("token");

let decoded = null;
if (token) {
  try {
    decoded = jwtDecode(token);
    console.log(decoded.id); // optional
  } catch (err) {
    console.error("Invalid token:", err);
  }
}

//  Handy config object you can reuse
const authConfig = {
  headers: {
    Authorization: `Bearer ${token}`,
  },
};

// ─────────── CRUD helpers ───────────
export const fetchServices = async () => {
  try {
    const { data } = await axios.get(API_URL, authConfig);
    return data;
  } catch (err) {
    console.error("Error fetching services:", err);
    return [];
  }
};

export const addService = async (name) => {
  try {
    const { data } = await axios.post(API_URL, { name }, authConfig);
    return data;
  } catch (err) {
    console.error(" Error adding service:", err.response?.data || err.message);
    return null;
  }
};

export const toggleService = async (id, selected) => {
  try {
    const { data } = await axios.put(
      `${API_URL}/${id}`,
      { selected },
      authConfig
    );
    return data;
  } catch (err) {
    console.error("Error toggling service:", err);
  }
};

export const deleteService = async (id) => {
  try {
    await axios.delete(`${API_URL}/${id}`, authConfig);
  } catch (err) {
    console.error("Error deleting service:", err);
  }
};

export const updateService = async (id, name) => {
  try {
    const { data } = await axios.put(
      `${API_URL}/update/${id}`,
      { name },
      authConfig
    );
    return data;
  } catch (err) {
    console.error("Error updating service:", err);
  }
};

export const updateServiceSteps = async (id, steps) => {
  try {
    const { data } = await axios.put(
      `${API_URL}/steps/${id}`,
      { steps },
      authConfig
    );
    return data;
  } catch (err) {
    console.error("Error updating service steps:", err);
  }
};

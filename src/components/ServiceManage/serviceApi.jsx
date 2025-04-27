import axios from "axios";

const API_URL = "http://localhost:5000/api/servicesManage";

export const fetchServices = async () => {
  try {
    const res = await axios.get(API_URL);
    return res.data;
  } catch (err) {
    console.error("Error fetching services:", err);
    return [];
  }
};

export const addService = async (name) => {
  try {
    const res = await axios.post(API_URL, { name }); // Only send name
    return res.data;
  } catch (err) {
    console.error("❌ Error adding service:", err.response?.data || err.message);
    return null;
  }
};

export const toggleService = async (id, selected) => {
  try {
    const res = await axios.put(`${API_URL}/${id}`, { selected });
    return res.data;
  } catch (err) {
    console.error("Error toggling service:", err);
  }
};

export const deleteService = async (id) => {
  try {
    await axios.delete(`${API_URL}/${id}`);
  } catch (err) {
    console.error("Error deleting service:", err);
  }
};

export const updateService = async (id, name) => {
  try {
    const res = await axios.put(`${API_URL}/update/${id}`, { name });
    return res.data;
  } catch (err) {
    console.error("Error updating service:", err);
  }
};

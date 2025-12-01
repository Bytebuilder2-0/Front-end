import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import API_BASE_URL from "../../config/api";

const HandleAppointmentForm = () => {
  const { user, token } = useAuth();
  const [vehicles, setVehicles] = useState([]);
  const [services, setServices] = useState([]);
  const [formData, setFormData] = useState({
    vehicleObject: "",
    vehicleNumber: "",
    model: "",
    services: [],
    issue: "",
    preferredDate: "",
    preferredTime: "",
    expectedDeliveryDate: "",
    contactNumber: "",
  });
  const [errors, setErrors] = useState({});
  const [disabledVehicles, setDisabledVehicles] = useState([]); //Track vehicles with active appointments

  const fetchData = async () => {
    if (!user || !user.id || !token) return;
    try {
      console.log("Fetching data for user:", user.id);

      const API_URL = `${API_BASE_URL}/appointments/vehicles/${user.id}`;

      const vehiclesResponse = await axios.get(API_URL, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("Vehicles response:", vehiclesResponse.data);
      setVehicles(vehiclesResponse.data);

      const servicesResponse = await axios.get(
        `${API_BASE_URL}/appointments/services`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setServices(servicesResponse.data);

      const appointmentsResponse = await axios.get(
        `${API_BASE_URL}/appointments/user/${user.id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log("Appointments response:", appointmentsResponse.data);

      const activeAppointments = appointmentsResponse.data.data.filter(
        (appointment) => !["Paid", "Cancelled"].includes(appointment.status)
      );
      console.log("Active appointments:", activeAppointments);

      const disabledVehicleIds = activeAppointments.map(
        (app) => app.vehicleObject
      );
      const statusMap = {};
      activeAppointments.forEach((app) => {
        statusMap[app.vehicleObject] = app.status;
      });
      console.log("Disabled vehicles:", disabledVehicleIds);
      console.log("Status map:", statusMap);
      setDisabledVehicles(disabledVehicleIds);
    } catch (error) {
      console.error(
        "Error fetching data:",
        error.response ? error.response.data : error.message
      );
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, [user?.id, token]); // Only depend on auth context

  const handleVehicleChange = (e) => {
    const vehicleObject = e.target.value;
    const selectedVehicle = vehicles.find((v) => v._id === vehicleObject);

    setFormData({
      ...formData,
      vehicleObject,
      vehicleNumber: selectedVehicle?.vehicleNumber || "",
      model: selectedVehicle?.model || "",
    });
  };

  const handleServiceChange = (e) => {
    setFormData({ ...formData, services: e.target.value });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Clear error for the field being edited
    if (errors[name]) {
      setErrors({ ...errors, [name]: null });
    }
  };

  // This useEffect seems to be a duplicate of the one above. Keeping only one.
  /*
useEffect(() => {
  fetchData(); 
  const interval = setInterval(fetchData, 30000); 
  return () => clearInterval(interval);
}, []);
*/

  const validateForm = () => {
    const newErrors = {};
    const now = new Date();

    const {
      contactNumber,
      issue,
      preferredDate,
      preferredTime,
      expectedDeliveryDate,
    } = formData;

    // --- Contact Number ---
    if (!contactNumber) {
      newErrors.contactNumber = "Contact number is required";
    } else if (!/^\d{11}$/.test(contactNumber)) {
      newErrors.contactNumber = "Contact number must be exactly 11 digits";
    } else if (!/^94\d{9}$/.test(contactNumber)) {
      newErrors.contactNumber = "Must start with 94 and contain 9 more digits";
    }

    // --- Issue ---
    if (issue && !/^[A-Za-z0-9\s]+$/.test(issue)) {
      newErrors.issue = "Only letters, numbers and spaces allowed";
    }

    // --- Preferred Date ---
    if (!preferredDate) {
      newErrors.preferredDate = "Preferred date is required";
    } else if (new Date(preferredDate) < new Date(now.toDateString())) {
      newErrors.preferredDate = "Invalid date. Must be future";
    }

    // --- Expected Delivery Date ---
    if (!expectedDeliveryDate) {
      newErrors.expectedDeliveryDate = "Expected delivery date is required";
    } else if (new Date(expectedDeliveryDate) < new Date(now.toDateString())) {
      newErrors.expectedDeliveryDate = "Invalid date.Must be future ";
    }

    // --- preferredDate <= expectedDeliveryDate ---
    if (preferredDate && expectedDeliveryDate) {
      const pDate = new Date(preferredDate);
      const eDate = new Date(expectedDeliveryDate);
      if (pDate > eDate) {
        newErrors.preferredDate =
          "Preferred date must be before expected delivery date";
      }
    }

    // --- Time validation ---
    if (!preferredTime) {
      newErrors.preferredTime = "Preferred time is required";
    } else {
      // Parse 12-hour format with AM/PM
      const timeParts = preferredTime.split(" ");
      const timeValue = timeParts[0];
      const period = timeParts[1]; // AM or PM
      const [hoursStr, minutesStr] = timeValue.split(":");
      let hours = parseInt(hoursStr, 10);
      const minutes = parseInt(minutesStr, 10);

      if (period === "PM" && hours !== 12) {
        hours += 12;
      } else if (period === "AM" && hours === 12) {
        hours = 0;
      }
      if ((period === "AM" && hours < 6) || (period === "AM" && hours === 12)) {
        newErrors.preferredTime =
          "Time slot between 12:00 AM and 6:00 AM is not allowed";
      }
      if (preferredDate) {
        const preferredDateTime = new Date(preferredDate);
        preferredDateTime.setHours(hours, minutes, 0, 0);
        const now = new Date();

        // Check if preferred date is today
        if (preferredDateTime.toDateString() === now.toDateString()) {
          // Check if time is in the past
          if (preferredDateTime <= now) {
            newErrors.preferredTime = "Time slot has already passed for today";
          }
          // Check minimum buffer time (1 hour from now)
          else {
            const oneHourFromNow = new Date(now.getTime() + 60 * 60 * 1000);
            if (preferredDateTime <= oneHourFromNow) {
              newErrors.preferredTime =
                "Please select a time at least 1 hour from now";
            }
          }
        }
        if (expectedDeliveryDate) {
          const deliveryDate = new Date(expectedDeliveryDate);
          if (
            preferredDateTime.toDateString() === deliveryDate.toDateString()
          ) {
            // Additional validation for same-day delivery
            const deliveryDateTime = new Date(deliveryDate);
            deliveryDateTime.setHours(17, 0, 0, 0); // Assuming 5PM closing time
          }
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      const response = await axios.post(
        `${API_BASE_URL}/appointments/${user.id}`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setDisabledVehicles([...disabledVehicles, formData.vehicleObject]);
      await fetchData();

      console.log("Created appointment:", response.data);

      setFormData({
        vehicleObject: "",
        vehicleNumber: "",
        model: "",
        services: [],
        issue: "",
        preferredDate: "",
        preferredTime: "",
        expectedDeliveryDate: "",
        contactNumber: "",
      });

      return response.data;
    } catch (error) {
      console.error("Submission error:", error);
      // Using a custom message box instead of alert()
      // You would replace this with your actual message box component/logic
      const errorMessage = error.response?.data?.message || error.message;
      console.log(`Error creating appointment: ${errorMessage}`);
      // Example of how you might trigger a message box:
      // showMessageBox(`Error creating appointment: ${errorMessage}`);
    }
    return null;
  };

  const handleReset = () => {
    setFormData({
      vehicleObject: "",
      vehicleNumber: "",
      model: "",
      services: [],
      issue: "",
      preferredDate: "",
      preferredTime: "",
      expectedDeliveryDate: "",
      contactNumber: "",
    });
    setErrors({});
  };

  return {
    vehicles,
    services,
    formData,
    errors,
    disabledVehicles,
    fetchData,
    handleVehicleChange,
    handleServiceChange,
    handleInputChange,
    handleSubmit,
    handleReset,
  };
};

export default HandleAppointmentForm;

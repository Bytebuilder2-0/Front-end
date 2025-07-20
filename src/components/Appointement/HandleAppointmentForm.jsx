import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from "../../context/AuthContext";


const HandleAppointmentForm = () => {

  const { user, token } = useAuth();
  const [vehicles, setVehicles] = useState([]);
  const [services, setServices] = useState([]);
  const [formData, setFormData] = useState({
    vehicleObject: '',
    vehicleNumber: '',
    model: '',
    services: [],
    issue: '',
    preferredDate: '',
    preferredTime: '',
    expectedDeliveryDate: '',
    contactNumber: ''
  });
  const [errors, setErrors] = useState({});
  const [disabledVehicles, setDisabledVehicles] = useState([]); //Track vehicles with active appointments


  const fetchData = async () => {
      if (!user || !user.id ||!token) return;
    try {
      console.log('Fetching data for user:', user.id);

      const API_URL = `http://localhost:5000/api/appointments/vehicles/${user.id}`;
      
      const vehiclesResponse = await axios.get(API_URL, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

      console.log('Vehicles response:', vehiclesResponse.data);
      setVehicles(vehiclesResponse.data);


        const servicesResponse = await axios.get(
        'http://localhost:5000/api/appointments/services',
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setServices(servicesResponse.data);

          const appointmentsResponse = await axios.get(
        `http://localhost:5000/api/appointments/user/${user.id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
        console.log('Appointments response:', appointmentsResponse.data);

        const activeAppointments = appointmentsResponse.data.data.filter(
          appointment => !["Paid", "Cancelled"].includes(appointment.status)
        );
        console.log('Active appointments:', activeAppointments);

        const disabledVehicleIds = activeAppointments.map(app => app.vehicleObject);
        const statusMap = {};
        activeAppointments.forEach(app => {
        statusMap[app.vehicleObject] = app.status;
});
      console.log('Disabled vehicles:', disabledVehicleIds);
      console.log('Status map:', statusMap);
        setDisabledVehicles(disabledVehicleIds);
  
    } catch (error) {
      console.error('Error fetching data:',  error.response ? error.response.data : error.message);
    }
  };

    useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, [user?.id, token]);   // Only depend on auth context



  const handleVehicleChange = (e) => {
    const vehicleObject = e.target.value;
    const selectedVehicle = vehicles.find(v => v._id === vehicleObject);
    
    setFormData({
      ...formData,
      vehicleObject,
      vehicleNumber: selectedVehicle?.vehicleNumber || '',
      model: selectedVehicle?.model || ''
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

  // Contact Number Validation
  if (!formData.contactNumber) {
    newErrors.contactNumber = 'Contact number is required';
  } else if (!/^\d{11}$/.test(formData.contactNumber)) {
    newErrors.contactNumber = 'Contact number must be exactly 11 digits (e.g., 94771234567)';
  } else if (!/^94\d{9}$/.test(formData.contactNumber)) {
    newErrors.contactNumber = 'Invalid format: must start with 94 and contain 9 more digits';
  }

  // Issue Field Validation
  if (formData.issue && !/^[A-Za-z0-9\s]+$/.test(formData.issue)) {
    newErrors.issue = 'Issue must only contain letters, numbers, and spaces';
  }

  // Date/Time Validation
  let preferredDateTime = null;
  let deliveryDate = null;

  // Preferred Date Validation
  if (!formData.preferredDate) {
    newErrors.preferredDate = 'Preferred date is required';
  }

  // Preferred Time Validation
  if (!formData.preferredTime) {
    newErrors.preferredTime = 'Preferred time is required';
  }

  // Process preferred date/time if both exist
  if (formData.preferredDate && formData.preferredTime) {
    const timeParts = formData.preferredTime.match(/(\d+):(\d+)\s?(AM|PM)/i);
    if (timeParts) {
      let [_, hour, minute, meridian] = timeParts;
      hour = parseInt(hour);
      minute = parseInt(minute);
      
      // Convert to 24-hour format
      if (meridian.toUpperCase() === 'PM' && hour !== 12) hour += 12;
      if (meridian.toUpperCase() === 'AM' && hour === 12) hour = 0;

      preferredDateTime = new Date(formData.preferredDate);
      preferredDateTime.setHours(hour, minute, 0, 0);

      // Check if preferred date/time is in the future
      if (preferredDateTime < now) {
        newErrors.preferredTime = 'Preferred date and time must be in the future';
      }
    } else {
      newErrors.preferredTime = 'Invalid time format (use HH:MM AM/PM)';
    }
  }

  // Expected Delivery Date Validation
  if (!formData.expectedDeliveryDate) {
    newErrors.expectedDeliveryDate = 'Delivery date is required';
  } else {
    deliveryDate = new Date(formData.expectedDeliveryDate);
    deliveryDate.setHours(0, 0, 0, 0); // Set to start of day for comparison
    
    // Check if delivery date is in the future
    if (deliveryDate < new Date(now.setHours(0, 0, 0, 0))) {
      newErrors.expectedDeliveryDate = 'Delivery date must be today or in the future';
    }

    // Compare with preferred date/time if available
    if (preferredDateTime) {
      const preferredDateOnly = new Date(preferredDateTime);
      preferredDateOnly.setHours(0, 0, 0, 0);
      
      if (deliveryDate < preferredDateOnly) {
        newErrors.expectedDeliveryDate = 'Delivery date must be on or after the preferred service date';
      }
    }
  }

  // Vehicle & Services Validation
  if (!formData.vehicleObject) {
    newErrors.vehicleObject = 'Vehicle selection is required';
  }

  if (formData.services.length === 0) {
    newErrors.services = 'At least one service is required';
  }

  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};



  const handleSubmit = async (e) => {
    e.preventDefault();
    
    
    if (!validateForm()) return;

    try {
      const response = await axios.post(
        `http://localhost:5000/api/appointments/${user.id}`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
        setDisabledVehicles([...disabledVehicles, formData.vehicleObject]);
        await fetchData();
      
      console.log('Created appointment:', response.data);
      
      setFormData({
        vehicleObject: '',
        vehicleNumber: '',
        model: '',
        services: [],
        issue: '',
        preferredDate: '',
        preferredTime: '',
        expectedDeliveryDate: '',
        contactNumber: ''
      });

      return response.data; 
  
    } catch (error) {
      console.error('Submission error:', error);
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
      vehicleObject: '',
      vehicleNumber: '',
      model: '',
      services: [],
      issue: '',
      preferredDate: '',
      preferredTime: '',
      expectedDeliveryDate: '',
      contactNumber: ''
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
    handleReset
  };
};

export default HandleAppointmentForm;

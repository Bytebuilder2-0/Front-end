import { useState, useEffect } from 'react';
import axios from 'axios';

const HandleAppointmentForm = (userId) => {
  // State variables
  const [vehicles, setVehicles] = useState([]);
  const [services, setServices] = useState([]);
  const [formData, setFormData] = useState({
    vehicleObject: '',
    vehicleNumber: '',
    model: '',
    services: [],
    issue: '',
    preferredTime: '',
    expectedDeliveryDate: '',
    contactNumber: ''
  });
  const [errors, setErrors] = useState({});
  const [disabledVehicles, setDisabledVehicles] = useState([]); //Track vehicles with active appointments
  const [vehicleStatusMap, setVehicleStatusMap] = useState({}); // Track statuses for disabled vehicles
  // Fetch initial data
  const fetchData = async () => {
    try {
      console.log('Fetching data for user:', userId);
      
      // 1. Fetch user's vehicles
      const vehiclesResponse = await axios.get(
        `http://localhost:5000/api/appointments/vehicles/${userId}`
      );
      console.log('Vehicles response:', vehiclesResponse.data);
      setVehicles(vehiclesResponse.data);

      const servicesResponse = await axios.get('http://localhost:5000/api/appointments/services');
      setServices(servicesResponse.data);

        // NEW: Fetch user's appointments to check for active ones
        const appointmentsResponse = await axios.get(
          `http://localhost:5000/api/appointments/user/${userId}`
        );
        console.log('Appointments response:', appointmentsResponse.data);
  
        // Filter appointments that aren't Paid or Cancelled
        const activeAppointments = appointmentsResponse.data.filter(
          appointment => !["Paid", "Cancelled"].includes(appointment.status)
        );
        console.log('Active appointments:', activeAppointments);
  
        // Get vehicle IDs from active appointments
        const disabledVehicleIds = activeAppointments.map(app => app.vehicleObject);
        const statusMap = {};
        activeAppointments.forEach(app => {
        statusMap[app.vehicleObject] = app.status;
});
      console.log('Disabled vehicles:', disabledVehicleIds);
      console.log('Status map:', statusMap);
        setDisabledVehicles(disabledVehicleIds);
        setVehicleStatusMap(statusMap);

    } catch (error) {
      console.error('Error fetching data:',  error.response ? error.response.data : error.message);
    }
  };

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
    
    if (errors[name]) {
      setErrors({ ...errors, [name]: null });
    }
  };

  // In HandleAppointmentForm.jsx
useEffect(() => {
  fetchData(); // Initial fetch

  const interval = setInterval(fetchData, 30000); // Refresh every 30 seconds
  return () => clearInterval(interval);
}, []);

  // useEffect(() => {
  //   fetchData();
  // }, []);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.vehicleObject) newErrors.vehicleObject = 'Vehicle selection is required';
    if (formData.services.length === 0) newErrors.services = 'At least one service required';
    if (!formData.preferredTime) newErrors.preferredTime = 'Preferred time is required';
    if (!formData.expectedDeliveryDate) newErrors.expectedDeliveryDate = 'Delivery date is required';
    if (!formData.contactNumber) {
      newErrors.contactNumber = 'Contact number is required';
    } else if (!/^\d{10}$/.test(formData.contactNumber)) {
      newErrors.contactNumber = 'Invalid contact number (10 digits required)';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    
    if (!validateForm()) return;

    try {
      const response = await axios.post(
        `http://localhost:5000/api/appointments/${userId}`,
        formData
      );
        // Add the vehicle to disabled list
        setDisabledVehicles([...disabledVehicles, formData.vehicleObject]);
        await fetchData();
      
      console.log('Created appointment:', response.data);
      
      setFormData({
        vehicleObject: '',
        vehicleNumber: '',
        model: '',
        services: [],
        issue: '',
        preferredTime: '',
        expectedDeliveryDate: '',
        contactNumber: ''
      });

      // setSubmittedVehicles([...submittedVehicles, formData.vehicleObject]);
      return response.data; 
 
    } catch (error) {
      console.error('Submission error:', error);
      alert(`Error creating appointment: ${error.response?.data?.message || error.message}`);
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

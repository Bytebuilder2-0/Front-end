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

  // Fetch initial data
  const fetchData = async () => {
    try {
      // Fetch user's vehicles
      const vehiclesResponse = await axios.get(
        `http://localhost:5000/api/appointments/vehicles/${userId}`
      );
      setVehicles(vehiclesResponse.data);

      // Fetch all services
      const servicesResponse = await axios.get('http://localhost:5000/api/appointments/services');
      setServices(servicesResponse.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  // Handle vehicle selection
  const handleVehicleChange = (e) => {
    const vehicleObject = e.target.value;
    // console.log('Selected Vehicle ID (Frontend):', vehicleObject);
    const selectedVehicle = vehicles.find(v => v._id === vehicleObject);
    
    setFormData({
      ...formData,
      vehicleObject,
      vehicleNumber: selectedVehicle?.vehicleNumber || '',
      model: selectedVehicle?.model || ''
    });
  };

  // Handle service selection
  const handleServiceChange = (e) => {
    setFormData({ ...formData, services: e.target.value });
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: null });
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Validate form
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

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      const response = await axios.post(
        `http://localhost:5000/api/appointments/${userId}`,
        formData
      );
      
      alert('Appointment created successfully!');
      console.log('Created appointment:', response.data);
      
      // Reset form
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
 
    } catch (error) {
      console.error('Submission error:', error);
      alert(`Error creating appointment: ${error.response?.data?.message || error.message}`);
    }
  };

  // Handle form reset
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
    fetchData,
    handleVehicleChange,
    handleServiceChange,
    handleInputChange,
    handleSubmit,
    handleReset
  };
};

export default HandleAppointmentForm;
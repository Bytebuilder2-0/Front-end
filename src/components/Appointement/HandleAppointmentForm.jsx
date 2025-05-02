import { useState, useEffect } from 'react';
import axios from 'axios';

const HandleAppointmentForm = (userId) => {

  const API_URL_VEHI = `http://localhost:5000/api/appointments/vehicles/${userId}`
  const API_URL_SERVI = 'http://localhost:5000/api/appointments/services'
  const API_URL_User_APPOIN = `http://localhost:5000/api/appointments/user/${userId}`
  const API_URL_APPOIN   = `http://localhost:5000/api/appointments/${userId}`

  const [vehicles, setVehicles] = useState([]);     //state initialization
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

//data fetching 

  const fetchData = async () => {
    try {   

      const vehiclesResponse = await axios.get(API_URL_VEHI);      //set vehicles related user
      console.log('Vehicles response:', vehiclesResponse.data);
      setVehicles(vehiclesResponse.data);

      const servicesResponse = await axios.get(API_URL_SERVI);   //set services
      setServices(servicesResponse.data);

      const appointmentsResponse = await axios.get(API_URL_User_APPOIN);    //set appoinments related user
      console.log('Appointments response:', appointmentsResponse.data);
    

      const activeAppointments = appointmentsResponse.data.data.filter(          //Filter appoinments except status 'paid','cancelled'
          appointment => !["Paid", "Cancelled"].includes(appointment.status)
      );
      console.log('Active appointments:', activeAppointments);

      const disabledVehicleIds = activeAppointments.map(app => app.vehicleObject);      //Map vehicles from active appoinments

      console.log('Disabled vehicles:', disabledVehicleIds);
      setDisabledVehicles(disabledVehicleIds);
 
    } catch (error) {
      console.error('Error fetching data:',  error.response ? error.response.data : error.message);
    }
  };

  //input hadling

  const handleVehicleChange = (e) => {
    const vehicleObject = e.target.value;
    const selectedVehicle = vehicles.find(v => v._id === vehicleObject);    //find selected vehilce(one by one)
    
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


useEffect(() => {
  fetchData(); 
  const interval = setInterval(fetchData, 30000); 
  return () => clearInterval(interval);
}, []);


  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.vehicleObject) newErrors.vehicleObject = 'Vehicle selection is required';
    if (formData.services.length === 0) newErrors.services = 'At least one service required';
    if (!formData.issue) newErrors.issue = 'Vehicle issue is required';
    if (!formData.preferredDate) newErrors.preferredDate = 'Preferred date is required';
    if (!formData.preferredTime) newErrors.preferredTime = 'Preferred time is required';
    if (!formData.expectedDeliveryDate) newErrors.expectedDeliveryDate = 'Delivery date is required';
    if (!formData.contactNumber) {
      newErrors.contactNumber = 'Contact number is required';
    }  else if (!/^94\d{9}$/.test(formData.contactNumber)) {
      newErrors.contactNumber = 'Invalid contact number (must start with 94 followed by 9 digits, e.g., 94771234567)';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;      //called to if form valid or not

    try {
      const response = await axios.post( API_URL_APPOIN , formData );

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

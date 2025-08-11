import React from "react";
import {
    Typography,
    Paper,
    Box,
    Divider,
    Stack,
    Grid,
    Button,
} from "@mui/material";
import {
    CheckCircle as CheckCircleIcon,
    Description as ServiceIcon,
    DirectionsCar as VehicleIcon,
    ConfirmationNumber as IdIcon,
    ModelTraining as ModelIcon,
    
} from "@mui/icons-material";
import { green, orange, blue } from "@mui/material/colors";
import { format } from "date-fns";
import { useNavigate } from 'react-router-dom';

import axios from "axios";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(
    "pk_test_51Rl8A92E8JZ0nXeqBkKSyzbSZnPa4fHYeEe8TF2ApdVDI8BDRoDDD5u4EIgPLuNkRMHyZvq47KqNf4fPbqMrGDwa004pUMyJfU"
);

const AppointmentPaid = ({ appointment }) => {
    const navigate = useNavigate();


 
    return (
        <Box sx={{ padding: "20px" }}>
            {/* Appointment Header */}
                 <Typography  gutterBottom sx={{ 
                              fontWeight: 600,
                              fontSize : 35,
                              marginBottom: '1px'
                            }}>
                              Appoinment Details
                            </Typography>
                            <Typography varient="caption" sx = {{color:'green'}} > Appoinment - Paid</Typography>
                            
                            <Divider sx={{ mb: 6  }} />

            <Grid container spacing={2} sx={{ mb: 3 }}>
                {/* Customer Column */}
                <Grid item xs={12} md={4}>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                        <IdIcon color="primary" sx={{ mr: 1 }} />
                        <Typography>
                            <strong>Vehicle ID:</strong> {appointment.vehicleId || "N/A"}
                        </Typography>
                    </Box>
                </Grid>

                {/* Service Column */}
                <Grid item xs={12} md={4}>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                        <ServiceIcon color="primary" sx={{ mr: 1 }} />
                        <Typography>
                            <strong>Service:</strong> {appointment.services || "N/A"}
                        </Typography>
                    </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                <ServiceIcon color="primary" sx={{ mr: 1 }} />
                                <Typography>
                                  <strong>Delivary Date:</strong> {appointment.expectedDeliveryDate ? format(new Date(appointment.expectedDeliveryDate), 'MMM d, yyyy') : 'Not specified'}
                                 </Typography>
                            
                    
                              </Box>
                </Grid>

                {/* Vehicle Column */}
                <Grid item xs={12} md={4}>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                        <ModelIcon color="primary" sx={{ mr: 1 }} />
                        <Typography>
                            <strong>Model:</strong> {appointment.model || "N/A"}
                        </Typography>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                        <VehicleIcon color="primary" sx={{ mr: 1 }} />
                        <Typography>
                            <strong>Plate Number:</strong> {appointment.vehicleNumber || "N/A"}
                        </Typography>
                    </Box>
                </Grid>
            </Grid>

            <Divider sx={{ my: 3 }} />

         
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        p: 4,
        maxWidth: '500px',
        margin: '0 auto'
      }}
    >
      {/* Success icon */}
      <CheckCircleIcon 
        sx={{ 
          fontSize: 80, 
          color: 'green',
          mb: 2 
        }} 
      />

      {/* Main message */}
      <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
        Payment Successful!
      </Typography>

      {/* Thank you message */}
      <Typography variant="body1" sx={{ mb: 4, lineHeight: 1.6 }}>
        Thank you for your payment. Your appointment has been confirmed successfully.
        Our team will contact you if any further information is needed.
      </Typography>

      {/* Action button */}
      <Button
        variant="contained"
        onClick={() => navigate('/User')}
        sx={{
          px: 4,
          py: 1.5,
          borderRadius: '8px',
          fontWeight: 600
        }}
      >
        Return to Home
      </Button>
    </Box>



           

            
            

            <Divider sx={{ my: 2 }} />
        </Box>
    );
};

export default AppointmentPaid;

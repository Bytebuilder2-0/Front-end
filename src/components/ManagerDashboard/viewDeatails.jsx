import React, { useState } from "react";
import {
  Button, Modal, Box, Typography, Grid, IconButton, Tooltip, Divider, Dialog,
  DialogTitle, DialogContent, DialogActions
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";

const DeatailsViewer = ({ appointment }) => {
  const [open, setOpen] = useState(false);
  if (!appointment) return null;

  return (
    <>
      <Tooltip title="View Appointment Details" arrow>
        <IconButton sx={{ color: "black" }} onClick={() => setOpen(true)}>
          <VisibilityIcon sx={{ fontSize: 22 }} />
        </IconButton>
      </Tooltip>

      <Dialog open={!!open} onClose={() => setOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle sx={{ fontWeight: "bold", color: "#1976d2" }}>
          Appointment Details
        </DialogTitle>
        <Divider />

        <DialogContent dividers sx={{ py: 3 }}>
          {/* Vehicle Info */}
          <Box mb={3}>
            <Typography variant="h6" sx={{ color: "#1976d2", mb: 1 }}>
              Vehicle Information
            </Typography>
            {appointment.vehicleId && <Typography><strong>Vehicle ID:</strong> {appointment.vehicleId}</Typography>}
            {appointment.vehicleNumber && <Typography><strong>Vehicle Number:</strong> {appointment.vehicleNumber}</Typography>}
            {appointment.model && <Typography><strong>Model:</strong> {appointment.model}</Typography>}
          </Box>

           {/* Services */}
           {Array.isArray(appointment.services) && appointment.services.length > 0 && (
            <Box mb={3}>
              <Typography variant="h6" sx={{ color: "#1976d2", mb: 1 }}>
                Services Selected
              </Typography>
              {appointment.services.map((service, idx) => (
                <Typography key={idx} sx={{ mb: 0.5 }}>
                  {service}
                </Typography>
              ))}
            </Box>
          )}


          {/* Issue Info */}
          {(appointment.issue || appointment.reason) && (
            <Box mb={3}>
              <Typography variant="h6" sx={{ color: "#1976d2", mb: 1 }}>
                Issue Details
              </Typography>
              {appointment.issue && <Typography><strong>Issue:</strong> {appointment.issue}</Typography>}
              {appointment.reason && <Typography><strong>Reason:</strong> {appointment.reason}</Typography>}
            </Box>
          )}

         
          {/* Appointment Dates */}
          {(appointment.preferredDate || appointment.preferredTime || appointment.expectedDeliveryDate) && (
            <Box mb={3}>
              <Typography variant="h6" sx={{ color: "#1976d2", mb: 1 }}>
                Date Information
              </Typography>
              {appointment.preferredDate && <Typography><strong>Preferred Date:</strong> {new Date(appointment.preferredDate).toLocaleDateString()}</Typography>}
              {appointment.preferredTime && <Typography><strong>Preferred Time:</strong> {appointment.preferredTime}</Typography>}
              {appointment.expectedDeliveryDate && <Typography><strong>Expected Delivery:</strong> {new Date(appointment.expectedDeliveryDate).toLocaleDateString()}</Typography>}
            </Box>
          )}

          {/* Contact */}
          {appointment.contactNumber && (
            <Box mb={3}>
              <Typography variant="h6" sx={{ color: "#1976d2", mb: 1 }}>
                Contact Information
              </Typography>
              <Typography><strong>Contact Number:</strong> {appointment.contactNumber}</Typography>
            </Box>
          )}

          {/* Workload */}
          {Array.isArray(appointment.workload) && appointment.workload.length > 0 && (
            <Box mb={3}>
              <Typography variant="h6" sx={{ color: "#1976d2", mb: 1 }}>
                Workload Details
              </Typography>
              {appointment.workload.map((task, idx) => (
                <Typography key={idx} sx={{ mb: 0.5 }}>
                  <strong>Step {task.step}:</strong> {task.description} ({task.status})
                </Typography>
              ))}
            </Box>
          )}

          {/* Technician Feedback */}
          {(appointment.techMessage || appointment.suggestion) && (
            <Box mb={2}>
              <Typography variant="h6" sx={{ color: "#1976d2", mb: 1 }}>
                Technician's Feedback
              </Typography>
              {appointment.techMessage && <Typography><strong>Technician Message:</strong> {appointment.techMessage}</Typography>}
              {appointment.suggestion && <Typography><strong>Suggestion:</strong> {appointment.suggestion}</Typography>}
            </Box>
          )}
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpen(false)} variant="contained" color="error">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default DeatailsViewer;

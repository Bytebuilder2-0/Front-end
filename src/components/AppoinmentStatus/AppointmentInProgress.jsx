import React from 'react';
import { 
  Typography, 
  LinearProgress, 
  Box, 
  List, 
  ListItem, 
  ListItemText, 
  Chip,
  Divider,
  Paper,
  Grid
} from '@mui/material';
import { 
  CheckCircle as CheckCircleIcon,
  Pending as PendingIcon,
  Description as ServiceIcon,
  DirectionsCar as VehicleIcon,
  ConfirmationNumber as IdIcon,
  ModelTraining as ModelIcon
} from '@mui/icons-material';

const AppointmentInProgress = ({ appointment }) => {
  const tasks = appointment.workload || [];
  const completedTasks = tasks.filter(task => task.status === 'Completed');
  const pendingTasks = tasks.filter(task => task.status === 'Pending');
  const completionPercentage = tasks.length > 0 
    ? Math.round((completedTasks.length / tasks.length) * 100) 
    : 0;

  return (
    <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
      {/* Appointment Header */}
      <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
        Appointment Details
      </Typography>
      
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {/* Customer Column */}
        <Grid item xs={12} md={4}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <IdIcon color="primary" sx={{ mr: 1 }} />
            <Typography>
              <strong>Vehicle ID:</strong> {appointment.vehicleId || 'N/A'}
            </Typography>
          </Box>
        </Grid>

        {/* Service Column */}
        <Grid item xs={12} md={4}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <ServiceIcon color="primary" sx={{ mr: 1 }} />
            <Typography>
              <strong>Service:</strong> {appointment.services  || 'N/A'}
            </Typography>
          </Box>

    
        </Grid>

        {/* Vehicle Column */}
        <Grid item xs={12} md={4}>

          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <ModelIcon color="primary" sx={{ mr: 1 }} />
            <Typography>
              <strong>Model:</strong> {appointment.model || 'N/A'}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <VehicleIcon color="primary" sx={{ mr: 1 }} />
            <Typography>
              <strong>Plate Number:</strong> {appointment.vehicleNumber || 'N/A'}
            </Typography>
          </Box>
        </Grid>
      </Grid>

      <Divider sx={{ my: 3 }} />

      {/* Progress Section */}
      <Typography variant="h6" gutterBottom>
        Work Progress
      </Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Typography variant="body1" sx={{ mr: 2 }}>
          {completionPercentage}% completed ({completedTasks.length}/{tasks.length} tasks)
        </Typography>
        <LinearProgress 
          variant="determinate" 
          value={completionPercentage} 
          sx={{ flexGrow: 1, height: 10, borderRadius: 5 }}
        />
      </Box>

      {/* Completed Tasks */}
      <Typography variant="subtitle1" sx={{ mt: 2, mb: 1, color: 'success.main' }}>
        <CheckCircleIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
        Completed Tasks ({completedTasks.length})
      </Typography>
      <List>
        {completedTasks.map((task, index) => (
          <ListItem key={`completed-${index}`}>
            <ListItemText 
              primary={task.description} 
            />
            <Chip 
              icon={<CheckCircleIcon />}
              label="Completed"
              color="success"
              size="small"
            />
          </ListItem>
        ))}
        {completedTasks.length === 0 && (
          <Typography variant="body2" color="textSecondary">
            No tasks completed yet
          </Typography>
        )}
      </List>

      <Divider sx={{ my: 2 }} />

      {/* Pending Tasks */}
      <Typography variant="subtitle1" sx={{ mt: 2, mb: 1, color: 'warning.main' }}>
        <PendingIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
        Pending Tasks ({pendingTasks.length})
      </Typography>
      <List dense>
        {pendingTasks.map((task, index) => (
          <ListItem key={`pending-${index}`}>
            <ListItemText 
              primary={task.description} 
            />
            <Chip 
              icon={<PendingIcon />}
              label="Pending"
              color="warning"
              size="small"
            />
          </ListItem>
        ))}
        {pendingTasks.length === 0 && tasks.length > 0 && (
          <Typography variant="body2" color="success.main">
            All tasks completed!
          </Typography>
        )}
        {tasks.length === 0 && (
          <Typography variant="body2" color="textSecondary">
            No tasks assigned
          </Typography>
        )}
      </List>
    </Paper>
  );
};

export default AppointmentInProgress;


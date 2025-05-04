import React from 'react';
import { Typography, LinearProgress, Box, List, ListItem, ListItemText, Chip } from '@mui/material';

const AppointmentInProgress = ({ appointment }) => {
  // Extract tasks from appointment (assuming tasks is an array of objects with 'name' and 'status')
  const tasks = appointment.tasks || [];
  
  // Calculate completed tasks
  const completedTasks = tasks.filter(task => task.status === 'completed').length;
  const totalTasks = tasks.length;
  const completionPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Work Progress
      </Typography>
      
      {/* Progress bar */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="body1" gutterBottom>
          {completionPercentage}% completed ({completedTasks}/{totalTasks} tasks)
        </Typography>
        <LinearProgress 
          variant="determinate" 
          value={completionPercentage} 
          sx={{ height: 10, borderRadius: 5 }}
        />
      </Box>

      {/* Task list */}
      <List>
        {tasks.map((task, index) => (
          <ListItem key={index} divider>
            <ListItemText 
              primary={task.name} 
              secondary={`Supervisor: ${task.supervisor || 'Not assigned'}`} 
            />
            <Chip 
              label={task.status === 'completed' ? 'Completed' : 'Pending'} 
              color={task.status === 'completed' ? 'success' : 'warning'} 
              variant="outlined"
            />
          </ListItem>
        ))}
      </List>

      {tasks.length === 0 && (
        <Typography variant="body1" color="textSecondary">
          No tasks assigned yet
        </Typography>
      )}
    </Box>
  );
};

export default AppointmentInProgress;
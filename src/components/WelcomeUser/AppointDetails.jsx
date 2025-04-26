import React, { useEffect, useState } from 'react';
import { 
  List, 
  ListItem, 
  ListItemText, 
  Typography,
  IconButton,
  Divider,
  Box,
  CircularProgress
} from '@mui/material';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AppointDetails = ({ userId }) => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setLoading(true);
         
    
        const response = await axios.get(`http://localhost:5000/api/appointments/user/${userId}`);
               // Ensure we're working with an array
               const appointmentsData = Array.isArray(response.data) 
               ? response.data 
               : response.data?.data || [];
             
             const filteredAppointments = appointmentsData.filter(
               appt => appt && !['Cancelled', 'All Done'].includes(appt.status)
             );
        
             setAppointments(filteredAppointments);
     
      } catch (error) {
        console.error('Error fetching appointments:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [userId]);

  if (loading) return <CircularProgress />;

  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
        Your  Appointments
      </Typography>
      
      <List sx={{ width: '100%' }}>
        {appointments.map((appointment) => (
          <React.Fragment key={appointment._id}>
            <ListItem 
              secondaryAction={
                <IconButton edge="end" onClick={() => navigate(`/appointments/${appointment._id}`)}>
                  <ChevronRightIcon />
                </IconButton>
              }
              sx={{
                '&:hover': {
                  backgroundColor: 'action.hover',
                  cursor: 'pointer'
                }
              }}
              onClick={() => navigate(`/appointments/${appointment._id}`)}
            >
              <ListItemText
                primary={appointment.model}
                secondary={
                  <Box component="span" sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {appointment.services.map((service, i) => (
                      <Typography 
                        key={i} >
                        {service}
                      </Typography>
                    ))}
                  </Box>
                }
              />
            </ListItem>
            <Divider variant="inset" component="li" />
          </React.Fragment>
        ))}
      </List>
    </Box>
  );
};

export default AppointDetails;
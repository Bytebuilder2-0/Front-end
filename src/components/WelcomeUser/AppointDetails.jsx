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

//This component for display apppointments in dashboard if has

const AppointDetails = ({ userId }) => {

   const API_URL = `http://localhost:5000/api/appointments/user/${userId}`

  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setLoading(true);

        const response = await axios.get(API_URL);

        const appointmentsData = response.data.data;
             
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
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', fontSize:'22px'}}>
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
                   boxShadow: '0px 2px 4px rgba(0,0,0,0.1)',
                  backgroundColor: 'action.hover',
                  cursor: 'pointer'
                }
              }}
              onClick={() => navigate(`/appointments/${appointment._id}`)} 
              >
                

              <ListItemText
                primary={appointment.model}
                secondary={
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {appointment.services.map((service, i) => (
                      <Typography 
                        key={i} >
                        {service}..
                      </Typography>
                    ))}
                  </Box>
                }
              />
            </ListItem>
            <Divider  sx={{width:'50%'}} />
          </React.Fragment>
          
        ))}
        
      </List>
    </Box>
  );
};

export default AppointDetails;
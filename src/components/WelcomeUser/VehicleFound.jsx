import { Grid, Box, Typography, Button, useTheme, Stack } from '@mui/material';
import { Add as AddIcon, DirectionsCar as CarIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const VehicleFound = ({ vehicles }) => {
  const navigate = useNavigate();
  const theme = useTheme();

  return (
    <>
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {vehicles.map((vehicle) => (
          <Grid item key={vehicle._id}>
            <Box
              sx={{
             
                p: 3,
                border: `1px solid ${theme.palette.divider}`,
                borderRadius: '12px',
                minWidth: '200px',
                textAlign: 'center',
               
              }}
              onClick={() => navigate(`/vehicles/${vehicle._id}`)}
            >
              <Typography
                variant="subtitle1"
                sx={{
                  fontWeight: 600,
                  mb: 0.5,
                  
                }}
              >
                {vehicle.model}
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: theme.palette.text.secondary,
               
                }}
              >
                {vehicle.vehicleNumber}
              </Typography>
            </Box>
          </Grid>
        ))}
      </Grid>
      
      <Stack 
        direction={{ xs: 'column', sm: 'row' }} 
        spacing={2} 
        sx={{ 
          mt: 4,
          
        }}
      >
        {/* Contained Primary Button */}
        <Button
          variant="contained"
          onClick={() => navigate('/VehicleRegister')}
          startIcon={<AddIcon />}
          sx={{
            minWidth: '220px',
            fontSize: '0.9375rem',
            fontWeight: 600,
            py: 1.5,
            px: 4,
            borderRadius: '10px',
            backgroundColor: '#4CAF50',
            borderColor: '#4CAF50',
            color: '#FFFFFF',
            textTransform: 'none',
            boxShadow: theme.shadows[2],
            '&:hover': {
              backgroundColor: '#388E3C',
              boxShadow: theme.shadows[2],
              transform: 'translateY(-1px)'
            },
            transition: 'all 0.3s ease'
          }}
        >
          ADD NEW VEHICLE
        </Button>

        {/* Outlined Secondary Button */}
        <Button
          variant="outlined"
          onClick={() => navigate('/Vehicles')}
          startIcon={<CarIcon />}
          sx={{
            minWidth: '220px',
            fontSize: '0.9375rem',
            fontWeight: 600,
            py: 1.5,
            px: 4,
            borderRadius: '10px',
            borderColor: '#4CAF50',
            color: '#4CAF50',
            textTransform: 'none',
            '&:hover': {
              backgroundColor: '#C8E6C9',
              borderColor: '#388E3C',
              color: '#006400',
              boxShadow: theme.shadows[1],
              transform: 'translateY(-1px)'
            },
            transition: 'all 0.3s ease'
          }}
        >
          VIEW ALL VEHICLES
        </Button>
      </Stack>
    </>
  );
};

export default VehicleFound;
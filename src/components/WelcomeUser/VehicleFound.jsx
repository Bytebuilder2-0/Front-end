import { Grid, Box, Typography, Button, useTheme } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
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
                p: 4,
                border: '1px solid #e0e0e0',
                borderRadius: '8px',
                minWidth: '180px',
                textAlign: 'center',
                '&:hover': {
                  boxShadow: '0px 2px 4px rgba(0,0,0,0.1)',
                },
              }}
            >
              <Typography
                variant="subtitle1"
                sx={{
                  fontWeight: 'bold',
                  mb: 0.5,
                }}
              >
                {vehicle.model}
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: '#666',
                  fontSize: '0.875rem',
                }}
              >
                {vehicle.vehicleNumber}
              </Typography>
            </Box>
          </Grid>
        ))}
      </Grid>
      
      <Box sx={{  mt: 4 }}>
        <Button
        variant="contained"
        onClick={() => navigate('/VehicleRegister')}
        sx={{
          width: '200px',
          fontSize: '0.9375rem', // 15px
          fontWeight: 600,
          py: 1.5,
          px: 3,
          borderRadius: '10px',
          backgroundColor: '#51b672 ',
          color: theme.palette.success.contrastText,
          textTransform: 'none',
          boxShadow: 'none',
          '&:hover': {
            backgroundColor: theme.palette.success.dark,
            
          },
          transition: 'all 0.3s ease'
        }}
      >
        Add Vehicle
      </Button>
      </Box>
    </>
  );
};

export default VehicleFound;
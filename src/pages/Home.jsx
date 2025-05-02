import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Home = () => {
  const navigate = useNavigate();

  const handleAppointmentClick = () => {
    navigate('/appointments/new'); // Ensure this route is correctly handled in your router
  };

  return (
    <>
      <Box
  sx={{
    width: '100vw',
    minHeight: '100vh',
    backgroundImage: 'url(/assets/garagebg.jpeg)',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    overflowX: 'hidden',
  }}

      >
        <Navbar />
        <Box
          sx={{
            height: 'calc(100vh - 64px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            color: 'white',
            textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
          }}
        >
          <Typography variant="h2" component="h1" gutterBottom>
            Where Your Vehicle Meets Precision and Care
          </Typography>
          <Typography variant="h5" gutterBottom>
            Our Well Trained Technicians are Here to Provide You With The Best Service Possible.
          </Typography>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={handleAppointmentClick}
            sx={{ mt: 3, fontWeight: 'bold', px: 4, py: 1.5 }}
          >
            Make an Appointment
          </Button>
        </Box>
      </Box>
            {/* Additional Section Below Main Content */}
            <Box
        sx={{
          minHeight: '50vh',
          width: '100%',
          backgroundColor: '#f5f5f5',
          py: 6,
          px: 3,
          textAlign: 'center',
        }}
      >
        <Typography variant="h2" gutterBottom sx={{ fontWeight: 'bold' }}>
          We Provide Expert Services
        </Typography>
        <Typography variant="body1" sx={{ maxWidth: '800px', mx: 'auto', mb: 2 }}>
          At Garage24, we’re not just fixing vehicles — we’re building trust. With state-of-the-art tools,
          certified technicians, and a commitment to excellence, we provide unmatched auto care tailored
          to your needs.
        </Typography>
        <Box
  sx={{
    backgroundColor: '#ffffff',
    py: 6,
    px: 3,
    textAlign: 'center',
  }}
>
  <Typography variant="h2" gutterBottom sx={{ fontWeight: 'bold', color: '#333' }}>
    How It Works
  </Typography>
  <Typography variant="body1" sx={{ mb: 4, color: '#555' }}>
    These few steps will help return your car to a working condition
  </Typography>

  {/* Steps Section */}
  <Box
  sx={{
    backgroundColor: '#ffffff',
    display: 'flex',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: 4,
    textAlign: 'center', // Center align text inside boxes
  }}
>
  {/* Step 1 */}
  <Box sx={{ width: 200, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
    <Typography sx={{ fontWeight: 'bold', mt: 2 }}>Choose YOUR SERVICE</Typography>
    <img src="/assets/list2.avif" alt="Choose Service" style={{ width: '100%' }} />
  </Box>

  {/* Step 2 */}
  <Box sx={{ width: 200, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
    <Typography sx={{ fontWeight: 'bold', mt: 2 }}>Make an APPOINTMENT</Typography>
    <img src="/assets/shedule.png" alt="Make Appointment" style={{ width: '100%' }} />
  </Box>

  {/* Step 3 */}
  <Box sx={{ width: 200, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
    <Typography sx={{ fontWeight: 'bold', mt: 2, textAlign: 'center' }}>
      We’ll take YOUR CAR for repair
    </Typography>
    <img src="/assets/care2.avif" alt="Car Repair" style={{ width: '100%' }} />
  </Box>
</Box>

</Box>

        
      </Box>
      {/* Footer outside background container */}
      <Footer />
    </>
  );
};

export default Home;

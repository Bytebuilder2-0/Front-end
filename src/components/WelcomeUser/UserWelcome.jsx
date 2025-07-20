import React, { useState, useEffect } from "react";
import { Typography, Box, Divider, Paper, Skeleton, Alert, Fade } from "@mui/material";
import { styled } from "@mui/material/styles";
import { CarIcon, Calendar, Wrench } from "lucide-react";
import AppointDetails from "./AppointDetails";
import NoAppointment from "./NoAppointment";
import VehicleDetails from "./VehicleDetails";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";

const WelcomeContainer = styled(Box)(({ theme }) => ({
  backgroundColor: '#428BCA',
  borderRadius: theme.spacing(2),
  padding: theme.spacing(6),
  marginBottom: theme.spacing(4),
  color: 'white',
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    right: 0,
    width: '200px',
    height: '200px',
    background: 'rgba(255, 255, 255, 0.05)',
    borderRadius: '50%',
    transform: 'translate(50%, -50%)',
  }
}));

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: theme.spacing(2),
  backgroundColor: 'white',
  border: '1px solid #e5e7eb',
  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  }
}));

const IconWrapper = styled(Box)(({ theme }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '56px',
  height: '56px',
  borderRadius: '12px',
  marginRight: theme.spacing(3),
  flexShrink: 0,
}));

const SectionContainer = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(4),
}));

const LoadingSkeleton = () => (
  <Box sx={{ width: '100%' }}>
    <Skeleton 
      variant="rectangular" 
      width="100%" 
      height={180} 
      sx={{ 
        borderRadius: 2, 
        mb: 2,
        backgroundColor: '#f3f4f6'
      }} 
    />
    <Skeleton 
      variant="text" 
      width="75%" 
      height={32}
      sx={{ mb: 1, backgroundColor: '#f3f4f6' }}
    />
    <Skeleton 
      variant="text" 
      width="50%" 
      height={24}
      sx={{ backgroundColor: '#f3f4f6' }}
    />
  </Box>
);

const UserWelcome = () => {
  const { user, token } = useAuth();
  const [hasAppointments, setHasAppointments] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user || !user.id) return;

    const checkAppointments = async () => {
      try {
        setError(null);
        const API_URL = `http://localhost:5000/api/appointments/user/${user.id}`;

        const response = await axios.get(API_URL, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const validAppointments = response.data.data.filter(
          (appointment) => !["Cancelled", "Paid", "All done"].includes(appointment.status)
        );

        setHasAppointments(validAppointments.length > 0);
      } catch (err) {
        console.error("Error checking appointments:", err);
        setError("Unable to load appointments. Please try again later.");
        setHasAppointments(false);
      } finally {
        setLoading(false);
      }
    };

    checkAppointments();
  }, [user?.id, token]);

  if (!user || !user.id) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Alert 
          severity="warning" 
          sx={{ 
            borderRadius: 2,
            backgroundColor: '#fef3c7',
            border: '1px solid #f59e0b',
            color: '#92400e'
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 600 }}>Authentication Required</Typography>
          <Typography>Please log in to access your dashboard.</Typography>
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ 
      minHeight: "100vh",
      backgroundColor: "#f8fafc",
      p: { xs: 2, md: 4 }, 
      maxWidth: "1200px", 
      margin: "0 auto"
    }}>
      <Fade in timeout={600}>
        <WelcomeContainer>
          <Box sx={{ position: 'relative', zIndex: 1 }}>
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'flex-start', 
              mb: 4,
              flexDirection: { xs: 'column', md: 'row' },
              gap: { xs: 2, md: 0 }
            }}>
              <IconWrapper sx={{ 
                backgroundColor: 'rgba(255,255,255,0.15)',
                alignSelf: { xs: 'center', md: 'flex-start' }
              }}>
                <Wrench size={28} color="white" />
              </IconWrapper>
              <Box sx={{ 
                textAlign: { xs: 'center', md: 'left' },
                flex: 1
              }}>
                <Typography
                  variant="h2"
                  sx={{
                    fontWeight: 700,
                    letterSpacing: "-1px",
                    mb: 1,
                    fontSize: { xs: '2rem', md: '2.75rem' },
                    lineHeight: 1.2
                  }}
                >
                  Welcome to Garage24
                </Typography>
                <Typography
                  variant="h6"
                  sx={{
                    opacity: 0.95,
                    fontWeight: 400,
                    mb: 2,
                    fontSize: { xs: '1.1rem', md: '1.25rem' }
                  }}
                >
                  Your trusted automotive service partner
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    opacity: 0.9,
                    fontSize: { xs: '16px', md: '18px' },
                    fontWeight: 400,
                    lineHeight: 1.6,
                    maxWidth: '600px',
                    margin: { xs: '0 auto', md: '0' }
                  }}
                >
                  Professional automotive care with cutting-edge technology and expert service.
                  We keep your vehicles running at peak performance.
                </Typography>
              </Box>
            </Box>
          </Box>
        </WelcomeContainer>
      </Fade>

      {error && (
        <Alert 
          severity="error" 
          sx={{ 
            mb: 3, 
            borderRadius: 2,
            backgroundColor: '#fef2f2',
            border: '1px solid #f87171',
            color: '#991b1b'
          }}
        >
          {error}
        </Alert>
      )}

      <SectionContainer>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <IconWrapper sx={{ backgroundColor: '#459328' }}>
            <Calendar size={24} color="white" />
          </IconWrapper>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 600,
              color: '#33383E',
              letterSpacing: "-0.5px",
              fontSize: { xs: '1.5rem', md: '2rem' }
            }}
          >
            Your Appointments
          </Typography>
        </Box>

        <Fade in={!loading} timeout={800}>
          <StyledPaper elevation={0}>
            {loading ? (
              <LoadingSkeleton />
            ) : hasAppointments ? (
              <AppointDetails userId={user.id} />
            ) : (
              <NoAppointment userId={user.id} />
            )}
          </StyledPaper>
        </Fade>
      </SectionContainer>

      <Divider 
        sx={{ 
          my: 5, 
          borderColor: '#e5e7eb',
          borderWidth: '1px'
        }} 
      />

      <SectionContainer>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <IconWrapper sx={{ backgroundColor: '#428BCA' }}>
            <CarIcon size={24} color="white" />
          </IconWrapper>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 600,
              color: '#33383E',
              letterSpacing: "-0.5px",
              fontSize: { xs: '1.5rem', md: '2rem' }
            }}
          >
            Your Vehicles
          </Typography>
        </Box>

        <Fade in timeout={1000}>
          <StyledPaper elevation={0}>
            <VehicleDetails userId={user.id} />
          </StyledPaper>
        </Fade>
      </SectionContainer>
    </Box>
  );
};

export default UserWelcome;
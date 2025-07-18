import React from "react";
import {
  Box,
  Typography,
  Stack,
  Divider,
  Grid,
} from "@mui/material";
import {
  CalendarToday,
  DirectionsCar,
  CarRepair,
} from "@mui/icons-material";
import { format } from 'date-fns';

const AppHistory = ({ appointment }) => {
  if (!appointment) return null;

  return (
    <>
      <Divider sx={{ my: 3 }} />

      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={3}>
          <Stack direction="row" alignItems="center" spacing={1.5}>
            <CalendarToday
              fontSize="small"
              sx={{ color: "text.secondary", width: 20 }}
            />
            <Box>
              <Typography variant="caption" color="text.secondary">
                Service Date
              </Typography>
              <Typography variant="body2" fontWeight={500}>
                {appointment.preferredDate
                  ? format(new Date(appointment.preferredDate), 'PP')
                  : 'N/A'}
              </Typography>
            </Box>
          </Stack>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Stack direction="row" alignItems="center" spacing={1.5}>
            <DirectionsCar
              fontSize="small"
              sx={{ color: "text.secondary", width: 20 }}
            />
            <Box>
              <Typography variant="caption" color="text.secondary">
                Vehicle Number
              </Typography>
              <Typography variant="body2" fontWeight={500}>
                {appointment.vehicleNumber || 'Not specified'}
              </Typography>
            </Box>
          </Stack>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Stack direction="row" alignItems="center" spacing={1.5}>
            <CarRepair
              fontSize="small"
              sx={{ color: "text.secondary", width: 20 }}
            />
            <Box>
              <Typography variant="caption" color="text.secondary">
                Services
              </Typography>
              <Typography variant="body2" fontWeight={500}>
                {appointment.services?.slice(0, 2).join(', ') || 'General Service'}
                {appointment.services?.length > 2 && ' + more'}
              </Typography>
            </Box>
          </Stack>
        </Grid>
      </Grid>
    </>
  );
};

export default AppHistory;

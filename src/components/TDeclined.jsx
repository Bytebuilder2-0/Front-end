import React, { useState, useEffect } from "react";
import axios from "axios";
import API_BASE_URL from "../config/api";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Container,
  Box,
  Typography,
  TextField,
} from "@mui/material";
import { useAuth } from "../context/AuthContext";

const API_URL = `${API_BASE_URL}/appointments`;

function TDeclined() {
  const { user, token } = useAuth(); //Ensure user and token are retrieved properly
  const [appointments, setAppointments] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token || !user) return; //  Block fetching if user is not authenticated

    axios
      .get(API_URL, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setAppointments(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching appointments:", error);
        setLoading(false);
      });
  }, [token, user]);

  // Filter by status and technician match
  const filteredAppointments = appointments
    .filter(
      (app) =>
        app.status === "Reject2" &&
        app.tech?._id?.toString() === user?.technicianId
    )
    .filter((appointment) =>
      (appointment.vehicleId || "")
        .toString()
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    );

  return (
    <Container>
      <h2>Declined Works</h2>

      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Typography variant="h5" gutterBottom>
          Appointments
        </Typography>
        <TextField
          label="Search by Vehicle ID"
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </Box>

      <TableContainer
        component={Paper}
        sx={{
          marginTop: 2,
          overflow: "auto",
          maxHeight: 400,
          borderRadius: 2,
          boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.05)",
        }}
      >
        <Table stickyHeader>
          <TableHead>
            <TableRow
              sx={{
                "& th": { fontWeight: "bold", backgroundColor: "#f5f5f5" },
              }}
            >
              <TableCell>Vehicle ID</TableCell>
              <TableCell>Vehicle Number</TableCell>
              <TableCell>Service Description</TableCell>
              <TableCell>Decline Reason</TableCell>
              <TableCell>Exp.Date</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                  Loading...
                </TableCell>
              </TableRow>
            ) : filteredAppointments.length > 0 ? (
              filteredAppointments.map((appointment) => (
                <TableRow
                  key={appointment._id}
                  sx={{
                    "&:nth-of-type(odd)": { backgroundColor: "#fafafa" },
                    "&:hover": { backgroundColor: "#e0e0e0" },
                  }}
                >
                  <TableCell>{appointment.vehicleId}</TableCell>
                  <TableCell>{appointment.vehicleNumber}</TableCell>
                  <TableCell>{appointment.issue}</TableCell>
                  <TableCell>{appointment.reason}</TableCell>
                  <TableCell>
                    {new Date(
                      appointment.expectedDeliveryDate
                    ).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                  No declined appointments found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
}

export default TDeclined;

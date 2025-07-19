import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Button,
  CircularProgress,
  Container,
  Stack,
} from "@mui/material";
import axios from "axios";

const AccountRequest = () => {
  const [pendingUsers, setPendingUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(null);
  const [error, setError] = useState("");

  const fetchPendingUsers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/auth/pending-users", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setPendingUsers(res.data);
    } catch (err) {
      console.error(err);
      setError("Failed to load pending users.");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (userId) => {
    try {
      setProcessing(userId);
      const token = localStorage.getItem("token");
      await axios.post(`http://localhost:5000/api/auth/approve-user/${userId}`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setPendingUsers(pendingUsers.filter((user) => user._id !== userId));
    } catch (err) {
      console.error(err);
      alert("Approval failed. Please try again.");
    } finally {
      setProcessing(null);
    }
  };

  const handleReject = async (userId) => {
    try {
      setProcessing(userId);
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/auth/reject-user/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setPendingUsers(pendingUsers.filter((user) => user._id !== userId));
    } catch (err) {
      console.error(err);
      alert("Rejection failed. Please try again.");
    } finally {
      setProcessing(null);
    }
  };

  useEffect(() => {
    fetchPendingUsers();
  }, []);

  return (
    <Container maxWidth="md" sx={{ mt: 5 }}>
      <Typography variant="h4" gutterBottom>
        Pending Technician & Supervisor Requests ({pendingUsers.length})
      </Typography>

      {loading ? (
        <Box textAlign="center" mt={4}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Typography color="error">{error}</Typography>
      ) : pendingUsers.length === 0 ? (
        <Typography>No pending requests.</Typography>
      ) : (
        <Paper sx={{ mt: 3 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Full Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Requested At</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {pendingUsers.map((user) => (
                <TableRow key={user._id}>
                  <TableCell>{user.fullName}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell>{new Date(user.createdAt).toLocaleString()}</TableCell>
                  <TableCell align="center">
                    <Stack direction="row" spacing={1} justifyContent="center">
                      <Button
                        variant="contained"
                        color="success"
                        size="small"
                        onClick={() => handleApprove(user._id)}
                        disabled={processing === user._id}
                      >
                        {processing === user._id ? "Processing..." : "Approve"}
                      </Button>
                      <Button
                        variant="outlined"
                        color="error"
                        size="small"
                        onClick={() => handleReject(user._id)}
                        disabled={processing === user._id}
                      >
                        {processing === user._id ? "Processing..." : "Reject"}
                      </Button>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      )}
    </Container>
  );
};

export default AccountRequest;

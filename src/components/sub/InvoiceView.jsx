import React, { useState, useRef } from "react";
import ReceiptIcon from "@mui/icons-material/Receipt";
import axios from "axios";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Box,
  Typography,
  Grid,
  Divider,
} from "@mui/material";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

import API_BASE_URL from "../../config/api";
const baseURL = API_BASE_URL.replace("/api", "");

function InvoiceView({ appointment }) {
  const [open, setOpen] = useState(false);
  const [budget, setBudget] = useState(null);
  const [supervisor, setSupervisor] = useState(null); //store supervisor separately
  const [isProcessing, setIsProcessing] = useState(false);
  const invoiceRef = useRef(null);

  const fetchBudget = async () => {
    try {
      //  1) Fetch Budget
      const response = await axios.get(
        `${baseURL}/budget/${appointment._id}/view`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setBudget(response.data || {});

      //  2) Fetch Supervisor details separately
      if (appointment.sconfirmedBy) {
        try {
          const supRes = await axios.get(
            `${baseURL}/supervisor/${appointment.sconfirmedBy}`,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );
          setSupervisor(supRes.data);
        } catch (err) {
          console.error("Error fetching supervisor:", err);
          setSupervisor(null);
        }
      }

      setOpen(true);
    } catch (error) {
      console.error("Error fetching budget:", error);
      setBudget({ amountAllocations: [] });
    }
  };

  const handleDownloadInvoice = async () => {
    if (!invoiceRef.current) return;
    setIsProcessing(true);

    try {
      const pdf = new jsPDF("p", "mm", "a4");
      const canvas = await html2canvas(invoiceRef.current, {
        scale: 2,
        useCORS: true,
      });
      const imgData = canvas.toDataURL("image/png");

      const imgWidth = 190;
      const pageHeight = 250;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 10;

      pdf.addImage(imgData, "PNG", 10, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft > 0) {
        pdf.addPage();
        position = heightLeft > pageHeight ? 10 : heightLeft - imgHeight;
        pdf.addImage(imgData, "PNG", 10, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`Invoice_${appointment._id}.pdf`);
    } catch (err) {
      console.error("Error generating PDF:", err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <>
      <ReceiptIcon
        fontSize="large"
        style={{ cursor: "pointer", color: "#33383E" }}
        onClick={fetchBudget}
      />

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        fullWidth
        maxWidth="md"
      >
        <div ref={invoiceRef}>
          {/* Header */}
          <DialogTitle
            sx={{
              textAlign: "center",
              pb: 1,
              pt: 3,
              backgroundColor: "#f8f9fa",
              borderBottom: "1px solid #e0e0e0",
            }}
          >
            <Box
              display="flex"
              alignItems="center"
              justifyContent="center"
              gap={2}
            >
              <img
                src="/assets/garage.jpg"
                alt="Garage24 Logo"
                style={{
                  maxWidth: "120px",
                  height: "auto",
                  borderRadius: "6px",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                }}
              />
              <Typography
                variant="h4"
                sx={{
                  fontWeight: "bold",
                  color: "#33383E",
                  letterSpacing: "0.5px",
                }}
              >
                Invoice
              </Typography>
            </Box>
          </DialogTitle>

          {/* Business & Invoice Info */}
          <Box sx={{ px: 4, pt: 3, pb: 1, bgcolor: "#fff" }}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} sm={6}>
                <Typography
                  variant="h5"
                  sx={{ fontWeight: "bold", color: "#33383E", mb: 1 }}
                >
                  Garage24
                </Typography>
                <Typography variant="body2" color="#33383E">
                  <strong>Tel:</strong> 0770188325
                </Typography>
                <Typography variant="body2" color="#33383E">
                  <strong>Address:</strong> 123 Main Street, Colombo, Sri Lanka
                </Typography>
              </Grid>
              <Grid
                item
                xs={12}
                sm={6}
                sx={{ textAlign: { xs: "center", sm: "right" } }}
              >
                {budget?._id && (
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: "bold", color: "#428BCA", mb: 1 }}
                  >
                    Invoice #{budget._id}
                  </Typography>
                )}
                <Typography variant="body2" color="#33383E">
                  Date: {new Date().toLocaleDateString()} &nbsp; | Time:{" "}
                  {new Date().toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </Typography>
              </Grid>
            </Grid>
          </Box>

          {/* Customer & Supervisor Details */}
          <Box
            sx={{
              px: 4,
              pt: 2,
              pb: 2,
              backgroundColor: "#f8f9fa",
              borderTop: "1px solid #e0e0e0",
              borderBottom: "1px solid #e0e0e0",
              mt: 2,
            }}
          >
            <Grid container spacing={2}>
              {/* Customer */}
              <Grid item xs={12} sm={6}>
                <Typography
                  variant="subtitle1"
                  sx={{ fontWeight: "bold", color: "#33383E" }}
                >
                  Customer Details:
                </Typography>
                <Typography variant="body2" color="#33383E">
                  Name: {appointment.userId?.name || "N/A"}
                </Typography>
                <Typography variant="body2" color="#33383E">
                  Email: {appointment.userId?.email || "N/A"}
                </Typography>
                <Typography variant="body2" color="#33383E">
                  Contact: {appointment.contactNumber || "N/A"}
                </Typography>
                <Typography variant="body2" color="#33383E">
                  Vehicle Number: {appointment.vehicleNumber}
                </Typography>
                <Typography variant="body2" color="#33383E">
                  Model: {appointment.model}
                </Typography>
              </Grid>

              {/* Supervisor */}
              <Grid item xs={12} sm={6}>
                <Typography
                  variant="subtitle1"
                  sx={{ fontWeight: "bold", color: "#33383E" }}
                >
                  Supervised By:
                </Typography>
                <Typography variant="body2" color="#33383E">
                  Username: {supervisor?.userName || "N/A"}
                </Typography>
                {/* <Typography variant="body2" color="#33383E">
									Email: {supervisor?.email || "N/A"}
								</Typography> */}
                <Typography variant="body2" color="#33383E">
                  Supervisor ID: {supervisor?._id || "N/A"}
                </Typography>
              </Grid>
            </Grid>
          </Box>

          <Divider sx={{ my: 2 }} />

          {/* Table Section */}
          <DialogContent>
            {budget ? (
              <TableContainer
                component={Paper}
                elevation={2}
                sx={{ borderRadius: "8px", overflow: "hidden" }}
              >
                <Table>
                  <TableHead sx={{ backgroundColor: "#459328" }}>
                    <TableRow>
                      <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
                        Step
                      </TableCell>
                      <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
                        Description
                      </TableCell>
                      <TableCell
                        align="right"
                        sx={{ color: "#fff", fontWeight: "bold" }}
                      >
                        Amount (LKR)
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {(budget.amountAllocations || []).map((item, index) => (
                      <TableRow
                        key={index}
                        sx={{
                          "&:nth-of-type(odd)": { backgroundColor: "#f9f9f9" },
                        }}
                      >
                        <TableCell sx={{ color: "#33383E" }}>
                          {item.step}
                        </TableCell>
                        <TableCell sx={{ color: "#33383E" }}>
                          {item.des}
                        </TableCell>
                        <TableCell align="right" sx={{ color: "#33383E" }}>
                          LKR {item.amount}
                        </TableCell>
                      </TableRow>
                    ))}
                    <TableRow sx={{ backgroundColor: "#e8f5e9" }}>
                      <TableCell
                        colSpan={2}
                        sx={{ fontWeight: "bold", color: "#33383E" }}
                      >
                        Total
                      </TableCell>
                      <TableCell
                        align="right"
                        sx={{ fontWeight: "bold", color: "#459328" }}
                      >
                        LKR {budget.totalAmount || 0}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <Typography sx={{ textAlign: "center", mt: 2 }} color="#33383E">
                Loading...
              </Typography>
            )}
          </DialogContent>
          <Box sx={{ px: 4, pb: 3, pt: 2 }}>
            <Typography variant="body2" color="#555">
              <strong>Note:</strong> This is a system-generated invoice and does
              not require a physical signature. Please contact Garage24 for any
              discrepancies.
            </Typography>
          </Box>
          <Box
            sx={{
              px: 4,
              pt: 3,
              pb: 3,
              backgroundColor: "#f8f9fa",
              borderRadius: "6px",
              mt: 3,
            }}
          >
            <Typography
              variant="body2"
              sx={{ fontStyle: "italic", color: "#555", textAlign: "center" }}
            >
              Thank you for choosing Garage24!
            </Typography>
          </Box>
        </div>

        {/* Buttons */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            gap: 2,
            p: 2,
            borderTop: "1px solid #e0e0e0",
            bgcolor: "#f8f9fa",
          }}
        >
          <Button
            onClick={() => setOpen(false)}
            color="error"
            variant="contained"
            sx={{
              width: "100px",
              fontWeight: "bold",
              textTransform: "none",
              borderRadius: "6px",
            }}
          >
            Close
          </Button>
          <Button
            onClick={handleDownloadInvoice}
            color="primary"
            variant="contained"
            disabled={isProcessing}
            sx={{
              width: "180px",
              fontWeight: "bold",
              textTransform: "none",
              borderRadius: "6px",
              backgroundColor: "#459328",
              "&:hover": { backgroundColor: "#357a23" },
            }}
          >
            {isProcessing ? "Generating..." : "Download Invoice"}
          </Button>
        </Box>
      </Dialog>
    </>
  );
}

export default InvoiceView;

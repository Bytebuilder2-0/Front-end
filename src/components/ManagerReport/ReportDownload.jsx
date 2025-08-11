import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
  IconButton,
} from "@mui/material";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import { useTheme } from "@mui/material/styles";
import { Close } from "@mui/icons-material";

const ReportDownload = ({ reportRef, counts, isSmallScreen }) => {
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const [fileName, setFileName] = useState("Garage_Report");
  const [error, setError] = useState("");
  const [pdfPreview, setPdfPreview] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const generatePDF = async (forPreview = true) => {
    setIsProcessing(true);
    try {
      const input = reportRef.current;
      const pdf = new jsPDF("p", "mm", "a4");

      // Add header information
      const currentDate = new Date();
      const formattedDate = currentDate.toLocaleString();
      pdf.setFontSize(20);
      pdf.text("Garage Report", 105, 20, { align: "center" });
      pdf.setFontSize(12);
      pdf.text(`Generated on: ${formattedDate}`, 105, 30, { align: "center" });

      // Convert content to image
      const canvas = await html2canvas(input, {
        scale: 2,
        useCORS: true,
        scrollX: 0,
        scrollY: 0,
        windowWidth: document.documentElement.offsetWidth,
        windowHeight: document.documentElement.offsetHeight,
      });

      // Calculate image dimensions
      const imgData = canvas.toDataURL("image/png");
      const imgWidth = 190;
      const pageHeight = 250;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      // Add image to PDF
      let heightLeft = imgHeight;
      let position = 40;
      pdf.addImage(imgData, "PNG", 10, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      // Handle multi-page PDF
      while (heightLeft > 0) {
        pdf.addPage();
        position = heightLeft > pageHeight ? 10 : heightLeft - imgHeight;
        pdf.addImage(imgData, "PNG", 10, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      if (forPreview) {
        setPdfPreview(canvas.toDataURL("image/png"));
      } else {
        pdf.save(`${fileName}.pdf`);
        setOpen(false);
      }
    } catch (error) {
      console.error("Error generating PDF:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClickOpen = () => {
    setOpen(true);
    setError("");
    setPdfPreview(null);
  };

  const handleClose = () => {
    setOpen(false);
    setError("");
    setPdfPreview(null);
  };

  const handleDownload = () => {
    if (fileName.trim() === "") {
      setError("Please enter a valid file name.");
      return;
    }
    generatePDF(false); // Direct download
  };

  const handlePreview = () => {
    if (fileName.trim() === "") {
      setError("Please enter a valid file name.");
      return;
    }
    generatePDF(true); // Generate preview
  };

  return (
    <>
      {!open && (
        <Button
          className="download-report-button"
          variant="contained"
          color="primary"
          onClick={handleClickOpen}
          size={isSmallScreen ? "small" : "medium"}
          sx={{
            mt: 2,
            mb: 2,
            backgroundColor: theme.palette.success.main,
            "&:hover": {
              backgroundColor: theme.palette.success.dark,
            },
          }}
          disabled={isProcessing}
        >
          Download Report as PDF
        </Button>
      )}

      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
        maxWidth="md"
        fullWidth={true}
        PaperProps={{
          style: {
            minHeight: pdfPreview ? "80vh" : "300px",
          },
        }}
      >
        <DialogTitle id="form-dialog-title">
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span>Enter File Name</span>
            <IconButton onClick={handleClose} size="small">
              <Close />
            </IconButton>
          </div>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="textSecondary" gutterBottom>
            Enter a file name for your report (optional). The default is "Garage
            Report".
          </Typography>
          <TextField
            autoFocus
            margin="dense"
            label="File Name"
            fullWidth
            value={fileName}
            onChange={(e) => setFileName(e.target.value)}
            helperText="File name cannot be empty."
            error={!!error}
          />
          {error && (
            <Typography color="error" variant="body2">
              {error}
            </Typography>
          )}

          {pdfPreview && (
            <div style={{ marginTop: 20 }}>
              <Typography variant="h6" gutterBottom>
                PDF Preview:
              </Typography>
              <div
                style={{
                  maxHeight: "70vh",
                  overflowY: "auto",
                  border: "1px solid #ddd",
                  marginBottom: "15px",
                }}
              >
                <img
                  src={pdfPreview}
                  alt="PDF Preview"
                  style={{
                    width: "100%",
                    height: "auto",
                    objectFit: "contain",
                  }}
                />
              </div>
            </div>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">
            Cancel
          </Button>
          {!pdfPreview ? (
            <>
              <Button
                onClick={handleDownload}
                color="primary"
                disabled={isProcessing}
              >
                {isProcessing ? "Downloading..." : "Download Now"}
              </Button>
              <Button
                onClick={handlePreview}
                color="primary"
                disabled={isProcessing}
              >
                Preview PDF
              </Button>
            </>
          ) : (
            <Button
              onClick={handleDownload}
              color="primary"
              disabled={isProcessing}
            >
              Download PDF
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ReportDownload;

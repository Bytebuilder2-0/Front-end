import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import {
  Button,
  Card,
  CardContent,
  Typography,
  Grid,
  Box,
  CircularProgress,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import ReportCharts from "./ReportCharts";
import ReportTables from "./ReportTables";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import { jwtDecode } from "jwt-decode";

const baseURL = "http://localhost:5000/api";

const token = localStorage.getItem("token");

let decoded = null;
if (token) {
  try {
    decoded = jwtDecode(token);
    console.log(decoded.id); // optional
  } catch (err) {
    console.error("Invalid token:", err);
  }
}

// 👉 Handy config object you can reuse
const authConfig = {
  headers: {
    Authorization: `Bearer ${token}`,
  },
};

const ReportMain = () => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const [counts, setCounts] = useState({
    total: 0,
    pending: 0,
    confirmed: 0,
    checking: 0,
    cancelled: 0,
    rejected: 0,
    accepted: 0,
    inProgress: 0,
    taskDone: 0,
    paid: 0,
    waiting: 0,
  });

  const [technicianData, setTechnicianData] = useState([]);
  const [departmentStatusData, setDepartmentStatusData] = useState([]);
  const [showReport, setShowReport] = useState(false);
  const [loading, setLoading] = useState(false);
  const [pdfLoading, setPdfLoading] = useState(false);
  const reportRef = useRef(null);

  useEffect(() => {
    if (showReport) {
      const fetchCounts = async () => {
        setLoading(true);
        try {
          const [statusResponse, technicianResponse, departmentStatusResponse] =
            await Promise.all([
              axios.get(`${baseURL}/appointments/statusCountsc`, authConfig),
              axios.get(
                `${baseURL}/appointments/statusCountscheck`,
                authConfig
              ),
              axios.get(
                `${baseURL}/appointments/departmentStatusData`,
                authConfig
              ),
            ]);

          setCounts(statusResponse.data);
          setTechnicianData(technicianResponse.data.technicianAppointments);
          setDepartmentStatusData(departmentStatusResponse.data);
        } catch (error) {
          console.error("Error fetching data:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchCounts();
    }
  }, [showReport]);

  const handleViewReport = () => {
    setShowReport(true);
  };

  const generatePDF = async () => {
    if (!reportRef.current) return;

    setPdfLoading(true);
    try {
      // Create a new PDF with landscape orientation
      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "mm",
      });

      const element = reportRef.current;

      // Hide all duplicate chart canvases
      const charts = element.querySelectorAll(".chart-container");
      charts.forEach((chart) => {
        const canvases = chart.querySelectorAll("canvas");
        canvases.forEach((canvas, index) => {
          if (index > 0) canvas.style.display = "none";
        });
      });

      // Get the total height of the content
      const totalHeight = element.scrollHeight;

      // PDF page dimensions (A4 landscape)
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      // Margins (10mm on each side)
      const margin = 10;
      const contentWidth = pdfWidth - margin * 2;

      // Calculate scale to fit content width
      const scale = contentWidth / element.scrollWidth;

      // Calculate how much content fits on one page (in pixels)
      const pageContentHeight = (pdfHeight - margin * 2) / scale;

      let position = 0;
      let pageNum = 1;

      // First render pass to ensure all elements are loaded
      await html2canvas(element, {
        scrollY: 0,
        height: totalHeight,
        windowHeight: totalHeight,
        scale: 1,
        useCORS: true,
        backgroundColor: theme.palette.background.default,
        logging: true,
        allowTaint: true,
        onclone: (clonedDoc) => {
          // Ensure all elements are visible for capture
          clonedDoc.getElementById("report-content").style.overflow = "visible";

          // Force all tables to be fully expanded
          clonedDoc.querySelectorAll("table").forEach((table) => {
            table.style.width = "100%";
            table.style.overflow = "visible";
          });

          // Hide duplicate chart canvases
          clonedDoc.querySelectorAll(".chart-container").forEach((chart) => {
            const canvases = chart.querySelectorAll("canvas");
            canvases.forEach((canvas, index) => {
              if (index > 0) canvas.style.display = "none";
            });
          });
        },
      });

      // Now capture page by page
      while (position < totalHeight) {
        if (pageNum > 1) {
          pdf.addPage([pdfWidth, pdfHeight], "landscape");
        }

        // Calculate the height to capture for this page
        const captureHeight = Math.min(
          pageContentHeight,
          totalHeight - position
        );

        const canvas = await html2canvas(element, {
          scrollY: -position,
          height: captureHeight,
          windowHeight: captureHeight,
          scale: scale * 2, // Higher quality
          useCORS: true,
          backgroundColor: theme.palette.background.default,
          logging: true,
          allowTaint: true,
          ignoreElements: (el) => {
            // Skip duplicate canvas elements and hidden elements
            return (
              (el.tagName === "CANVAS" && el.style.display === "none") ||
              el.classList.contains("MuiDataGrid-main")
            );
          },
          onclone: (clonedDoc) => {
            // Ensure tables are fully expanded
            clonedDoc.querySelectorAll("table").forEach((table) => {
              table.style.width = "100%";
              table.style.overflow = "visible";
            });
          },
        });

        const imgData = canvas.toDataURL("image/jpeg", 0.95);

        // Calculate image dimensions to maintain aspect ratio
        const imgWidth = contentWidth;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        // Add image to PDF
        pdf.addImage(imgData, "JPEG", margin, margin, imgWidth, imgHeight);

        // Add footer with page number
        pdf.setFontSize(10);
        pdf.setTextColor(100);
        pdf.text(
          `Page ${pageNum}`,
          pdfWidth - margin - 10,
          pdfHeight - margin / 2
        );

        position += pageContentHeight;
        pageNum++;
      }

      // Add header to first page
      pdf.setPage(1);
      pdf.setFontSize(18);
      pdf.setTextColor(40);
      pdf.text("Appointment Report", pdfWidth / 2, margin + 5, {
        align: "center",
      });

      pdf.setFontSize(12);
      pdf.text(
        `Generated on: ${new Date().toLocaleString()}`,
        pdfWidth / 2,
        margin + 10,
        { align: "center" }
      );

      // Save the PDF
      pdf.save("appointment_report.pdf");
    } catch (error) {
      console.error("Error generating PDF:", error);
    } finally {
      setPdfLoading(false);
    }
  };

  const workingAppointmentsCount =
    counts.confirmed +
    counts.inProgress +
    counts.waiting +
    counts.accepted +
    counts.rejected;
  const completedCount = counts.taskDone + counts.paid;
  const cancelledRejectedCount = counts.cancelled + counts.rejected;

  return (
    <Box sx={{ p: { xs: 1, sm: 2, md: 3 }, overflowX: "hidden" }}>
      {!showReport && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "50vh",
          }}
        >
          <Button
            variant="contained"
            color="primary"
            onClick={handleViewReport}
            size="large"
            sx={{
              px: { xs: 3, sm: 4 },
              py: { xs: 1.5, sm: 2 },
              fontSize: { xs: "0.9rem", sm: "1.1rem" },
              fontWeight: "bold",
              borderRadius: "10px",
              boxShadow: 3,
              "&:hover": {
                boxShadow: 6,
                transform: "translateY(-2px)",
              },
              transition: "all 0.3s ease",
            }}
          >
            Generate Appointment Report
          </Button>
        </Box>
      )}

      {showReport && (
        <>
          <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
            <Button
              variant="contained"
              color="secondary"
              onClick={generatePDF}
              disabled={pdfLoading || loading}
              startIcon={
                pdfLoading ? (
                  <CircularProgress size={20} color="inherit" />
                ) : null
              }
              sx={{
                px: { xs: 2, sm: 3 },
                py: { xs: 1, sm: 1.5 },
                fontSize: { xs: "0.8rem", sm: "0.9rem" },
                fontWeight: "bold",
                borderRadius: "8px",
                boxShadow: 2,
                "&:hover": {
                  boxShadow: 4,
                  transform: "translateY(-1px)",
                },
                transition: "all 0.3s ease",
              }}
            >
              {pdfLoading ? "Generating PDF..." : "Download PDF Report"}
            </Button>
          </Box>

          <div
            ref={reportRef}
            id="report-content"
            style={{
              background: theme.palette.background.default,
              overflow: "visible",
            }}
          >
            {loading ? (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  minHeight: "50vh",
                }}
              >
                <CircularProgress size={60} thickness={4} />
              </Box>
            ) : (
              <Grid container spacing={isSmallScreen ? 1 : 2}>
                <Grid item xs={12}>
                  <Grid container spacing={isSmallScreen ? 1 : 2}>
                    <Grid item xs={12} sm={6} md={3}>
                      <Card
                        sx={{
                          boxShadow: 3,
                          background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                          color: theme.palette.primary.contrastText,
                          height: "100%",
                          minHeight: isSmallScreen ? "120px" : "auto",
                        }}
                      >
                        <CardContent sx={{ p: isSmallScreen ? 1 : 2 }}>
                          <Typography
                            variant="h6"
                            gutterBottom
                            fontSize={isSmallScreen ? "0.75rem" : "1rem"}
                          >
                            Total Appointments
                          </Typography>
                          <Typography
                            variant="h3"
                            fontWeight="bold"
                            fontSize={isSmallScreen ? "1.5rem" : "2.4rem"}
                          >
                            {counts.total}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <Card
                        sx={{
                          boxShadow: 3,
                          background: `linear-gradient(135deg, ${theme.palette.success.main}, ${theme.palette.success.dark})`,
                          color: theme.palette.success.contrastText,
                          height: "100%",
                          minHeight: isSmallScreen ? "120px" : "auto",
                        }}
                      >
                        <CardContent sx={{ p: isSmallScreen ? 1 : 2 }}>
                          <Typography
                            variant="h6"
                            gutterBottom
                            fontSize={isSmallScreen ? "0.75rem" : "1rem"}
                          >
                            Completed
                          </Typography>
                          <Typography
                            variant="h3"
                            fontWeight="bold"
                            fontSize={isSmallScreen ? "1.5rem" : "2.4rem"}
                          >
                            {completedCount}
                          </Typography>
                          <Typography
                            variant="caption"
                            sx={{
                              opacity: 0.8,
                              display: "block",
                              mt: 1,
                              fontSize: isSmallScreen ? "0.6rem" : "0.8rem",
                            }}
                          >
                            (Task Done: {counts.taskDone}, Paid: {counts.paid})
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <Card
                        sx={{
                          boxShadow: 3,
                          background: `linear-gradient(135deg, ${theme.palette.info.main}, ${theme.palette.info.dark})`,
                          color: theme.palette.info.contrastText,
                          height: "100%",
                          minHeight: isSmallScreen ? "120px" : "auto",
                          position: "relative",
                          overflow: "hidden",
                          "&:before": {
                            content: '""',
                            position: "absolute",
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            background:
                              "linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0))",
                          },
                        }}
                      >
                        <CardContent sx={{ p: isSmallScreen ? 1 : 2 }}>
                          <Typography
                            variant="h6"
                            gutterBottom
                            fontSize={isSmallScreen ? "0.75rem" : "1rem"}
                          >
                            Working Appointments
                          </Typography>
                          <Typography
                            variant="h3"
                            fontWeight="bold"
                            fontSize={isSmallScreen ? "1.5rem" : "2.4rem"}
                          >
                            {workingAppointmentsCount}
                          </Typography>
                          <Typography
                            variant="caption"
                            sx={{
                              opacity: 0.8,
                              display: "block",
                              mt: 1,
                              fontSize: isSmallScreen ? "0.6rem" : "0.8rem",
                            }}
                          >
                            (Confirmed: {counts.confirmed}, In Progress:{" "}
                            {counts.inProgress}, Accepted: {counts.accepted},
                            Waiting: {counts.waiting}, Rejected:{" "}
                            {counts.rejected})
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <Card
                        sx={{
                          boxShadow: 3,
                          background: `linear-gradient(135deg, ${theme.palette.error.main}, ${theme.palette.error.dark})`,
                          color: theme.palette.error.contrastText,
                          height: "100%",
                          minHeight: isSmallScreen ? "120px" : "auto",
                        }}
                      >
                        <CardContent sx={{ p: isSmallScreen ? 1 : 2 }}>
                          <Typography
                            variant="h6"
                            gutterBottom
                            fontSize={isSmallScreen ? "0.75rem" : "1rem"}
                          >
                            Cancelled/Rejected
                          </Typography>
                          <Typography
                            variant="h3"
                            fontWeight="bold"
                            fontSize={isSmallScreen ? "1.5rem" : "2.4rem"}
                          >
                            {cancelledRejectedCount}
                          </Typography>
                          <Typography
                            variant="caption"
                            sx={{
                              opacity: 0.8,
                              display: "block",
                              mt: 1,
                              fontSize: isSmallScreen ? "0.6rem" : "0.8rem",
                            }}
                          >
                            (Cancelled: {counts.cancelled}, Rejected:{" "}
                            {counts.rejected})
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  </Grid>
                </Grid>

                <ReportCharts
                  counts={counts}
                  technicianData={technicianData}
                  departmentStatusData={departmentStatusData}
                  theme={theme}
                  isSmallScreen={isSmallScreen}
                />

                <ReportTables
                  counts={counts}
                  departmentStatusData={departmentStatusData}
                  technicianData={technicianData}
                  theme={theme}
                  isSmallScreen={isSmallScreen}
                />
              </Grid>
            )}
          </div>
        </>
      )}
    </Box>
  );
};

export default ReportMain;

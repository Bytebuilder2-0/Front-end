import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import API_BASE_URL from "../../config/api";
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
import ReportDownload from "./ReportDownload";
import { jwtDecode } from "jwt-decode";

const baseURL = API_BASE_URL;

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

//  Handy config object you can reuse
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

  const workingAppointmentsCount =
    counts.confirmed +
    counts.inProgress +
    counts.waiting +
    counts.accepted +
    counts.rejected;
  const completedCount = counts.taskDone + counts.paid;
  const NewJOB = counts.pending + counts.checking;

  return (
    <Box
      sx={{ p: { xs: 1, sm: 2, md: 3 }, overflowX: "hidden" }}
      ref={reportRef}
    >
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
            <>
              <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
                <ReportDownload
                  reportRef={reportRef}
                  counts={counts}
                  isSmallScreen={isSmallScreen}
                />
              </Box>

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
                            {counts.total - counts.cancelled}
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
                            Completed Appointment
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
                            Waiting for Tech: {counts.waiting}, Rejected:{" "}
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
                            New Appointment
                          </Typography>
                          <Typography
                            variant="h3"
                            fontWeight="bold"
                            fontSize={isSmallScreen ? "1.5rem" : "2.4rem"}
                          >
                            {NewJOB}
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
                            (Checking: {counts.checking}, Pending:
                            {counts.pending})
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
            </>
          )}
        </>
      )}
    </Box>
  );
};

export default ReportMain;

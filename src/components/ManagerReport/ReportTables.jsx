import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Card,
  CardContent,
  Typography,
  Grid,
} from "@mui/material";
import { lighten } from "@mui/material/styles";

const ReportTables = ({
  counts,
  departmentStatusData,
  technicianData,
  theme,
  isSmallScreen,
}) => {
  // ===== COLOR DEFINITION (matching ReportCharts) =====
  const COLORS = {
    pending: "#f1950aff", // Orange
    confirmed: "#29B6F6", // Blue
    checking: "#c32012ff", // Purple
    rejected: "#7d2626ff", // Dark Red
    accepted: "#cc2ebcff", // Green
    inProgress: "#3498db", // Blue
    taskDone: "#27ae60", // Dark Green
    paid: "#1618a0ff", // Teal
    reject2: "#e74c3c", // Dark Red (Tech reject)
    waiting: "#8907bcff", // Purple (waiting for technician confirmation)
    borderDark: "#34495e",
    borderLight: "#E0E0E0",
    fallback: "#95a5a6",
    fallbackLight: "#bdc3c7",
    total: "#32608dff", // Dark blue-gray for total
  };

  // ===== CONFIGURATION SECTION =====
  const TABLE_VISIBILITY = {
    showDepartmentsTable: true,
    showStatusOverviewTable: true,
    showDepartmentStatusTable: true,
  };

  const STATUS_CONFIG = [
    {
      key: "waiting for technician confirmation",
      display: "waiting for Tech",
      color: COLORS.waiting,
      showInTable: true,
    },
    {
      key: "accepted",
      display: "accepted",
      color: COLORS.accepted,
      showInTable: true,
    },
    {
      key: "reject2",
      display: "Rejected",
      color: COLORS.reject2,
      showInTable: true,
    },
    {
      key: "inprogress",
      display: "In progress",
      color: COLORS.inProgress,
      showInTable: true,
    },
    {
      key: "task done",
      display: "Task done",
      color: COLORS.taskDone,
      showInTable: true,
    },
    {
      key: "paid",
      display: "paid",
      color: COLORS.paid,
      showInTable: true,
    },
  ];

  const STATUS_OVERVIEW_CONFIG = [
    { key: "checking", display: "Checking", color: COLORS.checking },
    { key: "pending", display: "Pending", color: COLORS.pending },
    { key: "confirmed", display: "Confirmed", color: COLORS.confirmed },
    { key: "waiting", display: "Waiting for Tech", color: COLORS.waiting },
    { key: "reject2", display: "Rejected", color: COLORS.reject2 },
    { key: "accepted", display: "Accepted", color: COLORS.accepted },
    { key: "inProgress", display: "In Progress", color: COLORS.inProgress },
    { key: "taskDone", display: "Task Done", color: COLORS.taskDone },
    { key: "paid", display: "Paid", color: COLORS.paid },
  ];

  // ===== DATA PROCESSING =====
  const processedDepartmentData = departmentStatusData.map((dept) => {
    const department = { department: dept.department };
    STATUS_CONFIG.filter((status) => status.showInTable).forEach((status) => {
      department[status.display] = dept.statusCounts[status.key] || 0;
    });
    return department;
  });

  // Sort departments and assign colors matching the chart
  const sortedDepartmentData = [...technicianData]
    .sort((a, b) => a.department.localeCompare(b.department))
    .map((data, index) => ({
      department: data.department,
      count: data.count,
      // Generate colors matching the chart's department colors
      color: `hsl(${(index * 360) / technicianData.length}, 70%, 70%)`,
    }));

  const sortedStatusData = [...processedDepartmentData].sort((a, b) =>
    a.department.localeCompare(b.department)
  );

  // Prepare status overview data - show all statuses even if count is 0
  const statusOverviewData = STATUS_OVERVIEW_CONFIG.map(
    ({ key, display, color }) => ({
      status: display,
      count: counts[key] || 0, // Default to 0 if undefined
      color: color,
    })
  );

  // ===== STYLING =====
  const getStatusCellStyle = (color, value) => ({
    backgroundColor: value > 0 ? color : theme.palette.background.paper,
    color:
      value > 0
        ? theme.palette.getContrastText(color)
        : theme.palette.text.secondary,
    fontWeight: "bold",
    borderRadius: "4px",
    padding: isSmallScreen ? "4px 6px" : "8px 12px",
    textAlign: "center",
    fontSize: isSmallScreen ? "0.7rem" : "0.8rem",
  });

  const getCountCellStyle = (color) => ({
    backgroundColor: color,
    color: theme.palette.getContrastText(color),
    fontWeight: "bold",
    borderRadius: "4px",
    textAlign: "center",
  });

  const getDepartmentCellStyle = (color) => ({
    backgroundColor: color,
    color: theme.palette.getContrastText(color),
    fontWeight: "bold",
    borderRadius: "4px",
    textAlign: "center",
    padding: isSmallScreen ? "4px 6px" : "8px 12px",
  });

  const headerStyle = {
    fontWeight: "bold",
    backgroundColor: lighten(theme.palette.primary.light, 0.7),
    color: theme.palette.getContrastText(
      lighten(theme.palette.primary.light, 0.7)
    ),
    fontSize: isSmallScreen ? "0.7rem" : "0.8rem",
    px: isSmallScreen ? 1 : 2,
    py: isSmallScreen ? 1 : 1.5,
  };

  const cardStyle = {
    boxShadow: 3,
    borderRadius: "8px",
    height: "100%",
  };

  return (
    <>
      {TABLE_VISIBILITY.showStatusOverviewTable && (
        <Grid item xs={12} sm={12} md={6} sx={{ mt: 5 }}>
          <Card sx={cardStyle}>
            <CardContent>
              <Typography variant="h6" gutterBottom fontWeight="bold">
                Appointment Status Overview
              </Typography>
              <TableContainer component={Paper}>
                <Table size="small" stickyHeader>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={headerStyle}>Status</TableCell>
                      <TableCell align="center" sx={headerStyle}>
                        Count
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {statusOverviewData.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>{item.status}</TableCell>
                        <TableCell
                          align="center"
                          sx={getCountCellStyle(item.color)}
                        >
                          {item.count}
                        </TableCell>
                      </TableRow>
                    ))}
                    <TableRow>
                      <TableCell sx={{ fontWeight: "bold" }}>Total</TableCell>
                      <TableCell
                        align="center"
                        sx={{
                          ...getCountCellStyle(COLORS.total),
                          fontWeight: "bold",
                        }}
                      >
                        {counts.total - (counts.cancelled || 0)}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>
      )}

      {/* Appointments by Department Table */}
      {TABLE_VISIBILITY.showDepartmentsTable && (
        <Grid item xs={12} sm={12} md={6} sx={{ mt: 5 }}>
          <Card sx={cardStyle}>
            <CardContent>
              <Typography variant="h6" gutterBottom fontWeight="bold">
                Appointments by Department
              </Typography>
              <TableContainer component={Paper}>
                <Table size="small" stickyHeader>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={headerStyle}>Department</TableCell>
                      <TableCell align="center" sx={headerStyle}>
                        Total
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {sortedDepartmentData.map((dept, index) => (
                      <TableRow key={index}>
                        <TableCell>{dept.department}</TableCell>
                        <TableCell
                          align="center"
                          sx={getDepartmentCellStyle(dept.color)}
                        >
                          {dept.count}
                        </TableCell>
                      </TableRow>
                    ))}
                    <TableRow>
                      <TableCell sx={{ fontWeight: "bold" }}>Total</TableCell>
                      <TableCell
                        align="center"
                        sx={{
                          ...getDepartmentCellStyle(COLORS.total),
                          fontWeight: "bold",
                        }}
                      >
                        {sortedDepartmentData.reduce(
                          (sum, dept) => sum + dept.count,
                          0
                        )}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>
      )}

      {/* Department Status Overview Table */}
      {TABLE_VISIBILITY.showDepartmentStatusTable && (
        <Grid item xs={12} sx={{ mt: 8 }}>
          <Card sx={cardStyle}>
            <CardContent>
              <Typography variant="h6" gutterBottom fontWeight="bold">
                Department Status Overview
              </Typography>
              <TableContainer component={Paper}>
                <Table size="small" stickyHeader>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={headerStyle}>Department</TableCell>
                      {STATUS_CONFIG.filter((status) => status.showInTable).map(
                        (status) => (
                          <TableCell
                            key={status.display}
                            align="center"
                            sx={headerStyle}
                          >
                            {status.display}
                          </TableCell>
                        )
                      )}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {sortedStatusData.map((dept, index) => (
                      <TableRow key={index}>
                        <TableCell>{dept.department}</TableCell>
                        {STATUS_CONFIG.filter(
                          (status) => status.showInTable
                        ).map((status) => (
                          <TableCell
                            key={status.display}
                            align="center"
                            sx={getStatusCellStyle(
                              status.color,
                              dept[status.display]
                            )}
                          >
                            {dept[status.display]}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>
      )}
    </>
  );
};

export default ReportTables;

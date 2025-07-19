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
  const statusColors = {
    pending: `rgb(255, 213, 79)`, // lighten(warning.light, 0.2)
    // confirmed: `rgb(144, 202, 249)`, // lighten(info.light, 0.1)
    checking: `rgb(206, 147, 216)`, // lighten(secondary.light, 0.1)
    //cancelled: `rgb(239, 154, 154)`, // lighten(error.light, 0.2)
    rejected: `rgb(198, 40, 40)`, // lighten(error.dark, 0.1)
    accepted: `rgb(165, 214, 167)`, // lighten(success.light, 0.1)
    inProgress: `rgb(91, 124, 151)`, // lighten(primary.light, 0.1)
    taskDone: `rgb(102, 187, 106)`, // lighten(success.main, 0.1)
    paid: `rgb(56, 142, 60)`, // lighten(success.dark, 0.1)
    reject1: `rgb(239, 83, 80)`, // lighten(error.main, 0.1)
    reject2: `rgb(198, 40, 40)`, // lighten(error.dark, 0.1)
    // waiting: `rgb(255, 167, 38)`, // lighten(warning.main, 0.1)
    //  "all done": `rgb(56, 142, 60)`, // lighten(success.dark, 0.1)
  };

  const getStatusCellStyle = (status, value) => {
    const backgroundColor =
      value > 0
        ? statusColors[status.toLowerCase().replace(/\s+/g, "")] ||
          theme.palette.background.paper
        : theme.palette.background.paper;

    return {
      backgroundColor,
      color:
        value > 0
          ? theme.palette.getContrastText(backgroundColor)
          : theme.palette.text.secondary,
      fontWeight: "bold",
      borderRadius: "4px",
      padding: isSmallScreen ? "4px 6px" : "8px 12px",
      textAlign: "center",
      transition: "all 0.3s ease",
      boxShadow: value > 0 ? `0 2px 4px ${theme.palette.divider}` : "none",
      fontSize: isSmallScreen ? "0.7rem" : "0.8rem",
      "&:hover": {
        transform: value > 0 ? "translateY(-2px)" : "none",
        boxShadow: value > 0 ? `0 4px 8px ${theme.palette.divider}` : "none",
      },
    };
  };

  const departmentStatusTableData = departmentStatusData.map((data) => ({
    department: data.department,

    // confirmed: data.statusCounts.confirmed || 0,
    // reject1: data.statusCounts.reject1 || 0,
    //waiting: data.statusCounts.waiting || 0,
    "waiting for technician confirmation":
      data.statusCounts["waiting for technician confirmation"] || 0,
    accepted: data.statusCounts.accepted || 0,
    reject2: data.statusCounts.reject2 || 0,
    inProgress: data.statusCounts.inprogress || 0,
    taskDone: data.statusCounts["task done"] || 0,
    // cancelled: data.statusCounts.cancelled || 0,
    paid: data.statusCounts.paid || 0,

    // "all done": data.statusCounts["all done"] || 0,
  }));

  const statusKeys = [
    //"confirmed",
    // "reject1",
    // "waiting",

    "accepted",
    "reject2",
    "inProgress",
    "taskDone",
    // "cancelled",
    "paid",
    "waiting for technician confirmation",
    //"all done",
  ];

  const sortedDepartmentData = [...technicianData]
    .map((data) => ({ department: data.department, count: data.count }))
    .sort((a, b) => b.count - a.count);

  const headerStyle = {
    fontWeight: "bold",
    backgroundColor:
      theme.palette.mode === "light"
        ? lighten(theme.palette.primary.light, 0.7)
        : theme.palette.primary.dark,
    color: theme.palette.getContrastText(
      theme.palette.mode === "light"
        ? lighten(theme.palette.primary.light, 0.7)
        : theme.palette.primary.dark
    ),
    whiteSpace: "nowrap",
    fontSize: isSmallScreen ? "0.6rem" : "0.8rem",
    borderBottom: `2px solid ${theme.palette.divider}`,
    px: isSmallScreen ? 0.5 : 2,
    py: isSmallScreen ? 0.5 : 1.5,
  };

  const cardStyle = {
    boxShadow: 3,
    borderRadius: "8px",
    overflow: "hidden",
    transition: "all 0.3s ease",
    "&:hover": {
      boxShadow: 6,
      transform: "translateY(-2px)",
    },
    height: "100%",
  };

  return (
    <>
      <Grid item xs={12} sm={12} md={6} style={{ marginTop: "25px" }}>
        <Card sx={cardStyle}>
          <CardContent sx={{ p: isSmallScreen ? 1 : 2 }}>
            <Typography
              variant="h5"
              gutterBottom
              fontWeight="bold"
              color="primary"
              fontSize={isSmallScreen ? "0.9rem" : "1.1rem"}
              sx={{ mb: 1 }}
            >
              Appointments by Department
            </Typography>
            <TableContainer
              component={Paper}
              sx={{
                borderRadius: "4px",
                border: `1px solid ${theme.palette.divider}`,
                background: theme.palette.background.paper,
                maxHeight: isSmallScreen ? 250 : 400,
                overflow: "auto",
              }}
            >
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
                  {sortedDepartmentData.map((department, index) => (
                    <TableRow key={index} hover>
                      <TableCell
                        component="th"
                        scope="row"
                        sx={{
                          fontWeight: 500,
                          borderRight: `1px solid ${theme.palette.divider}`,
                          fontSize: isSmallScreen ? "0.7rem" : "0.8rem",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {department.department}
                      </TableCell>
                      <TableCell
                        align="center"
                        sx={{
                          fontWeight: "bold",
                          backgroundColor: lighten(
                            theme.palette.primary.light,
                            0.5
                          ),
                          color: theme.palette.getContrastText(
                            lighten(theme.palette.primary.light, 0.5)
                          ),
                          borderRadius: "4px",
                          fontSize: isSmallScreen ? "0.7rem" : "0.8rem",
                        }}
                      >
                        {department.count}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} sm={12} md={6} style={{ marginTop: "25px" }}>
        <Card sx={cardStyle}>
          <CardContent sx={{ p: isSmallScreen ? 1 : 2 }}>
            <Typography
              variant="h5"
              gutterBottom
              fontWeight="bold"
              color="primary"
              fontSize={isSmallScreen ? "0.9rem" : "1.1rem"}
              sx={{ mb: 1 }}
            >
              Appointment Status Overview
            </Typography>
            <TableContainer
              component={Paper}
              sx={{
                borderRadius: "4px",
                border: `1px solid ${theme.palette.divider}`,
                background: theme.palette.background.paper,
              }}
            >
              <Table size="small" stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell sx={headerStyle}>Status</TableCell>
                    <TableCell align="center" sx={headerStyle}>
                      Count
                    </TableCell>
                  </TableRow>
                </TableHead>
                {/* Inside the TableBody of the "Appointment Status Overview" table */}
                <TableBody>
                  {Object.entries(counts)
                    .filter(([status]) => status !== "total") // Exclude total from the main list
                    .map(([status, count]) => (
                      <TableRow key={status} hover>
                        <TableCell
                          component="th"
                          scope="row"
                          sx={{
                            fontWeight: 500,
                            borderRight: `1px solid ${theme.palette.divider}`,
                            fontSize: isSmallScreen ? "0.7rem" : "0.8rem",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {status.charAt(0).toUpperCase() +
                            status.slice(1).replace(/([A-Z])/g, " $1")}
                        </TableCell>
                        <TableCell
                          align="center"
                          sx={getStatusCellStyle(status, count)}
                        >
                          {count}
                        </TableCell>
                      </TableRow>
                    ))}
                  {/* Add the total row at the bottom */}
                  <TableRow hover>
                    <TableCell
                      component="th"
                      scope="row"
                      sx={{
                        fontWeight: "bold",
                        borderRight: `1px solid ${theme.palette.divider}`,
                        fontSize: isSmallScreen ? "0.7rem" : "0.8rem",
                        whiteSpace: "nowrap",
                        backgroundColor: lighten(
                          theme.palette.primary.light,
                          0.3
                        ),
                      }}
                    >
                      Total
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{
                        fontWeight: "bold",
                        backgroundColor: lighten(
                          theme.palette.primary.light,
                          0.3
                        ),
                        color: theme.palette.getContrastText(
                          lighten(theme.palette.primary.light, 0.3)
                        ),
                        fontSize: isSmallScreen ? "0.7rem" : "0.8rem",
                      }}
                    >
                      {counts.total}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} style={{ marginTop: "30px" }}>
        <Card sx={cardStyle}>
          <CardContent sx={{ p: isSmallScreen ? 1 : 2 }}>
            <Typography
              variant="h5"
              gutterBottom
              fontWeight="bold"
              color="primary"
              fontSize={isSmallScreen ? "0.9rem" : "1.1rem"}
              sx={{ mb: 1 }}
            >
              Department Status Overview
            </Typography>
            <TableContainer
              component={Paper}
              sx={{
                borderRadius: "4px",
                border: `1px solid ${theme.palette.divider}`,
                background: theme.palette.background.paper,
                maxHeight: 500,
                overflow: "auto",
              }}
            >
              <Table size="small" stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell sx={headerStyle}>Department</TableCell>
                    {statusKeys.map((key) => (
                      <TableCell
                        key={key}
                        align="center"
                        sx={{
                          ...headerStyle,
                          fontSize: isSmallScreen ? "0.6rem" : "0.7rem",
                          px: 1,
                        }}
                      >
                        {key.charAt(0).toUpperCase() +
                          key.slice(1).replace(/([A-Z])/g, " $1")}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {departmentStatusTableData.map((department, idx) => (
                    <TableRow key={idx} hover>
                      <TableCell
                        component="th"
                        scope="row"
                        sx={{
                          fontWeight: 500,
                          whiteSpace: "nowrap",
                          borderRight: `1px solid ${theme.palette.divider}`,
                          fontSize: isSmallScreen ? "0.7rem" : "0.8rem",
                        }}
                      >
                        {department.department}
                      </TableCell>
                      {statusKeys.map((key) => (
                        <TableCell
                          key={key}
                          align="center"
                          sx={getStatusCellStyle(key, department[key])}
                        >
                          {department[key]}
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
    </>
  );
};

export default ReportTables;

import React from "react";
import { Card, CardContent, Typography, Box, Grid } from "@mui/material";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const ReportCharts = ({
  counts,
  technicianData,
  departmentStatusData,
  theme,
  isSmallScreen,
}) => {
  // Define all colors as hex values
  const COLORS = {
    // Status colors - define each status only once
    pending: "#f1950aff", // Orange
    confirmed: "#29B6F6", // Blue
    checking: "#c32012ff", // Purple
    // cancelled: "#EF5350", // Red
    rejected: "#7d2626ff", // Dark Red
    accepted: "#cc2ebcff", // Green
    inProgress: "#3498db", // Blue
    taskDone: "#27ae60", // Dark Green
    paid: "#1618a0ff", // Teal
    //reject1: "#EF5350", // Red
    reject2: "#e74c3c", // Dark Red (Tech reject)
    waiting: "#8907bcff", // Purple (waiting for technician confirmation)
    //allDone: "#2E7D32", // Dark Green

    // Border colors
    borderDark: "#34495e",
    borderLight: "#E0E0E0",

    // Fallback colors
    fallback: "#95a5a6",
    fallbackLight: "#bdc3c7",
  };

  const chartData = {
    labels: [
      "Checking",
      "Pending",
      "Confirmed",
      "Waiting for Tech",
      "Tech rejected",
      "Accepted",
      "In Progress",
      "Task Done",
      "Paid",
    ],
    datasets: [
      {
        label: "Appointment Status Counts",
        data: [
          counts.checking,
          counts.pending,
          counts.confirmed,
          counts.waiting,
          counts.rejected,
          counts.accepted,
          counts.inProgress,
          counts.taskDone,
          counts.paid,
        ],
        backgroundColor: [
          COLORS.checking,
          COLORS.pending,
          COLORS.confirmed,
          COLORS.waiting,
          COLORS.rejected,
          COLORS.accepted,
          COLORS.inProgress,
          COLORS.taskDone,
          COLORS.paid,
        ],
        borderColor: [
          COLORS.borderDark,
          COLORS.borderDark,
          COLORS.borderDark,
          COLORS.borderDark,
          COLORS.borderDark,
          COLORS.borderDark,
          COLORS.borderDark,
          COLORS.borderDark,
          COLORS.borderDark,
        ],
        borderWidth: 1,
        borderRadius: 4,
        hoverBackgroundColor: [
          `${COLORS.checking}CC`,
          `${COLORS.pending}CC`,
          `${COLORS.confirmed}CC`,
          `${COLORS.waiting}CC`,
          `${COLORS.rejected}CC`,
          `${COLORS.accepted}CC`,
          `${COLORS.inProgress}CC`,
          `${COLORS.taskDone}CC`,
          `${COLORS.paid}CC`,
        ],
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: true,
        text: "Appointment Status Distribution",
        font: {
          size: isSmallScreen ? 12 : 16,
          weight: "bold",
        },
        color: "#333333",
        padding: {
          top: 10,
          bottom: 15,
        },
      },
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: "#FFFFFF",
        titleColor: "#333333",
        bodyColor: "#666666",
        borderColor: "#E0E0E0",
        borderWidth: 1,
        titleFont: {
          size: 12,
          weight: "bold",
        },
        bodyFont: {
          size: 11,
        },
        callbacks: {
          label: function (tooltipItem) {
            return `${tooltipItem.dataset.label}: ${tooltipItem.raw} appointments`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
          callback: function (value) {
            return Number.isInteger(value) ? value : "";
          },
          color: "#666666",
          font: {
            size: isSmallScreen ? 9 : 11,
          },
        },
        grid: {
          color: "#E0E0E0",
        },
      },
      x: {
        ticks: {
          color: "#666666",
          maxRotation: isSmallScreen ? 45 : 30,
          minRotation: isSmallScreen ? 45 : 30,
          autoSkip: false,
          padding: 5,
          font: {
            size: isSmallScreen ? 9 : 11,
          },
        },
        grid: {
          display: false,
        },
      },
    },
    animation: {
      duration: 1000,
      easing: "easeOutBounce",
    },
    layout: {
      padding: {
        right: isSmallScreen ? 5 : 20,
      },
    },
  };

  // Sort departments alphabetically for Appointments by Department chart
  const sortedTechnicianData = [...technicianData].sort((a, b) =>
    a.department.localeCompare(b.department)
  );
  const departmentLabels = sortedTechnicianData.map((data) => data.department);
  const departmentCounts = sortedTechnicianData.map((data) => data.count);

  const departmentChartData = {
    labels: departmentLabels,
    datasets: [
      {
        label: "Appointments per Department",
        data: departmentCounts,
        backgroundColor: departmentLabels.map(
          (_, i) => `hsl(${(i * 360) / departmentLabels.length}, 70%, 70%)`
        ),
        borderColor: departmentLabels.map(
          (_, i) => `hsl(${(i * 360) / departmentLabels.length}, 70%, 50%)`
        ),
        borderWidth: 1,
        borderRadius: 4,
        hoverBackgroundColor: departmentLabels.map(
          (_, i) => `hsl(${(i * 360) / departmentLabels.length}, 70%, 60%)`
        ),
      },
    ],
  };

  const departmentChartOptions = {
    ...chartOptions,
    plugins: {
      ...chartOptions.plugins,
      title: {
        ...chartOptions.plugins.title,
        text: "Appointments by Department",
      },
      legend: {
        display: false,
      },
    },
  };

  const departmentStatusTableData = departmentStatusData.map((data) => ({
    department: data.department,
    "waiting for technician confirmation":
      data.statusCounts["waiting for technician confirmation"] || 0,
    "Tech reject": data.statusCounts.reject2 || 0,
    accepted: data.statusCounts.accepted || 0,
    taskDone: data.statusCounts["task done"] || 0,
    inProgress: data.statusCounts.inprogress || 0,
    paid: data.statusCounts.paid || 0,
  }));

  const statusKeys = [
    "waiting for technician confirmation",
    "accepted",
    "Tech reject",
    "inProgress",
    "taskDone",
    "paid",
  ];

  // Sort departments alphabetically for Detailed Status by Department chart
  const sortedDepartmentStatusData = [...departmentStatusTableData].sort(
    (a, b) => a.department.localeCompare(b.department)
  );

  const departmentStatusChartDataForStatus = {
    labels: sortedDepartmentStatusData.map((item) => item.department),
    datasets: [
      {
        label: "Waiting for Tech",
        data: sortedDepartmentStatusData.map(
          (item) => item["waiting for technician confirmation"]
        ),
        backgroundColor: COLORS.waiting,
        borderColor: COLORS.borderDark,
        borderWidth: 1,
      },
      {
        label: "Accepted",
        data: sortedDepartmentStatusData.map((item) => item.accepted),
        backgroundColor: COLORS.accepted,
        borderColor: COLORS.borderDark,
        borderWidth: 1,
      },
      {
        label: "Tech Reject",
        data: sortedDepartmentStatusData.map((item) => item["Tech reject"]),
        backgroundColor: COLORS.reject2,
        borderColor: COLORS.borderDark,
        borderWidth: 1,
      },
      {
        label: "In Progress",
        data: sortedDepartmentStatusData.map((item) => item.inProgress),
        backgroundColor: COLORS.inProgress,
        borderColor: COLORS.borderDark,
        borderWidth: 1,
      },
      {
        label: "Task Done",
        data: sortedDepartmentStatusData.map((item) => item.taskDone),
        backgroundColor: COLORS.taskDone,
        borderColor: COLORS.borderDark,
        borderWidth: 1,
      },
      {
        label: "Paid",
        data: sortedDepartmentStatusData.map((item) => item.paid),
        backgroundColor: COLORS.paid,
        borderColor: COLORS.borderDark,
        borderWidth: 1,
      },
    ],
  };

  const departmentStatusChartOptionsForStatus = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      ...chartOptions.plugins,
      title: {
        ...chartOptions.plugins.title,
        text: "Appointment Status by Department",
      },
      legend: {
        position: "bottom",
        labels: {
          padding: 10,
          usePointStyle: true,
          pointStyle: "circle",
          color: "#333333",
          font: {
            size: isSmallScreen ? 9 : 11,
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        stacked: true,
        ticks: {
          stepSize: 1,
          callback: function (value) {
            return Number.isInteger(value) ? value : "";
          },
          color: "#666666",
        },
        grid: {
          color: "#E0E0E0",
        },
      },
      x: {
        stacked: true,
        ticks: {
          color: "#666666",
          maxRotation: isSmallScreen ? 45 : 0,
          autoSkip: isSmallScreen ? false : true,
          font: {
            size: isSmallScreen ? 9 : 11,
          },
        },
        grid: {
          display: false,
        },
      },
    },
  };

  return (
    <>
      <Grid item xs={12} sm={12} md={6}>
        <Card
          sx={{
            boxShadow: 3,
            height: "100%",
            display: "flex",
            flexDirection: "column",
            backgroundColor: "#FFFFFF",
          }}
        >
          <CardContent sx={{ flexGrow: 1, p: isSmallScreen ? 1 : 2 }}>
            <Typography
              variant="h5"
              gutterBottom
              fontWeight="bold"
              color="#333333"
              fontSize={isSmallScreen ? "1rem" : "1.25rem"}
            >
              Appointment Status Distribution
            </Typography>
            <Box sx={{ height: isSmallScreen ? 250 : 300 }}>
              <Bar data={chartData} options={chartOptions} />
            </Box>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} sm={12} md={6}>
        <Card
          sx={{
            boxShadow: 3,
            height: "100%",
            display: "flex",
            flexDirection: "column",
            backgroundColor: "#FFFFFF",
          }}
        >
          <CardContent sx={{ flexGrow: 1, p: isSmallScreen ? 1 : 2 }}>
            <Typography
              variant="h5"
              gutterBottom
              fontWeight="bold"
              color="#333333"
              fontSize={isSmallScreen ? "1rem" : "1.25rem"}
            >
              Appointments by Department
            </Typography>
            <Box sx={{ height: isSmallScreen ? 250 : 300 }}>
              <Bar
                data={departmentChartData}
                options={departmentChartOptions}
              />
            </Box>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12}>
        <Card
          sx={{
            boxShadow: 3,
            backgroundColor: "#FFFFFF",
          }}
        >
          <CardContent sx={{ p: isSmallScreen ? 1 : 2 }}>
            <Typography
              variant="h5"
              gutterBottom
              fontWeight="bold"
              color="#333333"
              fontSize={isSmallScreen ? "1rem" : "1.25rem"}
            >
              Detailed Status by Department
            </Typography>
            <Box sx={{ height: isSmallScreen ? 350 : 400 }}>
              <Bar
                data={departmentStatusChartDataForStatus}
                options={departmentStatusChartOptionsForStatus}
              />
            </Box>
          </CardContent>
        </Card>
      </Grid>
    </>
  );
};

export default ReportCharts;

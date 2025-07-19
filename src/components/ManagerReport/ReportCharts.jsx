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
  const statusColors = {
    pending: theme.palette.warning.light,
    confirmed: theme.palette.info.light,
    checking: theme.palette.secondary.light,
    cancelled: theme.palette.error.light,
    rejected: theme.palette.error.dark,
    accepted: theme.palette.success.light,
    inProgress: theme.palette.primary.light,
    taskDone: theme.palette.success.main,
    paid: theme.palette.success.dark,
    reject1: theme.palette.error.main,
    reject2: theme.palette.error.dark,
    waiting: theme.palette.warning.main,
    "all done": theme.palette.success.dark,
  };

  const chartData = {
    labels: [
      "Checking",
      "Pending",
      "Confirmed",
      "Waiting for Tech",
      //  "Cancelled",
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
          // counts.cancelled,
          counts.rejected,
          counts.accepted,
          counts.inProgress,
          counts.taskDone,
          counts.paid,
        ],
        backgroundColor: [
          statusColors.checking,
          statusColors.pending,
          statusColors.confirmed,
          statusColors.waiting,
          //statusColors.cancelled,
          statusColors.rejected,
          statusColors.accepted,
          statusColors.inProgress,
          statusColors.taskDone,
          statusColors.paid,
        ],
        borderColor: [
          theme.palette.warning.dark,
          theme.palette.info.dark,
          theme.palette.secondary.dark,
          theme.palette.error.dark,
          theme.palette.error.dark,
          theme.palette.success.dark,
          theme.palette.primary.dark,
          theme.palette.success.dark,
          theme.palette.success.dark,
          theme.palette.secondary.dark,
        ],
        borderWidth: 1,
        borderRadius: 4,
        hoverBackgroundColor: [
          theme.palette.warning.main,
          theme.palette.info.main,
          theme.palette.secondary.main,
          theme.palette.error.main,
          theme.palette.error.main,
          theme.palette.success.main,
          theme.palette.primary.main,
          theme.palette.success.main,
          theme.palette.success.main,
          theme.palette.warning.dark,
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
        color: theme.palette.text.primary,
        padding: {
          top: 10,
          bottom: 15,
        },
      },
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: theme.palette.background.paper,
        titleColor: theme.palette.text.primary,
        bodyColor: theme.palette.text.secondary,
        borderColor: theme.palette.divider,
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
          color: theme.palette.text.secondary,
          font: {
            size: isSmallScreen ? 9 : 11,
          },
        },
        grid: {
          color: theme.palette.divider,
        },
      },
      x: {
        ticks: {
          color: theme.palette.text.secondary,
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

  const departmentLabels = technicianData.map((data) => data.department);
  const departmentCounts = technicianData.map((data) => data.count);

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
    // confirmed: data.statusCounts.confirmed || 0,
    // reject1: data.statusCounts.reject1 || 0,
    // waiting: data.statusCounts.waiting || 0,
    "waiting for technician confirmation":
      data.statusCounts["waiting for technician confirmation"] || 0,
    "Tech reject": data.statusCounts.reject2 || 0,
    accepted: data.statusCounts.accepted || 0,
    taskDone: data.statusCounts["task done"] || 0,
    inProgress: data.statusCounts.inprogress || 0,

    //  cancelled: data.statusCounts.cancelled || 0,
    paid: data.statusCounts.paid || 0,

    // "all done": data.statusCounts["all done"] || 0,
  }));

  const statusKeys = [
    // "confirmed",
    // "reject1",
    // "waiting for Tech",
    "waiting for technician confirmation",
    "rejecte2",
    "accepted",
    "inProgress",
    "taskDone",
    // "cancelled",
    "paid",

    // "all done",
  ];

  const departmentStatusChartDataForStatus = {
    labels: departmentStatusTableData.map((item) => item.department),
    datasets: statusKeys.map((key) => ({
      label:
        key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, " $1"),
      data: departmentStatusTableData.map((item) => item[key]),
      backgroundColor: statusColors[key],
      borderColor:
        theme.palette.mode === "dark"
          ? theme.palette.grey[800]
          : theme.palette.grey[300],
      borderWidth: 1,
      borderRadius: 2,
      hoverBackgroundColor:
        theme.palette.mode === "dark"
          ? `${statusColors[key]}99`
          : `${statusColors[key]}cc`,
    })),
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
          color: theme.palette.text.primary,
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
          color: theme.palette.text.secondary,
        },
        grid: {
          color: theme.palette.divider,
        },
      },
      x: {
        stacked: true,
        ticks: {
          color: theme.palette.text.secondary,
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
          }}
        >
          <CardContent sx={{ flexGrow: 1, p: isSmallScreen ? 1 : 2 }}>
            <Typography
              variant="h5"
              gutterBottom
              fontWeight="bold"
              color="primary"
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
          }}
        >
          <CardContent sx={{ flexGrow: 1, p: isSmallScreen ? 1 : 2 }}>
            <Typography
              variant="h5"
              gutterBottom
              fontWeight="bold"
              color="primary"
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
        <Card sx={{ boxShadow: 3 }}>
          <CardContent sx={{ p: isSmallScreen ? 1 : 2 }}>
            <Typography
              variant="h5"
              gutterBottom
              fontWeight="bold"
              color="primary"
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

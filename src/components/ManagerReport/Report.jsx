import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Button,
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

// Register necessary components for Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const baseURL = "http://localhost:5000/api"; // Your API base URL

const Report = () => {
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
  });

  const [technicianData, setTechnicianData] = useState([]); // State to hold technician data
  const [departmentStatusData, setDepartmentStatusData] = useState([]); // State to hold department status data
  const [showReport, setShowReport] = useState(false); // State to toggle the report visibility

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const response = await axios.get(
          `${baseURL}/appointments/statusCountsc`
        );
        setCounts(response.data); // Setting appointment counts

        const technicianResponse = await axios.get(
          `${baseURL}/appointments/statusCountscheck`
        );
        setTechnicianData(technicianResponse.data.technicianAppointments); // Setting technician data (department and count)

        const departmentStatusResponse = await axios.get(
          `${baseURL}/appointments/departmentStatusData`
        );
        setDepartmentStatusData(departmentStatusResponse.data); // Setting department status data
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchCounts();
  }, []);

  const handleViewReport = () => {
    setShowReport(true); // Show the report when the button is clicked
  };

  // Custom gradient color for bars
  const gradientColors = (chart) => {
    const ctx = chart.ctx;
    const gradient = ctx.createLinearGradient(0, 0, 0, chart.height);
    gradient.addColorStop(0, "rgba(75, 192, 192, 0.8)"); // Light blue
    gradient.addColorStop(1, "rgba(54, 162, 235, 0.8)"); // Dark blue
    return gradient;
  };

  // Chart.js data structure for Appointment Status Counts
  const chartData = {
    labels: [
      "Pending",
      "Confirmed",
      "Checking",
      "Cancelled",
      "Rejected",
      "Accepted",
      "In Progress",
      "Task Done",
      "Paid",
    ],
    datasets: [
      {
        label: "Appointment Status Counts",
        data: [
          counts.pending,
          counts.confirmed,
          counts.checking,
          counts.cancelled,
          counts.rejected,
          counts.accepted,
          counts.inProgress,
          counts.taskDone,
          counts.paid,
        ],
        backgroundColor: function (context) {
          const chart = context.chart;
          return gradientColors(chart); // Apply gradient
        },
        borderColor: "rgba(54, 162, 235, 1)", // Blue border
        borderWidth: 1,
        hoverBackgroundColor: "rgba(54, 162, 235, 0.6)",
        hoverBorderColor: "rgba(54, 162, 235, 1)",
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: "Appointment Status Distribution",
        font: {
          size: 18,
          weight: "bold",
        },
        color: "#1976d2",
      },
      tooltip: {
        backgroundColor: "#1976d2",
        titleFont: {
          size: 14,
          weight: "bold",
        },
        bodyFont: {
          size: 12,
        },
        callbacks: {
          label: function (tooltipItem) {
            return `${tooltipItem.label}: ${tooltipItem.raw} appointments`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true, // Start y-axis from 0
        ticks: {
          stepSize: 1, // Ensure the y-axis increments by 1 (integer values)
          callback: function (value) {
            return Number.isInteger(value) ? value : ""; // Ensure no floating-point numbers
          },
        },
        grid: {
          color: "rgba(0, 0, 0, 0.1)",
          borderColor: "rgba(0, 0, 0, 0.1)",
        },
      },
    },
    animation: {
      duration: 1000, // Smooth animation duration for the bars
      easing: "easeOutBounce",
    },
  };

  // Prepare Department Appointment Counts data for Department chart
  const departmentLabels = technicianData.map((data) => data.department);
  const departmentCounts = technicianData.map((data) => data.count);

  const departmentChartData = {
    labels: departmentLabels,
    datasets: [
      {
        label: "Appointments per Department",
        data: departmentCounts,
        backgroundColor: function (context) {
          const chart = context.chart;
          return gradientColors(chart); // Apply gradient
        },
        borderColor: "rgba(54, 162, 235, 1)", // Blue border
        borderWidth: 1,
        hoverBackgroundColor: "rgba(54, 162, 235, 0.6)",
        hoverBorderColor: "rgba(54, 162, 235, 1)",
      },
    ],
  };

  const departmentChartOptions = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: "Appointments by Department",
        font: {
          size: 18,
          weight: "bold",
        },
        color: "#1976d2",
      },
      tooltip: {
        backgroundColor: "#1976d2",
        titleFont: {
          size: 14,
          weight: "bold",
        },
        bodyFont: {
          size: 12,
        },
        callbacks: {
          label: function (tooltipItem) {
            return `${tooltipItem.label}: ${tooltipItem.raw} appointments`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true, // Start y-axis from 0
        ticks: {
          stepSize: 1, // Ensure the y-axis increments by 1 (integer values)
          callback: function (value) {
            return Number.isInteger(value) ? value : ""; // Ensure no floating-point numbers
          },
        },
        grid: {
          color: "rgba(0, 0, 0, 0.1)",
          borderColor: "rgba(0, 0, 0, 0.1)",
        },
      },
    },
    animation: {
      duration: 1000, // Smooth animation duration for the bars
      easing: "easeOutBounce",
    },
  };

  // Prepare data for the new department status table and chart
  const departmentStatusTableData = departmentStatusData.map((data) => {
    return {
      department: data.department,
      confirmed: data.statusCounts.confirmed || 0,
      reject1: data.statusCounts.reject1 || 0,
      waiting: data.statusCounts.waiting || 0,
      accepted: data.statusCounts.accepted || 0,
      reject2: data.statusCounts.reject2 || 0,
      inProgress: data.statusCounts.inprogress || 0,
      taskDone: data.statusCounts["task done"] || 0, // Correct the field name
      cancelled: data.statusCounts.cancelled || 0, // Added cancelled status
      paid: data.statusCounts.paid || 0, // Added paid status
      "waiting for technician confirmation":
        data.statusCounts["waiting for technician confirmation"] || 0, // Added status for waiting for tech confirmation
      "all done": data.statusCounts["all done"] || 0, // Added "all done" status
    };
  });

  const departmentStatusChartDataForStatus = {
    labels: departmentStatusTableData.map((item) => item.department), // Use department names from table data
    datasets: [
      {
        label: "Confirmed",
        data: departmentStatusTableData.map((item) => item.confirmed),
        backgroundColor: "rgba(75, 192, 192, 0.8)", // Light blue
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
        hoverBackgroundColor: "rgba(75, 192, 192, 0.6)",
      },
      {
        label: "Rejected 1",
        data: departmentStatusTableData.map((item) => item.reject1),
        backgroundColor: "rgba(255, 99, 132, 0.8)", // Red
        borderColor: "rgba(255, 99, 132, 1)",
        borderWidth: 1,
        hoverBackgroundColor: "rgba(255, 99, 132, 0.6)",
      },
      {
        label: "Waiting for Technician",
        data: departmentStatusTableData.map((item) => item.waiting),
        backgroundColor: "rgba(255, 159, 64, 0.8)", // Orange
        borderColor: "rgba(255, 159, 64, 1)",
        borderWidth: 1,
        hoverBackgroundColor: "rgba(255, 159, 64, 0.6)",
      },
      {
        label: "Accepted",
        data: departmentStatusTableData.map((item) => item.accepted),
        backgroundColor: "rgba(54, 162, 235, 0.8)", // Blue
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 1,
        hoverBackgroundColor: "rgba(54, 162, 235, 0.6)",
      },
      {
        label: "Rejected 2",
        data: departmentStatusTableData.map((item) => item.reject2),
        backgroundColor: "rgba(153, 102, 255, 0.8)", // Purple
        borderColor: "rgba(153, 102, 255, 1)",
        borderWidth: 1,
        hoverBackgroundColor: "rgba(153, 102, 255, 0.6)",
      },
      {
        label: "In Progress",
        data: departmentStatusTableData.map((item) => item.inProgress),
        backgroundColor: "rgba(255, 159, 64, 0.8)", // Yellow
        borderColor: "rgba(255, 159, 64, 1)",
        borderWidth: 1,
        hoverBackgroundColor: "rgba(255, 159, 64, 0.6)",
      },
      {
        label: "Task Done",
        data: departmentStatusTableData.map((item) => item.taskDone),
        backgroundColor: "rgba(75, 192, 192, 0.8)", // Green
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
        hoverBackgroundColor: "rgba(75, 192, 192, 0.6)",
      },
      {
        label: "Cancelled",
        data: departmentStatusTableData.map((item) => item.cancelled),
        backgroundColor: "rgba(255, 99, 132, 0.6)", // Red (cancelled status)
        borderColor: "rgba(255, 99, 132, 1)",
        borderWidth: 1,
        hoverBackgroundColor: "rgba(255, 99, 132, 0.4)",
      },
      {
        label: "Paid",
        data: departmentStatusTableData.map((item) => item.paid),
        backgroundColor: "rgba(54, 162, 235, 0.6)", // Blue (paid status)
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 1,
        hoverBackgroundColor: "rgba(54, 162, 235, 0.4)",
      },
      {
        label: "Waiting for Technician Confirmation",
        data: departmentStatusTableData.map(
          (item) => item["waiting for technician confirmation"]
        ),
        backgroundColor: "rgba(153, 102, 255, 0.8)", // Purple (waiting for technician confirmation)
        borderColor: "rgba(153, 102, 255, 1)",
        borderWidth: 1,
        hoverBackgroundColor: "rgba(153, 102, 255, 0.6)",
      },
      {
        label: "All Done",
        data: departmentStatusTableData.map((item) => item["all done"]),
        backgroundColor: "rgba(255, 159, 64, 0.6)", // Orange (all done status)
        borderColor: "rgba(255, 159, 64, 1)",
        borderWidth: 1,
        hoverBackgroundColor: "rgba(255, 159, 64, 0.4)",
      },
    ],
  };

  const departmentStatusChartOptionsForStatus = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: "Appointment Status by Department",
        font: {
          size: 18,
          weight: "bold",
        },
        color: "#1976d2",
      },
    },
    scales: {
      y: {
        beginAtZero: true, // Start y-axis from 0
        ticks: {
          stepSize: 1,
          callback: function (value) {
            return Number.isInteger(value) ? value : "";
          },
        },
      },
    },
  };

  return (
    <div>
      {/* View Report Button */}
      <Button
        variant="contained"
        color="primary"
        onClick={handleViewReport}
        sx={{ marginBottom: 2 }}
      >
        View Appointment Report
      </Button>

      {/* Display the table and chart only after the button is clicked */}
      {showReport && (
        <Grid container spacing={3}>
          {/* Appointment Status Overview */}
          <Grid item xs={12} md={6}>
            <Card sx={{ boxShadow: 3 }}>
              <CardContent>
                <Typography variant="h5" gutterBottom>
                  Appointment Status Overview
                </Typography>
                <TableContainer component={Paper}>
                  <Table
                    sx={{ minWidth: 650 }}
                    aria-label="status summary table"
                  >
                    <TableHead>
                      <TableRow>
                        <TableCell>Status</TableCell>
                        <TableCell align="center">Count</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {Object.keys(counts).map((status, index) => (
                        <TableRow key={index}>
                          <TableCell>
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                          </TableCell>
                          <TableCell align="center">{counts[status]}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Grid>

          {/* Technician Appointment Summary Table */}
          <Grid item xs={12} md={6}>
            <Card sx={{ boxShadow: 3 }}>
              <CardContent>
                <Typography variant="h5" gutterBottom>
                  Technician Appointment Summary
                </Typography>
                <TableContainer component={Paper}>
                  <Table
                    sx={{ minWidth: 650 }}
                    aria-label="technician summary table"
                  >
                    <TableHead>
                      <TableRow>
                        <TableCell>Department</TableCell>
                        <TableCell align="center">Appointments Count</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {technicianData.map((technician, idx) => (
                        <TableRow key={idx}>
                          <TableCell>{technician.department}</TableCell>
                          <TableCell align="center">
                            {technician.count}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Grid>

          {/* Department Appointment Status Table */}
          <Grid item xs={12} md={6}>
            <Card sx={{ boxShadow: 3 }}>
              <CardContent>
                <Typography variant="h5" gutterBottom>
                  Department Appointment Status Overview
                </Typography>
                <TableContainer component={Paper}>
                  <Table
                    sx={{ minWidth: 650 }}
                    aria-label="department status table"
                  >
                    <TableHead>
                      <TableRow>
                        <TableCell>Department</TableCell>
                        <TableCell align="center">Confirmed</TableCell>
                        <TableCell align="center">Reject1</TableCell>
                        <TableCell align="center">
                          Waiting for Technician Confirmation
                        </TableCell>
                        <TableCell align="center">Accepted</TableCell>
                        <TableCell align="center">Reject2</TableCell>
                        <TableCell align="center">InProgress</TableCell>
                        <TableCell align="center">Task Done</TableCell>
                        <TableCell align="center">Cancelled</TableCell>
                        <TableCell align="center">Paid</TableCell>
                        <TableCell align="center">All Done</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {departmentStatusTableData.map((department, idx) => (
                        <TableRow key={idx}>
                          <TableCell>{department.department}</TableCell>
                          <TableCell align="center">
                            {department.confirmed}
                          </TableCell>
                          <TableCell align="center">
                            {department.reject1}
                          </TableCell>
                          <TableCell align="center">
                            {department["waiting for technician confirmation"]}
                          </TableCell>
                          <TableCell align="center">
                            {department.accepted}
                          </TableCell>
                          <TableCell align="center">
                            {department.reject2}
                          </TableCell>
                          <TableCell align="center">
                            {department.inProgress}
                          </TableCell>
                          <TableCell align="center">
                            {department.taskDone}
                          </TableCell>
                          <TableCell align="center">
                            {department.cancelled}
                          </TableCell>
                          <TableCell align="center">
                            {department.paid}
                          </TableCell>
                          <TableCell align="center">
                            {department["all done"]}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Grid>

          {/* Department Appointment Status Chart */}
          <Grid item xs={12} md={6}>
            <Card sx={{ boxShadow: 3 }}>
              <CardContent>
                <Typography variant="h5" gutterBottom>
                  Department Appointment Status Distribution
                </Typography>
                <Bar
                  data={departmentStatusChartDataForStatus}
                  options={departmentStatusChartOptionsForStatus}
                />
              </CardContent>
            </Card>
          </Grid>

          {/* Appointment Status Bar Chart */}
          <Grid item xs={12} md={6}>
            <Card sx={{ boxShadow: 3 }}>
              <CardContent>
                <Typography variant="h5" gutterBottom>
                  Appointment Status Chart
                </Typography>
                <Bar data={chartData} options={chartOptions} />
              </CardContent>
            </Card>
          </Grid>

          {/* Technician Appointment Chart */}
          <Grid item xs={12} md={6}>
            <Card sx={{ boxShadow: 3 }}>
              <CardContent>
                <Typography variant="h5" gutterBottom>
                  Technician Appointment Chart
                </Typography>
                <Bar
                  data={departmentChartData}
                  options={departmentChartOptions}
                />
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}
    </div>
  );
};

export default Report;

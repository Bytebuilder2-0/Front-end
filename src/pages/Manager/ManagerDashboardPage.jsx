import React from "react";
import ManagerSidebar from "../../components/ui/ManagerMiniDrawer";
import Apointmentcheking from "../../components/ManagerDashboard/ApointmentChecking";
import StatusSummary from "../../components/ManagerDashboard/ImfoBox"; //  Import added
import { Box, Toolbar, Divider } from "@mui/material";
import PathNaming from "../../components/sub/PathNaming";

export default function ManagerDashboardPage() {
  return (
    <div>
      <ManagerSidebar>
        {/*  StatusSummary added here */}
        <PathNaming label="DashBoard" path="Manager/DashBoard" />
        <Divider />
        <div style={{ padding: "20px 0" }}>
          <StatusSummary />
        </div>

        {/* Appointment Checking section */}
        <Apointmentcheking />
        
      </ManagerSidebar>
    </div>
  );
}

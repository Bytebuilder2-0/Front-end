import React from "react";
import ManagerSidebar from "../../components/ui/ManagerMiniDrawer";
import Apointmentcheking from "../../components/ManagerDashboard/ApointmentChecking";
import StatusSummary from "../../components/ManagerDashboard/ImfoBox"; //  Import added

export default function ManagerDashboardPage() {
  return (
    <div>
      <ManagerSidebar>
        <h1>Manager Dashboard</h1>

        {/*  StatusSummary added here */}
        <div style={{ padding: "20px 0" }}>
          <StatusSummary />
        </div>

        {/* Appointment Checking section */}
        <Apointmentcheking />
      </ManagerSidebar>
    </div>
  );
}

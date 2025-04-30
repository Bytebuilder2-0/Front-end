import React from "react";
import ManagerSidebar from "../../components/ui/ManagerMiniDrawer";
import Apointmentcheking from "../../components/ManagerDashboard/ApointmentChecking";

export default function ManagerDashboardPage() {
  return (
    <div>
      
      <ManagerSidebar>
      <h1> Manager Dashboard</h1>
      <Apointmentcheking/>

      </ManagerSidebar>
    </div>
  );
}
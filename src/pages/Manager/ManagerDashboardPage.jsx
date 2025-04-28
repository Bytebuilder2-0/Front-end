import React from "react";
import ManagerSidebar from "../../components/ui/ManagerMiniDrawer";
import Apointmentcheking from "../../components/ManagerDashboard/ApointmentChecking";

export default function ManagerDashboardPage() {
  return (
    <div>
      
      <ManagerSidebar>
      <Apointmentcheking/>
      <h1>this manager dashboard</h1>
      </ManagerSidebar>
    </div>
  );
}
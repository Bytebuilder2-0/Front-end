import React from "react";
import ManagerSidebar from "../../components/ui/ManagerMiniDrawer";
import Apointmentcheking from "../../components/ManagerDashboard/ApointmentChecking";
import axiosInstance from "../../utils/axiosInstance";
import protectedRoutes from "../../components/protectedRoutes";

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
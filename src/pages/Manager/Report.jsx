import React from "react";
import ReportComponent from "../../components/ManagerReport/ReportMain";
import ManagerSidebar from "../../components/ui/ManagerMiniDrawer";

export default function Report() {
  return (
    <div>
      <ManagerSidebar>
        <ReportComponent />
      </ManagerSidebar>
    </div>
  );
}

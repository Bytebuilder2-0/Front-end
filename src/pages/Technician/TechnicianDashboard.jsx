import React from "react";
import TAssignedWork from "../../components/TAssignedWork";
import TechnicianMiniDrawer from "../../components/ui/TechnicianMiniDrawer";
import TStatusSummary from "../../components/sub/TStatusSummary";

function TechnicianDashboard() {
  return (
    <div>
      <TechnicianMiniDrawer>
        <TStatusSummary />
        <TAssignedWork />
      </TechnicianMiniDrawer>
    </div>
  );
}

export default TechnicianDashboard;

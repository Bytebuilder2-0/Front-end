import React from "react";
import TAssignedWork from "../../components/TAssignedWork";
import TechnicianMiniDrawer from "../../components/ui/TechnicianMiniDrawer";

function TechnicianDashboard() {
  return (
    <div>
      <TechnicianMiniDrawer>
         <TAssignedWork/>
      </TechnicianMiniDrawer>
        
    </div>
  );
}

export default TechnicianDashboard;

import React from "react";
import ReportComponent from "../../components/ManagerReport/ReportMain";
import ManagerSidebar from "../../components/ui/ManagerMiniDrawer";
import { Box, Toolbar, Divider } from "@mui/material";
import PathNaming from "../../components/sub/PathNaming";

export default function Report() {
  return (
    <div>
      <ManagerSidebar>
        <PathNaming label="Report" path="Manager/Report" />
        <Divider />
        <ReportComponent />
      </ManagerSidebar>
    </div>
  );
}

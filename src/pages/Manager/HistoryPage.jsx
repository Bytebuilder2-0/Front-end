import React from "react";
import ManagerHistory from "../../components/ManagerHistory/ManagerHistory";
import ManagerSidebar from "../../components/ui/ManagerMiniDrawer";
import { Box, Toolbar, Divider } from "@mui/material";
import PathNaming from "../../components/sub/PathNaming";

export default function HistoryPage() {
  return (
    <div>
      <ManagerSidebar>
        <PathNaming label="History" path="Manager/History" />
        <Divider />
        <ManagerHistory />
      </ManagerSidebar>
    </div>
  );
}

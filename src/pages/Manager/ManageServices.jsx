import React from "react";
import ServiceManager from "../../components/ServiceManage/ServiceManage";
import ManagerSidebar from "../../components/ui/ManagerMiniDrawer";
import { Box, Toolbar, Divider } from "@mui/material";
import PathNaming from "../../components/sub/PathNaming";

export default function ManageServices() {
  return (
    <div>
      <ManagerSidebar>
        <PathNaming label="Manage Services" path="Manager/Manage Services" />
        <Divider />
        <ServiceManager />
      </ManagerSidebar>
    </div>
  );
}

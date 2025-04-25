import React from "react";
import ServiceManager from "../../components/ServiceManage/ServiceManage";
import ManagerSidebar from "../../components/ui/ManagerMiniDrawer";

export default function ManageServices() {
  return (
    <div>
      <ManagerSidebar>
      <ServiceManager />
      </ManagerSidebar>
    </div>
  );
}

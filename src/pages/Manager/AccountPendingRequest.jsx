import React from "react";
import ManagerSidebar from "../../components/ui/ManagerMiniDrawer";
import AccountRequest from "../../components/ManagerDashboard/AccountRequest";

export default function AccountPendingRequest() {
  return (
    <div>
      <ManagerSidebar>
        <AccountRequest />
      </ManagerSidebar>
    </div>
  );
}
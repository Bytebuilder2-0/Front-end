import React from "react";
import { Divider, Box, Container } from "@mui/material";
import ManagerSidebar from "../../components/ui/ManagerMiniDrawer";
import PathNaming from "../../components/sub/PathNaming";
import AccountRequest from "../../components/ManagerDashboard/AccountRequest";

export default function AccountPendingRequest() {
  return (
    <ManagerSidebar>
      <PathNaming label="Check Status" path="manager/account-pending-request" />
      <Divider/>

          <AccountRequest />
    </ManagerSidebar>
  );
}

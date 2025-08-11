import { Box, Toolbar, Divider } from "@mui/material";
import ManagerSidebar from "../../components/ui/ManagerMiniDrawer";
import Apointmentcheking from "../../components/ManagerDashboard/CheckStatus";
import PathNaming from "../../components/sub/PathNaming";

export default function CheckStatus() {
  return (
    <div>
      <ManagerSidebar>
        <PathNaming label="Check Status" path="Manager/Check Status" />
        <Divider />

        <Apointmentcheking />
      </ManagerSidebar>
    </div>
  );
}

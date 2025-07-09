import React from 'react'
import ManagerSidebar from "../../components/ui/ManagerMiniDrawer";
import Apointmentcheking from "../../components/ManagerDashboard/CheckStatus";

export default function CheckStatus() {
  return (
    <div>
       <ManagerSidebar>
                    <Apointmentcheking/>
        </ManagerSidebar>
    </div>
  )
}

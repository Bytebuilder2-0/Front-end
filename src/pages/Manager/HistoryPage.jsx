import React from 'react'
import ManagerHistory from "../../components/ManagerHistory/ManagerHistory"
import ManagerSidebar from "../../components/ui/ManagerMiniDrawer";


export default function HistoryPage() {
  return (
    <div>
        <ManagerSidebar>
              <ManagerHistory/>
         </ManagerSidebar>
      
    </div>
  )
}

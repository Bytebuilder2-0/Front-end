import { useEffect, useState } from "react";
import axios from "axios";
import { Container, Typography, Paper } from "@mui/material";
import Feedback from "../../components/Feedback/Feedback";
import ManagerSidebar from "../../components/ui/ManagerMiniDrawer";



export default function FeedbackPage() {
  return (
    <div>
      <ManagerSidebar>
      <Feedback/>
      </ManagerSidebar>
    </div>
  )
}

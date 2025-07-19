import { useEffect, useState } from "react";
import axios from "axios";
import { Container, Typography, Paper } from "@mui/material";
import Feedback from "../../components/Feedback/Feedback";
import ManagerSidebar from "../../components/ui/ManagerMiniDrawer";
import { Box, Toolbar, Divider } from "@mui/material";
import PathNaming from "../../components/sub/PathNaming";

export default function FeedbackPage() {
  return (
    <div>
      <ManagerSidebar>
        <PathNaming label="Manage FeedBack" path="Manager/Manage FeedBack" />
        <Divider />
        <Feedback />
      </ManagerSidebar>
    </div>
  );
}

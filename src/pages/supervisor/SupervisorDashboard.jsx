import React from "react";
import { Box, Toolbar, Divider } from "@mui/material";

import AppointmentData from "../../components/AppintmentData";
import MiniDrawer from "../../components/ui/MiniDrawer";
import PathNaming from "../../components/sub/PathNaming";

function SupervisorDashboard() {
	return (
		<>
			<Box sx={{ display: "flex" }}>
				<MiniDrawer />
				<Box component="main" sx={{ flexGrow: 1, pl: 3, pr: 3 }}>
					<Toolbar />
					<PathNaming label="Dashboard" path="Supervisor/Dashboard" />
					<Divider />
					<AppointmentData />
				</Box>
			</Box>
		</>
	);
}

export default SupervisorDashboard;

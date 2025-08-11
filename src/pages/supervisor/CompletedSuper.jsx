import React from "react";
import { Box, Toolbar, Divider } from "@mui/material";

import CompletedS from "../../components/CompletedS";
import MiniDrawer from "../../components/ui/MiniDrawer";
import PathNaming from "../../components/sub/PathNaming";

function CompletedSuper() {
	return (
		<Box sx={{ display: "flex" }}>
		
			<Box component="main" sx={{ flexGrow: 1, pl: 3, pr: 3 }}>
				<Toolbar />
				<PathNaming label="Completed" path="Supervisor/Completed" />
				<Divider />
				<CompletedS />
			</Box>
		</Box>
	);
}

export default CompletedSuper;

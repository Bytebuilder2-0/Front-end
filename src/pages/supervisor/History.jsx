import React from "react";
import { Box, Toolbar, Divider } from "@mui/material";

import PathNaming from "../../components/sub/PathNaming";
import MiniDrawer from "../../components/ui/MiniDrawer";
import SupHistory from "../../components/SupHistory";

function History() {
	return (
		<Box sx={{ display: "flex" }}>
			<MiniDrawer />
			<Box component="main" sx={{ flexGrow: 1, pl: 3, pr: 3 }}>
				<Toolbar />
				<PathNaming label="History" path="Supervisor/History" />
				<Divider />
				<SupHistory />
			</Box>
		</Box>
	);
}

export default History;

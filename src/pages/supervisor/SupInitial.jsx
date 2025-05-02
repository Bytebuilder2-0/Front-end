import React from "react";
import { Box, Toolbar, Divider } from "@mui/material";

import InitialCheck from "../../components/InitialCheck";
import MiniDrawer from "../../components/ui/MiniDrawer";
import StatusSummary from "../../components/sub/StatusSummary";
import PathNaming from "../../components/sub/PathNaming";

const SupInitial = () => {
	return (
		<>
			<Box sx={{ display: "flex" }}>
				<MiniDrawer />
				<Box component="main" sx={{ flexGrow: 1, pl: 3, pr: 3 }}>
					<Toolbar />
					<PathNaming label="Home" path="Supervisor/Home" />
					<Divider />
					<StatusSummary />
					<InitialCheck />
				</Box>
			</Box>
		</>
	);
};

export default SupInitial;

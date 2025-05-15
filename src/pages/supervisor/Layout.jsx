// components/Layout.jsx
import React from "react";
import { Box } from "@mui/material";
import MiniDrawer from "../../components/ui/MiniDrawer";
import { Outlet } from "react-router-dom";

const Layout = () => {
	return (
		<Box sx={{ display: "flex" }}>
			<MiniDrawer/>
			<Box component="main" sx={{ flexGrow: 1 }}>
				<Outlet />
			</Box>
		</Box>
	);
};

export default Layout;

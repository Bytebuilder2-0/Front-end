import * as React from "react";
// Importing necessary components and hooks from Material UI
import { styled, useTheme } from "@mui/material/styles";
import {
	Box,
	CssBaseline,
	Toolbar,
	Typography,
	IconButton,
	Avatar,
	Divider,
	List,
	ListItem,
	ListItemButton,
	ListItemIcon,
	ListItemText,
	AppBar as MuiAppBar,
	Drawer as MuiDrawer,
	useMediaQuery,
	Badge,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import {
	Menu as MenuIcon,
	ChevronLeft as ChevronLeftIcon,
	Home as HomeIcon,
	Feedback as FeedbackIcon,
	Build as BuildIcon,
	Dashboard as DashboardIcon,
	Notifications as NotificationsIcon,
	DoneOutline as DoneOutlineIcon,
	Error as ErrorIcon,
	AutoGraph as AutoGraphIcon,
	AccountCircle,
} from "@mui/icons-material";

import ApprovalIcon from "@mui/icons-material/Approval";
import Account from "../Atoms/Account";
import Notify from "../Atoms/Notify";
import { Link } from "react-router-dom";
import  { useEffect, useState } from "react";
import axios from "axios";
// Define the width of the drawer
const drawerWidth = 240;

// Styling function for an opened Drawer
const openedMixin = (theme) => ({
	width: drawerWidth,
	transition: theme.transitions.create("width", {
		easing: theme.transitions.easing.sharp,
		duration: theme.transitions.duration.enteringScreen,
	}),
	overflowX: "hidden", // Hide overflow content
});

// Styling function for a closed Drawer
const closedMixin = (theme) => ({
	transition: theme.transitions.create("width", {
		easing: theme.transitions.easing.sharp,
		duration: theme.transitions.duration.leavingScreen,
	}),
	overflowX: "hidden",
	width: `calc(${theme.spacing(7)} + 1px)`, // Compact width when closed
	[theme.breakpoints.up("sm")]: {
		width: `calc(${theme.spacing(8)} + 1px)`, // Slightly bigger on larger screens
	},
});

// Custom AppBar component styling
const AppBar = styled(MuiAppBar, {
	shouldForwardProp: (prop) => prop !== "open" && prop !== "issmallscreen",
})(({ theme, open, issmallscreen }) => ({
	zIndex: theme.zIndex.drawer + 1, // Keep AppBar above Drawer
	transition: theme.transitions.create(["width", "margin"], {
		easing: theme.transitions.easing.sharp,
		duration: theme.transitions.duration.leavingScreen,
	}),
	...(open &&
		!issmallscreen && {
			marginLeft: drawerWidth, // Push AppBar right when Drawer is open
			width: `calc(100% - ${drawerWidth}px)`, // Adjust width
		}),
}));

// Custom Drawer component styling
const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== "open" })(
	({ theme, open }) => ({
		width: drawerWidth,
		flexShrink: 0,
		whiteSpace: "nowrap",
		boxSizing: "border-box",
		...(open && {
			...openedMixin(theme),
			"& .MuiDrawer-paper": openedMixin(theme),
		}),
		...(!open && {
			...closedMixin(theme),
			"& .MuiDrawer-paper": closedMixin(theme),
		}),
	})
);

// DrawerHeader for maintaining consistent AppBar height
const DrawerHeader = styled("div")(({ theme }) => ({
	display: "flex",
	alignItems: "center",
	justifyContent: "flex-end",
	...theme.mixins.toolbar, // MUI built-in toolbar height
}));

// Main ManagerSidebar component
export default function TechnicianMiniDrawer({ children }) {
	const theme = useTheme(); // Using MUI theme
	const navigate = useNavigate(); // Hook for navigation
	const [open, setOpen] = React.useState(true); // State to handle desktop drawer open/close
	const [mobileOpen, setMobileOpen] = React.useState(false); // State to handle mobile drawer open/close
	const isSmallScreen = useMediaQuery(theme.breakpoints.down("md")); // Check if current screen size is small

	const [techProfile, setTechProfile] = useState({ name: "", profilePhoto: "" });

useEffect(() => {
	axios
		.get("http://localhost:5000/api/user/profile", {
			headers: {
				Authorization: `Bearer ${localStorage.getItem("token")}`, // only if using JWT
			},
			withCredentials: true, // only if using cookies
		})
		.then((res) => {
			if (res.data.success) {
				setTechProfile(res.data.data);
			}
		})
		.catch((err) => {
			console.error("Failed to fetch technician profile", err);
		});
}, []);


	// Function to toggle drawer open and close based on screen size
	const handleDrawerToggle = () => {
		if (isSmallScreen) {
			setMobileOpen(!mobileOpen); // Toggle temporary drawer
		} else {
			setOpen((prevOpen) => !prevOpen); // Toggle persistent drawer
		}
	};

	// Sidebar navigation items with their icons and labels
	const navItems = [
		{
			path: "/TDashboard",
			label: "Assigned",
			icon: <DashboardIcon sx={{ color: "#ffffff" }} />,
		},
		{
			path: "/TAccepted",
			label: "Accepted",
			icon: <ApprovalIcon sx={{ color: "#ffffff" }} />,
		},
		{
			path: "/TInprogress",
			label: "InProgress",
			icon: <AutoGraphIcon sx={{ color: "#ffffff" }} />,
		},
		{
			path: "/TCompleted",
			label: "Completed",
			icon: <DoneOutlineIcon color="success" />,
		},
		{
			path: "/TDeclined",
			label: "Declined",
			icon: <ErrorIcon sx={{ color: "#ffffff" }} />,
		},
	];

	// JSX for sidebar drawer content
	const drawerContent = (
		<>
			<DrawerHeader>
				{/* Company Logo inside Drawer */}
				<Link to="/">
					<img
						src="/assets/frame.png"
						alt="Logo"
						style={{
							height: "64px",
							width: "auto",
							opacity: "100%",
							backgroundColor: "#fff",
						}}
					/>
				</Link>
			</DrawerHeader>
			<Divider />
			{/* Technician Profile Section */}
			<Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", mt: 2 }}>
	<Avatar
		src={techProfile.profilePhoto || undefined}
		alt={techProfile.name || "Technician"}
		sx={{ width: 100, height: 100 }}
	>
		{!techProfile.profilePhoto && techProfile.name
			? techProfile.name.charAt(0).toUpperCase()
			: <AccountCircle fontSize="large" />}
	</Avatar>
	<Typography sx={{ mt: 1, fontWeight: 500 }}>
		{techProfile.name || "Technician"}
	</Typography>
</Box>


			<Divider sx={{ mx: 2, my: 1 }} />
			{/* Sidebar Menu Items */}
			<List>
				{navItems.map(({ path, label, icon }) => (
					<ListItem
						key={path}
						disablePadding
						sx={{ display: "block" }}
						onClick={() => navigate(path)}
					>
						<ListItemButton selected={window.location.pathname === path}>
							<ListItemIcon sx={{ minWidth: 0, mr: 2 }}>{icon}</ListItemIcon>
							<ListItemText primary={label} />
						</ListItemButton>
					</ListItem>
				))}
			</List>
		</>
	);

	return (
		<Box sx={{ display: "flex" }}>
			{/* Reset baseline CSS */}
			<CssBaseline />

			{/* Top AppBar */}
			<AppBar
				position="fixed"
				open={open}
				issmallscreen={isSmallScreen}
				sx={{ backgroundColor: "#428bca" }}
			>
				<Toolbar>
					{/* Toggle Drawer Button */}
					<IconButton
						color=""
						onClick={handleDrawerToggle}
						edge="start"
						sx={{ marginRight: 2 }}
					>
						{!isSmallScreen && open ? (
							<ChevronLeftIcon sx={{ color: "#ffffffff" }} />
						) : (
							<MenuIcon sx={{ color: "#ffffffff" }} />
						)}
					</IconButton>

					{/* Manager Panel Title */}
					<Typography
						variant="h6"
						noWrap
						component="div"
						sx={{ flexGrow: 1 }}
						color="black"
					></Typography>

					{/* Notification and Account Icons */}
					<Box sx={{ display: { xs: "none", md: "flex" }, alignItems: "center", gap: 2 }}>
						{/* Notifications Icon with badge */}

						{/*<Notify />*/}
						
						{/* Account Profile Icon */}

						<Account />
					</Box>
				</Toolbar>
			</AppBar>

			{/* Sidebar Drawer for mobile and desktop */}
			{isSmallScreen ? (
				<MuiDrawer
					variant="temporary"
					open={mobileOpen}
					onClose={handleDrawerToggle}
					ModalProps={{ keepMounted: true }}
					sx={{ "& .MuiDrawer-paper": { boxSizing: "border-box", width: drawerWidth } }}
				>
					{drawerContent}
				</MuiDrawer>
			) : (
				<MuiDrawer
					variant="persistent"
					open={open}
					sx={{
						"& .MuiDrawer-paper": {
							boxSizing: "border-box",
							width: drawerWidth,
							backgroundColor: "#33383E",
							color: "white",
						},
					}}
				>
					{drawerContent}
				</MuiDrawer>
			)}

			{/* Main Content Area beside Drawer */}
			<Box
				component="main"
				sx={{
					flexGrow: 1,
					p: { xs: 2, md: 3 },
					transition: theme.transitions.create("margin", {
						easing: theme.transitions.easing.sharp,
						duration: theme.transitions.duration.leavingScreen,
					}),
					marginLeft: !isSmallScreen && open ? `${drawerWidth}px` : 0,
				}}
			>
				{/* Spacer for AppBar */}
				<DrawerHeader />
				{/* Children components will be rendered here */}
				{children}
			</Box>
		</Box>
	);
}

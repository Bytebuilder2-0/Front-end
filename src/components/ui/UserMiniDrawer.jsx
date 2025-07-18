import * as React from "react";
import { useEffect, useState, useMemo } from "react";
import { styled } from "@mui/material/styles";
import axios from "axios";
import { useAuth } from '../../context/AuthContext';

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
	CircularProgress,
	AppBar as MuiAppBar,
	Drawer as MuiDrawer,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import {
	Menu as MenuIcon,
	ChevronLeft as ChevronLeftIcon,
	Home as HomeIcon,
	Feedback as FeedbackIcon,
	Schedule as TodayIcon,
	List as ListIcon,
	ExpandLess,
	Dashboard as DashboardIcon,
	ExpandMore,
} from "@mui/icons-material";
import Notify from "../Atoms/Notify";
import Account from "../Atoms/Account";
import { Link } from "react-router-dom";

const drawerWidth = 240;

const openedMixin = (theme) => ({
	width: drawerWidth,
	transition: theme.transitions.create("width", {
		easing: theme.transitions.easing.sharp,
		duration: theme.transitions.duration.enteringScreen,
	}),
	overflowX: "hidden",
});

const closedMixin = (theme) => ({
	transition: theme.transitions.create("width", {
		easing: theme.transitions.easing.sharp,
		duration: theme.transitions.duration.leavingScreen,
	}),
	overflowX: "hidden",
	width: `calc(${theme.spacing(7)} + 1px)`,
	[theme.breakpoints.up("sm")]: {
		width: `calc(${theme.spacing(8)} + 1px)`,
	},
});

const AppBar = styled(MuiAppBar)(({ theme }) => ({
	zIndex: theme.zIndex.drawer + 1, // ensures it's above the drawer
	width: "100%", // always full width
	transition: theme.transitions.create(["background-color"], {
		easing: theme.transitions.easing.sharp,
		duration: theme.transitions.duration.leavingScreen,
	}),
}));

const Drawer = styled(MuiDrawer, {
	shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
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
}));

const DrawerHeader = styled("div")(({ theme }) => ({
	...theme.mixins.toolbar, //this div is same height as the appbar height
}));

export default function UserMiniDrawer() {
	const { user, token } = useAuth();
	const [open, setOpen] = React.useState(true);
	const navigate = useNavigate();
	const [expanded, setExpanded] = useState({ "My Appointments": false });
	const [loading, setLoading] = useState(true);
	const [appointments, setAppointments] = useState([]);
	const [profile, setProfile] = useState(null);

	const handleDrawerOpen = () => setOpen(true);
	const handleDrawerClose = () => setOpen(false);

	const handleExpandClick = (menuItem) => {
		console.log("Toggling menu:", menuItem);
		setExpanded((prev) => ({ ...prev, [menuItem]: !prev[menuItem] }));
	};

	useEffect(() => {
		const fetchAppointments = async () => {
			try {
				console.log("Auth context:", { user, token });
				if (!user?.id) {
					console.error("No valid user ID available - user:", user);
					return;
				}

				setLoading(true);
				console.log("Fetching appointments for user:", user);

				const API_URL = `http://localhost:5000/api/appointments/user/${user.id}`;
				console.log("Request URL:", API_URL);

				const response = await axios.get(API_URL);
				let appointmentsData = response.data;

				// Ensure the response is an array
				if (appointmentsData && !Array.isArray(appointmentsData)) {
					if (appointmentsData.data && Array.isArray(appointmentsData.data)) {
						appointmentsData = appointmentsData.data;
					} else {
						appointmentsData = [];
					}
				}

				const filtered = appointmentsData.filter(
					(appt) => appt && !["Cancelled", "All done", "Reject1", "Paid"].includes(appt.status)
				);

				setAppointments(filtered);
			} catch (err) {
				console.error("Error details:", {
					message: err.message,
					response: err.response?.data,
					status: err.response?.status,
				});
				setAppointments([]);
			} finally {
				setLoading(false);
			}
		};

		const fetchProfile = async () => {
			try {
				const response = await axios.get('http://localhost:5000/api/user/profile', {
					headers: { Authorization: `Bearer ${token}` },
				});
				console.log("Fetched profile:", response.data);
				setProfile(response.data.user);
			} catch (error) {
				console.error("Failed to fetch profile photo:", error);
			}
		};

		if (user?.id && token) {
			fetchAppointments();
			fetchProfile();
		}
	}, [user, token]);

	const menuItems = useMemo(
		() => [
			{ path: "/", label: "Home", icon: <HomeIcon sx={{ color: "#ffffff" }} /> },
			{ path: "/User", label: "Dashboard", icon: <DashboardIcon sx={{ color: "#ffffff" }}/> },
			{
				path: "/appointments/new",
				label: "Make an Appointment",
				icon: <TodayIcon sx={{ color: "#ffffff" }} />,
			},
			{
				label: "My Appointments",
				icon: <ListIcon sx={{ color: "#ffffff" }}/> ,
				hasChildren: true,
				children: appointments.map((appt) => ({
					path: `/appointments/${appt._id}`,
					label: appt.model || `Vehicle ${appt._id?.substring(0, 4)}`,
					status: appt.status,
				})),
			},
			{ path: "/UserFeedback", label: "FeedBack", icon: <FeedbackIcon sx={{ color: "#ffffff" }}/> },
		],
		[appointments]
	);

	return (
		<Box sx={{ display: "flex" }}>
			<CssBaseline />
			<AppBar position="fixed" sx={{ backgroundColor: "#428bca", zIndex: (theme) => theme.zIndex.drawer + 1 }}>
				<Toolbar disableGutters>
					<Box sx={{ width: drawerWidth, display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "#fff" }}>
						<Link to="/" style={{ display: "inline-block", lineHeight: 0, margin: 0, padding: 0 }}>
							<img src="/assets/resized-garage24.png" alt="Frame" style={{ height: "64px", width: drawerWidth, objectFit: "contain" }} />
						</Link>
					</Box>

					<IconButton color="inherit" onClick={open ? handleDrawerClose : handleDrawerOpen} edge="end" sx={{ marginRight: 2 }}>
						{open ? <ChevronLeftIcon sx={{ color: "#ffffffff" }} /> : <MenuIcon sx={{ color: "#ffffffff" }} />}
					</IconButton>
					<Box sx={{ flexGrow: 1 }} />
					<Box sx={{ display: { xs: "none", md: "flex" }, alignItems: "center", gap: 2, pr: 5 }}>
						<Notify />
						<Account />
					</Box>
				</Toolbar>
			</AppBar>

			{/* Sidebar Drawer */}
			<Drawer variant="permanent" open={open} sx={{ "& .MuiDrawer-paper": { backgroundColor: "#33383E", color: "white" } }}>
				<DrawerHeader />
				<Divider />
				{/* User Avatar */}
				{open && (
					<Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", mt: 2, mb: 2 }}>
						<Avatar alt={profile?.name} src={profile?.profilePhoto || ''} sx={{ width: 100, height: 100 }}>
							{(!profile?.profilePhoto && profile?.name) ? profile.name[0].toUpperCase() : 'U'}
						</Avatar>
						<Typography sx={{ mt: 1 }}>{profile?.name || 'User'}</Typography>
					</Box>
				)}
				{open && <Divider sx={{ borderColor: "#ffffff", mr: 3, ml: 3 }} />}
				{/* Navigation List */}
				<List>
					{menuItems.map((item) => (
						<React.Fragment key={item.path || item.label}>
							<ListItem disablePadding sx={{ display: "block" }}>
								<ListItemButton onClick={() => item.path ? navigate(item.path) : handleExpandClick(item.label)} selected={window.location.pathname === item.path}>
									<ListItemIcon sx={{ minWidth: 0, justifyContent: "center", marginRight: 2 }}>{item.icon}</ListItemIcon>
									<ListItemText primary={item.label} sx={{ opacity: open ? 1 : 0 }} />
									{item.hasChildren && (expanded[item.label] ? <ExpandLess /> : <ExpandMore />)}
								</ListItemButton>
							</ListItem>
							{item.hasChildren && expanded[item.label] && (
								<List component="div" disablePadding>
									{loading ? (
										<ListItem>
											<CircularProgress size={24} />
										</ListItem>
									) : item.children?.length > 0 ? (
										item.children.map((child, index) => (
											<ListItem key={child.path || `child-${index}`} disablePadding sx={{ pl: 4 }} onClick={() => navigate(child.path)}>
												<ListItemButton selected={window.location.pathname === child.path}>
													<ListItemText primary={child.label} />
												</ListItemButton>
											</ListItem>
										))
									) : (
										<ListItem sx={{ pl: 4 }}>
											<ListItemText primary="No Appointments" />
										</ListItem>
									)}
								</List>
							)}
						</React.Fragment>
					))}
				</List>
			</Drawer>
		</Box>
	);
}

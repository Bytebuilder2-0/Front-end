import * as React from "react";
import { useEffect, useState } from "react";
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
	History as HistoryIcon,
	Notifications as NotificationsIcon,
	Feedback as FeedbackIcon,
	Edit as EditIcon,
	Schedule as TodayIcon,
	List as ListIcon,
	ExpandLess,
	Dashboard as DashboardIcon,
	ExpandMore,
} from "@mui/icons-material";
import Notify from "../Atoms/Notify";
import Account from "../Atoms/Account";
import ProfilePage from "../../pages/ProfilePage";

const drawerWidth = 240;

// Drawer Opened Styling
const openedMixin = (theme) => ({
	width: drawerWidth,
	transition: theme.transitions.create("width", {
		easing: theme.transitions.easing.sharp,
		duration: theme.transitions.duration.enteringScreen,
	}),
	overflowX: "hidden",
});

// Drawer Closed Styling
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

// Custom AppBar
const AppBar = styled(MuiAppBar, {
	shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
	zIndex: theme.zIndex.drawer + 1,
	transition: theme.transitions.create(["width", "margin"], {
		easing: theme.transitions.easing.sharp,
		duration: theme.transitions.duration.leavingScreen,
	}),
	...(open && {
		marginLeft: drawerWidth,
		width: `calc(100% - ${drawerWidth}px)`,
		transition: theme.transitions.create(["width", "margin"], {
			easing: theme.transitions.easing.sharp,
			duration: theme.transitions.duration.enteringScreen,
		}),
	}),
}));

// Custom Drawer
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

// Drawer Header
const DrawerHeader = styled("div")(({ theme }) => ({
	display: "flex",
	alignItems: "center",
	justifyContent: "flex-end",

	...theme.mixins.toolbar,
}));

export default function UserMiniDrawer({ userId }) {
	const { user, token } = useAuth();
	const [open, setOpen] = React.useState(true);
	const navigate = useNavigate();
	const [expanded, setExpanded] = useState({ "My Appointments": false });
	const [loading, setLoading] = useState(true);
	const [profile, setProfile] = useState(null);


	const handleDrawerOpen = () => setOpen(true);
	const handleDrawerClose = () => setOpen(false);

	// const { id } = useParams(); // Get appointment ID from the URL
	const [appointments, setAppointments] = useState([]);

	useEffect(() => {
		const fetchAppointments = async () => {
			try {
				setLoading(true);
				const API_URL = `http://localhost:5000/api/appointments/user/${userId}`
				const response = await axios.get(API_URL, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
				});

				let appointmentsData = response.data;
				console.log("Filtered appointments:", 
                 appointments.filter((appt) => !["Cancelled", "All done", "Reject1"].includes(appt?.status))
					);
				if (appointmentsData && !Array.isArray(appointmentsData)) {
					// If backend wraps array in an object (like { data: [...] })
					if (
						appointmentsData.data &&
						appointmentsData.data &&
						Array.isArray(appointmentsData.data)
					) {
						appointmentsData = appointmentsData.data;
					} else {
						// Convert single appointment to array
						appointmentsData = [];
					}
				}

				setAppointments(appointmentsData || []);
			} catch (err) {
				console.error("Full error:", err);
				console.error("Error response:", err.response);
				setAppointments([]);
			} finally {
				setLoading(false);
			}
		};

		if (userId) {
			fetchAppointments();
		}
		if (!token) return;

	const fetchProfile = async () => {
		try {
			const response = await axios.get('http://localhost:5000/api/user/profile', form, {
				headers: { Authorization: `Bearer ${token}` }
			});
			setProfile(response.data.user);
		} catch (error) {
			console.error("Failed to fetch profile photo:", error);
		}
	};

	fetchProfile();
		
	}, [userId, token]);

	
	

	const handleExpandClick = (menuItem) => {
		setExpanded((prev) => ({ ...prev, [menuItem]: !prev[menuItem] }));
	};

	return (
		<Box sx={{ display: "flex" }}>
			<CssBaseline />
			{/* App Bar */}
			<AppBar position="fixed" sx={{ backgroundColor: "#9CE178" }}>
				<Toolbar>
					{/* Flex container to separate left and right items */}
					<Box
						sx={{
							display: "flex",
							justifyContent: "space-between",
							alignItems: "center",
							width: "100%",
						}}
					>
						{/* Left section: Menu icon + image */}
						<Box sx={{ display: "flex", alignItems: "center" }}>
							<IconButton
								color="inherit"
								onClick={open ? handleDrawerClose : handleDrawerOpen}
								edge="start"
								sx={{ marginRight: 2 }}
							>
								{open ? <ChevronLeftIcon /> : <MenuIcon />}
							</IconButton>

							<img
								src="/assets/image.png"
								alt="Frame"
								style={{
									height: "64px",
									width: "auto",
								}}
							/>
						</Box>

						{/* Right section: Notify + Account */}
						<Box
							sx={{
								display: { xs: "none", md: "flex" },
								alignItems: "center",
								gap: 2,
							}}
						>
							<Notify />
							<Account />
						</Box>
					</Box>
				</Toolbar>
			</AppBar>

			{/* Sidebar Drawer */}
			<Drawer variant="permanent" open={open}>
				<DrawerHeader></DrawerHeader>
				<Divider />

				{/* User Avatar */}
				{open && (
					<Box
						sx={{
							display: "flex",
							flexDirection: "column",
							alignItems: "center",
							mt: 2,
							mb: 2,
						}}
					>

													{/* <img
							src={profile?.profilePhoto}
							alt="preview"
							style={{ width: 100, height: 100, objectFit: 'cover', borderRadius: '50%' }}
							/> */}


						<Avatar
	                       src={profile?.profilePhoto || ''}
	                       sx={{ width: 100, height: 100 }}
						   >
 
                         {!profile?.profilePhoto && (profile?.name?.[0] || 'U')}
                        </Avatar> 

						<br />
						<Typography>{profile?.name || 'User'}</Typography>


					</Box>
				)}
				{open && <Divider sx={{ mx: 2, my: 1 }} />}

				{/* Navigation List */}
				<List>
					{[
						{ path: "", label: "Home", icon: <HomeIcon /> },
						{ path: "/User", label: "Dashboard", icon: <DashboardIcon /> },
						{
							path: "/appointments/new",
							label: "Make an Appointemnt",
							icon: <TodayIcon />,
						},
						{ path: "", label: "Notifications", icon: <NotificationsIcon /> },
						{
							label: "My Appointments",
							icon: <ListIcon />,
							hasChildren: true,
							children: appointments
								.filter((appt) => !["Cancelled", "All done","Reject1"].includes(appt?.status))
								.map((appt) => ({
									path: `/appointments/${appt._id}`,
									label: appt.model || `Vehicle ${appt._id.substring(0, 4)}`, // Fallback to partial ID if no model
									status: appt.status,
								})),
						},
//---------------------this should be updated================================================================================================================
						{ path: "", label: "History", icon: <HistoryIcon /> },
						{ path: "/ProfilePage", label: "Edit Profile", icon: <EditIcon /> },
						{ path: "", label: "FeedBack", icon: <FeedbackIcon /> },
					].map((item) => (
						<React.Fragment key={item.path || item.label}>
							<ListItem disablePadding sx={{ display: "block" }}>
								<ListItemButton
									onClick={() =>
										item.path ? navigate(item.path) : handleExpandClick(item.label)
									}
									selected={window.location.pathname === item.path}
								>
									<ListItemIcon
										sx={{ minWidth: 0, justifyContent: "center", marginRight: 2 }}
									>
										{item.icon}
									</ListItemIcon>
									<ListItemText primary={item.label} sx={{ opacity: open ? 1 : 0 }} />
									{item.hasChildren &&
										(expanded[item.label] ? <ExpandLess /> : <ExpandMore />)}
										
								</ListItemButton>
							</ListItem>
							

							{item.hasChildren && expanded[item.label] && (
								<List component="div" disablePadding>
									{loading ? (
										<ListItem>
											<CircularProgress size={7} />
										</ListItem>
									) : (
										item.children.map((child) => (
											<ListItem
												key={child.path}
												disablePadding
												sx={{ pl: 4 }}
												onClick={() => navigate(child.path)}
											>
												<ListItemButton
													selected={window.location.pathname === child.path}
												>
													<ListItemText primary={child.label} />
												</ListItemButton>
											</ListItem>
										))
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

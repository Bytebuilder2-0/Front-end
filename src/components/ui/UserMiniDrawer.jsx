import * as React from "react";
import { useEffect, useState, useMemo } from "react";
import { styled } from "@mui/material/styles";
import axios from "axios";
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
	Chip,
	Fade,
} from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
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
import HistoryIcon from '@mui/icons-material/History';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import { useAuth } from "../../context/AuthContext";
import Account from "../Atoms/Account";
import { Link } from "react-router-dom";

const drawerWidth = 260;

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
	zIndex: theme.zIndex.drawer + 1,
	width: "100%",
	background: "linear-gradient(135deg, #428BCA 0%, #33383E 100%)",
	boxShadow: "0 4px 20px rgba(66, 139, 202, 0.3)",
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
		"& .MuiDrawer-paper": {
			...openedMixin(theme),
			background: "linear-gradient(180deg, #33383E 0%, #2c3136 100%)",
			borderRight: "1px solid rgba(66, 139, 202, 0.2)",
		},
	}),
	...(!open && {
		...closedMixin(theme),
		"& .MuiDrawer-paper": {
			...closedMixin(theme),
			background: "linear-gradient(180deg, #33383E 0%, #2c3136 100%)",
			borderRight: "1px solid rgba(66, 139, 202, 0.2)",
		},
	}),
}));

const DrawerHeader = styled("div")(({ theme }) => ({
	...theme.mixins.toolbar,
}));

const StyledListItemButton = styled(ListItemButton)(({ theme }) => ({
	margin: "4px 12px",
	borderRadius: "12px",
	transition: "all 0.3s ease",
	"&:hover": {
		backgroundColor: "rgba(66, 139, 202, 0.15)",
		transform: "translateX(4px)",
	},
	"&.Mui-selected": {
		backgroundColor: "rgba(66, 139, 202, 0.25)",
		borderLeft: "4px solid #428BCA",
		"&:hover": {
			backgroundColor: "rgba(66, 139, 202, 0.3)",
		},
	},
}));

const UserAvatar = styled(Avatar)(({ theme }) => ({
	width: 80,
	height: 80,
	border: "3px solid #428BCA",
	boxShadow: "0 4px 15px rgba(66, 139, 202, 0.3)",
	transition: "all 0.3s ease",
	"&:hover": {
		transform: "scale(1.05)",
		boxShadow: "0 6px 20px rgba(66, 139, 202, 0.4)",
	},
}));





export default function UserMiniDrawer() {
	const { user, token } = useAuth();
	const [open, setOpen] = React.useState(true);
	const navigate = useNavigate();
	const location = useLocation();
	const [expanded, setExpanded] = useState({ "My Appointments": false });
	const [loading, setLoading] = useState(true);
	const [appointments, setAppointments] = useState([]);

	const handleDrawerOpen = () => setOpen(true);
	const handleDrawerClose = () => setOpen(false);

	const handleExpandClick = (menuItem) => {
		setExpanded((prev) => ({ ...prev, [menuItem]: !prev[menuItem] }));
	};

	useEffect(() => {
		const fetchAppointments = async () => {
			try {
				if (!user?.id) {
					console.error("No valid user ID available");
					return;
				}

				setLoading(true);
				const API_URL = `http://localhost:5000/api/appointments/user/${user.id}`;

				const response = await axios.get(API_URL, {
					headers: {
						Authorization: `Bearer ${token}`,
					},
				});

				let appointmentsData = response.data;
				
				if (response.data?.appointments) {
					appointmentsData = response.data.appointments;
				} else if (response.data?.data) {
					appointmentsData = response.data.data;
				}

				if (!Array.isArray(appointmentsData)) {
					appointmentsData = [];
				}

				const filtered = appointmentsData.filter(
					(appt) => appt && !["Cancelled", "All done", "Reject1", "Paid"].includes(appt.status)
				);

				setAppointments(filtered);
			} catch (err) {
				console.error("Error fetching appointments:", err);
				setAppointments([]);
			} finally {
				setLoading(false);
			}
		};

		fetchAppointments();
	}, [user, token]);

	const menuItems = useMemo(
		() => [
			{ path: "/", label: "Home", icon: <HomeIcon /> },
			{ path: "/User", label: "Dashboard", icon: <DashboardIcon /> },
			{ path: "/Vehicles", label: "Your Vehicles", icon: <DirectionsCarIcon /> },
			{
				path: "/appointments/new",
				label: "Make an Appointment",
				icon: <TodayIcon />,
			},
			{
				label: "My Appointments",
				icon: <ListIcon />,
				hasChildren: true,
				children: appointments.map((appt) => ({
					path: `/appointments/${appt._id}`,
					label: appt.model || `Vehicle ${appt._id?.substring(0, 4)}`,
					status: appt.status,
				})),
			},
			{ path: "/UserHistory", label: "History", icon: <HistoryIcon /> },
			{ path: "/UserFeedback", label: "Feedback", icon: <FeedbackIcon /> },
		],
		[appointments]
	);

	return (
		<Box sx={{ display: "flex" }}>
			<CssBaseline />
			<AppBar position="fixed">
				<Toolbar disableGutters>
					<Box
						sx={{
							width: drawerWidth,
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
							backgroundColor: "#fff",
							borderRadius: "0 0 16px 0",
						}}
					>
						<Link
							to="/"
							style={{
								display: "inline-block",
								lineHeight: 0,
								margin: 0,
								padding: 0,
							}}
						>
							<img
								src="/assets/resized-garage24.png"
								alt="Garage24 Logo"
								style={{
									height: "64px",
									width: drawerWidth - 20,
									objectFit: "contain",
								}}
							/>
						</Link>
					</Box>

					<IconButton
						color="inherit"
						onClick={open ? handleDrawerClose : handleDrawerOpen}
						edge="end"
						sx={{ 
							marginRight: 2,
							backgroundColor: "rgba(255, 255, 255, 0.1)",
							"&:hover": {
								backgroundColor: "rgba(255, 255, 255, 0.2)",
							},
						}}
					>
						{open ? <ChevronLeftIcon /> : <MenuIcon />}
					</IconButton>
					
					<Box sx={{ flexGrow: 1 }} />
					
					<Box
						sx={{
							display: { xs: "none", md: "flex" },
							alignItems: "center",
							gap: 2,
							pr: 3,
						}}
					>
						<Account />
					</Box>
				</Toolbar>
			</AppBar>

			<Drawer variant="permanent" open={open}>
				<DrawerHeader />
				
				{open && (
					<Fade in={open} timeout={300}>
						<Box
							sx={{
								display: "flex",
								flexDirection: "column",
								alignItems: "center",
								mt: 3,
								mb: 3,
								px: 2,
							}}
						>
							<UserAvatar
								src="https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400"
								alt="User Avatar"
							/>
							<Typography
								variant="h6"
								sx={{
									mt: 2,
									color: "white",
									fontWeight: 600,
									textAlign: "center",
								}}
							>
								{user?.name || "User"}
							</Typography>
							<Typography
								variant="body2"
								sx={{
									color: "rgba(255, 255, 255, 0.7)",
									textAlign: "center",
									fontSize: "0.875rem",
								}}
							>
								Welcome back!
							</Typography>
						</Box>
					</Fade>
				)}
				
				{open && (
					<Divider 
						sx={{ 
							borderColor: "rgba(66, 139, 202, 0.3)", 
							mx: 2,
							mb: 2,
						}} 
					/>
				)}

				<List sx={{ px: 1 }}>
					{menuItems.map((item) => (
						<React.Fragment key={item.path || item.label}>
							<ListItem disablePadding sx={{ display: "block", mb: 0.5 }}>
								<StyledListItemButton
									onClick={() =>
										item.path
											? navigate(item.path)
											: handleExpandClick(item.label)
									}
									selected={location.pathname === item.path}
								>
									<ListItemIcon
										sx={{ 
											minWidth: 0, 
											justifyContent: "center", 
											marginRight: open ? 2 : 0,
											color: "#428BCA",
										}}
									>
										{item.icon}
									</ListItemIcon>
									<ListItemText
										primary={item.label}
										sx={{ 
											opacity: open ? 1 : 0,
											color: "white",
											"& .MuiTypography-root": {
												fontWeight: 500,
												fontSize: "0.95rem",
											},
										}}
									/>
									{item.hasChildren && open && (
										<Box sx={{ color: "#428BCA" }}>
											{expanded[item.label] ? <ExpandLess /> : <ExpandMore />}
										</Box>
									)}
								
								</StyledListItemButton>
							</ListItem>

							{item.hasChildren && expanded[item.label] && open && (
								<Fade in timeout={200}>
									<List component="div" disablePadding>
										{loading ? (
											<ListItem sx={{ justifyContent: "center", py: 2 }}>
												<CircularProgress 
													size={24} 
													sx={{ color: "#428BCA" }}
												/>
											</ListItem>
										) : item.children?.length > 0 ? (
											item.children.map((child, index) => (
												<ListItem
													key={child.path || `child-${index}`}
													disablePadding
													sx={{ pl: 2 }}
												>
													<StyledListItemButton
														onClick={() => navigate(child.path)}
														selected={location.pathname === child.path}
														sx={{ pl: 4 }}
													>
														<ListItemText 
															primary={child.label}
															sx={{
																color: "rgba(255, 255, 255, 0.9)",
																"& .MuiTypography-root": {
																	fontSize: "0.875rem",
																},
															}}
														/>
													
													</StyledListItemButton>
												</ListItem>
											))
										) : (
											<ListItem sx={{ pl: 4 }}>
												<ListItemText 
													primary="No Active Appointments"
													sx={{
														color: "rgba(255, 255, 255, 0.6)",
														"& .MuiTypography-root": {
															fontSize: "0.875rem",
															fontStyle: "italic",
														},
													}}
												/>
											</ListItem>
										)}
									</List>
								</Fade>
							)}
						</React.Fragment>
					))}
				</List>
			</Drawer>
		</Box>
	);
}
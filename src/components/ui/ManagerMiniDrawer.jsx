import * as React from "react";
// Importing necessary components and hooks from Material UI
import { styled, useTheme } from "@mui/material/styles";
import {
  Box, CssBaseline, Toolbar, Typography, IconButton,
  Avatar, Divider, List, ListItem, ListItemButton,
  ListItemIcon, ListItemText, AppBar as MuiAppBar, Drawer as MuiDrawer, useMediaQuery, Badge
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
  AccountCircle
} from "@mui/icons-material";

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
    width: `calc(${theme.spacing(8)} + 1px)` // Slightly bigger on larger screens
  }
});

// Custom AppBar component styling
const AppBar = styled(MuiAppBar, { shouldForwardProp: (prop) => prop !== "open" && prop !== "issmallscreen" })
(({ theme, open, issmallscreen }) => ({
  zIndex: theme.zIndex.drawer + 1, // Keep AppBar above Drawer
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && !issmallscreen && {
    marginLeft: drawerWidth, // Push AppBar right when Drawer is open
    width: `calc(100% - ${drawerWidth}px)` // Adjust width
  }),
}));

// Custom Drawer component styling
const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== "open" })(({ theme, open }) => ({
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

// DrawerHeader for maintaining consistent AppBar height
const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  ...theme.mixins.toolbar, // MUI built-in toolbar height
}));

// Main ManagerSidebar component
export default function ManagerSidebar({ children }) {
  const theme = useTheme(); // Using MUI theme
  const navigate = useNavigate(); // Hook for navigation
  const [open, setOpen] = React.useState(true); // State to handle desktop drawer open/close
  const [mobileOpen, setMobileOpen] = React.useState(false); // State to handle mobile drawer open/close
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("md")); // Check if current screen size is small

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
    { path: "/ManagerDashboard", label: "Dashboard", icon: <DashboardIcon /> },
    { path: "/ManageServices", label: "Manage Services", icon: <BuildIcon /> },
    { path: "/feedback", label: "Manage Feedback", icon: <FeedbackIcon /> },
  ];

  // JSX for sidebar drawer content
  const drawerContent = (
    <>
      <DrawerHeader>
        {/* Company Logo inside Drawer */}
        <img src="/assets/frame.png" alt="Logo" style={{ height: "64px", width: "auto" }} />
      </DrawerHeader>
      <Divider />
      <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", mt: 2 }}>
        {/* User Avatar */}
        <Avatar src="https://randomuser.me/api/portraits/women/2.jpg" sx={{ width: 80, height: 80 }} />
        <Typography sx={{ mt: 1 }}>Manager</Typography>
      </Box>
      <Divider sx={{ mx: 2, my: 1 }} />
      {/* Sidebar Menu Items */}
      <List>
        {navItems.map(({ path, label, icon }) => (
          <ListItem key={path} disablePadding sx={{ display: "block" }} onClick={() => navigate(path)}>
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
      <AppBar position="fixed" open={open} issmallscreen={isSmallScreen} sx={{ backgroundColor: "#1976d2" }}>
        <Toolbar>
          {/* Toggle Drawer Button */}
          <IconButton color="inherit" onClick={handleDrawerToggle} edge="start" sx={{ marginRight: 2 }}>
            {(!isSmallScreen && open) ? <ChevronLeftIcon /> : <MenuIcon />}
          </IconButton>

          {/* Manager Panel Title */}
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            Manager Panel
          </Typography>

          {/* Notification and Account Icons */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: "center", gap: 2 }}>
            {/* Notifications Icon with badge */}
            <IconButton size="large" color="inherit">
              <Badge badgeContent={0} color="error">
                <NotificationsIcon sx={{ color: "white" }} />
              </Badge>
            </IconButton>
            {/* Account Profile Icon */}
            <IconButton size="large" edge="end" color="inherit">
              <AccountCircle sx={{ color: "white" }} />
            </IconButton>
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
          sx={{ "& .MuiDrawer-paper": { boxSizing: "border-box", width: drawerWidth } }}
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
          marginLeft: (!isSmallScreen && open) ? `${drawerWidth}px` : 0,
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

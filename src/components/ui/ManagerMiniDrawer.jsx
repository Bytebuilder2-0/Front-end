import * as React from "react";
import { styled, useTheme } from "@mui/material/styles";
import {
  Box, CssBaseline, Toolbar, Typography, IconButton,
  Avatar, Divider, List, ListItem, ListItemButton,
  ListItemIcon, ListItemText, AppBar as MuiAppBar, Drawer as MuiDrawer
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import {
  Menu as MenuIcon, ChevronLeft as ChevronLeftIcon,
  Home as HomeIcon, Feedback as FeedbackIcon, Build as BuildIcon
} from "@mui/icons-material";

const drawerWidth = 240;

// Drawer Styles
const openedMixin = (theme) => ({ width: drawerWidth, transition: theme.transitions.create("width", {
  easing: theme.transitions.easing.sharp,
  duration: theme.transitions.duration.enteringScreen,
}), overflowX: "hidden" });

const closedMixin = (theme) => ({ transition: theme.transitions.create("width", {
  easing: theme.transitions.easing.sharp,
  duration: theme.transitions.duration.leavingScreen,
}), overflowX: "hidden", width: `calc(${theme.spacing(7)} + 1px)`, [theme.breakpoints.up("sm")]: {
  width: `calc(${theme.spacing(8)} + 1px)`,
}});

// Custom AppBar
const AppBar = styled(MuiAppBar, { shouldForwardProp: (prop) => prop !== "open" })(({ theme, open }) => ({
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

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  ...theme.mixins.toolbar,
}));

export default function ManagerSidebar({ children }) {
  const theme = useTheme();
  const [open, setOpen] = React.useState(true);
  const navigate = useNavigate();

  const handleDrawerToggle = () => setOpen(!open);

  const navItems = [
    { path: "/ManagerDashboard", label: "Dashboard", icon: <BuildIcon /> },
    { path: "/ManageServices", label: "Manage Services", icon: <BuildIcon /> },
    { path: "/feedback", label: "Manage Feedback", icon: <FeedbackIcon /> },
  ];

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar position="fixed" open={open} sx={{ backgroundColor: "#1976d2" }}>
        <Toolbar>
          <IconButton color="inherit" onClick={handleDrawerToggle} edge="start" sx={{ marginRight: 5 }}>
            {open ? <ChevronLeftIcon /> : <MenuIcon />}
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            Manager Panel
          </Typography>
        </Toolbar>
      </AppBar>

      <Drawer variant="permanent" open={open}>
        <DrawerHeader>
          <img src="/assets/frame.png" alt="Logo" style={{ height: "64px", width: "auto" }} />
        </DrawerHeader>
        <Divider />
        {open && (
          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", mt: 2 }}>
            <Avatar src="https://randomuser.me/api/portraits/women/2.jpg" sx={{ width: 80, height: 80 }} />
            <Typography sx={{ mt: 1 }}>Manager</Typography>
          </Box>
        )}
        {open && <Divider sx={{ mx: 2, my: 1 }} />}
        <List>
          {navItems.map(({ path, label, icon }) => (
            <ListItem key={path} disablePadding sx={{ display: "block" }} onClick={() => navigate(path)}>
              <ListItemButton selected={window.location.pathname === path}>
                <ListItemIcon sx={{ minWidth: 0, mr: 2 }}>{icon}</ListItemIcon>
                <ListItemText primary={label} sx={{ opacity: open ? 1 : 0 }} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>

      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <DrawerHeader />
        {children}
      </Box>
    </Box>
  );
}

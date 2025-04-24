import * as React from "react";
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
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import {
  Menu as MenuIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  Home as HomeIcon,
  AutoGraph as AutoGraphIcon,
  DoneOutline as DoneOutlineIcon,
  History as HistoryIcon,
  Error as ErrorIcon,
  Dashboard as DashboardIcon

} from "@mui/icons-material";

const drawerWidth = 240;

// Drawer Opened Styling
const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden", //hide any content that overflows beyond the component’s width
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
// Independent AppBar
const AppBar = styled(MuiAppBar)(({ theme }) => ({
  zIndex: theme.zIndex.drawer + 1, // ensures it's above the drawer
  width: "100%", // always full width
  transition: theme.transitions.create(["background-color"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
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

export default function MiniDrawer() {
  const theme = useTheme();
  const [open, setOpen] = React.useState(true);
  const navigate = useNavigate();

  const handleDrawerOpen = () => setOpen(true);
  const handleDrawerClose = () => setOpen(false);

  const handleNavItemClick = (path) => {
    navigate(path); // Navigates to the respective URL
  };

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      {/* App Bar */}
      <AppBar position="fixed" sx={{ backgroundColor: "", zIndex: (theme) => theme.zIndex.drawer + 1 }}>
  <Toolbar disableGutters>
    {/* Left-aligned image, same width as the drawer */}
    <Box sx={{ width: drawerWidth, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <img
        src="/assets/frame.png"
        alt="Frame"
        style={{
          height: "64px",
          width: "100%", // fills drawer width
          objectFit: "contain",
        }}
      />
    </Box>

    {/* Spacer between image and menu icon */}
    <Box  />

    {/* Toggle Drawer Icon */}
    <IconButton
      color="inherit"
      onClick={open ? handleDrawerClose : handleDrawerOpen}
      edge="end"
      sx={{ marginRight: 2 }}
    >
      {open ? <ChevronLeftIcon /> : <MenuIcon />}
    </IconButton>
  </Toolbar>
</AppBar>


      {/* Sidebar Drawer */}
      <Drawer variant="permanent" open={open}>
        <DrawerHeader>
      
        </DrawerHeader>
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
            <Avatar
              src="https://randomuser.me/api/portraits/men/1.jpg"
              sx={{ width: 100, height: 100 }}
            />
            <br />
            <Typography>Supervisor 1</Typography>
          </Box>
        )}
        {open && <Divider sx={{ mx: 2, my: 1 }} />}

        {/* Navigation List */}
        <List>
          {[
            { path: "/SInitial", label: "Home", icon: <HomeIcon /> },
            { path: "/Super", label: "Dashboard", icon: <DashboardIcon /> },
            { path: "/SInpro", label: "In Progress", icon: <AutoGraphIcon /> },
            {
              path: "/SCompleted",
              label: "Completed",
              icon: <DoneOutlineIcon color="success" />,
            },
            { path: "", label: "Decline", icon: <ErrorIcon /> },
            { path: "", label: "History", icon: <HistoryIcon /> },
          ].map(({ path, label, icon }) => (
            <ListItem
              key={path}
              disablePadding
              sx={{ display: "block" }}
              onClick={() => handleNavItemClick(path)}
            >
              <ListItemButton selected={window.location.pathname === path}>
                <ListItemIcon
                  sx={{ minWidth: 0, justifyContent: "center", marginRight: 2 }}
                >
                  {icon}
                </ListItemIcon>
                <ListItemText primary={label} sx={{ opacity: open ? 1 : 0 }} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>
    </Box>
  );
}

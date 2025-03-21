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
  Article as ArticleIcon,
  AutoGraph as AutoGraphIcon,
  DoneOutline as DoneOutlineIcon,
} from "@mui/icons-material";

import CompletedS from "../CompletedS";
import InitialCheck from "../InitialCheck";
import AppointmentData from "../AppintmentData";
import SupInprogress from "../SupInprogress";

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
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}));

export default function MiniDrawer() {
  const theme = useTheme();
  const [open, setOpen] = React.useState(true);
  const [selectedNav, setSelectedNav] = React.useState("home");
  const navigate = useNavigate();

  const handleDrawerOpen = () => setOpen(true);
  const handleDrawerClose = () => setOpen(false);

  const handleNavItemClick = (nav) => setSelectedNav(nav);

  // Component Rendering Logic
  const renderComponent = () => {
    switch (selectedNav) {
      case "home":
        return <InitialCheck />;
      case "dashboard":
        return <AppointmentData />;
      case "inprogress":
        return <SupInprogress />;
      case "completed":
        return <CompletedS />;
      default:
        return <InitialCheck />;
    }
  };

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      {/* App Bar */}
      <AppBar position="fixed" open={open}>
        <Toolbar>
          <IconButton
            color="inherit"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{ marginRight: 5, ...(open && { display: "none" }) }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap>
            Garage24
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Sidebar Drawer */}
      <Drawer variant="permanent" open={open}>
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === "rtl" ? (
              <ChevronRightIcon />
            ) : (
              <ChevronLeftIcon />
            )}
          </IconButton>
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

            <Typography>Supervisor 1</Typography>
          </Box>
        )}
        {open && <Divider sx={{ mx: 2, my: 1 }} />}

        {/* Navigation List */}
        <List>
          {[
            { id: "home", label: "Home", icon: <HomeIcon /> },
            { id: "dashboard", label: "Dashboard", icon: <ArticleIcon /> },
            { id: "inprogress", label: "In Progress", icon: <AutoGraphIcon /> },
            {
              id: "completed",
              label: "Completed",
              icon: <DoneOutlineIcon color="success" />,
            },
          ].map(({ id, label, icon }) => (
            <ListItem
              key={id}
              disablePadding
              sx={{ display: "block" }}
              onClick={() => handleNavItemClick(id)}
            >
              <ListItemButton selected={selectedNav === id}>
                <ListItemIcon sx={{ minWidth: 0, justifyContent: "center" ,marginRight:2}}>
                  {icon}
                </ListItemIcon>
                <ListItemText primary={label} sx={{ opacity: open ? 1 : 0 }} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>

      {/* Main Content */}
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        {renderComponent()}
      </Box>
    </Box>
  );
}

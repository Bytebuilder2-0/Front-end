import { useState, useEffect } from "react";
import {
  IconButton,
  Badge,
  Menu,
  MenuItem,
  Typography,
  Box,
  Divider,
  Button,
  CircularProgress,
} from "@mui/material";
import {
  Notifications as NotificationsIcon,
  Circle as CircleIcon,
} from "@mui/icons-material";
import axios from "axios";
import API_BASE_URL from "../config/api";
import { jwtDecode } from "jwt-decode";

const NotificationBell = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decoded = jwtDecode(token);
      setUserId(decoded.id);
    }
  }, []);

  useEffect(() => {
    if (userId) {
      fetchUnreadCount();
      // Poll for new notifications every 30 seconds
      const interval = setInterval(fetchUnreadCount, 30000);
      return () => clearInterval(interval);
    }
  }, [userId]);

  const fetchUnreadCount = async () => {
    if (!userId) return;

    try {
      const token = localStorage.getItem("token");
      const baseURL = API_BASE_URL.replace('/api', '');
      const response = await axios.get(
        `${baseURL}/api/notifications/user/${userId}/unread-count`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setUnreadCount(response.data.unreadCount);
    } catch (error) {
      // Silently fail if notification endpoint doesn't exist yet
      if (error.response?.status !== 404) {
        console.error("Error fetching unread count:", error);
      }
      setUnreadCount(0);
    }
  };

  const fetchNotifications = async () => {
    if (!userId) return;

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const baseURL = API_BASE_URL.replace('/api', '');
      const response = await axios.get(
        `${baseURL}/api/notifications/user/${userId}?limit=10`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setNotifications(response.data.data || []);
    } catch (error) {
      // Silently fail if notification endpoint doesn't exist yet
      if (error.response?.status !== 404) {
        console.error("Error fetching notifications:", error);
      }
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
    fetchNotifications();
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const markAsRead = async (notificationId) => {
    try {
      const token = localStorage.getItem("token");
      const baseURL = API_BASE_URL.replace('/api', '');
      await axios.patch(
        `${baseURL}/api/notifications/${notificationId}/read`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      
      // Update local state
      setNotifications((prev) =>
        prev.map((notif) =>
          notif._id === notificationId ? { ...notif, isRead: true } : notif
        )
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (error) {
      if (error.response?.status !== 404) {
        console.error("Error marking notification as read:", error);
      }
    }
  };

  const markAllAsRead = async () => {
    if (!userId) return;

    try {
      const token = localStorage.getItem("token");
      const baseURL = API_BASE_URL.replace('/api', '');
      await axios.patch(
        `${baseURL}/api/notifications/user/${userId}/read-all`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      
      // Update local state
      setNotifications((prev) =>
        prev.map((notif) => ({ ...notif, isRead: true }))
      );
      setUnreadCount(0);
    } catch (error) {
      if (error.response?.status !== 404) {
        console.error("Error marking all as read:", error);
      }
    }
  };

  const getTimeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    
    if (seconds < 60) return "Just now";
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  };

  return (
    <>
      <IconButton
        color="inherit"
        onClick={handleClick}
        sx={{
          "&:hover": {
            backgroundColor: "rgba(255, 255, 255, 0.1)",
          },
        }}
      >
        <Badge badgeContent={unreadCount} color="error">
          <NotificationsIcon />
        </Badge>
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        PaperProps={{
          sx: {
            width: 380,
            maxHeight: 500,
            mt: 1.5,
          },
        }}
      >
        <Box sx={{ px: 2, py: 1.5, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Typography variant="h6" fontWeight="bold">
            Notifications
          </Typography>
          {unreadCount > 0 && (
            <Button size="small" onClick={markAllAsRead}>
              Mark all read
            </Button>
          )}
        </Box>
        <Divider />

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 3 }}>
            <CircularProgress size={30} />
          </Box>
        ) : notifications.length === 0 ? (
          <Box sx={{ py: 4, textAlign: "center" }}>
            <Typography variant="body2" color="text.secondary">
              No notifications yet
            </Typography>
          </Box>
        ) : (
          <Box sx={{ maxHeight: 400, overflowY: "auto" }}>
            {notifications.map((notification) => (
              <MenuItem
                key={notification._id}
                onClick={() => {
                  if (!notification.isRead) {
                    markAsRead(notification._id);
                  }
                }}
                sx={{
                  py: 1.5,
                  px: 2,
                  backgroundColor: notification.isRead
                    ? "transparent"
                    : "rgba(25, 118, 210, 0.08)",
                  "&:hover": {
                    backgroundColor: notification.isRead
                      ? "rgba(0, 0, 0, 0.04)"
                      : "rgba(25, 118, 210, 0.12)",
                  },
                  borderBottom: "1px solid rgba(0, 0, 0, 0.08)",
                }}
              >
                <Box sx={{ display: "flex", alignItems: "flex-start", width: "100%" }}>
                  {!notification.isRead && (
                    <CircleIcon
                      sx={{
                        fontSize: 10,
                        color: "primary.main",
                        mt: 0.5,
                        mr: 1.5,
                      }}
                    />
                  )}
                  <Box sx={{ flex: 1, ml: notification.isRead ? 3 : 0 }}>
                    <Typography variant="body2" sx={{ mb: 0.5 }}>
                      {notification.message}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {getTimeAgo(notification.createdAt)}
                    </Typography>
                  </Box>
                </Box>
              </MenuItem>
            ))}
          </Box>
        )}
      </Menu>
    </>
  );
};

export default NotificationBell;

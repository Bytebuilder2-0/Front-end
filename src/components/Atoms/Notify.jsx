import React, { useState } from "react";
import {
	IconButton,
	Badge,
	Menu,
	MenuItem,
	Box,
	Typography,
	Tooltip,
} from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import CheckIcon from "@mui/icons-material/Check";
import DoneAllIcon from "@mui/icons-material/DoneAll";

function Notify() {
	const [notifications, setNotifications] = useState([
		{ id: 1, message: "New user registered", isRead: false },
		{ id: 2, message: "Payment received", isRead: false },
		{ id: 3, message: "New appointment booked", isRead: false },
	]);

	const [anchorEl, setAnchorEl] = useState(null);
	const unreadCount = notifications.filter((n) => !n.isRead).length;

	const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
	const handleMenuClose = () => setAnchorEl(null);

	const handleMarkAsRead = (id) => {
		setNotifications((prev) =>
			prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
		);
	};

	const handleMarkAllAsRead = () => {
		setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
	};

	return (
		<>
			<IconButton
				size="large"
				aria-label="show notifications"
				color="inherit"
				onClick={handleMenuOpen}
			>
				<Badge badgeContent={unreadCount} color="error">
					<NotificationsIcon sx={{ color: "#33383E" }} fontSize="large" />
				</Badge>
			</IconButton>

			<Menu
				anchorEl={anchorEl}
				open={Boolean(anchorEl)}
				onClose={handleMenuClose}
				PaperProps={{
					style: {
						width: 340,
						maxHeight: 400,
						overflowY: "auto",
					},
				}}
			>
				<Box
					sx={{
						px: 2,
						pt: 1,
						pb: 1,
						display: "flex",
						justifyContent: "space-between",
						alignItems: "center",
					}}
				>
					<Typography variant="h6" sx={{ fontWeight: "bold" }}>
						Notifications
					</Typography>
					<Tooltip title="Mark all as read">
						<IconButton size="small" onClick={handleMarkAllAsRead}>
							<DoneAllIcon fontSize="small" />
						</IconButton>
					</Tooltip>
				</Box>

				{notifications.length === 0 ? (
					<MenuItem disabled>No notifications</MenuItem>
				) : (
					notifications.map((notif) => (
						<MenuItem
							key={notif.id}
							divider
							sx={{
								opacity: notif.isRead ? 0.6 : 1,
								py: 2,
							}}
						>
							<Box
								sx={{
									display: "flex",
									justifyContent: "space-between",
									alignItems: "center",
									width: "100%",
								}}
							>
								<Typography variant="body1" sx={{ fontSize: "1rem" }}>
									{notif.message}
								</Typography>
								{!notif.isRead && (
									<IconButton size="small" onClick={() => handleMarkAsRead(notif.id)}>
										<CheckIcon fontSize="small" />
									</IconButton>
								)}
							</Box>
						</MenuItem>
					))
				)}
			</Menu>
		</>
	);
}

export default Notify;

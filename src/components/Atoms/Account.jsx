import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { IconButton, Menu, MenuItem } from "@mui/material";
import AccountCircle from "@mui/icons-material/AccountCircle";

function Account() {
	const [anchorEl, setAnchorEl] = useState(null);
	const menuOpen = Boolean(anchorEl);

	const handleMenuOpen = (event) => {
		setAnchorEl(event.currentTarget);
	};

	const handleMenuClose = () => {
		setAnchorEl(null);
	};

	const handleProfileClick = () => {
		// Navigate to profile page or open profile dialog
		console.log("Profile clicked");
		handleMenuClose();
	};

	const handleLogoutClick = () => {
		// Perform logout logic here (e.g., clear token, redirect)
		//localStorage.removeItem("token"); // Adjust based on your token name
		// Optionally clear other auth-related items
		// Redirect to login
		//navigate("/Loginpage"); // Update with your actual login route
		handleMenuClose();
	};

	return (
		<>
			<IconButton
				size="large"
				edge="end"
				aria-label="account of current user"
				aria-controls="account-menu"
				aria-haspopup="true"
				onClick={handleMenuOpen}
				color="inherit"
			>
				<AccountCircle sx={{ color: "#33383E" }} fontSize="large" />
			</IconButton>

			<Menu
				id="account-menu"
				anchorEl={anchorEl}
				open={menuOpen}
				onClose={handleMenuClose}
				anchorOrigin={{ vertical: "top", horizontal: "right" }}
				transformOrigin={{ vertical: "top", horizontal: "right" }}
			>
				<MenuItem onClick={handleProfileClick}>Profile</MenuItem>
				<MenuItem onClick={handleLogoutClick}>Logout</MenuItem>
			</Menu>
		</>
	);
}

export default Account;

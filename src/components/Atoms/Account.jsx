import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { IconButton, Menu, MenuItem } from "@mui/material";
import AccountCircle from "@mui/icons-material/AccountCircle";

function Account() {
	const [anchorEl, setAnchorEl] = useState(null);
	const menuOpen = Boolean(anchorEl);
	const navigate = useNavigate(); // Initialize navigation

	const handleMenuOpen = (event) => {
		setAnchorEl(event.currentTarget);
	};

	const handleMenuClose = () => {
		setAnchorEl(null);
	};

	const handleProfileClick = () => {
		console.log("Profile clicked");
		handleMenuClose();
	};

	const handleLogoutClick = () => {
		// Clear token and any other auth-related data
		localStorage.removeItem("token");
		localStorage.removeItem("userId"); // if used
		localStorage.removeItem("role"); // if used

		handleMenuClose(); // Close the dropdown menu

		// Redirect to login page
		navigate("/Loginpage"); // Update with your actual login route
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

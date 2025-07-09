import React, { useState, useContext } from "react";
import { TextField, Button, Box, Typography, Avatar } from "@mui/material";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import LoginSignupNavbar from "../components/LoginSignupNavbar";
import { LockOpen } from "@mui/icons-material";
import { jwtDecode } from "jwt-decode";

const Loginpage = () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");

	const navigate = useNavigate();
	const { login } = useContext(AuthContext);

	const handleLogin = async (e) => {
		e.preventDefault();
		setError("");

		try {
			const response = await axios.post("http://localhost:5000/api/auth/login", {
				email,
				password,
			});

			const { token } = response.data;
			login(token); // Save to AuthContext

			const decoded = jwtDecode(token);
			const userRole = decoded.role?.toLowerCase();

			if (userRole === "manager") navigate("/ManagerDashboard");
			else if (userRole === "technician") navigate("/TDashboard");
			else if (userRole === "customer") navigate("/User");
			else if (userRole === "supervisor") navigate("/SInitial");
			else navigate("/unauthorized");
		} catch (err) {
			setError(err.response?.data?.message || "Login failed");
		}
	};

	const avatarStyle = { backgroundColor: "#388e3c", color: "#fff" };

	return (
		<>
			<LoginSignupNavbar />
			<Box
				sx={{
					display: "flex",
					minHeight: "100vh",
					backgroundImage: "url(/assets/man2.webp)",
					backgroundSize: "cover",
					backgroundPosition: "center",
					alignItems: "center",
					justifyContent: "flex-end",
					pr: { xs: 2, sm: 8, md: 12 },
				}}
			>
				<Box
					component="form"
					onSubmit={handleLogin}
					sx={{
						width: "100%",
						maxWidth: 400,
						bgcolor: "white",
						p: 4,
						borderRadius: 7,
						boxShadow: 10,
					}}
				>
					<Box align="center" mb={2}>
						<Avatar sx={{ width: 60, height: 60 }} style={avatarStyle}>
							<LockOpen />
						</Avatar>
						<Typography variant="h5" align="center" gutterBottom>
							Login
						</Typography>
						<Typography
							variant="body2"
							color="textSecondary"
							align="center"
							sx={{ mb: 1 }}
						>
							Don't have an account?{" "}
							<Link
								to="/SignupPage"
								style={{
									textDecoration: "none",
									color: "ActiveCaption",
									fontWeight: "bold",
								}}
							>
								Sign Up
							</Link>
						</Typography>
					</Box>

					<TextField
						label="Email"
						type="email"
						fullWidth
						margin="normal"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						required
					/>

					<TextField
						label="Password"
						type="password"
						fullWidth
						margin="normal"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						required
					/>

					{error && (
						<Typography color="error" sx={{ mt: 1 }}>
							{error}
						</Typography>
					)}

					<Box
						sx={{
							mt: 3,
							display: "flex",
							justifyContent: "space-between",
							alignItems: "center",
						}}
					>
						<Button
							type="submit"
							variant="contained"
							sx={{
								width: "35%",
								backgroundColor: "#388e3c",
								"&:hover": {
									backgroundColor: "#7cc05d",
								},
							}}
						>
							Login
						</Button>

						<Box
							component={Link}
							to="#"
							sx={{
								textDecoration: "none",
								color: "InfoText",
								fontWeight: "bold",
								ml: 2,
								"&:hover": {
									color: "#388e3c",
								},
							}}
						>
							Forgot password?
						</Box>
					</Box>
				</Box>
			</Box>
		</>
	);
};

export default Loginpage;

import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
	TextField,
	Button,
	Container,
	Typography,
	Avatar,
	MenuItem,
	Grid,
	Paper,
	InputAdornment,
	IconButton,
	Checkbox,
	FormControlLabel,
} from "@mui/material";
import { Visibility, VisibilityOff, AddCircleOutlined } from "@mui/icons-material";
import axios from "axios";
import LoginSignupNavbar from "../components/LoginSignupNavbar";

const roles = ["customer", "technician", "manager", "supervisor"];

const Signup = () => {
	const [formData, setFormData] = useState({
		email: "",
		fullName: "",
		userName: "",
		phone: "",
		password: "",
		confirmPassword: "",
		role: "customer",
		termsAccepted: false,
	});

	const [errors, setErrors] = useState({});
	const [showPassword, setShowPassword] = useState(false);

	const handleChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const handleCheckboxChange = (e) => {
		setFormData({ ...formData, termsAccepted: e.target.checked });
	};

	const validate = () => {
		const newErrors = {};
		if (!formData.email.includes("@")) newErrors.email = "Invalid email";
		if (!formData.fullName.trim()) newErrors.fullName = "Full name required";
		if (!formData.userName.trim()) newErrors.userName = "Username required";
		if (!formData.phone.match(/^\d{10}$/)) newErrors.phone = "Phone must be 10 digits";
		if (formData.password.length < 6)
			newErrors.password = "Password must be at least 6 characters";
		if (formData.password !== formData.confirmPassword)
			newErrors.confirmPassword = "Passwords do not match";
		if (!formData.termsAccepted)
			newErrors.termsAccepted = "You must accept the terms and conditions";
		return newErrors;
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		const validationErrors = validate();
		if (Object.keys(validationErrors).length > 0) {
			setErrors(validationErrors);
			return;
		}

		try {
			const payload = {
				email: formData.email,
				fullName: formData.fullName,
				userName: formData.userName,
				phone: formData.phone,
				password: formData.password,
				role: formData.role,
			};

			const res = await axios.post("http://localhost:5000/api/auth/register", payload);
			alert("Signup successful!");
			console.log(res);
			setFormData({
				email: "",
				fullName: "",
				userName: "",
				phone: "",
				password: "",
				confirmPassword: "",
				role: "customer",
				termsAccepted: false,
			});
		} catch (err) {
			console.error("Signup error:", err.response?.data || err.message);
			alert(err.response?.data?.message || "Signup failed");
		}
	};

	const avatarStyle = { backgroundColor: "#388e3c", color: "#fff" };

	return (
		<>
			<LoginSignupNavbar />
			<Container maxWidth="sm">
				<Paper
					style={{
						padding: 20,
						height: "78vh",
						width: 405,
						borderRadius: 10,
						margin: "30px auto",
					}}
				>
					<Grid align="center" item xs={10} mb={2}>
						<Avatar sx={{ width: 50, height: 50 }} style={avatarStyle}>
							<AddCircleOutlined />
						</Avatar>
						<Typography variant="h5" gutterBottom>
							Create an Account
						</Typography>
						<Typography
							variant="body2"
							color="textSecondary"
							align="center"
							sx={{ mb: 1 }}
						>
							Already have an account?{" "}
							<Link
								to="/Loginpage"
								style={{
									textDecoration: "none",
									color: "ActiveCaption",
									fontWeight: "bold",
								}}
							>
								Login
							</Link>
						</Typography>
					</Grid>
					<form onSubmit={handleSubmit}>
						<Grid container spacing={2}>
							<Grid item xs={12}>
								<TextField
									fullWidth
									name="email"
									label="Email"
									value={formData.email}
									onChange={handleChange}
									error={!!errors.email}
									helperText={errors.email}
								/>
							</Grid>
							<Grid item xs={12}>
								<TextField
									fullWidth
									name="fullName"
									label="Full Name"
									value={formData.fullName}
									onChange={handleChange}
									error={!!errors.fullName}
									helperText={errors.fullName}
								/>
							</Grid>
							<Grid item xs={12}>
								<TextField
									fullWidth
									name="userName"
									label="Username"
									value={formData.userName}
									onChange={handleChange}
									error={!!errors.userName}
									helperText={errors.userName}
								/>
							</Grid>
							<Grid item xs={12}>
								<TextField
									fullWidth
									name="phone"
									label="Phone Number"
									value={formData.phone}
									onChange={handleChange}
									error={!!errors.phone}
									helperText={errors.phone}
								/>
							</Grid>
							<Grid item xs={12}>
								<TextField
									fullWidth
									name="password"
									label="Password"
									type={showPassword ? "text" : "password"}
									value={formData.password}
									onChange={handleChange}
									error={!!errors.password}
									helperText={errors.password}
									InputProps={{
										endAdornment: (
											<InputAdornment position="end">
												<IconButton onClick={() => setShowPassword(!showPassword)}>
													{showPassword ? <VisibilityOff /> : <Visibility />}
												</IconButton>
											</InputAdornment>
										),
									}}
								/>
							</Grid>
							<Grid item xs={12}>
								<TextField
									fullWidth
									name="confirmPassword"
									label="Confirm Password"
									type={showPassword ? "text" : "password"}
									value={formData.confirmPassword}
									onChange={handleChange}
									error={!!errors.confirmPassword}
									helperText={errors.confirmPassword}
								/>
							</Grid>
							<Grid item xs={12}>
								<TextField
									fullWidth
									select
									name="role"
									label="Role"
									value={formData.role}
									onChange={handleChange}
								>
									{roles.map((role) => (
										<MenuItem key={role} value={role}>
											{role}
										</MenuItem>
									))}
								</TextField>
							</Grid>

							{/* Terms and Conditions Checkbox */}
							<Grid item xs={12}>
								<FormControlLabel
									control={
										<Checkbox
											checked={formData.termsAccepted}
											onChange={handleCheckboxChange}
											sx={{
												color: "#388e3c",
												"&.Mui-checked": {
													color: "#388e3c",
												},
											}}
										/>
									}
									label="I accept the terms and conditions"
								/>
								{errors.termsAccepted && (
									<Typography color="error" variant="body2">
										{errors.termsAccepted}
									</Typography>
								)}
							</Grid>

							<Grid item xs={5} align="center">
								<Button
									type="submit"
									variant="contained"
									sx={{
										width: "100%",
										backgroundColor: "#388e3c",
										"&:hover": {
											backgroundColor: "#7cc05d",
										},
									}}
								>
									Sign Up
								</Button>
							</Grid>
						</Grid>
					</form>
				</Paper>
			</Container>
		</>
	);
};

export default Signup;

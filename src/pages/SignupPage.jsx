"use client";

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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
	Box,
	Chip,
	Fade,
	Slide,
} from "@mui/material";
import {
	Visibility,
	VisibilityOff,
	PersonAdd,
	Email,
	Person,
	Phone,
	Lock,
	Work,
	Security,
	Speed,
	DirectionsCar,
} from "@mui/icons-material";
import axios from "axios";
import LoginSignupNavbar from "../components/LoginSignupNavbar";
import { Snackbar, Alert } from "@mui/material";
import {toast } from "react-hot-toast";


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
	const [isLoading, setIsLoading] = useState(false);
	const navigate = useNavigate();


	const validateField = (name, value) => {
	let error = "";

	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{6,}$/;
	const usernameRegex = /^[A-Za-z0-9]+$/;

	switch (name) {
		case "email":
			if (!emailRegex.test(value)) error = "Invalid email format";
			break;
		case "fullName":
			if (!value.trim()) error = "Full name required";
			break;
		case "userName":
			if (!usernameRegex.test(value)) error = "Username can only contain letters and numbers";
			break;
		case "phone":
			if (!/^\d{10}$/.test(value)) error = "Phone must be 10 digits";
			break;
		case "password":
			if (!passwordRegex.test(value)) {
				error = "Min 6 chars,  including letters, numbers & symbols";
			}
			break;
		case "confirmPassword":
			if (value !== formData.password) error = "Passwords do not match";
			break;
		default:
			break;
	}
	return error;
};


	const handleChange = (e) => {
	const { name, value } = e.target;
	setFormData({ ...formData, [name]: value });

	// Live validation 
	const errorMsg = validateField(name, value);
	setErrors((prevErrors) => ({ ...prevErrors, [name]: errorMsg }));
};




	// const handleChange = (e) => {
	// 	setFormData({ ...formData, [e.target.name]: e.target.value });
	// };

	const handleCheckboxChange = (e) => {
		setFormData({ ...formData, termsAccepted: e.target.checked });
	};

	const validate = () => {        
	const newErrors = {};

	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{6,}$/;
	const usernameRegex = /^[A-Za-z0-9]+$/;

	if (!emailRegex.test(formData.email)) {
		newErrors.email = "Invalid email format";
	}

	if (!formData.fullName.trim()) {
		newErrors.fullName = "Full name required";
	}

	if (!usernameRegex.test(formData.userName)) {
		newErrors.userName = "Username can only contain letters and numbers";
	}

	if (!formData.phone.match(/^\d{10}$/)) {
		newErrors.phone = "Phone must be 10 digits";
	}

	if (!passwordRegex.test(formData.password)) {
		newErrors.password = "Password must be 6+ chars, with letters, numbers & symbols";
	}

	if (formData.password !== formData.confirmPassword) {
		newErrors.confirmPassword = "Passwords do not match";
	}

	if (!formData.termsAccepted) {
		newErrors.termsAccepted = "You must accept the terms and conditions";
	}

	return newErrors;
};

	const handleSubmit = async (e) => {
		e.preventDefault();
		const validationErrors = validate();
		if (Object.keys(validationErrors).length > 0) {
			setErrors(validationErrors);
			return;
		}

		setIsLoading(true);

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
			//alert("Signup successful!");
			toast.success("Registered Successfully!!"); 
			console.log(res);


			  //waiting page ekk daanna.......................................
			  //navigate to email verification 
			  //itapasse login ekata navigate krnn
				toast.success("🎉 Account created successfully! Welcome aboard!", {
			style: {
				borderRadius: "10px",
				background: "#1a237e",
				color: "#fff",
			},
			iconTheme: {
				primary: "#82b1ff",
				secondary: "#fff",
			},
		});
        setTimeout(() => {
			navigate("/Loginpage");
		}, 2000);

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
		} finally {
			setIsLoading(false);
		}
	};

	const features = [
		{ icon: <DirectionsCar />, text: "Premium Service" },
		{ icon: <Security />, text: "Secure Platform" },
		{ icon: <Speed />, text: "Quick Booking" },
	];

	const textFieldStyles = {
		"& .MuiOutlinedInput-root": {
			borderRadius: 2,
			"&:hover fieldset": {
				borderColor: "#82b1ff",
			},
			"&.Mui-focused fieldset": {
				borderColor: "#82b1ff",
			},
		},
		"& .MuiInputLabel-root.Mui-focused": {
			color: "#82b1ff",
		},
	};

	return (
		<>
			<LoginSignupNavbar />
			<Box
				sx={{
					minHeight: "100vh",
					background: "linear-gradient(135deg, #82b1ff 0%, #1a237e 100%)",
					position: "relative",
					overflow: "hidden",
					"&::before": {
						content: '""',
						position: "absolute",
						top: 0,
						left: 0,
						right: 0,
						bottom: 0,
						background: `url('/assets/garagebg.jpeg')`,
						backgroundSize: "cover",
						backgroundPosition: "center",
						opacity: 0.1,
						zIndex: 0,
					},
				}}
			>
				<Container
					maxWidth="lg"
					sx={{
						minHeight: "100vh",
						display: "flex",
						alignItems: "center",
						position: "relative",
						zIndex: 1,
						py: 4,
					}}
				>
					<Box
						sx={{
							display: "flex",
							width: "100%",
							alignItems: "center",
							gap: { xs: 0, md: 8 },
							flexDirection: { xs: "column", md: "row" },
						}}
					>
						{/* Left Side - Welcome Section */}
						<Fade in timeout={1000}>
							<Box
								sx={{
									flex: 1,
									color: "white",
									textAlign: { xs: "center", md: "left" },
									mb: { xs: 4, md: 0 },
								}}
							>
								<Typography
									variant="h2"
									sx={{
										fontWeight: 900,
										mb: 2,
										fontSize: { xs: "2.5rem", md: "3.5rem" },
										textShadow: "0 4px 20px rgba(0,0,0,0.3)",
										background: "linear-gradient(45deg, #ffffff, #f0f0f0)",
										backgroundClip: "text",
										WebkitBackgroundClip: "text",
										WebkitTextFillColor: "transparent",
									}}
								>
									Join Garage24
									<br />
									Today
								</Typography>
								<Typography
									variant="h6"
									sx={{
										mb: 4,
										opacity: 0.9,
										fontSize: { xs: "1.1rem", md: "1.3rem" },
										lineHeight: 1.6,
									}}
								>
									Create your account and start experiencing premium automotive services
									with trusted professionals.
								</Typography>

								{/* Features */}
								<Box sx={{ display: "flex", flexDirection: "column", gap: 2, mb: 4 }}>
									{features.map((feature, index) => (
										<Slide key={index} direction="right" in timeout={1000 + index * 200}>
											<Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
												<Box
													sx={{
														width: 50,
														height: 50,
														borderRadius: "50%",
														background: "rgba(255,255,255,0.2)",
														display: "flex",
														alignItems: "center",
														justifyContent: "center",
														backdropFilter: "blur(10px)",
													}}
												>
													{feature.icon}
												</Box>
												<Typography variant="body1" fontWeight="600">
													{feature.text}
												</Typography>
											</Box>
										</Slide>
									))}
								</Box>

								<Chip
									label="Join 10,000+ satisfied customers"
									sx={{
										bgcolor: "rgba(255,255,255,0.2)",
										color: "white",
										fontWeight: "bold",
										backdropFilter: "blur(10px)",
										border: "1px solid rgba(255,255,255,0.3)",
									}}
								/>
							</Box>
						</Fade>

						{/* Right Side - Signup Form */}
						<Slide direction="left" in timeout={800}>
							<Paper
								elevation={24}
								sx={{
									width: { xs: "100%", sm: 500, md: 550 },
									background: "rgba(255, 255, 255, 0.95)",
									backdropFilter: "blur(20px)",
									border: "1px solid rgba(255, 255, 255, 0.2)",
									borderRadius: 4,
									overflow: "hidden",
									position: "relative",
									"&::before": {
										content: '""',
										position: "absolute",
										top: 0,
										left: 0,
										right: 0,
										height: "4px",
										background: "linear-gradient(90deg, #82b1ff, #1a237e)",
									},
								}}
							>
								<Box sx={{ p: { xs: 4, sm: 6 } }}>
									{/* Header */}
									<Box sx={{ textAlign: "center", mb: 4 }}>
										<Avatar
											sx={{
												width: 80,
												height: 80,
												mx: "auto",
												mb: 2,
												background: "linear-gradient(135deg, #82b1ff 0%, #1a237e 100%)",
												boxShadow: "0 8px 25px rgba(102, 126, 234, 0.3)",
											}}
										>
											<PersonAdd sx={{ fontSize: 40 }} />
										</Avatar>
										<Typography
											variant="h4"
											sx={{
												fontWeight: 700,
												mb: 1,
												background: "linear-gradient(45deg, #82b1ff, #1a237e)",
												backgroundClip: "text",
												WebkitBackgroundClip: "text",
												WebkitTextFillColor: "transparent",
											}}
										>
											Create Account
										</Typography>
										<Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
											Join the Garage24 community
										</Typography>
										<Typography variant="body2" color="text.secondary">
											Already have an account?{" "}
											<Link
												to="/Loginpage"
												style={{
													textDecoration: "none",
													color: "#667eea",
													fontWeight: "bold",
												}}
											>
												Sign In Here
											</Link>
										</Typography>
									</Box>

									{/* Form */}
									<Box component="form" onSubmit={handleSubmit}>
										<Grid container spacing={3}>
											<Grid item xs={12}>
												<TextField
													fullWidth
													name="email"
													label="Email Address"
													type="email"
													value={formData.email}
													onChange={handleChange}
													error={!!errors.email}
													helperText={errors.email}
													InputProps={{
														startAdornment: (
															<InputAdornment position="start">
																<Email sx={{ color: "text.secondary" }} />
															</InputAdornment>
														),
													}}
													sx={textFieldStyles}
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
													InputProps={{
														startAdornment: (
															<InputAdornment position="start">
																<Person sx={{ color: "text.secondary" }} />
															</InputAdornment>
														),
													}}
													sx={textFieldStyles}
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
													InputProps={{
														startAdornment: (
															<InputAdornment position="start">
																<Person sx={{ color: "text.secondary" }} />
															</InputAdornment>
														),
													}}
													sx={textFieldStyles}
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
													InputProps={{
														startAdornment: (
															<InputAdornment position="start">
																<Phone sx={{ color: "text.secondary" }} />
															</InputAdornment>
														),
													}}
													sx={textFieldStyles}
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
														startAdornment: (
															<InputAdornment position="start">
																<Lock sx={{ color: "text.secondary" }} />
															</InputAdornment>
														),
														endAdornment: (
															<InputAdornment position="end">
																<IconButton
																	onClick={() => setShowPassword(!showPassword)}
																>
																	{showPassword ? <VisibilityOff /> : <Visibility />}
																</IconButton>
															</InputAdornment>
														),
													}}
													sx={textFieldStyles}
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
													InputProps={{
														startAdornment: (
															<InputAdornment position="start">
																<Lock sx={{ color: "text.secondary" }} />
															</InputAdornment>
														),
													}}
													sx={textFieldStyles}
												/>
											</Grid>

											<Grid item xs={12}>
												<TextField
													fullWidth
													select
													name="role"
													label="Select Your Role"
													value={formData.role}
													onChange={handleChange}
													InputProps={{
														startAdornment: (
															<InputAdornment position="start">
																<Work sx={{ color: "text.secondary" }} />
															</InputAdornment>
														),
													}}
													sx={textFieldStyles}
												>
													{roles.map((role) => (
														<MenuItem key={role} value={role}>
															<Typography sx={{ textTransform: "capitalize" }}>
																{role}
															</Typography>
														</MenuItem>
														
													))}
													{["technician", "supervisor"].includes(formData.role) && (
	<Typography variant="body2" sx={{ color: "orange", mt: 1 }}>
		Your account will require manager approval before you can log in.
	</Typography>
)}

												</TextField>
											</Grid>

											<Grid item xs={12}>
												<FormControlLabel
													control={
														<Checkbox
															checked={formData.termsAccepted}
															onChange={handleCheckboxChange}
															sx={{
																color: "#82b1ff",
																"&.Mui-checked": {
																	color: "#82b1ff",
																},
															}}
														/>
													}
													label={
														<Typography variant="body2">
															I agree to the{" "}
															<Link
																to="#"
																style={{ color: "#82b1ff", textDecoration: "none" }}
															>
																Terms of Service
															</Link>{" "}
															and{" "}
															<Link
																to="#"
																style={{ color: "#82b1ff", textDecoration: "none" }}
															>
																Privacy Policy
															</Link>
														</Typography>
													}
												/>
												{errors.termsAccepted && (
													<Typography color="error" variant="body2" sx={{ mt: 1 }}>
														{errors.termsAccepted}
													</Typography>
												)}
											</Grid>

											<Grid item xs={12}>
												<Button
													type="submit"
													fullWidth
													variant="contained"
													disabled={isLoading}
													sx={{
														py: 2,
														fontSize: "1.1rem",
														fontWeight: "bold",
														borderRadius: 2,
														background:
															"linear-gradient(135deg, #82b1ff 0%, #1a237e 100%)",
														boxShadow: "0 8px 25px rgba(102, 126, 234, 0.3)",
														"&:hover": {
															background:
																"linear-gradient(135deg, #82b1ff 0%, #1a237e 100%)",
															transform: "translateY(-2px)",
															boxShadow: "0 12px 35px rgba(102, 126, 234, 0.4)",
														},
														"&:disabled": {
															background: "rgba(0,0,0,0.12)",
														},
														transition: "all 0.3s ease",
													}}
												>
													{isLoading ? "Creating Account..." : "Create Account"}
												</Button>
											</Grid>
										</Grid>
									</Box>
								</Box>

								{/* Bottom Decoration */}
								<Box
									sx={{
										height: 60,
										background:
											"linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)",
										display: "flex",
										alignItems: "center",
										justifyContent: "center",
									}}
								>
									<Typography variant="caption" color="text.secondary" fontWeight="600">
										Secure Registration
									</Typography>
								</Box>
							</Paper>
						</Slide>
					</Box>
				</Container>
			</Box>
		</>
	);
};

export default Signup;

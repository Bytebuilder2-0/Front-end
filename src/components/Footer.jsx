import {
	Box,
	Typography,
	Link,
	Grid,
	Container,
	IconButton,
	Divider,
	Paper,
} from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import InstagramIcon from "@mui/icons-material/Instagram";
import LinkedInIcon from "@mui/icons-material/LinkedIn";

const Footer = () => {
	return (
		<Box
			component="footer"
			sx={{
				background: "linear-gradient(135deg, #2c3e50 0%, #34495e 100%)",
				color: "#fff",
				pt: 8,
				pb: 4,
				position: "relative",
				overflow: "hidden",
				"&::before": {
					content: '""',
					position: "absolute",
					top: 0,
					left: 0,
					right: 0,
					bottom: 0,
					background: "rgba(0,0,0,0.1)",
					pointerEvents: "none",
				},
			}}
		>
			<Container maxWidth="xl" sx={{ position: "relative", zIndex: 1 }}>
				<Grid container spacing={6}>
					{/* Company Info */}
					<Grid item xs={12} md={4}>
						<Box sx={{ mb: 4 }}>
							<img
								src="/assets/image.png"
								alt="Garage24 Logo"
								style={{
									height: 60,
									marginBottom: 16,
									filter: "brightness(1.2)",
								}}
							/>
							<Typography
								variant="h5"
								sx={{
									fontWeight: 800,
									mb: 2,
									background: "linear-gradient(45deg, #ffffff, #f0f0f0)",
									backgroundClip: "text",
									WebkitBackgroundClip: "text",
									WebkitTextFillColor: "transparent",
								}}
							>
								Garage24
							</Typography>
							<Typography
								variant="body2"
								sx={{
									color: "rgba(255,255,255,0.8)",
									lineHeight: 1.7,
									mb: 3,
								}}
							>
								Your trusted automotive service partner, providing premium car care with
								professional expertise and guaranteed satisfaction.
							</Typography>

							{/* Social Media */}
							<Box sx={{ display: "flex", gap: 1 }}>
								{[
									{
										icon: <FacebookIcon />,
										color: "#3b5998",
										href: "https://www.facebook.com/",
									},
									{ icon: <TwitterIcon />, color: "#1da1f2", href: "#" },
									{ icon: <InstagramIcon />, color: "#e4405f", href: "#" },
									{ icon: <LinkedInIcon />, color: "#0077b5", href: "#" },
								].map((social, index) => (
									<IconButton
										key={index}
										href={social.href}
										target="_blank"
										rel="noopener"
										sx={{
											backgroundColor: "rgba(255,255,255,0.1)",
											color: "white",
											"&:hover": {
												backgroundColor: social.color,
												transform: "translateY(-2px)",
											},
											transition: "all 0.3s ease",
										}}
									>
										{social.icon}
									</IconButton>
								))}
							</Box>
						</Box>
					</Grid>

					{/* Contact Info */}
					<Grid item xs={12} md={4}>
						<Typography
							variant="h6"
							sx={{
								fontWeight: 700,
								mb: 3,
								color: "white",
							}}
						>
							Contact Info
						</Typography>
						<Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
							{[
								{
									icon: <LocationOnIcon />,
									text: "190, Galle Road, Kaluthara, Sri Lanka",
									href: "https://www.google.com/maps?q=190,Galle+Road,Kaluthara,Sri+Lanka",
								},
								{
									icon: <PhoneIcon />,
									text: "+94 11 234 3243",
									href: "tel:+94112343243",
								},
								{
									icon: <EmailIcon />,
									text: "info@garage24.lk",
									href: "mailto:info@garage24.lk",
								},
							].map((contact, index) => (
								<Box key={index} sx={{ display: "flex", alignItems: "center", gap: 2 }}>
									<Box
										sx={{
											width: 40,
											height: 40,
											borderRadius: "50%",
											backgroundColor: "rgba(255,255,255,0.1)",
											display: "flex",
											alignItems: "center",
											justifyContent: "center",
											color: "white",
										}}
									>
										{contact.icon}
									</Box>
									<Link
										href={contact.href}
										target={contact.href.startsWith("http") ? "_blank" : undefined}
										rel={
											contact.href.startsWith("http") ? "noopener noreferrer" : undefined
										}
										underline="none"
										sx={{
											color: "rgba(255,255,255,0.8)",
											transition: "color 0.3s",
											"&:hover": {
												color: "#4caf50",
											},
										}}
									>
										<Typography variant="body2">{contact.text}</Typography>
									</Link>
								</Box>
							))}
						</Box>
					</Grid>

					{/* Opening Hours */}
					<Grid item xs={12} md={4}>
						<Typography
							variant="h6"
							sx={{
								fontWeight: 700,
								mb: 3,
								color: "white",
							}}
						>
							Opening Hours
						</Typography>
						<Paper
							elevation={0}
							sx={{
								p: 3,
								background: "rgba(255,255,255,0.1)",
								backdropFilter: "blur(10px)",
								borderRadius: 3,
								border: "1px solid rgba(255,255,255,0.2)",
							}}
						>
							<Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
								<AccessTimeIcon sx={{ color: "#4caf50" }} />
								<Typography variant="body1" fontWeight="600">
									Service Hours
								</Typography>
							</Box>
							<Typography
								variant="body2"
								sx={{
									color: "rgba(255,255,255,0.9)",
									lineHeight: 1.6,
								}}
							>
								Monday – Saturday
								<br />
								8:00 AM – 5:00 PM
							</Typography>
							<Typography
								variant="caption"
								sx={{
									color: "rgba(255,255,255,0.7)",
									mt: 1,
									display: "block",
								}}
							>
								Sunday: Closed
							</Typography>
						</Paper>
					</Grid>
				</Grid>

				<Divider sx={{ borderColor: "rgba(255,255,255,0.2)", my: 4 }} />

				{/* Bottom Section */}
				<Box
					sx={{
						display: "flex",
						flexDirection: { xs: "column", md: "row" },
						justifyContent: "space-between",
						alignItems: "center",
						gap: 2,
					}}
				>
					<Typography
						variant="body2"
						sx={{
							color: "rgba(255,255,255,0.7)",
							textAlign: { xs: "center", md: "left" },
						}}
					>
						© 2024 Garage24. All Rights Reserved. | Designed with ❤️ for automotive
						excellence
					</Typography>
					<Box sx={{ display: "flex", gap: 3 }}>
						{["Privacy Policy", "Terms of Service", "Support"].map((item) => (
							<Link
								key={item}
								href="#"
								underline="none"
								sx={{
									color: "rgba(255,255,255,0.7)",
									fontSize: "0.875rem",
									transition: "color 0.3s",
									"&:hover": {
										color: "#4caf50",
									},
								}}
							>
								{item}
							</Link>
						))}
					</Box>
				</Box>
			</Container>
		</Box>
	);
};

export default Footer;

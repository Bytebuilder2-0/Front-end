

import ResponsiveCarousel from "../components/MaterialUICarousel";
import { Box, Typography, Grid, Card, CardContent, Container, Chip } from "@mui/material";
import Navbar from "../components/Navbar";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import BuildIcon from "@mui/icons-material/Build";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import VerifiedIcon from "@mui/icons-material/Verified";
import HowItWorks from "../components/HowItWorks";
import Footer from "../components/Footer";
import Services from "../components/Services";
import { GlobalStyles } from "@mui/material";

const aboutItems = [
	{
		title: "We Make It Easy",
		description:
			"Make a booking online 24/7. Our mechanics are available from Monday to Saturday from 8:00AM to 5:00PM.",
		icon: <AccessTimeIcon sx={{ fontSize: 40, color: "#4CAF50" }} />,
		color: "#E8F5E8",
		gradient: "linear-gradient(135deg, #4CAF50 0%, #81C784 100%)",
	},
	{
		title: "CWORKS Parts",
		description:
			"CWORKS parts are specifically made according to the vehicle's manufacturer specifications and therefore make finding parts for the specific vehicle much easier.",
		icon: <BuildIcon sx={{ fontSize: 40, color: "#2196F3" }} />,
		color: "#E3F2FD",
		gradient: "linear-gradient(135deg, #2196F3 0%, #64B5F6 100%)",
	},
	{
		title: "Fair And Transparent Pricing",
		description:
			"We offer fair and transparent pricing and provide estimates upfront for many services across many vehicle brands and models. Make your booking with confidence.",
		icon: <AttachMoneyIcon sx={{ fontSize: 40, color: "#FF9800" }} />,
		color: "#FFF3E0",
		gradient: "linear-gradient(135deg, #FF9800 0%, #FFB74D 100%)",
	},
	{
		title: "Happiness Guaranteed",
		description:
			"At Garage24, we collaborate exclusively with top-rated technicians. Every service comes with the trusted Garage24 assurance, ensuring quality you can rely on.",
		icon: <VerifiedIcon sx={{ fontSize: 40, color: "#9C27B0" }} />,
		color: "#F3E5F5",
		gradient: "linear-gradient(135deg, #9C27B0 0%, #BA68C8 100%)",
	},
];

const HomePage = () => {
	return (
		<>
			<Navbar />
			<GlobalStyles
				styles={{
					html: {
						scrollBehavior: "smooth",
					},
					body: {
						margin: 0,
						fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
					},
				}}
			/>

			<ResponsiveCarousel />

			{/* ENHANCED ABOUT SECTION */}
			<Box
				sx={{
					py: { xs: 8, md: 12 },
					px: { xs: 2, sm: 4, md: 6 },
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
						background: "rgba(255, 255, 255, 0.1)",
						backdropFilter: "blur(10px)",
					},
				}}
			>
				<Container maxWidth="xl">
					{/* Section Header */}
					<Box sx={{ textAlign: "center", mb: 8, position: "relative", zIndex: 1 }}>
						
						<Typography
							variant="h3"
							component="h2"
							sx={{
								fontWeight: 800,
								color: "white",
								mb: 2,
								fontSize: { xs: "2.5rem", md: "3.5rem" },
								textShadow: "0 4px 20px rgba(0,0,0,0.3)",
							}}
						>
							Why Choose Garage24?
						</Typography>
						<Typography
							variant="h6"
							sx={{
								maxWidth: 600,
								mx: "auto",
								lineHeight: 1.6,
								fontSize: { xs: "1.1rem", md: "1.3rem" },
								color: "rgba(255,255,255,0.9)",
							}}
						>
							Experience the difference with our professional automotive services
						</Typography>
					</Box>

					
					<Grid container spacing={4} sx={{ position: "relative", zIndex: 1 }}>
						{aboutItems.map((item, index) => (
							<Grid item xs={12} sm={6} lg={3} key={index}>
								<Card
									sx={{
										height: "100%",
										background: "rgba(255, 255, 255, 0.95)",
										backdropFilter: "blur(20px)",
										border: "1px solid rgba(255, 255, 255, 0.2)",
										borderRadius: 4,
										transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
										position: "relative",
										overflow: "hidden",
										"&::before": {
											content: '""',
											position: "absolute",
											top: 0,
											left: 0,
											right: 0,
											height: "4px",
											background: item.gradient,
										},
										"&:hover": {
											transform: "translateY(-16px) scale(1.02)",
											boxShadow: "0 25px 50px rgba(0,0,0,0.15)",
											"& .feature-icon": {
												transform: "scale(1.2) rotate(10deg)",
												background: item.gradient,
											},
											"& .feature-content": {
												transform: "translateY(-4px)",
											},
										},
									}}
								>
									<CardContent
										sx={{
											p: 4,
											height: "100%",
											display: "flex",
											flexDirection: "column",
										}}
									>
										{/* Icon Container */}
										<Box
											className="feature-icon"
											sx={{
												width: 90,
												height: 90,
												borderRadius: "50%",
												bgcolor: item.color,
												display: "flex",
												alignItems: "center",
												justifyContent: "center",
												mb: 3,
												transition: "all 0.4s ease",
												position: "relative",
												boxShadow: "0 8px 25px rgba(0,0,0,0.1)",
											}}
										>
											{item.icon}
										</Box>

										
										<Box
											className="feature-content"
											sx={{ transition: "all 0.3s ease", flex: 1 }}
										>
											<Typography
												variant="h6"
												component="h3"
												sx={{
													fontWeight: 700,
													mb: 2,
													color: "text.primary",
													fontSize: "1.2rem",
												}}
											>
												{item.title}
											</Typography>
											<Typography
												variant="body2"
												color="text.secondary"
												sx={{
													lineHeight: 1.7,
													fontSize: "0.95rem",
												}}
											>
												{item.description}
											</Typography>
										</Box>

										{/* Check Icon */}
										<Box sx={{ mt: 3, display: "flex", alignItems: "center", gap: 1 }}>
											<CheckCircleIcon sx={{ color: "success.main", fontSize: 20 }} />
											<Typography variant="caption" color="success.main" fontWeight="600">
												Verified Service
											</Typography>
										</Box>
									</CardContent>
								</Card>
							</Grid>
						))}
					</Grid>
				</Container>
			</Box>

			<div id="services">
				<Services />
			</div>

			<HowItWorks />
			{/* <FeedbackSlider/> */}

			<div id="contact">
				<Footer />
			</div>
		</>
	);
};

export default HomePage;

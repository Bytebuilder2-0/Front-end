import { Box, Typography, Grid, Container, Paper, Chip } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import EventIcon from "@mui/icons-material/Event";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";

const steps = [
	{
		image: "/assets/man2.webp",
		title: "Choose YOUR SERVICE",
		number: "01",
		icon: <SearchIcon sx={{ fontSize: 50, color: "#2196F3" }} />,
		description:
			"Browse our comprehensive service catalog and select what your vehicle needs",
	},
	{
		image: "/assets/man2.webp",
		title: "Make an APPOINTMENT",
		number: "02",
		icon: <EventIcon sx={{ fontSize: 50, color: "#4CAF50" }} />,
		description: "Schedule your preferred time slot with our easy online booking system",
	},
	{
		image: "/assets/car.png",
		title: "We'll take YOUR CAR for repair",
		number: "03",
		icon: <DirectionsCarIcon sx={{ fontSize: 50, color: "#FF9800" }} />,
		description: "Our expert technicians will handle your vehicle with professional care",
	},
];

const HowItWorks = () => {
	return (
		<Box
			sx={{
				py: { xs: 8, md: 12 },
				background: "linear-gradient(135deg,  #82b1ff 0%, #1a237e 100%)",
				position: "relative",
				overflow: "hidden",
			}}
		>
			<Container maxWidth="xl">
				{/* Section Header */}
				<Box sx={{ textAlign: "center", mb: 10 }}>
					{/* <Chip
						label="Simple Process"
						sx={{
							mb: 3,
							bgcolor: "rgba(255,255,255,0.2)",
							color: "white",
							fontWeight: "bold",
							fontSize: "0.9rem",
							px: 3,
							py: 1,
							backdropFilter: "blur(10px)",
							border: "1px solid rgba(255,255,255,0.3)",
						}}
					/> */}
					<Typography
						variant="h3"
						sx={{
							fontWeight: 800,
							color: "white",
							mb: 2,
							fontSize: { xs: "2.5rem", md: "3.5rem" },
							textShadow: "0 4px 20px rgba(0,0,0,0.3)",
						}}
					>
						How It Works
					</Typography>
					<Typography
						variant="h6"
						sx={{
							color: "rgba(255,255,255,0.9)",
							maxWidth: 600,
							mx: "auto",
							lineHeight: 1.6,
							fontSize: { xs: "1.1rem", md: "1.3rem" },
						}}
					>
						These few steps will help return your car to a working condition
					</Typography>
				</Box>

				{/* Steps Grid */}
				<Grid container spacing={6} justifyContent="center">
					{steps.map((step, index) => (
						<Grid item xs={12} md={4} key={index}>
							<Box sx={{ position: "relative", textAlign: "center" }}>
								{/* Background Number */}
								<Typography
									sx={{
										fontSize: { xs: "120px", md: "150px" },
										fontWeight: 900,
										color: "rgba(255, 255, 255, 0.1)",
										position: "absolute",
										top: "50%",
										left: "50%",
										transform: "translate(-50%, -60%)",
										zIndex: 0,
										lineHeight: 1,
									}}
								>
									{step.number}
								</Typography>

								{/* Content Card */}
								<Paper
									elevation={0}
									sx={{
										p: 4,
										borderRadius: 4,
										background: "rgba(255, 255, 255, 0.95)",
										backdropFilter: "blur(20px)",
										border: "1px solid rgba(255, 255, 255, 0.2)",
										position: "relative",
										zIndex: 1,
										transition: "all 0.4s ease",
										"&:hover": {
											transform: "translateY(-10px)",
											boxShadow: "0 25px 50px rgba(0,0,0,0.2)",
										},
									}}
								>
									{/* Icon */}
									<Box
										sx={{
											width: 100,
											height: 100,
											borderRadius: "50%",
											background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
											display: "flex",
											alignItems: "center",
											justifyContent: "center",
											mx: "auto",
											mb: 3,
											boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
										}}
									>
										{step.icon}
									</Box>

									{/* Title */}
									<Typography
										variant="h6"
										sx={{
											fontWeight: 700,
											mb: 2,
											color: "text.primary",
											fontSize: "1.2rem",
										}}
									>
										{step.title}
									</Typography>

									{/* Description */}
									<Typography
										variant="body2"
										color="text.secondary"
										sx={{
											lineHeight: 1.7,
											fontSize: "0.95rem",
										}}
									>
										{step.description}
									</Typography>
								</Paper>

								{/* Connection Line (except for last item) */}
								{index < steps.length - 1 && (
									<Box
										sx={{
											position: "absolute",
											top: "50%",
											right: { xs: "50%", md: "-50px" },
											transform: {
												xs: "translateY(50px) rotate(90deg)",
												md: "translateY(-50%)",
											},
											width: "100px",
											height: "2px",
											background:
												"linear-gradient(90deg, rgba(255,255,255,0.5), transparent)",
											zIndex: 0,
											display: { xs: "none", md: "block" },
										}}
									/>
								)}
							</Box>
						</Grid>
					))}
				</Grid>
			</Container>
		</Box>
	);
};

export default HowItWorks;

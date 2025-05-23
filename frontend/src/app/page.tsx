import Slider from "@/components/Slider";
import Services from "@/components/Services";
import { Box } from "@mui/material";

export default function Home() {
	return (
		<Box
			sx={{
				display: "flex",
				flexDirection: "column",
				height: "100vh",
				width: "100vw",
				overflow: "hidden",
				bgcolor: "#f4f6f8",
			}}
		>
			{/* --- Main Content Area --- */}
			<Box
				component="main"
				sx={{
					flexGrow: 1,
					overflow: "hidden",
					py: 1,
					px: 1,
					display: "flex",
					flexDirection: "column",
				}}
			>
				<Slider />

				<Services />
			</Box>
		</Box>
	);
}

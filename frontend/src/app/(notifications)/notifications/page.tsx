"use client";

import React from "react";
import { Box, Button, Typography, Grid, Paper } from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import NewsIcon from "@mui/icons-material/Newspaper";
import CloudIcon from "@mui/icons-material/Cloud";
import AssessmentIcon from "@mui/icons-material/Assessment"; // Icon Báo cáo
import { styled } from "@mui/system";
import { useRouter } from "next/navigation";

const NotificationPage = () => {
	const router = useRouter();

	const ButtonStyled = styled(Button)(({ theme }) => ({
		backgroundColor: "#81c784", // Soft green
		color: "#fff",
		"&:hover": {
			backgroundColor: "#66bb6a", // Darker green on hover
		},
		margin: theme.spacing(1),
		borderRadius: "20px",
		padding: "10px 20px",
	}));

	return (
		<Box
			sx={{ backgroundColor: "#f1f8e9", minHeight: "100vh", padding: 2 }}
		>
			<Typography
				variant="h3"
				sx={{ textAlign: "center", color: "#388e3c", marginBottom: 4 }}
			>
				Thông báo
			</Typography>

			<div className="grid grid-cols-2 gap-4">
				<ButtonStyled
					startIcon={<NotificationsIcon />}
					onClick={() => router.push("/notification-detail")}
				>
					Thông báo
				</ButtonStyled>

				<ButtonStyled
					startIcon={<NewsIcon />}
					onClick={() => router.push("/news")}
				>
					Tin tức
				</ButtonStyled>

				<ButtonStyled
					startIcon={<CloudIcon />}
					onClick={() => router.push("/weather")}
				>
					Thời tiết
				</ButtonStyled>

				<ButtonStyled
					startIcon={<AssessmentIcon />}
					onClick={() => router.push("/report")}
				>
					Báo cáo
				</ButtonStyled>
			</div>

			<Box sx={{ marginTop: 4 }}>
				<Typography
					variant="h5"
					sx={{ color: "#388e3c", marginBottom: 2 }}
				>
					Tin tức mới nhất
				</Typography>
				<Grid container spacing={3} justifyContent="center">
					<Grid item xs={12} sm={4}>
						<Paper
							sx={{
								padding: 2,
								textAlign: "center",
								backgroundColor: "#e8f5e9",
							}}
						>
							<Typography variant="h6" sx={{ color: "#388e3c" }}>
								Tin 1
							</Typography>
							<Typography variant="body2">
								Thông tin về tin tức mới nhất...
							</Typography>
						</Paper>
					</Grid>
					<Grid item xs={12} sm={4}>
						<Paper
							sx={{
								padding: 2,
								textAlign: "center",
								backgroundColor: "#e8f5e9",
							}}
						>
							<Typography variant="h6" sx={{ color: "#388e3c" }}>
								Tin 2
							</Typography>
							<Typography variant="body2">
								Thông tin về tin tức mới nhất...
							</Typography>
						</Paper>
					</Grid>
					<Grid item xs={12} sm={4}>
						<Paper
							sx={{
								padding: 2,
								textAlign: "center",
								backgroundColor: "#e8f5e9",
							}}
						>
							<Typography variant="h6" sx={{ color: "#388e3c" }}>
								Tin 3
							</Typography>
							<Typography variant="body2">
								Thông tin về tin tức mới nhất...
							</Typography>
						</Paper>
					</Grid>
				</Grid>
			</Box>
		</Box>
	);
};

export default NotificationPage;

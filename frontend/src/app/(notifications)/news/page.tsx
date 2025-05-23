"use client";

import React from "react";
import { Box, Typography, IconButton } from "@mui/material";
import { ArrowBack } from "@mui/icons-material";
import { useRouter } from "next/navigation";

const NewsPage = () => {
	const router = useRouter();

	return (
		<Box
			sx={{
				minHeight: "100vh",
				width: "100vw",
				bgcolor: "#f1f8e9", // Light green background
				p: 2,
				display: "flex",
				flexDirection: "column",
				alignItems: "center",
				boxSizing: "border-box",
			}}
		>
			<IconButton
				sx={{
					position: "absolute",
					top: 10,
					left: 10,
					color: "#388e3c",
				}}
				onClick={() => router.push("/notifications")}
			>
				<ArrowBack />
			</IconButton>
			<Typography
				variant="h4"
				sx={{ textAlign: "center", mb: 3, color: "#388e3c", mt: 6 }}
			>
				Trang Tin Tức
			</Typography>
			<Typography variant="body1">
				Đây là trang tin tức. Nội dung tin tức sẽ được hiển thị ở đây.
			</Typography>
		</Box>
	);
};

export default NewsPage;

"use client";

import React, { useState } from "react";
import {
	Typography,
	Button,
	Box,
	IconButton,
	FormControl,
	InputLabel,
	Select,
	MenuItem,
	SelectChangeEvent,
} from "@mui/material";
import { pink, orange } from "@mui/material/colors";
import { ArrowBack } from "@mui/icons-material";
import { useRouter } from "next/navigation";

const RegisterService = () => {
	const router = useRouter();
	const [selectedService, setSelectedService] = useState("");

	const serviceOptions = [
		{ id: 1, name: "Dịch vụ bảo trì" },
		{ id: 2, name: "Dịch vụ vệ sinh" },
		{ id: 3, name: "Dịch vụ trông xe" },
	];

	const handleChange = (event: SelectChangeEvent<string>) => {
		setSelectedService(event.target.value);
	};

	return (
		<Box
			sx={{
				minHeight: "100vh",
				width: "100vw",
				bgcolor: orange[50],
				p: 2,
				display: "flex",
				flexDirection: "column",
				alignItems: "center",
				justifyContent: "flex-start",
				boxSizing: "border-box",
			}}
		>
			<IconButton
				sx={{
					position: "absolute",
					top: 10,
					left: 10,
					color: "salmon",
				}}
				onClick={() => router.push("/tools")}
			>
				<ArrowBack />
			</IconButton>
			<Typography
				variant="h4"
				sx={{ textAlign: "center", mb: 3, color: "salmon", mt: 6 }}
			>
				Đăng Ký Dịch Vụ
			</Typography>
			<Box
				component="form"
				sx={{
					display: "flex",
					flexDirection: "column",
					gap: 2,
					width: "90%",
					maxWidth: "400px",
				}}
			>
				<FormControl fullWidth>
					<InputLabel id="service-select-label">
						Chọn dịch vụ
					</InputLabel>
					<Select
						labelId="service-select-label"
						id="service-select"
						value={selectedService}
						label="Chọn dịch vụ"
						onChange={handleChange}
					>
						{serviceOptions.map((service) => (
							<MenuItem key={service.id} value={service.id}>
								{service.name}
							</MenuItem>
						))}
					</Select>
				</FormControl>
				<Button
					variant="contained"
					sx={{
						bgcolor: pink[300],
						color: "white",
						"&:hover": { bgcolor: pink[600] },
					}}
					fullWidth
				>
					Đăng Ký
				</Button>
			</Box>
		</Box>
	);
};

export default RegisterService;

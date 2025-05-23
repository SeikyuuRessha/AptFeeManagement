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

const RegisterApartmentRental = () => {
	const router = useRouter();
	const [selectedApartment, setSelectedApartment] = useState("");

	const apartmentOptions = [
		{ id: 1, address: "123 Main St" },
		{ id: 2, address: "456 Oak Ave" },
		{ id: 3, address: "789 Pine Ln" },
	];

	const handleChange = (event: SelectChangeEvent<string>) => {
		setSelectedApartment(event.target.value);
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
				Đăng Ký Thuê Căn Hộ
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
					<InputLabel id="apartment-select-label">
						Chọn căn hộ
					</InputLabel>
					<Select
						labelId="apartment-select-label"
						id="apartment-select"
						value={selectedApartment}
						label="Chọn căn hộ"
						onChange={handleChange}
					>
						{apartmentOptions.map((apartment) => (
							<MenuItem key={apartment.id} value={apartment.id}>
								{apartment.address}
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

export default RegisterApartmentRental;

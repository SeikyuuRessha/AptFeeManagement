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
	const [error, setError] = useState<string | null>(null);

	// Cập nhật apartmentOptions với thông tin mô tả hơn
	// Trong ứng dụng thực tế, dữ liệu này thường được lấy từ API
	const apartmentOptions: { id: string; name: string; description: string }[] = [
		{
			id: "APT001",
			name: "Căn hộ P1-12A08 - Park Hill",
			description: "2 phòng ngủ, 75m², view công viên",
		},
		{
			id: "APT002",
			name: "Căn hộ R2-25B01 - Royal City",
			description: "3 phòng ngủ, 120m², full nội thất, view quảng trường",
		},
		{ id: "APT003", name: "Shophouse SH05 - Times City", description: "Tầng 1, 150m², mặt đường lớn" },
	];

	const handleChange = (event: SelectChangeEvent<string>) => {
		setSelectedApartment(event.target.value);
		setError(null); // Xóa thông báo lỗi khi người dùng thay đổi lựa chọn
	};

	const handleRegister = () => {
		if (selectedApartment) {
			setError(null); // Xóa thông báo lỗi nếu có
			// Điều hướng đến trang hiển thị chi tiết căn hộ, giá và hợp đồng.
			// Truyền ID căn hộ đã chọn qua query parameter
			// Trang `/contract-view` sẽ chịu trách nhiệm tải và hiển thị thông tin này.
			router.push(`/contract-view?apartmentId=${selectedApartment}`);
		} else {
			// Hiển thị thông báo lỗi trên giao diện thay vì alert
			setError("Vui lòng chọn một căn hộ để đăng ký.");
		}
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
								{apartment.name} - {apartment.description}
							</MenuItem>
						))}
					</Select>
				</FormControl>
				{error && (
					<Typography color="error" sx={{ mt: 1, textAlign: 'center' }}>
						{error}
					</Typography>
				)}
				<Button
					variant="contained"
					sx={{
						bgcolor: pink[300],
						color: "white",
						"&:hover": { bgcolor: pink[600] },
					}}
					fullWidth
					onClick={handleRegister}
				>
					Đăng Ký
				</Button>
			</Box>
		</Box>
	);
};

export default RegisterApartmentRental;

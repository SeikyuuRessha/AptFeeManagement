"use client";

import React, { useState, useEffect } from "react";
import {
	Typography,
	List,
	ListItem,
	ListItemText,
	Box,
	IconButton,
} from "@mui/material";
import { orange } from "@mui/material/colors";
import { ArrowBack } from "@mui/icons-material";
import { useRouter } from "next/navigation";

const ServiceList = () => {
	const router = useRouter();
	const [services, setServices] = useState<
		{
			id: number;
			name: string;
			description: string;
		}[]
	>([]);

	useEffect(() => {
		// Simulate fetching data from backend
		const fetchData = async () => {
			// Replace this with actual API call
			const data = [
				{ id: 1, name: "Dịch vụ 1", description: "Mô tả dịch vụ 1" },
				{ id: 2, name: "Dịch vụ 2", description: "Mô tả dịch vụ 2" },
				{ id: 3, name: "Dịch vụ 3", description: "Mô tả dịch vụ 3" },
			];
			setServices(data);
		};

		fetchData();
	}, []);

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
				Danh Sách Dịch Vụ
			</Typography>
			<List sx={{ width: "90%" }}>
				{services.map((service) => (
					<ListItem key={service.id}>
						<ListItemText
							primary={service.name}
							secondary={service.description}
						/>
					</ListItem>
				))}
			</List>
		</Box>
	);
};

export default ServiceList;

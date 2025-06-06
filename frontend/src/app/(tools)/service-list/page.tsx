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
			// Replace this with actual API call for apartment fee management services
			const data = [
				{
					id: 1,
					name: "Thu Phí Định Kỳ & Phát Hành Hóa Đơn",
					description:
						"Quản lý việc thu các loại phí dịch vụ hàng tháng/quý (phí quản lý, nước, xe...) và phát hành hóa đơn điện tử cho cư dân.",
				},
				{
					id: 2,
					name: "Thông Báo & Nhắc Nợ Tự Động",
					description:
						"Hệ thống gửi thông báo phí, nhắc nhở thanh toán tự động khi đến hạn hoặc quá hạn, giúp giảm thiểu công nợ.",
				},
				{
					id: 3,
					name: "Quản Lý Thanh Toán Đa Kênh",
					description:
						"Hỗ trợ nhiều hình thức thanh toán tiện lợi cho cư dân: trực tuyến qua cổng thanh toán, chuyển khoản, ví điện tử.",
				},
				{
					id: 4,
					name: "Báo Cáo Tài Chính & Công Nợ Chi Tiết",
					description:
						"Cung cấp báo cáo thu chi, tình hình công nợ, và các số liệu tài chính khác một cách minh bạch, dễ theo dõi.",
				},
				{
					id: 5,
					name: "Hỗ Trợ Cư Dân Về Phí Dịch Vụ",
					description:
						"Giải đáp thắc mắc, tiếp nhận và xử lý các yêu cầu, khiếu nại của cư dân liên quan đến các khoản phí và thanh toán.",
				},
				{
					id: 6,
					name: "Quản Lý Quỹ Bảo Trì Chung Cư",
					description:
						"Theo dõi, quản lý việc thu và chi quỹ bảo trì (2%) theo đúng quy định, đảm bảo nguồn tài chính cho việc duy tu tòa nhà.",
				},
				// Bạn có thể thêm các dịch vụ khác tại đây
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

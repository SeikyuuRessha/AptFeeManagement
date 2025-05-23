"use client";

import { Apartment, Build, House, List as ListIcon } from "@mui/icons-material";
import { Box, Grid, Typography } from "@mui/material";
import { orange, pink } from "@mui/material/colors";
import React from "react";
import { useRouter } from "next/navigation";
import SubTools from "../components/Tools";
import { Button } from "@/components/ui/button";

const others = [
	{
		href: "/register-apartment-rental",
		content: "Đăng ký thuê căn hộ",
	},
	{
		href: "/register-apartment-purchase",
		content: "	Đăng ký mua căn hộ",
	},
	{
		href: "/register-service",
		content: "Đăng ký dịch vụ",
	},
	{
		href: "/service-list",
		content: "Danh sách dịch vụ",
	},
];

const Tools = () => {
	const router = useRouter();

	return (
		<Box
			sx={{
				backgroundColor: orange[50],
				minHeight: "100vh",
				padding: "20px",
				textAlign: "center",
			}}
		>
			{/* Đề mục */}
			<Typography
				variant="h3"
				sx={{ marginBottom: "20px", color: "salmon" }}
			>
				Công Cụ
			</Typography>

			{/* Nội dung chính */}
			<div className="grid grid-cols-2 gap-4">
				{others.map((item, index) => (
					<Button
						className="cursor-pointer"
						key={index}
						onClick={() => router.push(item.href)}
					>
						{item.content}
					</Button>
				))}
			</div>

			{/* Các hình ảnh và icon có thể thêm vào tùy ý */}
			<SubTools />
		</Box>
	);
};

export default Tools;

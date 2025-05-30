import React from "react";
import {
	Container,
	Typography,
	Paper,
	List,
	ListItem,
	ListItemText,
	Divider,
} from "@mui/material";

// Giả sử thông tin tài khoản người dùng đã được lấy từ state hoặc context (ví dụ: userId)
const currentUserId = 1; // Đây là ví dụ, bạn nên lấy thông tin này từ state hoặc context của ứng dụng.

const ReportPage = () => {
	// Các báo cáo mà ban quản lý gửi riêng cho từng tài khoản
	const reports = [
		{
			id: 1,
			userId: 1,
			title: "Công nợ",
			description: "Báo cáo công nợ của cư dân trong tháng.",
		},
		{
			id: 2,
			userId: 1,
			title: "Tiền điện",
			description:
				"Chi tiết tiền điện sử dụng trong tháng của các căn hộ.",
		},
		{
			id: 3,
			userId: 1,
			title: "Tiền nước",
			description: "Chi tiết tiền nước sử dụng trong tháng.",
		},
		{
			id: 4,
			userId: 1,
			title: "Phí dịch vụ",
			description: "Báo cáo phí dịch vụ cần thanh toán cho cư dân.",
		},
		{
			id: 5,
			userId: 1,
			title: "Phí thuê căn hộ",
			description: "Thông tin phí thuê căn hộ cho các cư dân.",
		},
	];

	// Lọc báo cáo theo userId hiện tại và chỉ lấy báo cáo liên quan đến các loại báo cáo cần thiết
	const filteredReports = reports.filter(
		(report) => report.userId === currentUserId,
	);

	return (
		<Container maxWidth="md" sx={{ textAlign: "center", py: 4 }}>
			<Typography
				variant="h4"
				sx={{ fontWeight: "bold", color: "green", mb: 3 }}
			>
				Báo Cáo Tài Chính và Dịch Vụ Của Tôi
			</Typography>

			<div className="shadow-md border border-gray-200 p-4 rounded-md">
				{filteredReports.length > 0 ? (
					filteredReports.map((report) => (
						<div
							key={report.id}
							className="text-left space-y-2 p-2 border-b-2 border-gray-200"
						>
							<div className="text-lg font-bold">
								{report.title}
							</div>

							<div className="text-sm">{report.description}</div>
						</div>
					))
				) : (
					<Typography
						variant="body1"
						sx={{ color: "red", marginTop: 2 }}
					>
						Không có báo cáo công nợ, tiền điện, nước, phí dịch vụ
						hoặc phí thuê căn hộ dành cho bạn.
					</Typography>
				)}
			</div>
		</Container>
	);
};

export default ReportPage;
"use client";

import React from "react";
import {
	Box,
	Typography,
	IconButton,
	Container,
	Paper,
	CircularProgress,
	Button, // Thêm Button
} from "@mui/material";
import { ArrowBack } from "@mui/icons-material";
import { useRouter, useParams } from "next/navigation";

// Định nghĩa lại NewsItem interface và newsItems array (trong ứng dụng thực tế, bạn sẽ lấy dữ liệu này từ API hoặc store)
interface NewsItemData {
	id: string;
	title: string;
	summary: string;
	fullContent: string;
	date: string;
}

const allNewsItems: NewsItemData[] = [
	{
		id: "news-1",
		title: "Thông báo lịch cắt nước tòa nhà A",
		summary: "Do sự cố đường ống, tòa nhà A sẽ tạm ngưng cung cấp nước...",
		fullContent:
			"Kính gửi quý cư dân tòa nhà A,\n\nHiện tại, do sự cố đột xuất trên hệ thống đường ống dẫn nước chính, Ban Quản Lý tòa nhà xin thông báo về việc tạm ngưng cung cấp nước sinh hoạt.\n\nThời gian dự kiến: Từ 14:00 ngày 10/05/2024 đến 18:00 ngày 10/05/2024.\n\nChúng tôi đang khẩn trương làm việc với đơn vị sửa chữa để khắc phục sự cố trong thời gian sớm nhất. Rất mong quý cư dân thông cảm và chủ động tích trữ nước cho nhu cầu sử dụng.\n\nTrân trọng thông báo!",
		date: "09/05/2024",
	},
	{
		id: "news-2",
		title: "Chương trình khuyến mãi phí quản lý tháng 6",
		summary: "Ưu đãi đặc biệt cho cư dân thanh toán phí quản lý sớm...",
		fullContent:
			"Nhằm tri ân quý cư dân đã đồng hành cùng Ban Quản Lý, chúng tôi xin trân trọng thông báo chương trình khuyến mãi đặc biệt cho phí quản lý tháng 06/2024:\n\n- Giảm 10% cho các hộ thanh toán trước ngày 05/06/2024.\n- Giảm 5% cho các hộ thanh toán từ ngày 05/06/2024 đến ngày 10/06/2024.\n\nChương trình áp dụng cho tất cả các căn hộ. Vui lòng liên hệ quầy lễ tân để biết thêm chi tiết.\n\nXin cảm ơn!",
		date: "08/05/2024",
	},
	{
		id: "news-3",
		title: "Lịch phun thuốc diệt côn trùng định kỳ",
		summary: "Ban quản lý sẽ tiến hành phun thuốc diệt côn trùng...",
		fullContent:
			"Để đảm bảo môi trường sống trong lành và an toàn cho quý cư dân, Ban Quản Lý sẽ tổ chức phun thuốc diệt muỗi và côn trùng định kỳ tại các khu vực công cộng của tòa nhà.\n\nThời gian thực hiện: 09:00 - 11:00, Thứ Bảy, ngày 11/05/2024.\n\nTrong thời gian phun thuốc, vui lòng đóng cửa sổ và hạn chế ra vào các khu vực đang xử lý. Thuốc sử dụng an toàn cho người và vật nuôi sau khi khô.\n\nTrân trọng.",
		date: "07/05/2024",
	},
];

const NewsDetailPage = () => {
	const router = useRouter();
	const params = useParams();
	const newsId = params.id as string; // Lấy id từ URL

	const newsItem = allNewsItems.find((item) => item.id === newsId);

	if (!newsItem) {
		return (
			<Container maxWidth="md" sx={{ py: 2, textAlign: "center" }}>
				<Paper elevation={3} sx={{ p: 4, mt: 4, bgcolor: 'background.paper' }}>
					<Typography variant="h5" component="h2" gutterBottom color="error.main">
						Không tìm thấy tin tức
					</Typography>
					<Typography sx={{ mb: 3 }}>
						Tin tức bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.
					</Typography>
					<Button variant="outlined" startIcon={<ArrowBack />} onClick={() => router.push("/notifications/news")}>
						Quay lại danh sách tin tức
					</Button>
				</Paper>
			</Container>
		);
	}

	return (
		<Container maxWidth="md" sx={{ bgcolor: "#f1f8e9", minHeight: "100vh", py: 2 }}>
			<IconButton
				sx={{ mb: 2, color: "#388e3c", '&:hover': { bgcolor: 'action.hover' } }}
				onClick={() => router.push("/notifications/news")} // Quay lại trang danh sách tin tức
				aria-label="Quay lại danh sách tin tức"
			>
				<ArrowBack />
			</IconButton>
			<Paper elevation={4} sx={{ p: { xs: 2, sm: 3, md: 4 }, borderRadius: 2, bgcolor: 'background.paper' }}>
				<Typography 
					variant="h4" 
					component="h1" 
					gutterBottom 
					sx={{ 
						color: "primary.dark", // Sử dụng màu đậm hơn từ theme
						fontWeight: 'bold',
						lineHeight: 1.3 
					}}
				>
					{newsItem.title}
				</Typography>
				<Typography variant="subtitle2" display="block" color="text.secondary" sx={{ mb: 3 }}>
					Ngày đăng: {newsItem.date}
				</Typography>
				<Box sx={{ whiteSpace: "pre-line", lineHeight: 1.7, fontSize: '1.1rem', color: 'text.primary' }}>
					{newsItem.fullContent}
				</Box>
			</Paper>
		</Container>
	);
};

export default NewsDetailPage;
"use client";

import React, { useState } from "react";
import {
	Box,
	Typography,
	IconButton,
	Paper,
	List,
	ListItem,
	ListItemText,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogContentText,
	DialogActions,
	Button,
	Container,
} from "@mui/material";
import { ArrowBack, Close as CloseIcon } from "@mui/icons-material";
import { useRouter } from "next/navigation";

interface NewsItem {
	id: string;
	title: string;
	summary: string;
	fullContent: string;
	date: string;
}

const NewsPage = () => {
	const router = useRouter();
	const [openDialog, setOpenDialog] = useState(false);
	const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);

	const newsItems: NewsItem[] = [
		{
			id: "news-1",
			title: "Thông báo lịch cắt nước tòa nhà A",
			summary:
				"Do sự cố đường ống, tòa nhà A sẽ tạm ngưng cung cấp nước...",
			fullContent:
				"Kính gửi quý cư dân tòa nhà A,\n\nHiện tại, do sự cố đột xuất trên hệ thống đường ống dẫn nước chính, Ban Quản Lý tòa nhà xin thông báo về việc tạm ngưng cung cấp nước sinh hoạt.\n\nThời gian dự kiến: Từ 14:00 ngày 10/05/2024 đến 18:00 ngày 10/05/2024.\n\nChúng tôi đang khẩn trương làm việc với đơn vị sửa chữa để khắc phục sự cố trong thời gian sớm nhất. Rất mong quý cư dân thông cảm và chủ động tích trữ nước cho nhu cầu sử dụng.\n\nTrân trọng thông báo!",
			date: "09/05/2024",
		},
		{
			id: "news-2",
			title: "Chương trình khuyến mãi phí quản lý tháng 6",
			summary:
				"Ưu đãi đặc biệt cho cư dân thanh toán phí quản lý sớm...",
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

	const handleNewsClick = (news: NewsItem) => {
		setSelectedNews(news);
		setOpenDialog(true);
	};

	const handleCloseDialog = () => {
		setOpenDialog(false);
		setSelectedNews(null);
	};

	return (
		<Container
			maxWidth="md" // Sử dụng Container để giới hạn chiều rộng và căn giữa
			sx={{
				bgcolor: "#f1f8e9", // Light green background
				minHeight: "100vh", // Đảm bảo chiều cao tối thiểu
				py: 2, // padding top and bottom
			}}
		>
			<IconButton
				sx={{
					// position: "absolute", // Không cần absolute nếu dùng Container
					// top: 10,
					// left: 10,
					mb: 1, // margin bottom cho nút back
					color: "#388e3c",
				}}
				onClick={() => router.push("/notifications")}
			>
				<ArrowBack />
			</IconButton>
			<Typography
				variant="h4"
				sx={{ textAlign: "center", mb: 3, color: "#388e3c" /*mt: 6 bỏ đi*/ }}
			>
				Trang Tin Tức
			</Typography>

			{newsItems.length > 0 ? (
				<List>
					{newsItems.map((news) => (
						<Paper
							key={news.id}
							elevation={2}
							sx={{
								mb: 2,
								cursor: "pointer",
								"&:hover": {
									backgroundColor: "action.hover",
								},
							}}
							onClick={() => handleNewsClick(news)}
						>
							<ListItem alignItems="flex-start">
								<ListItemText
									primary={
										<Typography variant="h6" component="div" color="primary.dark">
											{news.title}
										</Typography>
									}
									secondary={
										<>
											<Typography
												sx={{ display: "block" }}
												component="span"
												variant="body2"
												color="text.secondary"
											>
												{news.date}
											</Typography>
											{news.summary}
										</>
									}
								/>
							</ListItem>
						</Paper>
					))}
				</List>
			) : (
				<Typography sx={{ textAlign: "center", mt: 3, color: "text.secondary" }}>
					Hiện chưa có tin tức nào.
				</Typography>
			)}

			{selectedNews && (
				<Dialog open={openDialog} onClose={handleCloseDialog} fullWidth maxWidth="sm">
					<DialogTitle>
						{selectedNews.title}
						<IconButton
							aria-label="close"
							onClick={handleCloseDialog}
							sx={{ position: "absolute", right: 8, top: 8, color: (theme) => theme.palette.grey[500] }}
						>
							<CloseIcon />
						</IconButton>
					</DialogTitle>
					<DialogContent dividers>
						<DialogContentText component="div" sx={{ whiteSpace: 'pre-line' }}>
							<Typography variant="caption" display="block" gutterBottom color="text.secondary">Ngày đăng: {selectedNews.date}</Typography>
							{selectedNews.fullContent}
						</DialogContentText>
					</DialogContent>
					<DialogActions>
						<Button onClick={handleCloseDialog} color="primary">Đóng</Button>
					</DialogActions>
				</Dialog>
			)}
		</Container>
	);
};

export default NewsPage;

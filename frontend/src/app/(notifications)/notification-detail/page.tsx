"use client";

import React from "react";
import { Box, Typography, IconButton, Container,Button, Paper, Chip, Icon, SvgIcon } from "@mui/material";
import { ArrowBack } from "@mui/icons-material";
import PaymentIcon from '@mui/icons-material/Payment';
import ConstructionIcon from '@mui/icons-material/Construction';
import CampaignIcon from '@mui/icons-material/Campaign';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import EventIcon from '@mui/icons-material/Event';
import GavelIcon from '@mui/icons-material/Gavel';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';

import { useRouter, useSearchParams } from "next/navigation"; // Thêm useSearchParams

interface NotificationItem {
	id: string;
	title: string;
	content: string;
	date: string;
	type: 'fee_reminder' | 'maintenance_scheduled' | 'maintenance_completed' | 'announcement' | 'payment_confirmation' | 'community_event' | 'new_regulation' | 'emergency'; // Các loại thông báo
	isRead: boolean;
	relatedLink?: string;
	icon?: React.ElementType; // Thêm icon cho từng loại
}

const sampleNotifications: NotificationItem[] = [
	{
		id: "notif-1",
		title: "Nhắc nhở thanh toán phí dịch vụ tháng 05/2024",
		content: "Kính gửi quý cư dân,\n\nĐây là thông báo nhắc nhở về việc thanh toán phí dịch vụ tháng 05/2024. Hạn cuối thanh toán là ngày 15/05/2024.\n\nSố tiền cần thanh toán: 1.200.000 VNĐ.\n\nVui lòng thực hiện thanh toán sớm để tránh phát sinh phí trễ hạn.\n\nTrân trọng cảm ơn!",
		date: "10/05/2024 09:00",
		type: "fee_reminder",
		isRead: false,
		relatedLink: "/payment",
		icon: PaymentIcon
	},
	{
		id: "notif-2",
		title: "Xác nhận thanh toán thành công phí quản lý",
		content: "Thanh toán của bạn cho phí quản lý tháng 04/2024 với số tiền 1.000.000 VNĐ đã được ghi nhận thành công vào ngày 05/04/2024.\n\nMã giao dịch: TXN_PM_042024_123.\n\nCảm ơn bạn đã hoàn tất thanh toán.",
		date: "05/04/2024 14:30",
		type: "payment_confirmation",
		isRead: true,
		icon: CheckCircleOutlineIcon
	},
	{
		id: "notif-3",
		title: "Thông báo lịch bảo trì thang máy tòa B",
		content: "Kính gửi quý cư dân tòa B,\n\nBan quản lý xin thông báo lịch bảo trì định kỳ cho hệ thống thang máy tại tòa B như sau:\n- Thời gian: Từ 09:00 đến 17:00, ngày 12/05/2024.\nTrong thời gian bảo trì, thang máy số 02 sẽ tạm ngưng hoạt động. Vui lòng sử dụng thang máy số 01 hoặc thang bộ.\n\nRất mong quý cư dân thông cảm cho sự bất tiện này.",
		date: "09/05/2024 16:00",
		type: "maintenance_scheduled",
		isRead: false,
		icon: ConstructionIcon
	},
	{
		id: "notif-4",
		title: "Hoàn tất bảo trì hệ thống cấp nước tổng",
		content: "Ban quản lý vui mừng thông báo hệ thống cấp nước tổng của tòa nhà đã được bảo trì và hoạt động trở lại bình thường từ 18:00 ngày 10/05/2024.\n\nCảm ơn sự kiên nhẫn của quý cư dân.",
		date: "10/05/2024 18:30",
		type: "maintenance_completed",
		isRead: true,
		icon: CheckCircleOutlineIcon
	},
	{
		id: "notif-5",
		title: "Mời tham gia sự kiện \"Ngày Hội Gia Đình\" cuối tuần này",
		content: "Thân mời quý cư dân cùng gia đình tham gia sự kiện \"Ngày Hội Gia Đình\" do Ban quản lý tổ chức:\n- Thời gian: 08:00 - 12:00, Chủ Nhật, ngày 19/05/2024.\n- Địa điểm: Sảnh sinh hoạt cộng đồng.\nNhiều hoạt động vui chơi, giải trí và ẩm thực hấp dẫn đang chờ đón!\n\nTrân trọng kính mời.",
		date: "14/05/2024 10:00",
		type: "community_event",
		isRead: false,
		icon: EventIcon
	},
	{
		id: "notif-6",
		title: "Quy định mới về việc sử dụng khu vực đỗ xe",
		content: "Kính gửi quý cư dân,\n\nĐể đảm bảo trật tự và an toàn tại khu vực đỗ xe, Ban quản lý xin thông báo áp dụng quy định mới về việc đăng ký và sắp xếp vị trí đỗ xe, có hiệu lực từ ngày 01/06/2024.\n\nChi tiết quy định vui lòng xem tại bảng tin hoặc website của tòa nhà.\n\nRất mong nhận được sự hợp tác của quý cư dân.",
		date: "15/05/2024 11:00",
		type: "new_regulation",
		isRead: false,
		icon: GavelIcon
	},
	{
		id: "notif-7",
		title: "CẢNH BÁO KHẨN: Sự cố mất điện đột ngột",
		content: "Hiện tại đang có sự cố mất điện đột ngột tại một số khu vực trong tòa nhà. Đội ngũ kỹ thuật đang khẩn trương kiểm tra và khắc phục.\n\nChúng tôi sẽ cập nhật tình hình sớm nhất. Mong quý cư dân giữ bình tĩnh và chú ý an toàn.\n\nSố điện thoại hỗ trợ khẩn cấp: 0123.456.789",
		date: "16/05/2024 08:15",
		type: "emergency",
		isRead: false,
		icon: ReportProblemIcon
	},
];

const getTypeLabelAndColor = (type: NotificationItem['type']) => {
	switch (type) {
		case 'fee_reminder':
			return { label: 'Nhắc Phí', color: 'warning' as const, icon: PaymentIcon };
		case 'maintenance_scheduled':
			return { label: 'Lịch Bảo Trì', color: 'info' as const, icon: ConstructionIcon };
		case 'maintenance_completed':
			return { label: 'Hoàn Tất Bảo Trì', color: 'success' as const, icon: CheckCircleOutlineIcon };
		case 'announcement':
			return { label: 'Thông Báo Chung', color: 'default' as const, icon: CampaignIcon };
		case 'payment_confirmation':
			return { label: 'Xác Nhận Thanh Toán', color: 'primary' as const, icon: CheckCircleOutlineIcon };
		case 'community_event':
			return { label: 'Sự Kiện Cộng Đồng', color: 'secondary' as const, icon: EventIcon };
		case 'new_regulation':
			return { label: 'Quy Định Mới', color: 'info' as const, icon: GavelIcon };
		case 'emergency':
			return { label: 'Khẩn Cấp', color: 'error' as const, icon: ReportProblemIcon };
		default:
			// Đảm bảo type của default case là một string hợp lệ cho ChipProps['color']
			const defaultColor: "default" | "primary" | "secondary" | "error" | "info" | "success" | "warning" = 'default';
			return { label: 'Khác', color: defaultColor, icon: CampaignIcon };
	}
}

const NotificationDetail = () => {
	const router = useRouter();
	const searchParams = useSearchParams();
	const notificationId = searchParams.get("id"); 
	
	const notification = sampleNotifications.find(n => n.id === notificationId);
	if (!notification) {
		return (
			<Container maxWidth="sm" sx={{ py: 4, textAlign: 'center' }}>
				<Typography variant="h5" color="error" gutterBottom>Thông báo không tồn tại</Typography>
				<Typography>Thông báo bạn yêu cầu không tìm thấy hoặc đã bị xóa.</Typography>
				<IconButton onClick={() => router.push("/notifications")} sx={{ mt: 2 }}>
					<ArrowBack /> <Typography sx={{ml:1}}>Quay lại</Typography>
				</IconButton>
			</Container>
		);
	}

	const { label: typeLabel, color: typeColor, icon: TypeIcon } = getTypeLabelAndColor(notification.type);

	return (
		<Container maxWidth="md" sx={{ bgcolor: "#f0f4f8", minHeight: "100vh", py: 3 }}>
			<IconButton
				sx={{ mb: 2, color: "primary.main", '&:hover': { bgcolor: 'action.hover' } }}
				onClick={() => router.push("/notifications")}
				aria-label="Quay lại danh sách thông báo"
			>
				<ArrowBack />
			</IconButton>
			<Paper elevation={3} sx={{ p: { xs: 2, sm: 3, md: 4 }, borderRadius: 2, bgcolor: 'background.paper' }}>
				<Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
					<Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
						{TypeIcon && <SvgIcon component={TypeIcon} sx={{ fontSize: '2rem', color: `${typeColor}.main` }} />}
						<Typography variant="h5" component="h1" sx={{ fontWeight: 'bold', color: 'primary.dark' }}>
							{notification.title}
						</Typography>
					</Box>
					<Chip label={typeLabel} color={typeColor} size="small" sx={{ mt: 0.5 }} />
				</Box>
				<Typography variant="caption" display="block" color="text.secondary" sx={{ mb: 3 }}>
					Ngày gửi: {notification.date}
				</Typography>
				<Box sx={{ whiteSpace: "pre-line", lineHeight: 1.7, fontSize: '1.05rem', color: 'text.primary', mb: notification.relatedLink ? 3 : 0 }}>
					{notification.content}
				</Box>
				{notification.relatedLink && (
					<Box sx={{ mt: 3, textAlign: 'right' }}>
						<Button variant="contained" color="primary" onClick={() => router.push(notification.relatedLink!)}>
							Đi đến thanh toán
						</Button>
					</Box>
				)}
			</Paper>
		</Container>
	);
};

export default NotificationDetail;

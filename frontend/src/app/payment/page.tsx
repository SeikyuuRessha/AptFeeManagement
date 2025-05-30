"use client"; // Thêm dòng này nếu bạn đang dùng Next.js App Router và có state/event handlers
import {
	Box,
	Button,
	Container,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
	IconButton,
	Paper,
	Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import React, { useState } from "react";

interface Transaction {
	id: number;
	description: string;
	amount: string;
	date: string;
	time: string; // Thêm thời gian
	fullDescription: string; // Mô tả chi tiết hơn
	transactionId: string; // Mã giao dịch
	paymentMethod: string; // Phương thức thanh toán
}

const TransactionHistoryPage = () => {
	const [openDialog, setOpenDialog] = useState(false);
	const [selectedTransaction, setSelectedTransaction] =
		useState<Transaction | null>(null);

	const transactions: Transaction[] = [
		{
			id: 1,
			description: "Thanh toán hóa đơn điện",
			amount: "-500,000 VND",
			date: "01/04/2023",
			time: "10:30 AM",
			fullDescription:
				"Thanh toán hóa đơn tiền điện tháng 3/2023 cho căn hộ A101.",
			transactionId: "TXN123456789",
			paymentMethod: "Chuyển khoản ngân hàng",
		},
		{
			id: 2,
			description: "Nhận tiền từ A",
			amount: "+1,000,000 VND",
			date: "02/04/2023",
			time: "02:15 PM",
			fullDescription: "Nhận tiền thanh toán dịch vụ từ Nguyễn Văn A.",
			transactionId: "TXN987654321",
			paymentMethod: "Tiền mặt",
		},
		{
			id: 3,
			description: "Thanh toán phí quản lý",
			amount: "-1,200,000 VND",
			date: "05/04/2023",
			time: "09:00 AM",
			fullDescription: "Thanh toán phí quản lý chung cư tháng 4/2023.",
			transactionId: "TXN000000001",
			paymentMethod: "Chuyển khoản ngân hàng",
		},
		{
			id: 4,
			description: "Hoàn tiền dịch vụ",
			amount: "+200,000 VND",
			date: "06/04/2023",
			time: "03:45 PM",
			fullDescription: "Hoàn tiền do hủy dịch vụ vệ sinh.",
			transactionId: "TXN000000002",
			paymentMethod: "Ví điện tử",
		},
		{
			id: 5,
			description: "Thanh toán tiền gửi xe",
			amount: "-150,000 VND",
			date: "07/04/2023",
			time: "08:00 AM",
			fullDescription: "Thanh toán phí gửi xe tháng 4/2023.",
			transactionId: "TXN000000003",
			paymentMethod: "Tiền mặt",
		},
	];

	return (
		<Container maxWidth="sm" sx={{ mt: 4, pb: 4 }}>
			<Typography
				variant="h4"
				sx={{ textAlign: "center", mb: 4, color: "primary.main" }}
			>
				Lịch Sử Giao Dịch
			</Typography>

			{transactions.length > 0 ? (
				transactions.map((transaction) => (
					<Paper
						key={transaction.id}
						elevation={3}
						sx={{
							p: 2,
							mb: 2,
							borderRadius: 2,
							"&:last-child": { mb: 0 },
							cursor: "pointer", // Thêm con trỏ chuột
							"&:hover": {
								backgroundColor: "action.hover", // Hiệu ứng khi hover
							},
						}}
						onClick={() => {
							// Xử lý khi click vào giao dịch
							setSelectedTransaction(transaction);
							setOpenDialog(true);
						}}
					>
						<Box
							sx={{
								display: "flex",
								justifyContent: "space-between",
								alignItems: "flex-start", 
							}}
						>
							<Box>
								<Typography
									variant="subtitle1"
									component="div"
									fontWeight="medium"
								>
									{transaction.description}
								</Typography>
								<Typography variant="body2" color="text.secondary">
									{transaction.date}
								</Typography>
							</Box>
							<Typography
								variant="subtitle1"
								fontWeight="bold"
								sx={{
									color: transaction.amount.startsWith("+")
										? "success.main" // Màu xanh lá cho thu nhập
										: "error.main", // Màu đỏ cho chi tiêu
									whiteSpace: "nowrap", // Ngăn số tiền xuống dòng
									ml: 2, // Khoảng cách với phần mô tả
								}}
							>
								{transaction.amount}
							</Typography>
						</Box>
					</Paper>
				))
			) : (
				<Typography
					sx={{ textAlign: "center", mt: 3, color: "text.secondary" }}
				>
					Không có giao dịch nào.
				</Typography>
			)}

			{/* Dialog hiển thị chi tiết giao dịch */}
			{selectedTransaction && (
				<Dialog
					open={openDialog}
					onClose={() => setOpenDialog(false)}
					aria-labelledby="transaction-dialog-title"
					fullWidth
					maxWidth="xs"
				>
					<DialogTitle id="transaction-dialog-title">
						Chi Tiết Giao Dịch
						<IconButton
							aria-label="close"
							onClick={() => setOpenDialog(false)}
							sx={{
								position: "absolute",
								right: 8,
								top: 8,
								color: (theme) => theme.palette.grey[500],
							}}
						>
							<CloseIcon />
						</IconButton>
					</DialogTitle>
					<DialogContent dividers>
						<Typography gutterBottom variant="h6">
							{selectedTransaction.description}
						</Typography>
						<DialogContentText component="div">
							<Box sx={{ mb: 1 }}>
								<strong>Ngày:</strong> {selectedTransaction.date}
							</Box>
							<Box sx={{ mb: 1 }}>
								<strong>Giờ:</strong> {selectedTransaction.time}
							</Box>
							<Box sx={{ mb: 1 }}>
								<strong>Số tiền:</strong>{" "}
								<Typography component="span" fontWeight="bold" color={selectedTransaction.amount.startsWith("+") ? "success.main" : "error.main"}>
									{selectedTransaction.amount}
								</Typography>
							</Box>
							<Box sx={{ mb: 1 }}>
								<strong>Nội dung chi tiết:</strong> {selectedTransaction.fullDescription}
							</Box>
							<Box sx={{ mb: 1 }}>
								<strong>Mã giao dịch:</strong> {selectedTransaction.transactionId}
							</Box>
							<Box>
								<strong>Phương thức:</strong> {selectedTransaction.paymentMethod}
							</Box>
						</DialogContentText>
					</DialogContent>
					<DialogActions>
						<Button onClick={() => setOpenDialog(false)} color="primary">
							Đóng
						</Button>
					</DialogActions>
				</Dialog>
			)}
		</Container>
	);
};

export default TransactionHistoryPage;

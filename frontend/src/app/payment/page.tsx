import {
	Container,
	Divider,
	List,
	ListItem,
	ListItemText,
	Typography,
} from "@mui/material";
import React from "react";

const TransactionHistoryPage = () => {
	const transactions = [
		{
			id: 1,
			description: "Thanh toán hóa đơn điện",
			amount: "-500,000 VND",
			date: "01/04/2023",
		},
		{
			id: 2,
			description: "Nhận tiền từ A",
			amount: "+1,000,000 VND",
			date: "02/04/2023",
		},
		{
			id: 3,
			description: "Thanh toán hóa đơn nước",
			amount: "-300,000 VND",
			date: "03/04/2023",
		},
	];

	return (
		<Container maxWidth="sm" sx={{ mt: 4 }}>
			<Typography
				variant="h4"
				sx={{ textAlign: "center", mb: 3, color: "salmon" }}
			>
				Lịch Sử Giao Dịch
			</Typography>
			<List>
				{transactions.map((transaction) => (
					<React.Fragment key={transaction.id}>
						<ListItem>
							<ListItemText
								primary={transaction.description}
								secondary={`${transaction.date} - ${transaction.amount}`}
							/>
						</ListItem>
						<Divider />
					</React.Fragment>
				))}
			</List>
		</Container>
	);
};

export default TransactionHistoryPage;

"use client";

import ApartmentIcon from '@mui/icons-material/Apartment'
import HomeIcon from '@mui/icons-material/Home'
import DescriptionIcon from '@mui/icons-material/Description'; // Icon cho chi tiết hợp đồng
import UpdateIcon from '@mui/icons-material/Update'
import { Box, Button, Container, Paper, Typography, Grid, List, ListItem, ListItemIcon, ListItemText, Divider } from '@mui/material'
import React, { useState } from 'react'

type ContractType = 'rent' | 'sell' | 'extend';

interface ContractClause {
	id: string;
	title: string;
	content: string;
}

interface ContractDetails {
	id: ContractType;
	typeTitle: string; // e.g., "Hợp đồng Thuê Chung Cư"
	contractNumber: string;
	effectiveDate: string;
	expiryDate?: string;
	parties: {
		partyA: string; // Tên hoặc mô tả bên A
		partyB: string; // Tên hoặc mô tả bên B
	};
	propertyDetails: string; // Mô tả tài sản (căn hộ, diện tích,...)
	clauses: ContractClause[];
	additionalNotes?: string;
}

const contractData: Record<ContractType, ContractDetails> = {
	rent: {
		id: 'rent',
		typeTitle: 'Hợp Đồng Thuê Chung Cư',
		contractNumber: 'HDT-2024-001',
		effectiveDate: '01/06/2024',
		expiryDate: '31/05/2025',
		parties: {
			partyA: 'Công ty TNHH Quản Lý Chung Cư ABC (Bên Cho Thuê)',
			partyB: 'Ông Nguyễn Văn A (Bên Thuê)',
		},
		propertyDetails: 'Căn hộ số A101, Tòa nhà XYZ, Diện tích 70m2, 2 phòng ngủ.',
		clauses: [
			{ id: 'c1', title: 'Điều 1: Đối tượng hợp đồng', content: 'Bên A cho thuê và Bên B thuê căn hộ nêu trên.' },
			{ id: 'c2', title: 'Điều 2: Thời hạn thuê', content: 'Thời hạn thuê là 12 tháng, kể từ ngày hợp đồng có hiệu lực.' },
			{ id: 'c3', title: 'Điều 3: Giá thuê và phương thức thanh toán', content: 'Giá thuê: 10.000.000 VNĐ/tháng. Thanh toán vào ngày 01 hàng tháng.' },
		],
		additionalNotes: 'Hợp đồng có thể được gia hạn theo thỏa thuận của hai bên.'
	},
	sell: {
		id: 'sell',
		typeTitle: 'Hợp Đồng Mua Bán Chung Cư',
		contractNumber: 'HDMB-2024-002',
		effectiveDate: '15/07/2024',
		parties: {
			partyA: 'Bà Trần Thị B (Bên Bán)',
			partyB: 'Ông Lê Văn C (Bên Mua)',
		},
		propertyDetails: 'Căn hộ số B205, Tòa nhà Alpha, Diện tích 90m2, 3 phòng ngủ, view hồ bơi.',
		clauses: [
			{ id: 'c1', title: 'Điều 1: Đối tượng mua bán', content: 'Bên A bán và Bên B mua quyền sở hữu căn hộ nêu trên.' },
			{ id: 'c2', title: 'Điều 2: Giá bán và phương thức thanh toán', content: 'Giá bán: 3.000.000.000 VNĐ. Thanh toán thành 3 đợt.' },
			{ id: 'c3', title: 'Điều 3: Thời điểm bàn giao', content: 'Bên A bàn giao căn hộ cho Bên B trong vòng 30 ngày kể từ ngày ký hợp đồng.' },
		],
	},
	extend: {
		id: 'extend',
		typeTitle: 'Hợp Đồng Gia Hạn Thuê Chung Cư',
		contractNumber: 'HDGH-2024-003',
		effectiveDate: '01/06/2025',
		expiryDate: '31/05/2026',
		parties: {
			partyA: 'Công ty TNHH Quản Lý Chung Cư ABC (Bên Cho Thuê)',
			partyB: 'Ông Nguyễn Văn A (Bên Thuê)',
		},
		propertyDetails: 'Căn hộ số A101, Tòa nhà XYZ (gia hạn từ hợp đồng HDT-2024-001).',
		clauses: [
			{ id: 'c1', title: 'Điều 1: Gia hạn hợp đồng', content: 'Hai bên thống nhất gia hạn hợp đồng thuê HDT-2024-001.' },
			{ id: 'c2', title: 'Điều 2: Thời hạn gia hạn', content: 'Thời hạn gia hạn là 12 tháng.' },
			{ id: 'c3', title: 'Điều 3: Các điều khoản khác', content: 'Các điều khoản khác của hợp đồng HDT-2024-001 vẫn giữ nguyên giá trị pháp lý.' },
		],
	},
}

const Contract = () => {
	const [selectedContractKey, setSelectedContractKey] = useState<ContractType | null>(null)

	return (
		<Container
			maxWidth='md'
			sx={{ textAlign: 'center', mt: 4 }}>
			<Typography
				variant='h4'
				gutterBottom
				sx={{ color: 'salmon' }}>
				Hợp Đồng
			</Typography>
			<Box
				sx={{
					display: 'flex',
					justifyContent: 'center',
					gap: 2,
					mb: 3,
				}}>
				<Button
					variant='contained'
					startIcon={<ApartmentIcon />}
					onClick={() => setSelectedContractKey('rent')}
					sx={{ bgcolor: 'salmon', color: 'white' }}>
					Hợp đồng thuê chung cư
				</Button>
				<Button
					variant='contained'
					startIcon={<HomeIcon />}
					onClick={() => setSelectedContractKey('sell')}
					sx={{ bgcolor: 'salmon', color: 'white' }}>
					Hợp đồng bán chung cư
				</Button>
				<Button
					variant='contained'
					startIcon={<UpdateIcon />}
					onClick={() => setSelectedContractKey('extend')}
					sx={{ bgcolor: 'salmon', color: 'white' }}>
					Hợp đồng gia hạn thuê
				</Button>
			</Box>
			{selectedContractKey && contractData[selectedContractKey] && (
				<ContractDetailView contract={contractData[selectedContractKey]} />
			)}
		</Container>
	)
}

// Component con để hiển thị chi tiết hợp đồng
const ContractDetailView: React.FC<{ contract: ContractDetails }> = ({ contract }) => {
	return (
		<Paper elevation={3} sx={{ p: 3, mt: 3, textAlign: 'left', bgcolor: 'background.paper' }}>
			<Typography variant="h5" component="h2" gutterBottom sx={{ color: 'primary.main', fontWeight: 'bold' }}>
				{contract.typeTitle}
			</Typography>
			<Divider sx={{ mb: 2 }} />

			<Grid container spacing={2}>
				<Grid item xs={12} sm={6}>
					<Typography variant="subtitle1" fontWeight="bold">Số hợp đồng:</Typography>
					<Typography variant="body1" gutterBottom>{contract.contractNumber}</Typography>
				</Grid>
				<Grid item xs={12} sm={6}>
					<Typography variant="subtitle1" fontWeight="bold">Ngày hiệu lực:</Typography>
					<Typography variant="body1" gutterBottom>{contract.effectiveDate}</Typography>
				</Grid>
				{contract.expiryDate && (
					<Grid item xs={12} sm={6}>
						<Typography variant="subtitle1" fontWeight="bold">Ngày hết hạn:</Typography>
						<Typography variant="body1" gutterBottom>{contract.expiryDate}</Typography>
					</Grid>
				)}
				<Grid item xs={12}>
					<Typography variant="subtitle1" fontWeight="bold">Các bên tham gia:</Typography>
					<Typography variant="body2">Bên A: {contract.parties.partyA}</Typography>
					<Typography variant="body2" gutterBottom>Bên B: {contract.parties.partyB}</Typography>
				</Grid>
				<Grid item xs={12}>
					<Typography variant="subtitle1" fontWeight="bold">Thông tin tài sản:</Typography>
					<Typography variant="body1" gutterBottom>{contract.propertyDetails}</Typography>
				</Grid>
			</Grid>

			<Typography variant="h6" component="h3" sx={{ mt: 3, mb: 1, color: 'secondary.main' }}>
				Các điều khoản chính:
			</Typography>
			<List dense>
				{contract.clauses.map((clause) => (
					<ListItem key={clause.id} sx={{ display: 'block', mb: 1, borderLeft: '3px solid', borderColor: 'primary.light', pl: 2 }}>
						<Typography variant="subtitle2" fontWeight="medium">{clause.title}:</Typography>
						<Typography variant="body2" sx={{ pl: 1 }}>{clause.content}</Typography>
					</ListItem>
				))}
			</List>

			{contract.additionalNotes && (
				<>
					<Typography variant="h6" component="h3" sx={{ mt: 3, mb: 1, color: 'secondary.main' }}>
						Ghi chú bổ sung:
					</Typography>
					<Typography variant="body1">
						{contract.additionalNotes}
					</Typography>
				</>
			)}
		</Paper>
	);
};

export default Contract

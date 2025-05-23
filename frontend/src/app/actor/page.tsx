import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import {
	AppBar,
	Box,
	Container,
	Fab,
	List,
	ListItem,
	ListItemText,
	Paper,
	Toolbar,
	Typography,
} from '@mui/material'
import React from 'react'
import { useNavigate } from 'react-router-dom'

const Actor = () => {
	const navigate = useNavigate()

	return (
		<Box sx={{ background: '#fffaf0' }}>
			{/* App Bar */}
			<AppBar
				position='static'
				sx={{ background: 'salmon' }}>
				<Toolbar>
					<Typography variant='h6'>Tài khoản</Typography>
				</Toolbar>
			</AppBar>

			{/* Main Content */}
			<Container
				maxWidth='sm'
				sx={{ mt: 4 }}>
				<Paper
					elevation={3}
					sx={{ p: 3, textAlign: 'center' }}>
					{/* Floating Button */}
					<Fab
						color='secondary'
						aria-label='owner'
						sx={{ mb: 2 }}>
						<AccountCircleIcon fontSize='large' />
					</Fab>
					<Typography
						variant='h6'
						sx={{ color: 'salmon', fontWeight: 'bold' }}>
						Tên Người Sở Hữu
					</Typography>

					{/* Account Options List */}
					<List>
						{/* Chỉnh sửa thông tin tài khoản */}
						<ListItem
							button
							onClick={() => navigate('/edit-profile')}>
							<ListItemText primary='Chỉnh sửa Thông tin tài khoản' />
						</ListItem>

						{/* Đổi mật khẩu */}
						<ListItem button>
							<ListItemText primary='Đổi mật khẩu' />
						</ListItem>

						{/* Thông tin căn hộ */}
						<ListItem button>
							<ListItemText primary='Thông tin căn hộ' />
						</ListItem>

						{/* Đơn khiếu nại */}
						<ListItem button>
							<ListItemText primary='Đơn khiếu nại' />
						</ListItem>

						{/* Hợp đồng */}
						<ListItem
							button
							onClick={() => navigate('/contract')}>
							<ListItemText primary='Hợp đồng' />
						</ListItem>

						{/* Góp ý */}
						<ListItem button>
							<ListItemText primary='Góp ý' />
						</ListItem>
						{/* Lịch sử thanh toán */}
						<ListItem
							button
							onClick={() => navigate('/transaction-history')}>
							<ListItemText primary='Lịch sử thanh toán' />
						</ListItem>

						{/* Cài đặt */}
						<ListItem
							button
							onClick={() => navigate('/setting')}>
							<ListItemText primary='Cài đặt' />
						</ListItem>

						{/* Xóa tài khoản */}
						<ListItem button>
							<ListItemText
								primary='Xóa tài khoản'
								sx={{ color: 'red' }}
							/>
						</ListItem>

						{/* Đăng xuất */}
						<ListItem
							button
							onClick={() => navigate('/login')}>
							<ListItemText
								primary='Đăng xuất'
								sx={{ color: 'blue' }}
							/>
						</ListItem>
					</List>
				</Paper>
			</Container>
		</Box>
	)
}

export default Actor

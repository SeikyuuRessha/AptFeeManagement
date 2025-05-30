"use client"
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
import { useRouter } from 'next/navigation'

const Actor = () => {
	const router = useRouter()

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
							component='button'
							onClick={() => router.push('/me/profile')}>
							<ListItemText primary='Chỉnh sửa Thông tin tài khoản' />
						</ListItem>

						{/* Đổi mật khẩu */}
						<ListItem component='button'
							onClick={() => router.push('/edit-profile')}>
							<ListItemText primary='Đổi mật khẩu' />
						</ListItem>

						{/* Thông tin căn hộ */}
						<ListItem component='button'
							onClick={() => router.push('/edit-profile')}>
							<ListItemText primary='Thông tin căn hộ' />
						</ListItem>

						{/* Đơn khiếu nại */}
						<ListItem component='button'
							onClick={() => router.push('/edit-profile')}>
							<ListItemText primary='Đơn khiếu nại' />
						</ListItem>

						{/* Hợp đồng */}
						<ListItem
							component='button'
							onClick={() => router.push('/contract')}>
							<ListItemText primary='Hợp đồng' />
						</ListItem>

						{/* Góp ý */}
						<ListItem component='button'
							onClick={() => router.push('/edit-profile')}>
							<ListItemText primary='Góp ý' />
						</ListItem>
						{/* Lịch sử thanh toán */}
						{/* Thông báo */}
						<ListItem
							component='button'
							onClick={() => router.push('/notifications')}>
							<ListItemText primary='Thông báo' />
						</ListItem>

						<ListItem
							component='button'
							onClick={() => router.push('/payment')}>
							<ListItemText primary='Lịch sử thanh toán' />
						</ListItem>

						{/* Cài đặt */}
						<ListItem
							component='button'
							onClick={() => router.push('/setting')}>
							<ListItemText primary='Cài đặt' />
						</ListItem>

						{/* Xóa tài khoản */}
						<ListItem component='button'
							onClick={() => router.push('/edit-profile')}>
							<ListItemText
								primary='Xóa tài khoản'
								sx={{ color: 'red' }}
							/>
						</ListItem>

						{/* Đăng xuất */}
						<ListItem
							component='button'
							onClick={() => router.push('/login')}>
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

import { Box, Button, Container, TextField, Typography } from '@mui/material'
import React from 'react'

const EditProfilePage = () => {
	return (
		<Container
			maxWidth='sm'
			sx={{ mt: 4 }}>
			<Typography
				variant='h4'
				sx={{ textAlign: 'center', mb: 3, color: 'salmon' }}>
				Chỉnh Sửa Hồ Sơ
			</Typography>
			<Box
				component='form'
				sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
				<TextField
					label='Họ và Tên'
					variant='outlined'
					fullWidth
				/>
				<TextField
					label='Email'
					variant='outlined'
					fullWidth
				/>
				<TextField
					label='Số Điện Thoại'
					variant='outlined'
					fullWidth
				/>
				<Button
					variant='contained'
					color='primary'
					fullWidth>
					Lưu Thay Đổi
				</Button>
			</Box>
		</Container>
	)
}

export default EditProfilePage

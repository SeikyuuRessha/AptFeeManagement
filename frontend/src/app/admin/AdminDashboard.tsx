import { Container, Grid, Paper, Typography } from '@mui/material'
import React from 'react'

const AdminDashboard = () => {
	const stats = [
		{ label: 'Người Dùng', value: 1200 },
		{ label: 'Căn Hộ', value: 300 },
		{ label: 'Giao Dịch', value: 4500 },
	]

	return (
		<Container
			maxWidth='lg'
			sx={{ mt: 4 }}>
			<Typography
				variant='h4'
				sx={{ textAlign: 'center', mb: 3, color: 'salmon' }}>
				Bảng Điều Khiển Admin
			</Typography>
			<Grid
				container
				spacing={3}>
				{stats.map((stat, index) => (
					<Grid
						item
						xs={12}
						sm={4}
						key={index}>
						<Paper
							elevation={3}
							sx={{ p: 3, textAlign: 'center' }}>
							<Typography
								variant='h6'
								sx={{ color: 'salmon' }}>
								{stat.label}
							</Typography>
							<Typography
								variant='h4'
								sx={{ fontWeight: 'bold' }}>
								{stat.value}
							</Typography>
						</Paper>
					</Grid>
				))}
			</Grid>
		</Container>
	)
}

export default AdminDashboard

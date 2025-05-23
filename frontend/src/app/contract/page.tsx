import ApartmentIcon from '@mui/icons-material/Apartment'
import HomeIcon from '@mui/icons-material/Home'
import UpdateIcon from '@mui/icons-material/Update'
import { Box, Button, Container, Paper, Typography } from '@mui/material'
import React, { useState } from 'react'

const contractData = {
	rent: 'Hợp đồng thuê chung cư: Đây là nội dung hợp đồng thuê chung cư...',
	sell: 'Hợp đồng bán chung cư: Đây là nội dung hợp đồng bán chung cư...',
	extend: 'Hợp đồng gia hạn thuê: Đây là nội dung hợp đồng gia hạn thuê chung cư...',
}

const Contract = () => {
	const [selectedContract, setSelectedContract] = useState(null)

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
					onClick={() => setSelectedContract('rent')}
					sx={{ bgcolor: 'salmon', color: 'white' }}>
					Hợp đồng thuê chung cư
				</Button>
				<Button
					variant='contained'
					startIcon={<HomeIcon />}
					onClick={() => setSelectedContract('sell')}
					sx={{ bgcolor: 'salmon', color: 'white' }}>
					Hợp đồng bán chung cư
				</Button>
				<Button
					variant='contained'
					startIcon={<UpdateIcon />}
					onClick={() => setSelectedContract('extend')}
					sx={{ bgcolor: 'salmon', color: 'white' }}>
					Hợp đồng gia hạn thuê
				</Button>
			</Box>
			{selectedContract && (
				<Paper
					elevation={3}
					sx={{ p: 3, bgcolor: '#fde2e4' }}>
					<Typography
						variant='h6'
						sx={{ color: '#880e4f' }}>
						{contractData[selectedContract]}
					</Typography>
				</Paper>
			)}
		</Container>
	)
}

export default Contract

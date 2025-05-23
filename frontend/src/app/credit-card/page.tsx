import {
	Button,
	Card,
	CardContent,
	Container,
	Grid,
	TextField,
	Typography,
} from '@mui/material'
import React from 'react'
import { useNavigate } from 'react-router-dom'

const CreditCard = () => {
	const navigate = useNavigate()
	return (
		<Container
			maxWidth='sm'
			style={{
				textAlign: 'center',
				marginTop: '20px',
				backgroundColor: '#f7f1e3', // Màu kem nhạt
				padding: '20px',
				borderRadius: '10px',
			}}>
			<Typography
				variant='h4'
				gutterBottom>
				Thanh toán
			</Typography>

			<Grid
				container
				spacing={2}
				justifyContent='center'
				style={{ marginBottom: '20px' }}>
				{['Ngân hàng', 'Hóa đơn', 'Thanh toán', 'Hỗ trợ'].map(
					(label) => (
						<Grid
							item
							key={label}>
							<Button
								variant='contained'
								style={{
									backgroundColor: 'salmon',
									color: '#fff',
								}}
								onClick={() => navigate('/transactions')}>
								{label}
							</Button>
						</Grid>
					),
				)}
			</Grid>

			<Card>
				<CardContent>
					<Typography
						variant='h6'
						gutterBottom>
						Nhập thông tin thanh toán
					</Typography>
					<form>
						<TextField
							fullWidth
							label='Số thẻ'
							margin='normal'
							variant='outlined'
						/>
						<TextField
							fullWidth
							label='Tên chủ thẻ'
							margin='normal'
							variant='outlined'
						/>
						<TextField
							fullWidth
							label='Ngày hết hạn'
							margin='normal'
							variant='outlined'
						/>
						<TextField
							fullWidth
							label='CVV'
							type='password'
							margin='normal'
							variant='outlined'
						/>

						<Button
							variant='contained'
							fullWidth
							style={{
								backgroundColor: 'salmon',
								color: '#fff',
								marginTop: '10px',
							}}
							onClick={() => navigate('/transactions')}>
							Xác nhận thanh toán
						</Button>
					</form>
				</CardContent>
			</Card>
		</Container>
	)
}

export default CreditCard

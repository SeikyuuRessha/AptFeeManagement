import { Grid } from '@mui/material'
import React from 'react'

import {
	AccountBalance as AccountBalanceIcon,
	Apps as AppsIcon,
	CardGiftcard as CardGiftcardIcon,
	CreditCard as CreditCardIcon,
	Groups as GroupsIcon,
	LocalShipping as LocalShippingIcon,
	Receipt as ReceiptIcon,
	Savings as SavingsIcon,
	Send as SendIcon,
	Wifi as WifiIcon,
} from '@mui/icons-material'
import clsx from 'clsx'

const mainServices = [
	{
		label: 'Chuyển tiền',
		icon: <SendIcon />,
		className: 'from-orange-400 to-orange-600',
		color: '#ffb74d',
	},
	{
		label: 'Mua mã thẻ',
		icon: <CreditCardIcon />,
		color: '#90caf9',
		className: 'from-blue-400 to-blue-600',
	},
	{
		label: 'Heo Đất',
		icon: <SavingsIcon />,
		color: '#f48fb1',
		className: 'from-pink-400 to-pink-600',
	},
	{
		label: 'Thanh toán HĐ',
		icon: <ReceiptIcon />,
		color: '#80cbc4',
		className: 'from-teal-400 to-teal-600',
	},
	{
		label: 'Data 4G/5G',
		icon: <WifiIcon />,
		color: '#b39ddb',
		className: 'from-indigo-400 to-indigo-600',
	},
	{
		label: 'Ahamove',
		icon: <LocalShippingIcon />,
		color: '#ffcc80',
		className: 'from-amber-400 to-amber-600',
	},
	{
		label: 'Túi Thần Tài',
		icon: <SavingsIcon />,
		color: '#c5e1a5',
		className: 'from-green-400 to-green-600',
	},
	{
		label: 'Chuyển tiền NH',
		icon: <AccountBalanceIcon />,
		color: '#81d4fa',
		className: 'from-red-400 to-red-600',
	},
	{
		label: 'Giật Lì xì',
		icon: <CardGiftcardIcon />,
		color: '#ef9a9a',
		className: 'from-orange-400 to-orange-600',
	},
	{
		label: 'Quỹ nhóm',
		icon: <GroupsIcon />,
		color: '#9fa8da',
		className: 'from-orange-400 to-orange-600',
	},
	{
		label: 'Xem thêm',
		icon: <AppsIcon />,
		color: '#bdbdbd',
		className: 'from-orange-400 to-orange-600',
	},
]

const Services = () => {
	return (
		<Grid
			container
			spacing={1}
			justifyContent='center'>
			{mainServices.slice(0, 8).map((service, index) => (
				<Grid
					item
					xs={3}
					key={index}>
					<div
						className={clsx(
							'bg-linear-to-br text-white flex items-center gap-2 p-2 rounded-md shadow-md font-semibold',
							service.className,
						)}>
						{service.icon}

						<div className='text-xs font-semibold'>
							{service.label}
						</div>
					</div>
				</Grid>
			))}
		</Grid>
	)
}

export default Services

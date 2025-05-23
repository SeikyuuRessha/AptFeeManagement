'use client'

import {
	BuildRounded,
	CommentRounded,
	Home,
	Person,
	QrCodeScanner,
} from '@mui/icons-material'
import clsx from 'clsx'
import { useRouter } from 'next/navigation'
import React from 'react'

const pages = [
	{
		href: '/',
		label: 'Trang chủ',
		icon: <Home fontSize='small' />,
	},
	{
		href: '/notifications',
		label: 'Thông báo',
		icon: <CommentRounded fontSize='small' />,
	},
	{
		href: '/payment',
		label: 'Quét QR',
		icon: (
			<QrCodeScanner
				className='bg-green-500'
				sx={{
					color: 'white',

					borderRadius: '50%',
					p: 1,
					fontSize: 40,
				}}
			/>
		),
	},
	{
		href: '/tools',
		label: 'Công cụ',
		icon: <BuildRounded fontSize='small' />,
	},
	{
		href: '/me/profile',
		label: 'Hồ sơ',
		icon: <Person fontSize='small' />,
	},
]

function Footer() {
	const router = useRouter()
	const [value, setValue] = React.useState(0)

	return (
		<div className='fixed h-16 bottom-0 left-0 w-full z-20 shadow-md bg-white flex items-center justify-evenly border-t-2 border-gray-100'>
			{pages.map((page, i) => (
				<button
					onClick={() => {
						router.push(page.href)
						setValue(i)
					}}
					key={page.href}
					className={clsx(
						'flex flex-col gap-1 items-center hover:text-green-600 hover:font-semibold rounded-md transition cursor-pointer p-2 flex-1',
						value === i && 'font-bold text-green-600',
					)}>
					{page.icon}
					<span className='text-xs'>{page.label}</span>
				</button>
			))}
		</div>
	)
}

export default Footer

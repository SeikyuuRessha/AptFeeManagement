import Link from 'next/link'

import useUserStore from '@/store/userStore'
import {
	AdminPanelSettings as AdminPanelSettingsIcon,
	Logout as LogoutIcon,
	Notifications as NotificationsIcon,
	QrCodeScanner as QrCodeScannerIcon,
} from '@mui/icons-material'

const Actions = () => {
	const { logout, user } = useUserStore()

	const actions = [
		{
			icon: NotificationsIcon,
			value: 99,
			ariaLabel: 'notifications',
		},
		{
			icon: QrCodeScannerIcon,
			ariaLabel: 'qr scanner',
		},
		{
			icon: AdminPanelSettingsIcon,
			ariaLabel: 'admin panel',
			href: '/admin',
		},
		{
			icon: LogoutIcon,
			ariaLabel: 'logout',
			onClick: logout,
		},
	]

	return (
		<div className='flex shrink-0 items-center gap-3 md:order-3'>
			{actions.map((action, index) => {
				const button = (
					<button
						key={index}
						className='relative p-2 flex items-center justify-center rounded-full'
						onClick={action.onClick}>
						{action.value && (
							<div className='absolute top-0 right-0 font-bold text-xs bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center'>
								{action.value > 99 ? '99+' : action.value}
							</div>
						)}
						<action.icon fontSize='small' />
					</button>
				)

				if (action.href === '/admin') {
					if (user?.role === 'admin') {
						return (
							<Link
								href={action.href}
								key={index}>
								{button}
							</Link>
						)
					}
				}

				return button
			})}
		</div>
	)
}

export default Actions

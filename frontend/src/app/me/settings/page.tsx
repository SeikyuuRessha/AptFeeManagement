import {
	Help,
	Language,
	Lock,
	Notifications,
	VolumeUp,
} from '@mui/icons-material'
import {
	Box,
	Divider,
	List,
	ListItem,
	ListItemIcon,
	ListItemText,
	Switch,
	Typography,
} from '@mui/material'
import { styled } from '@mui/system'
import React from 'react'

const SettingPage = () => {
	const StyledListItem = styled(ListItem)(({ theme }) => ({
		paddingTop: theme.spacing(2),
		paddingBottom: theme.spacing(2),
		'&:hover': {
			backgroundColor: 'rgba(0, 0, 0, 0.04)',
		},
	}))

	return (
		<Box
			sx={{
				bgcolor: '#f9f9f9',
				minHeight: '100vh',
				padding: 3,
			}}>
			<Typography
				variant='h4'
				gutterBottom
				sx={{ color: '#333', textAlign: 'center' }}>
				Cài đặt
			</Typography>
			<List>
				<StyledListItem>
					<ListItemIcon sx={{ color: 'salmon' }}>
						<Notifications />
					</ListItemIcon>
					<ListItemText primary='Thông báo' />
					<Switch defaultChecked />
				</StyledListItem>
				<Divider />
				<StyledListItem>
					<ListItemIcon sx={{ color: 'salmon' }}>
						<VolumeUp />
					</ListItemIcon>
					<ListItemText primary='Âm lượng' />
					<Switch />
				</StyledListItem>
				<Divider />
				<StyledListItem>
					<ListItemIcon sx={{ color: 'salmon' }}>
						<Lock />
					</ListItemIcon>
					<ListItemText primary='Bảo mật' />
				</StyledListItem>
				<Divider />
				<StyledListItem>
					<ListItemIcon sx={{ color: 'salmon' }}>
						<Language />
					</ListItemIcon>
					<ListItemText primary='Ngôn ngữ' />
				</StyledListItem>
				<Divider />
				<StyledListItem>
					<ListItemIcon sx={{ color: 'salmon' }}>
						<Help />
					</ListItemIcon>
					<ListItemText primary='Trợ giúp' />
				</StyledListItem>
				<Divider />
			</List>
		</Box>
	)
}

export default SettingPage

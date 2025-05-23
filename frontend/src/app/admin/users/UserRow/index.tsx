import { FC, memo } from 'react'

import { IUser } from '@/interfaces/user'
import { UpdateUserInput } from '@/services/user'
import { Delete } from '@mui/icons-material'
import BlockIcon from '@mui/icons-material/Block'

import UpdateModal from './UpdateModal'

interface UserRowProps extends IUser {
	onDelete: (id: string) => void
	onUpdate: (payload: UpdateUserInput) => void
	deleteDisabled: boolean
	updateDisabled: boolean
	updateSuccess: boolean
}

const UserRow: FC<UserRowProps> = ({
	fullName,
	id,
	phone,
	email,
	role,
	onUpdate,
	onDelete,
	deleteDisabled,
	updateDisabled,
	updateSuccess,
}) => {
	return (
		<div className='flex'>
			<div className='flex-1 p-2 hidden md:block line-clamp-1 border'>
				{id.substring(0, 10)}...
			</div>

			<div className='flex-1 p-2 line-clamp-1 border'>{fullName}</div>

			<div className='flex-1 p-2 line-clamp-1 border'>{phone}</div>

			<div className='flex-1 p-2 hidden md:block line-clamp-1 border'>
				{email}
			</div>

			<div className='flex-1 p-2 hidden md:block line-clamp-1 border'>
				{role}
			</div>

			<div className='flex-1 overflow-y-scroll p-2 flex items-center border justify-center gap-1'>
				{role !== 'admin' && (
					<>
						<UpdateModal
							updateSuccess={updateSuccess}
							updateDisabled={updateDisabled}
							onUpdate={onUpdate}
							data={{ email, fullName, phone, role }}
							id={id}
						/>

						<button
							disabled={deleteDisabled}
							className='p-1 rounded-full text-orange-500 hover:bg-orange-500 hover:text-white transition'
							onClick={() => onDelete(id)}>
							<Delete fontSize='small' />
						</button>

						<button className='p-1 rounded-full text-red-500 hover:bg-red-500 hover:text-white transition'>
							<BlockIcon fontSize='small' />
						</button>
					</>
				)}
			</div>
		</div>
	)
}

export default memo(UserRow)

'use client'

import { useCallback } from 'react'
import { toast } from 'sonner'

import Skeleton from '@/components/Skeleton'
import {
	deleteUser,
	getUsers,
	updateUser,
	UpdateUserInput,
} from '@/services/user'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import UserRow from './UserRow'

const AdminUsersPage = () => {
	const { isLoading, data } = useQuery({
		queryKey: ['users'],
		queryFn: getUsers,
	})
	const queryClient = useQueryClient()

	const handleSuccess = (msg: string) => {
		toast.success(msg)
		queryClient.invalidateQueries({ queryKey: ['users'] })
	}

	const deleteMutation = useMutation({
		mutationFn: (id: string) => deleteUser(id),
		onSuccess: () => handleSuccess('Xóa người dùng thành công!'),
		onError: (error) => toast.error(error.message),
	})

	const updateMutation = useMutation({
		mutationFn: (payload: UpdateUserInput) => updateUser(payload),
		onSuccess: () => handleSuccess('Cập nhật người dùng thành công!'),
		onError: (error) => toast.error(error.message),
	})

	const handleDelete = useCallback((id: string) => {
		deleteMutation.mutate(id)
	}, [])

	const handleUpdate = useCallback((payload: UpdateUserInput) => {
		updateMutation.mutate(payload)
	}, [])

	return (
		<div className='space-y-7'>
			<h1 className='text-3xl font-bold'>Quản lý người dùng</h1>

			<div className='text-center'>
				<div className='flex flex-wrap'>
					<div className='flex-1 hidden md:block p-2 border'>ID</div>
					<div className='flex-1 p-2 border'>Họ và tên</div>
					<div className='flex-1 p-2 border'>Số điện thoại</div>
					<div className='flex-1 hidden md:block p-2 border'>
						Email
					</div>
					<div className='flex-1 hidden md:block p-2 border'>
						Chức vụ
					</div>
					<div className='flex-1 p-2 border'>Hành động</div>
				</div>

				{isLoading
					? new Array(10).fill(null).map((_, index) => (
							<Skeleton
								key={index}
								className='h-32'
							/>
					  ))
					: data &&
					  data.map((user) => (
							<UserRow
								key={user.id}
								{...user}
								onDelete={handleDelete}
								onUpdate={handleUpdate}
								deleteDisabled={deleteMutation.isPending}
								updateDisabled={updateMutation.isPending}
								updateSuccess={updateMutation.isSuccess}
							/>
					  ))}
			</div>
		</div>
	)
}

export default AdminUsersPage

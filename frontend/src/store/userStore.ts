import { create } from 'zustand'

import api from '@/config/api'
import jwtManager from '@/helpers/jwtManager'
import { IUser } from '@/interfaces/user'

interface UserStore {
	user: IUser | null
	isLoggedIn: boolean
	setUser: (user: IUser | null) => void
	logout: () => void
}

const useUserStore = create<UserStore>((set) => ({
	isLoggedIn: false,
	user: null,
	setUser: (user) => set({ user, isLoggedIn: !!user }),
	logout: async () => {
		set({ user: null, isLoggedIn: false })
		await api.get('/auth/logout')
		jwtManager.removeTokens()
	},
}))

export default useUserStore

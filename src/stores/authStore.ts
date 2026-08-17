import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { UserProfile } from '@/types/user'

interface AuthStoreState {
  user: UserProfile | null
  token: string | null
  isLoading: boolean
  setUser: (user: UserProfile | null) => void
  setToken: (token: string | null) => void
  setLoading: (isLoading: boolean) => void
  logout: () => void
}

export const useAuthStore = create<AuthStoreState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isLoading: false,
      setUser: (user) => set({ user }),
      setToken: (token) => set({ token }),
      setLoading: (isLoading) => set({ isLoading }),
      logout: () => set({ user: null, token: null }),
    }),
    {
      name: 'moodifys-auth-store',
      partialize: (state) => ({ user: state.user, token: state.token }),
    }
  )
)

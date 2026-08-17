export interface UserProfile {
  id: string
  email: string
  fullName?: string
  phone?: string
  avatarUrl?: string
  isAdmin: boolean
  createdAt: string
  updatedAt: string
}

export interface AuthState {
  user: UserProfile | null
  session: unknown | null
  isLoading: boolean
  isAuthenticated: boolean
}

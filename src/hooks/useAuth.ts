import { useEffect } from 'react'
import { useAuthStore } from '@/stores/authStore'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'

export function useAuth() {
  const { user, isLoading, setUser, setLoading, logout } = useAuthStore()

  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) return

    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email || '',
          fullName: session.user.user_metadata?.full_name || '',
          avatarUrl: session.user.user_metadata?.avatar_url || '',
          isAdmin: Boolean(session.user.user_metadata?.is_admin),
          createdAt: session.user.created_at,
          updatedAt: session.user.updated_at || session.user.created_at,
        })
      }
    })

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (session?.user) {
          setUser({
            id: session.user.id,
            email: session.user.email || '',
            fullName: session.user.user_metadata?.full_name || '',
            avatarUrl: session.user.user_metadata?.avatar_url || '',
            isAdmin: Boolean(session.user.user_metadata?.is_admin),
            createdAt: session.user.created_at,
            updatedAt: session.user.updated_at || session.user.created_at,
          })
        } else {
          setUser(null)
        }
      }
    )

    return () => {
      subscription.unsubscribe()
    }
  }, [setUser])

  const signIn = async (email: string, password?: string) => {
    setLoading(true)
    try {
      if (isSupabaseConfigured && supabase) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password: password || '',
        })
        if (error) throw error
        return { user: data.user, error: null }
      } else {
        // Mock login for offline dev
        const mockUser = {
          id: 'user-mock-1',
          email,
          fullName: email.split('@')[0].toUpperCase(),
          isAdmin: email.includes('admin'),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }
        setUser(mockUser)
        return { user: mockUser, error: null }
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Sign in failed'
      return { user: null, error: message }
    } finally {
      setLoading(false)
    }
  }

  const signUp = async (email: string, password?: string, fullName?: string) => {
    setLoading(true)
    try {
      if (isSupabaseConfigured && supabase) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password: password || '',
          options: {
            data: { full_name: fullName },
          },
        })
        if (error) throw error
        return { user: data.user, error: null }
      } else {
        const mockUser = {
          id: 'user-mock-new',
          email,
          fullName: fullName || email.split('@')[0].toUpperCase(),
          isAdmin: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }
        setUser(mockUser)
        return { user: mockUser, error: null }
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Sign up failed'
      return { user: null, error: message }
    } finally {
      setLoading(false)
    }
  }

  const signOut = async () => {
    setLoading(true)
    try {
      if (isSupabaseConfigured && supabase) {
        await supabase.auth.signOut()
      }
      logout()
    } finally {
      setLoading(false)
    }
  }

  return {
    user,
    isAuthenticated: Boolean(user),
    isAdmin: Boolean(user?.isAdmin),
    isLoading,
    signIn,
    signUp,
    signOut,
  }
}

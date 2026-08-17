import { useEffect, useCallback } from 'react'
import { useAdminAuthStore } from '@/stores/adminAuthStore'
import { useAuthStore } from '@/stores/authStore'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import { AdminRole, ROLE_PERMISSIONS, ROLE_LABELS } from '@/types/admin'

export function useAdminAuth() {
  const { user } = useAuthStore()
  const {
    adminUser,
    activeRole,
    permissions,
    isLoading,
    error,
    setAdminUser,
    setDemoRole,
    setLoading,
    setError,
    hasPermission,
    hasRole,
    canAccessRoute,
    logoutAdmin,
  } = useAdminAuthStore()

  // Verify and fetch remote admin profile from Supabase
  const refreshAdminSession = useCallback(async () => {
    if (!isSupabaseConfigured || !supabase || !user) {
      return
    }

    setLoading(true)
    try {
      // 1. Query admin_users joined with role and permissions
      const { data, error: adminErr } = await supabase
        .from('admin_users')
        .select(`
          id,
          user_id,
          is_active,
          created_at,
          role:admin_roles(
            name,
            slug
          )
        `)
        .eq('user_id', user.id)
        .single()

      if (adminErr || !data || !data.is_active) {
        // User is not an active admin in the database
        setAdminUser(null)
        return
      }

      // 2. Resolve role
      const rawRole = (data.role as any)?.slug?.toUpperCase() as AdminRole
      const role: AdminRole = rawRole && ROLE_PERMISSIONS[rawRole] ? rawRole : 'ADMIN'
      const perms = ROLE_PERMISSIONS[role] || []

      setAdminUser({
        id: data.id,
        userId: data.user_id,
        email: user.email,
        fullName: user.fullName || user.email,
        role,
        roleName: ROLE_LABELS[role] || role,
        isActive: data.is_active,
        permissions: perms,
        createdAt: data.created_at,
      })
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to verify admin status'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }, [user, setAdminUser, setError, setLoading])

  useEffect(() => {
    if (isSupabaseConfigured && user) {
      refreshAdminSession()
    }
  }, [user, refreshAdminSession])

  return {
    adminUser,
    activeRole,
    permissions,
    isLoading,
    error,
    isSuperAdmin: activeRole === 'SUPER_ADMIN',
    isAdmin: Boolean(activeRole),
    hasPermission,
    hasRole,
    canAccessRoute,
    setDemoRole,
    refreshAdminSession,
    logoutAdmin,
  }
}

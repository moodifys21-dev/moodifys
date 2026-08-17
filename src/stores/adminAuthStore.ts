import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import {
  AdminRole,
  AdminUser,
  PermissionKey,
  ROLE_PERMISSIONS,
  ROLE_LABELS,
} from '@/types/admin'

interface AdminAuthState {
  adminUser: AdminUser | null
  activeRole: AdminRole | null
  permissions: PermissionKey[]
  isLoading: boolean
  error: string | null

  // Methods
  setAdminUser: (admin: AdminUser | null) => void
  setDemoRole: (role: AdminRole) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  hasPermission: (permission: PermissionKey) => boolean
  hasRole: (role: AdminRole | AdminRole[]) => boolean
  canAccessRoute: (pathname: string) => boolean
  logoutAdmin: () => void
}

// Route to required permission map
const ROUTE_PERMISSION_MAP: Record<string, PermissionKey> = {
  '/admin/cms/versions': 'homepage.publish',
  '/admin/cms/homepage': 'homepage.view',
  '/admin/homepage': 'homepage.view',
  '/admin/fulfillment/production': 'orders.fulfill',
  '/admin/fulfillment': 'orders.fulfill',
  '/admin/designs': 'orders.fulfill',
  '/admin/orders': 'orders.view',
  '/admin/products/new': 'products.create',
  '/admin/products': 'products.view',
  '/admin/inventory': 'inventory.view',
  '/admin/customers': 'customers.view',
  '/admin/categories': 'categories.view',
  '/admin/media': 'media.view',
  '/admin/staff': 'admin.users.view',
  '/admin/users': 'admin.users.view',
  '/admin/roles': 'admin.users.view',
  '/admin/audit-logs': 'audit_logs.view',
  '/admin/discounts': 'discounts.view',
  '/admin/analytics': 'analytics.view',
  '/admin/settings': 'settings.view',
  '/admin': 'dashboard.view',
}

export const useAdminAuthStore = create<AdminAuthState>()(
  persist(
    (set, get) => ({
      adminUser: {
        id: 'admin-usr-master',
        userId: 'master-admin-01',
        email: 'founder@moodifys.studio',
        fullName: 'MASTER CONTROL (FOUNDER)',
        role: 'SUPER_ADMIN',
        roleName: ROLE_LABELS['SUPER_ADMIN'],
        isActive: true,
        permissions: ROLE_PERMISSIONS['SUPER_ADMIN'],
        createdAt: new Date().toISOString(),
      },
      activeRole: 'SUPER_ADMIN',
      permissions: ROLE_PERMISSIONS['SUPER_ADMIN'],
      isLoading: false,
      error: null,

      setAdminUser: (admin) =>
        set({
          adminUser: admin,
          activeRole: admin?.role || null,
          permissions: admin?.permissions || [],
          isLoading: false,
          error: null,
        }),

      setDemoRole: (role: AdminRole) => {
        const perms = ROLE_PERMISSIONS[role] || []
        set({
          activeRole: role,
          permissions: perms,
          adminUser: {
            id: `admin-usr-${role.toLowerCase()}`,
            userId: `mock-${role.toLowerCase()}`,
            email: `${role.toLowerCase()}@moodifys.studio`,
            fullName: `${ROLE_LABELS[role]} (DEMO)`,
            role,
            roleName: ROLE_LABELS[role],
            isActive: true,
            permissions: perms,
            createdAt: new Date().toISOString(),
          },
        })
      },

      setLoading: (isLoading) => set({ isLoading }),
      setError: (error) => set({ error, isLoading: false }),

      hasPermission: (permission: PermissionKey) => {
        const { permissions, activeRole } = get()
        if (activeRole === 'SUPER_ADMIN') return true
        return permissions.includes(permission)
      },

      hasRole: (role: AdminRole | AdminRole[]) => {
        const { activeRole } = get()
        if (!activeRole) return false
        if (Array.isArray(role)) {
          return role.includes(activeRole)
        }
        return activeRole === role
      },

      canAccessRoute: (pathname: string) => {
        const { activeRole, permissions } = get()
        if (!activeRole) return false
        if (activeRole === 'SUPER_ADMIN') return true

        // Find closest matching route permission
        const matchedEntry = Object.entries(ROUTE_PERMISSION_MAP).find(
          ([route]) => pathname === route || pathname.startsWith(`${route}/`)
        )

        if (!matchedEntry) {
          return permissions.includes('dashboard.view')
        }

        const requiredPermission = matchedEntry[1]
        return permissions.includes(requiredPermission)
      },

      logoutAdmin: () =>
        set({
          adminUser: null,
          activeRole: null,
          permissions: [],
          isLoading: false,
          error: null,
        }),
    }),
    {
      name: 'moodifys-admin-auth',
    }
  )
)

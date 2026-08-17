import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { AdminUser, AdminRole, PermissionKey, ROLE_PERMISSIONS, ROLE_LABELS } from '@/types/admin'

interface StaffStoreState {
  staff: AdminUser[]

  // Actions
  inviteStaffMember: (fullName: string, email: string, role: AdminRole) => void
  updateStaffRole: (id: string, role: AdminRole) => void
  updateStaffPermissions: (id: string, permissions: PermissionKey[]) => void
  toggleStaffStatus: (id: string) => void
  deleteStaffMember: (id: string) => void
}

const SEED_STAFF: AdminUser[] = [
  {
    id: 'st-1',
    userId: 'usr-super-01',
    fullName: 'Master Controller',
    email: 'founder@moodifys.studio',
    role: 'SUPER_ADMIN',
    roleName: ROLE_LABELS['SUPER_ADMIN'],
    isActive: true,
    permissions: ROLE_PERMISSIONS['SUPER_ADMIN'],
    createdAt: '2026-01-01T00:00:00Z',
    lastActiveAt: '2026-08-16T22:30:00Z',
  },
  {
    id: 'st-2',
    userId: 'usr-prod-02',
    fullName: 'Karan Mehra',
    email: 'karan.production@moodifys.studio',
    role: 'FULFILLMENT_MANAGER',
    roleName: ROLE_LABELS['FULFILLMENT_MANAGER'],
    isActive: true,
    permissions: ROLE_PERMISSIONS['FULFILLMENT_MANAGER'],
    createdAt: '2026-04-10T09:00:00Z',
    lastActiveAt: '2026-08-16T21:15:00Z',
  },
  {
    id: 'st-3',
    userId: 'usr-inv-03',
    fullName: 'Ananya Roy',
    email: 'ananya.inventory@moodifys.studio',
    role: 'INVENTORY_MANAGER',
    roleName: ROLE_LABELS['INVENTORY_MANAGER'],
    isActive: true,
    permissions: ROLE_PERMISSIONS['INVENTORY_MANAGER'],
    createdAt: '2026-05-15T11:00:00Z',
    lastActiveAt: '2026-08-16T19:40:00Z',
  },
  {
    id: 'st-4',
    userId: 'usr-cms-04',
    fullName: 'Devika Singhania',
    email: 'devika.content@moodifys.studio',
    role: 'CONTENT_MANAGER',
    roleName: ROLE_LABELS['CONTENT_MANAGER'],
    isActive: true,
    permissions: ROLE_PERMISSIONS['CONTENT_MANAGER'],
    createdAt: '2026-06-01T14:00:00Z',
    lastActiveAt: '2026-08-16T18:00:00Z',
  },
  {
    id: 'st-5',
    userId: 'usr-sup-05',
    fullName: 'Tariq Ali',
    email: 'tariq.support@moodifys.studio',
    role: 'CUSTOMER_SUPPORT',
    roleName: ROLE_LABELS['CUSTOMER_SUPPORT'],
    isActive: false,
    permissions: ROLE_PERMISSIONS['CUSTOMER_SUPPORT'],
    createdAt: '2026-07-01T10:00:00Z',
    lastActiveAt: '2026-08-10T12:00:00Z',
  },
]

export const useStaffStore = create<StaffStoreState>()(
  persist(
    (set, get) => ({
      staff: SEED_STAFF,

      inviteStaffMember: (fullName, email, role) => {
        const newStaff: AdminUser = {
          id: `st-${Date.now()}`,
          userId: `usr-${Date.now()}`,
          fullName: fullName.trim(),
          email: email.trim().toLowerCase(),
          role,
          roleName: ROLE_LABELS[role],
          isActive: true,
          permissions: ROLE_PERMISSIONS[role],
          createdAt: new Date().toISOString(),
        }

        set({ staff: [...get().staff, newStaff] })
      },

      updateStaffRole: (id, role) => {
        set({
          staff: get().staff.map((s) =>
            s.id === id
              ? {
                  ...s,
                  role,
                  roleName: ROLE_LABELS[role],
                  permissions: ROLE_PERMISSIONS[role],
                }
              : s
          ),
        })
      },

      updateStaffPermissions: (id, permissions) => {
        set({
          staff: get().staff.map((s) =>
            s.id === id ? { ...s, permissions } : s
          ),
        })
      },

      toggleStaffStatus: (id) => {
        set({
          staff: get().staff.map((s) =>
            s.id === id ? { ...s, isActive: !s.isActive } : s
          ),
        })
      },

      deleteStaffMember: (id) => {
        set({ staff: get().staff.filter((s) => s.id !== id) })
      },
    }),
    {
      name: 'moodifys-admin-staff-storage',
    }
  )
)

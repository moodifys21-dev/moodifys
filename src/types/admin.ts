// ==============================================================================
// MOODIFYS ADMIN CONTROL CENTER — ROLES & PERMISSION DEFINITIONS
// ==============================================================================

export type AdminRole =
  | 'SUPER_ADMIN'
  | 'ADMIN'
  | 'MANAGER'
  | 'FULFILLMENT_MANAGER'
  | 'INVENTORY_MANAGER'
  | 'CONTENT_MANAGER'
  | 'CUSTOMER_SUPPORT'

export type PermissionKey =
  | 'dashboard.view'
  | 'orders.view'
  | 'orders.update'
  | 'orders.cancel'
  | 'orders.fulfill'
  | 'products.view'
  | 'products.create'
  | 'products.update'
  | 'products.delete'
  | 'inventory.view'
  | 'inventory.update'
  | 'inventory.adjust'
  | 'customers.view'
  | 'customers.update'
  | 'homepage.view'
  | 'homepage.update'
  | 'homepage.publish'
  | 'categories.view'
  | 'categories.create'
  | 'categories.update'
  | 'categories.delete'
  | 'media.view'
  | 'media.upload'
  | 'media.delete'
  | 'admin.users.view'
  | 'admin.users.create'
  | 'admin.users.update'
  | 'admin.users.delete'
  | 'settings.view'
  | 'settings.update'
  | 'audit_logs.view'
  | 'discounts.view'
  | 'discounts.update'
  | 'analytics.view'

export interface AdminUser {
  id: string
  userId: string
  email: string
  fullName: string
  role: AdminRole
  roleName: string
  isActive: boolean
  permissions: PermissionKey[]
  createdAt: string
  lastActiveAt?: string
}

export interface AuditLog {
  id: string
  actorUserId?: string
  actorName: string
  action: string
  entityType: string
  entityId?: string
  oldData?: Record<string, unknown>
  newData?: Record<string, unknown>
  ipAddress?: string
  createdAt: string
}

export interface AdminNotification {
  id: string
  type: 'ORDER' | 'LOW_STOCK' | 'QC_FAILED' | 'SYSTEM'
  title: string
  message: string
  link?: string
  isRead: boolean
  createdAt: string
}

// Default Granular Permission Matrix by Role
export const ROLE_PERMISSIONS: Record<AdminRole, PermissionKey[]> = {
  SUPER_ADMIN: [
    'dashboard.view',
    'orders.view',
    'orders.update',
    'orders.cancel',
    'orders.fulfill',
    'products.view',
    'products.create',
    'products.update',
    'products.delete',
    'inventory.view',
    'inventory.update',
    'inventory.adjust',
    'customers.view',
    'customers.update',
    'homepage.view',
    'homepage.update',
    'homepage.publish',
    'categories.view',
    'categories.create',
    'categories.update',
    'categories.delete',
    'media.view',
    'media.upload',
    'media.delete',
    'admin.users.view',
    'admin.users.create',
    'admin.users.update',
    'admin.users.delete',
    'settings.view',
    'settings.update',
    'audit_logs.view',
    'discounts.view',
    'discounts.update',
    'analytics.view',
  ],
  ADMIN: [
    'dashboard.view',
    'orders.view',
    'orders.update',
    'orders.cancel',
    'orders.fulfill',
    'products.view',
    'products.create',
    'products.update',
    'inventory.view',
    'inventory.update',
    'inventory.adjust',
    'customers.view',
    'customers.update',
    'homepage.view',
    'homepage.update',
    'homepage.publish',
    'categories.view',
    'categories.create',
    'categories.update',
    'media.view',
    'media.upload',
    'audit_logs.view',
    'discounts.view',
    'discounts.update',
    'analytics.view',
    'settings.view',
  ],
  MANAGER: [
    'dashboard.view',
    'orders.view',
    'orders.update',
    'orders.fulfill',
    'products.view',
    'products.create',
    'products.update',
    'inventory.view',
    'inventory.update',
    'inventory.adjust',
    'customers.view',
    'categories.view',
    'discounts.view',
    'analytics.view',
  ],
  FULFILLMENT_MANAGER: [
    'dashboard.view',
    'orders.view',
    'orders.update',
    'orders.fulfill',
    'inventory.view',
  ],
  INVENTORY_MANAGER: [
    'dashboard.view',
    'products.view',
    'products.create',
    'products.update',
    'inventory.view',
    'inventory.update',
    'inventory.adjust',
    'categories.view',
  ],
  CONTENT_MANAGER: [
    'dashboard.view',
    'homepage.view',
    'homepage.update',
    'homepage.publish',
    'categories.view',
    'categories.create',
    'categories.update',
    'media.view',
    'media.upload',
    'media.delete',
  ],
  CUSTOMER_SUPPORT: [
    'dashboard.view',
    'orders.view',
    'customers.view',
    'products.view',
  ],
}

export const ROLE_LABELS: Record<AdminRole, string> = {
  SUPER_ADMIN: 'Super Administrator',
  ADMIN: 'System Admin',
  MANAGER: 'Store Operations Manager',
  FULFILLMENT_MANAGER: 'Fulfillment & Production Lead',
  INVENTORY_MANAGER: 'Inventory & Stock Manager',
  CONTENT_MANAGER: 'CMS & Content Editor',
  CUSTOMER_SUPPORT: 'Customer Concierge',
}

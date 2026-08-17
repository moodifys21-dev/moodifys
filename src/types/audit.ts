export type AuditSeverity = 'INFO' | 'WARNING' | 'CRITICAL_SECURITY'

export type AuditCategory =
  | 'ORDERS'
  | 'FULFILLMENT'
  | 'INVENTORY'
  | 'PRODUCTS'
  | 'CMS_HOMEPAGE'
  | 'STAFF_RBAC'
  | 'SECURITY_FRAUD'

export interface AuditRecord {
  id: string
  actorId: string
  actorName: string
  actorRole: string
  action: string
  category: AuditCategory
  entityType: string
  entityId: string
  severity: AuditSeverity
  ipAddress: string
  location?: string
  oldData?: Record<string, unknown>
  newData?: Record<string, unknown>
  metadata?: Record<string, unknown>
  createdAt: string
}

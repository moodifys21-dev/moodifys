import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { AuditRecord } from '@/types/audit'

interface AuditLogStoreState {
  logs: AuditRecord[]

  // Actions
  addLog: (log: Omit<AuditRecord, 'id' | 'createdAt'>) => void
  clearLogs: () => void
}

const SEED_LOGS: AuditRecord[] = [
  {
    id: 'aud-001',
    actorId: 'usr-super-01',
    actorName: 'Master Controller',
    actorRole: 'SUPER_ADMIN',
    action: 'CMS_HOMEPAGE_PUBLISHED',
    category: 'CMS_HOMEPAGE',
    entityType: 'HomepageCMSConfig',
    entityId: 'v1.1.0',
    severity: 'INFO',
    ipAddress: '103.21.144.12',
    location: 'Mumbai, IN',
    oldData: {
      heroHeadline: 'MOOD OVER MATERIAL',
      sectionsCount: 6,
      isDraft: true,
    },
    newData: {
      heroHeadline: 'WEAR YOUR MOOD',
      sectionsCount: 6,
      isDraft: false,
    },
    createdAt: '2026-08-16T22:30:00Z',
  },
  {
    id: 'aud-002',
    actorId: 'usr-prod-02',
    actorName: 'Karan Mehra',
    actorRole: 'FULFILLMENT_MANAGER',
    action: 'ORDER_DISPATCH_COURIER_ASSIGNED',
    category: 'FULFILLMENT',
    entityType: 'Order',
    entityId: 'MOOD-92041',
    severity: 'INFO',
    ipAddress: '49.36.128.88',
    location: 'New Delhi, IN',
    oldData: {
      fulfillmentStage: 'ready_to_ship',
      carrier: null,
      trackingNumber: null,
    },
    newData: {
      fulfillmentStage: 'shipped',
      carrier: 'Bluedart Express',
      trackingNumber: 'BLUEDART-8829410-IN',
    },
    createdAt: '2026-08-16T21:15:00Z',
  },
  {
    id: 'aud-003',
    actorId: 'usr-inv-03',
    actorName: 'Ananya Roy',
    actorRole: 'INVENTORY_MANAGER',
    action: 'STOCK_LEVEL_ADJUSTMENT',
    category: 'INVENTORY',
    entityType: 'ProductVariant',
    entityId: 'SKU-ACID-BLK-L',
    severity: 'WARNING',
    ipAddress: '182.74.55.90',
    location: 'Bengaluru, IN',
    oldData: {
      stockQuantity: 45,
    },
    newData: {
      stockQuantity: 30,
      movementType: 'QC_SCRAP_DEFECT',
      reasonNote: 'Damaged rib collar seams found in batch #B-914',
    },
    createdAt: '2026-08-16T19:40:00Z',
  },
  {
    id: 'aud-004',
    actorId: 'system-security-daemon',
    actorName: 'Supabase RLS & Sentinel',
    actorRole: 'SYSTEM_BOT',
    action: 'FAILED_3DS_PAYMENT_FRAUD_FLAG',
    category: 'SECURITY_FRAUD',
    entityType: 'CustomerAccount',
    entityId: 'cust-5',
    severity: 'CRITICAL_SECURITY',
    ipAddress: '185.220.101.5',
    location: 'Tor Exit Node (Suspicious IP)',
    oldData: {
      accountStatus: 'ACTIVE',
      fraudScore: 12,
    },
    newData: {
      accountStatus: 'FLAGGED',
      fraudScore: 98,
      flagReason: 'Velocity check failed: 5 failed credit cards in 3 minutes',
    },
    createdAt: '2026-08-16T14:10:00Z',
  },
  {
    id: 'aud-005',
    actorId: 'usr-super-01',
    actorName: 'Master Controller',
    actorRole: 'SUPER_ADMIN',
    action: 'STAFF_ROLE_MODIFIED',
    category: 'STAFF_RBAC',
    entityType: 'AdminUser',
    entityId: 'st-5 (Tariq Ali)',
    severity: 'WARNING',
    ipAddress: '103.21.144.12',
    location: 'Mumbai, IN',
    oldData: {
      role: 'CUSTOMER_SUPPORT',
      isActive: true,
    },
    newData: {
      role: 'CUSTOMER_SUPPORT',
      isActive: false,
      reason: 'Temporary suspension pending security clearance review',
    },
    createdAt: '2026-08-16T10:00:00Z',
  },
]

export const useAuditLogStore = create<AuditLogStoreState>()(
  persist(
    (set, get) => ({
      logs: SEED_LOGS,

      addLog: (logData) => {
        const newRecord: AuditRecord = {
          ...logData,
          id: `aud-${Date.now()}`,
          createdAt: new Date().toISOString(),
        }

        set({ logs: [newRecord, ...get().logs] })
      },

      clearLogs: () => {
        set({ logs: [] })
      },
    }),
    {
      name: 'moodifys-audit-logs-storage',
    }
  )
)

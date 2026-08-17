import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { useAuditLogStore } from './auditLogStore'

export interface GeneralSettings {
  storeName: string
  storeLogoUrl: string
  faviconUrl: string
  storeEmail: string
  supportEmail: string
  supportPhone: string
  storeDescription: string
  timezone: string
  country: string
  defaultLanguage: string
}

export interface StoreOperationalSettings {
  storeStatus: 'OPEN' | 'MAINTENANCE'
  storeAnnouncement: string
  freeShippingThreshold: number
  minimumOrderValue: number
  returnPeriodDays: number
  defaultShippingFee: number
  enableCustomization: boolean
}

export interface CheckoutSettings {
  allowGuestCheckout: boolean
  requireAccount: boolean
  enableCoupons: boolean
  requirePhone: boolean
  requireBillingAddress: boolean
  allowOrderNotes: boolean
  paymentCod: boolean
  paymentCards: boolean
  paymentUPI: boolean
  paymentNetbanking: boolean
}

export interface ShippingSettings {
  standardShippingFee: number
  expressShippingFee: number
  freeShippingThreshold: number
  estimatedStandardDays: string
  estimatedExpressDays: string
  supportedRegions: string
}

export interface NotificationSettings {
  notifyNewOrderEmail: boolean
  notifyLowStockEmail: boolean
  notifyOrderStatusCustomer: boolean
  notifyAdminDigestDaily: boolean
  adminRecipientEmail: string
}

export interface MediaConfigSettings {
  maxUploadSizeMb: number
  allowedFormats: string[]
  defaultFolder: string
  maxGalleryImagesPerProduct: number
}

export interface SecuritySettings {
  sessionTimeoutMinutes: number
  requireReauthForSensitiveActions: boolean
  maxFailedLoginsLockout: number
  enforceTwoFactor: boolean
}

export interface SEOSettings {
  metaTitle: string
  metaDescription: string
  ogImageUrl: string
  canonicalDomain: string
}

export interface StoreSettingsState {
  general: GeneralSettings
  storeOps: StoreOperationalSettings
  checkout: CheckoutSettings
  shipping: ShippingSettings
  notifications: NotificationSettings
  mediaConfig: MediaConfigSettings
  security: SecuritySettings
  seo: SEOSettings

  // Actions
  updateGeneral: (updates: Partial<GeneralSettings>, actorName?: string) => void
  updateStoreOps: (updates: Partial<StoreOperationalSettings>, actorName?: string) => void
  updateCheckout: (updates: Partial<CheckoutSettings>, actorName?: string) => void
  updateShipping: (updates: Partial<ShippingSettings>, actorName?: string) => void
  updateNotifications: (updates: Partial<NotificationSettings>, actorName?: string) => void
  updateMediaConfig: (updates: Partial<MediaConfigSettings>, actorName?: string) => void
  updateSecurity: (updates: Partial<SecuritySettings>, actorName?: string) => void
  updateSEO: (updates: Partial<SEOSettings>, actorName?: string) => void
  resetToDefaults: () => void
}

const DEFAULT_SETTINGS = {
  general: {
    storeName: 'MOODIFYS',
    storeLogoUrl: '/logo.svg',
    faviconUrl: '/favicon.ico',
    storeEmail: 'concierge@moodifys.com',
    supportEmail: 'support@moodifys.com',
    supportPhone: '+91 98765 43210',
    storeDescription: 'Contemporary bespoke streetwear and customizable luxury fashion catalog.',
    timezone: 'Asia/Kolkata (IST +5:30)',
    country: 'India',
    defaultLanguage: 'English (EN-US)',
  },
  storeOps: {
    storeStatus: 'OPEN' as const,
    storeAnnouncement: 'COMPLIMENTARY ARCHIVAL SHIPPING ON ORDERS OVER 999',
    freeShippingThreshold: 999,
    minimumOrderValue: 299,
    returnPeriodDays: 14,
    defaultShippingFee: 149,
    enableCustomization: true,
  },
  checkout: {
    allowGuestCheckout: true,
    requireAccount: false,
    enableCoupons: true,
    requirePhone: true,
    requireBillingAddress: false,
    allowOrderNotes: true,
    paymentCod: true,
    paymentCards: true,
    paymentUPI: true,
    paymentNetbanking: true,
  },
  shipping: {
    standardShippingFee: 149,
    expressShippingFee: 299,
    freeShippingThreshold: 999,
    estimatedStandardDays: '3-5 Business Days',
    estimatedExpressDays: '24-48 Hours',
    supportedRegions: 'Pan-India Domestic & Select Global Destinations',
  },
  notifications: {
    notifyNewOrderEmail: true,
    notifyLowStockEmail: true,
    notifyOrderStatusCustomer: true,
    notifyAdminDigestDaily: false,
    adminRecipientEmail: 'operations@moodifys.com',
  },
  mediaConfig: {
    maxUploadSizeMb: 10,
    allowedFormats: ['JPG', 'JPEG', 'PNG', 'WEBP'],
    defaultFolder: 'Products',
    maxGalleryImagesPerProduct: 8,
  },
  security: {
    sessionTimeoutMinutes: 60,
    requireReauthForSensitiveActions: true,
    maxFailedLoginsLockout: 5,
    enforceTwoFactor: false,
  },
  seo: {
    metaTitle: 'Moodifys — Wear Your Mood | Bespoke Luxury Streetwear & 2D Customizer',
    metaDescription: 'Customizable luxury streetwear and heavyweight minimalist silhouettes. Design your own bespoke aesthetic on heavyweight cotton blanks.',
    ogImageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=1600&auto=format&fit=crop&q=90',
    canonicalDomain: 'https://moodifys.com',
  },
}

export const useStoreSettingsStore = create<StoreSettingsState>()(
  persist(
    (set, get) => ({
      ...DEFAULT_SETTINGS,

      updateGeneral: (updates, actorName = 'Admin Operator') => {
        const oldData = { ...get().general }
        const updated = { ...get().general, ...updates }
        set({ general: updated })
        try {
          useAuditLogStore.getState().addLog({
            actorId: 'admin-actor',
            actorName,
            actorRole: 'SUPER_ADMIN',
            action: 'STORE_SETTINGS_UPDATED',
            category: 'SECURITY_FRAUD',
            entityType: 'StoreSettings',
            entityId: 'GENERAL',
            severity: 'INFO',
            ipAddress: '127.0.0.1',
            oldData: oldData as unknown as Record<string, unknown>,
            newData: updated as unknown as Record<string, unknown>,
          })
        } catch {
          // ignore
        }
      },

      updateStoreOps: (updates, actorName = 'Admin Operator') => {
        const oldData = { ...get().storeOps }
        const updated = { ...get().storeOps, ...updates }
        set({ storeOps: updated })
        try {
          useAuditLogStore.getState().addLog({
            actorId: 'admin-actor',
            actorName,
            actorRole: 'SUPER_ADMIN',
            action: 'STORE_SETTINGS_UPDATED',
            category: 'SECURITY_FRAUD',
            entityType: 'StoreSettings',
            entityId: 'STORE_OPS',
            severity: 'WARNING',
            ipAddress: '127.0.0.1',
            oldData: oldData as unknown as Record<string, unknown>,
            newData: updated as unknown as Record<string, unknown>,
          })
        } catch {
          // ignore
        }
      },

      updateCheckout: (updates, _actorName = 'Admin Operator') => {
        set({ checkout: { ...get().checkout, ...updates } })
      },

      updateShipping: (updates, _actorName = 'Admin Operator') => {
        set({ shipping: { ...get().shipping, ...updates } })
      },

      updateNotifications: (updates, _actorName = 'Admin Operator') => {
        set({ notifications: { ...get().notifications, ...updates } })
      },

      updateMediaConfig: (updates, _actorName = 'Admin Operator') => {
        set({ mediaConfig: { ...get().mediaConfig, ...updates } })
      },

      updateSecurity: (updates, _actorName = 'Admin Operator') => {
        set({ security: { ...get().security, ...updates } })
      },

      updateSEO: (updates, _actorName = 'Admin Operator') => {
        set({ seo: { ...get().seo, ...updates } })
      },

      resetToDefaults: () => {
        set(DEFAULT_SETTINGS)
      },
    }),
    {
      name: 'moodifys-store-settings',
    }
  )
)

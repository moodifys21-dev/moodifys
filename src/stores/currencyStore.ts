import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { useAuditLogStore } from './auditLogStore'

export type SymbolPosition = 'BEFORE' | 'AFTER'

export interface CurrencyConfig {
  currencyCode: string
  currencySymbol: string
  currencyName: string
  decimalPlaces: number
  symbolPosition: SymbolPosition
  thousandsSeparator: string
  decimalSeparator: string
}

export interface CurrencyPreset {
  code: string
  symbol: string
  name: string
  decimalPlaces: number
  position: SymbolPosition
  thousandsSeparator: string
  decimalSeparator: string
}

export const POPULAR_CURRENCIES: CurrencyPreset[] = [
  { code: 'INR', symbol: '₹', name: 'Indian Rupee', decimalPlaces: 0, position: 'BEFORE', thousandsSeparator: ',', decimalSeparator: '.' },
  { code: 'PKR', symbol: 'Rs.', name: 'Pakistani Rupee', decimalPlaces: 0, position: 'BEFORE', thousandsSeparator: ',', decimalSeparator: '.' },
  { code: 'USD', symbol: '$', name: 'US Dollar', decimalPlaces: 2, position: 'BEFORE', thousandsSeparator: ',', decimalSeparator: '.' },
  { code: 'EUR', symbol: '€', name: 'Euro', decimalPlaces: 2, position: 'AFTER', thousandsSeparator: '.', decimalSeparator: ',' },
  { code: 'GBP', symbol: '£', name: 'British Pound', decimalPlaces: 2, position: 'BEFORE', thousandsSeparator: ',', decimalSeparator: '.' },
  { code: 'AED', symbol: 'د.إ', name: 'UAE Dirham', decimalPlaces: 2, position: 'BEFORE', thousandsSeparator: ',', decimalSeparator: '.' },
  { code: 'CAD', symbol: 'CA$', name: 'Canadian Dollar', decimalPlaces: 2, position: 'BEFORE', thousandsSeparator: ',', decimalSeparator: '.' },
  { code: 'AUD', symbol: 'AU$', name: 'Australian Dollar', decimalPlaces: 2, position: 'BEFORE', thousandsSeparator: ',', decimalSeparator: '.' },
  { code: 'SGD', symbol: 'SG$', name: 'Singapore Dollar', decimalPlaces: 2, position: 'BEFORE', thousandsSeparator: ',', decimalSeparator: '.' },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen', decimalPlaces: 0, position: 'BEFORE', thousandsSeparator: ',', decimalSeparator: '.' },
]

interface CurrencyStoreState {
  config: CurrencyConfig
  updateCurrency: (newConfig: Partial<CurrencyConfig>, actorName?: string) => void
  applyPreset: (code: string, actorName?: string) => void
  resetToDefault: () => void
}

const DEFAULT_CURRENCY: CurrencyConfig = {
  currencyCode: 'INR',
  currencySymbol: '₹',
  currencyName: 'Indian Rupee',
  decimalPlaces: 0,
  symbolPosition: 'BEFORE',
  thousandsSeparator: ',',
  decimalSeparator: '.',
}

export const useCurrencyStore = create<CurrencyStoreState>()(
  persist(
    (set, get) => ({
      config: DEFAULT_CURRENCY,

      updateCurrency: (newConfig, actorName = 'Admin Operator') => {
        const oldConfig = { ...get().config }
        const updated = { ...get().config, ...newConfig }
        set({ config: updated })

        // Log audit event
        try {
          useAuditLogStore.getState().addLog({
            actorId: 'admin-actor',
            actorName,
            actorRole: 'SUPER_ADMIN',
            action: 'CURRENCY_SETTINGS_UPDATED',
            category: 'SECURITY_FRAUD',
            entityType: 'StoreSettings',
            entityId: `CURRENCY-${updated.currencyCode}`,
            severity: 'WARNING',
            ipAddress: '127.0.0.1',
            location: 'Admin Session',
            oldData: oldConfig as unknown as Record<string, unknown>,
            newData: updated as unknown as Record<string, unknown>,
          })
        } catch {
          // safe fallback
        }
      },

      applyPreset: (code, actorName = 'Admin Operator') => {
        const preset = POPULAR_CURRENCIES.find((p) => p.code === code)
        if (!preset) return

        get().updateCurrency(
          {
            currencyCode: preset.code,
            currencySymbol: preset.symbol,
            currencyName: preset.name,
            decimalPlaces: preset.decimalPlaces,
            symbolPosition: preset.position,
            thousandsSeparator: preset.thousandsSeparator,
            decimalSeparator: preset.decimalSeparator,
          },
          actorName
        )
      },

      resetToDefault: () => {
        set({ config: DEFAULT_CURRENCY })
      },
    }),
    {
      name: 'moodifys-currency-storage',
    }
  )
)

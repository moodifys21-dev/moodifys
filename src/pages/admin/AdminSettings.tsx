import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useStoreSettingsStore } from '@/stores/storeSettingsStore'
import { useCurrencyStore, POPULAR_CURRENCIES, SymbolPosition } from '@/stores/currencyStore'
import { formatPrice } from '@/lib/utils'
import { MediaPicker } from '@/components/admin/MediaPicker'
import {
  Save,
  Globe,
  DollarSign,
  Store,
  CreditCard,
  Truck,
  Bell,
  Image as ImageIcon,
  Shield,
  Users,
  Search,
  CheckCircle2,
  ExternalLink,
  Upload,
} from 'lucide-react'

export const AdminSettings: React.FC = () => {
  const {
    general,
    storeOps,
    checkout,
    shipping,
    notifications,
    mediaConfig,
    security,
    seo,
    updateGeneral,
    updateStoreOps,
    updateCheckout,
    updateShipping,
    updateNotifications,
    updateMediaConfig,
    updateSecurity,
    updateSEO,
  } = useStoreSettingsStore()

  const { config: currencyConfig, updateCurrency, applyPreset } = useCurrencyStore()

  const [activeTab, setActiveTab] = useState<
    'general' | 'currency' | 'store' | 'checkout' | 'shipping' | 'notifications' | 'media' | 'security' | 'access' | 'seo'
  >('currency')

  const [savedSuccess, setSavedSuccess] = useState(false)
  const [mediaPickerOpen, setMediaPickerOpen] = useState(false)
  const [mediaTarget, setMediaTarget] = useState<'LOGO' | 'OG_IMAGE'>('LOGO')

  const showSavedAlert = () => {
    setSavedSuccess(true)
    setTimeout(() => setSavedSuccess(false), 3000)
  }

  const handleMediaSelected = (url: string) => {
    if (mediaTarget === 'LOGO') {
      updateGeneral({ storeLogoUrl: url })
    } else if (mediaTarget === 'OG_IMAGE') {
      updateSEO({ ogImageUrl: url })
    }
  }

  const tabs = [
    { key: 'currency' as const, label: 'CURRENCY & REGIONAL', icon: <DollarSign size={14} /> },
    { key: 'general' as const, label: 'GENERAL STORE', icon: <Globe size={14} /> },
    { key: 'store' as const, label: 'STORE OPERATIONS', icon: <Store size={14} /> },
    { key: 'checkout' as const, label: 'CHECKOUT & PAYMENT', icon: <CreditCard size={14} /> },
    { key: 'shipping' as const, label: 'SHIPPING & LOGISTICS', icon: <Truck size={14} /> },
    { key: 'notifications' as const, label: 'NOTIFICATIONS', icon: <Bell size={14} /> },
    { key: 'media' as const, label: 'MEDIA & UPLOADS', icon: <ImageIcon size={14} /> },
    { key: 'security' as const, label: 'SECURITY & SESSIONS', icon: <Shield size={14} /> },
    { key: 'access' as const, label: 'ADMIN ACCESS', icon: <Users size={14} /> },
    { key: 'seo' as const, label: 'SEO & METADATA', icon: <Search size={14} /> },
  ]

  return (
    <div className="space-y-6 pb-20">
      
      {/* Global Media Picker */}
      <MediaPicker
        isOpen={mediaPickerOpen}
        onClose={() => setMediaPickerOpen(false)}
        onSelect={handleMediaSelected}
        defaultFolder="General"
        title={mediaTarget === 'LOGO' ? 'SELECT STORE LOGO' : 'SELECT SOCIAL SHARE OG IMAGE'}
      />

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#BEBDBB]/30">
        <div>
          <span className="text-[10px] font-mono font-bold tracking-[0.25em] text-[#BEBDBB] uppercase">
            SYSTEM ARCHITECTURE & CONFIGURATION
          </span>
          <h1 className="font-display text-2xl sm:text-3xl font-bold uppercase tracking-tight text-[#090808]">
            GLOBAL STORE SETTINGS CENTER
          </h1>
        </div>

        <div className="flex items-center gap-3">
          {savedSuccess && (
            <span className="px-3 py-1.5 bg-emerald-100 text-emerald-900 border border-emerald-300 text-xs font-mono font-bold flex items-center gap-1.5 animate-in fade-in">
              <CheckCircle2 size={14} className="text-emerald-700" />
              <span>SETTINGS SAVED & APPLIED GLOBALLY</span>
            </span>
          )}

          <button
            type="button"
            onClick={() => {
              showSavedAlert()
            }}
            className="inline-flex items-center gap-1.5 px-5 py-2 bg-[#090808] text-white text-xs font-mono font-bold uppercase hover:opacity-85 shadow-md"
          >
            <Save size={14} />
            <span>SAVE ALL CONFIGURATIONS</span>
          </button>
        </div>
      </div>

      {/* TABS CONTAINER */}
      <div className="flex border-b border-[#E1E0DC] overflow-x-auto bg-white">
        {tabs.map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => setActiveTab(t.key)}
            className={`flex items-center gap-2 px-4 py-3 text-xs font-mono font-bold uppercase tracking-wider whitespace-nowrap transition-colors border-b-2 ${
              activeTab === t.key
                ? 'border-[#090808] text-[#090808] bg-[#F0EFED]/50'
                : 'border-transparent text-[#BEBDBB] hover:text-[#090808]'
            }`}
          >
            {t.icon}
            <span>{t.label}</span>
          </button>
        ))}
      </div>

      {/* TAB CONTENT PANELS */}
      <div className="bg-white border border-[#E1E0DC] p-6 shadow-xs">
        
        {/* TAB: CURRENCY & REGIONAL */}
        {activeTab === 'currency' && (
          <div className="space-y-6 max-w-3xl">
            
            <div className="p-4 bg-[#F0EFED] border border-[#E1E0DC] space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-display text-sm font-bold uppercase text-[#090808]">
                  LIVE CURRENCY PREVIEW
                </span>
                <span className="px-2 py-0.5 bg-[#090808] text-white text-[10px] font-mono font-bold uppercase">
                  ACTIVE DISPLAY: {formatPrice(1499)}
                </span>
              </div>
              <p className="text-xs text-[#302F2E]">
                All storefront prices, cart checkout amounts, and admin inventory values automatically format using this configuration without altering numeric data.
              </p>
            </div>

            {/* Quick Currency Presets */}
            <div className="space-y-2">
              <label className="text-[11px] font-mono font-bold uppercase text-[#090808] block">
                ONE-CLICK WORLDWIDE CURRENCY PRESETS
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
                {POPULAR_CURRENCIES.map((preset) => (
                  <button
                    key={preset.code}
                    type="button"
                    onClick={() => {
                      applyPreset(preset.code)
                      showSavedAlert()
                    }}
                    className={`p-2.5 border text-left font-mono text-xs transition-all ${
                      currencyConfig.currencyCode === preset.code
                        ? 'border-[#090808] bg-[#090808] text-white shadow-xs'
                        : 'border-[#E1E0DC] bg-[#F0EFED] hover:border-[#090808] text-[#090808]'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-bold">{preset.code}</span>
                      <span className="text-sm">{preset.symbol}</span>
                    </div>
                    <p className={`text-[10px] truncate mt-0.5 ${currencyConfig.currencyCode === preset.code ? 'text-zinc-300' : 'text-[#BEBDBB]'}`}>
                      {preset.name}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* Granular Currency Attributes */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-[#E1E0DC]">
              <div className="space-y-1">
                <label className="text-[11px] font-mono font-bold uppercase text-[#090808]">
                  CURRENCY CODE (ISO-4217) *
                </label>
                <input
                  type="text"
                  value={currencyConfig.currencyCode}
                  onChange={(e) => updateCurrency({ currencyCode: e.target.value.toUpperCase() })}
                  className="w-full bg-[#F0EFED] border border-[#E1E0DC] p-2.5 text-xs font-mono font-bold uppercase text-[#090808] focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-mono font-bold uppercase text-[#090808]">
                  CURRENCY SYMBOL / DENOMINATION *
                </label>
                <input
                  type="text"
                  value={currencyConfig.currencySymbol}
                  onChange={(e) => updateCurrency({ currencySymbol: e.target.value })}
                  className="w-full bg-[#F0EFED] border border-[#E1E0DC] p-2.5 text-xs font-mono font-bold text-[#090808] focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="text-[11px] font-mono font-bold uppercase text-[#090808]">
                  SYMBOL PLACEMENT
                </label>
                <select
                  value={currencyConfig.symbolPosition}
                  onChange={(e) => updateCurrency({ symbolPosition: e.target.value as SymbolPosition })}
                  className="w-full bg-[#F0EFED] border border-[#E1E0DC] p-2.5 text-xs font-mono font-bold uppercase focus:outline-none"
                >
                  <option value="BEFORE">BEFORE AMOUNT (e.g. ₹999 / $999)</option>
                  <option value="AFTER">AFTER AMOUNT (e.g. 999 €)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-mono font-bold uppercase text-[#090808]">
                  DECIMAL PRECISION
                </label>
                <select
                  value={currencyConfig.decimalPlaces}
                  onChange={(e) => updateCurrency({ decimalPlaces: Number(e.target.value) })}
                  className="w-full bg-[#F0EFED] border border-[#E1E0DC] p-2.5 text-xs font-mono font-bold uppercase focus:outline-none"
                >
                  <option value={0}>0 DECIMALS (e.g. 1,499)</option>
                  <option value={2}>2 DECIMALS (e.g. 1,499.00)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-mono font-bold uppercase text-[#090808]">
                  THOUSANDS SEPARATOR
                </label>
                <input
                  type="text"
                  value={currencyConfig.thousandsSeparator}
                  onChange={(e) => updateCurrency({ thousandsSeparator: e.target.value })}
                  className="w-full bg-[#F0EFED] border border-[#E1E0DC] p-2.5 text-xs font-mono font-bold text-center text-[#090808] focus:outline-none"
                />
              </div>
            </div>

          </div>
        )}

        {/* TAB: GENERAL STORE */}
        {activeTab === 'general' && (
          <div className="space-y-5 max-w-2xl text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[11px] font-mono font-bold uppercase text-[#090808]">STORE NAME *</label>
                <input
                  type="text"
                  value={general.storeName}
                  onChange={(e) => updateGeneral({ storeName: e.target.value })}
                  className="w-full bg-[#F0EFED] border border-[#E1E0DC] p-2.5 font-bold uppercase focus:outline-none"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-mono font-bold uppercase text-[#090808]">TIMEZONE *</label>
                <input
                  type="text"
                  value={general.timezone}
                  onChange={(e) => updateGeneral({ timezone: e.target.value })}
                  className="w-full bg-[#F0EFED] border border-[#E1E0DC] p-2.5 font-mono focus:outline-none"
                />
              </div>
            </div>

            {/* Store Logo Selector */}
            <div className="p-3 bg-[#F0EFED] border border-[#E1E0DC] space-y-2">
              <label className="text-[11px] font-mono font-bold uppercase text-[#090808] block">
                STORE LOGO IMAGE
              </label>
              <div className="flex items-center gap-3">
                <div className="w-16 h-12 bg-white border border-[#E1E0DC] flex items-center justify-center p-1 overflow-hidden">
                  <img src={general.storeLogoUrl} alt="Store Logo" className="max-h-full object-contain" />
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setMediaTarget('LOGO')
                    setMediaPickerOpen(true)
                  }}
                  className="px-3 py-1.5 bg-[#090808] text-white text-[10px] font-mono font-bold uppercase hover:opacity-85 flex items-center gap-1.5"
                >
                  <Upload size={12} />
                  <span>CHANGE LOGO VIA MEDIA PICKER</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[11px] font-mono font-bold uppercase text-[#090808]">SUPPORT EMAIL *</label>
                <input
                  type="email"
                  value={general.supportEmail}
                  onChange={(e) => updateGeneral({ supportEmail: e.target.value })}
                  className="w-full bg-[#F0EFED] border border-[#E1E0DC] p-2.5 font-mono focus:outline-none"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-mono font-bold uppercase text-[#090808]">SUPPORT PHONE *</label>
                <input
                  type="text"
                  value={general.supportPhone}
                  onChange={(e) => updateGeneral({ supportPhone: e.target.value })}
                  className="w-full bg-[#F0EFED] border border-[#E1E0DC] p-2.5 font-mono focus:outline-none"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-mono font-bold uppercase text-[#090808]">STORE DESCRIPTION</label>
              <textarea
                rows={3}
                value={general.storeDescription}
                onChange={(e) => updateGeneral({ storeDescription: e.target.value })}
                className="w-full bg-[#F0EFED] border border-[#E1E0DC] p-2.5 focus:outline-none"
              />
            </div>
          </div>
        )}

        {/* TAB: STORE OPERATIONS */}
        {activeTab === 'store' && (
          <div className="space-y-5 max-w-2xl text-xs">
            <div className="flex items-center justify-between p-4 bg-[#F0EFED] border border-[#E1E0DC]">
              <div>
                <p className="font-bold text-sm text-[#090808]">STORE OPERATIONAL STATUS</p>
                <p className="text-xs text-[#302F2E]">
                  Switch to MAINTENANCE to pause customer checkout and display custom maintenance banner.
                </p>
              </div>
              <select
                value={storeOps.storeStatus}
                onChange={(e) => updateStoreOps({ storeStatus: e.target.value as 'OPEN' | 'MAINTENANCE' })}
                className="bg-white border border-[#090808] p-2 font-mono text-xs font-bold uppercase"
              >
                <option value="OPEN">OPEN — ACCEPTING ORDERS</option>
                <option value="MAINTENANCE">MAINTENANCE MODE</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-mono font-bold uppercase text-[#090808]">
                STOREWIDE ANNOUNCEMENT BAR TICKER
              </label>
              <input
                type="text"
                value={storeOps.storeAnnouncement}
                onChange={(e) => updateStoreOps({ storeAnnouncement: e.target.value })}
                className="w-full bg-[#F0EFED] border border-[#E1E0DC] p-2.5 font-bold uppercase focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="text-[11px] font-mono font-bold uppercase text-[#090808]">
                  FREE DELIVERY THRESHOLD ({currencyConfig.currencySymbol})
                </label>
                <input
                  type="number"
                  value={storeOps.freeShippingThreshold}
                  onChange={(e) => updateStoreOps({ freeShippingThreshold: Number(e.target.value) })}
                  className="w-full bg-[#F0EFED] border border-[#E1E0DC] p-2.5 font-mono font-bold focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-mono font-bold uppercase text-[#090808]">
                  MIN ORDER VALUE ({currencyConfig.currencySymbol})
                </label>
                <input
                  type="number"
                  value={storeOps.minimumOrderValue}
                  onChange={(e) => updateStoreOps({ minimumOrderValue: Number(e.target.value) })}
                  className="w-full bg-[#F0EFED] border border-[#E1E0DC] p-2.5 font-mono font-bold focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-mono font-bold uppercase text-[#090808]">
                  RETURN WINDOW (DAYS)
                </label>
                <input
                  type="number"
                  value={storeOps.returnPeriodDays}
                  onChange={(e) => updateStoreOps({ returnPeriodDays: Number(e.target.value) })}
                  className="w-full bg-[#F0EFED] border border-[#E1E0DC] p-2.5 font-mono font-bold focus:outline-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-[#F0EFED] border border-[#E1E0DC]">
              <div>
                <p className="font-bold text-xs text-[#090808]">2D CUSTOMIZER STUDIO ENGINE</p>
                <p className="text-[11px] text-[#302F2E]">Enable customer custom design studio on apparel pieces.</p>
              </div>
              <input
                type="checkbox"
                checked={storeOps.enableCustomization}
                onChange={(e) => updateStoreOps({ enableCustomization: e.target.checked })}
                className="w-5 h-5 accent-[#090808]"
              />
            </div>
          </div>
        )}

        {/* TAB: CHECKOUT */}
        {activeTab === 'checkout' && (
          <div className="space-y-4 max-w-2xl text-xs">
            <div className="space-y-3">
              {[
                { key: 'allowGuestCheckout', label: 'Allow Guest Checkout (No mandatory account creation)' },
                { key: 'enableCoupons', label: 'Enable Promotional Discount Codes & Archival Vouchers' },
                { key: 'requirePhone', label: 'Mandatory Phone Number for Carrier Tracking SMS' },
                { key: 'allowOrderNotes', label: 'Allow Customer Special Order Delivery Instructions' },
                { key: 'paymentCards', label: 'Credit / Debit Cards (Visa, Mastercard, Amex)' },
                { key: 'paymentUPI', label: 'Instant UPI & QR Code Payments' },
                { key: 'paymentCod', label: 'Cash on Delivery (COD) Safeguard' },
              ].map((item) => (
                <div key={item.key} className="flex items-center justify-between p-3 bg-[#F0EFED] border border-[#E1E0DC]">
                  <span className="font-bold text-[#090808]">{item.label}</span>
                  <input
                    type="checkbox"
                    checked={Boolean(checkout[item.key as keyof typeof checkout])}
                    onChange={(e) => updateCheckout({ [item.key]: e.target.checked })}
                    className="w-4 h-4 accent-[#090808]"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB: SHIPPING */}
        {activeTab === 'shipping' && (
          <div className="space-y-4 max-w-2xl text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[11px] font-mono font-bold uppercase text-[#090808]">
                  STANDARD SHIPPING FEE ({currencyConfig.currencySymbol})
                </label>
                <input
                  type="number"
                  value={shipping.standardShippingFee}
                  onChange={(e) => updateShipping({ standardShippingFee: Number(e.target.value) })}
                  className="w-full bg-[#F0EFED] border border-[#E1E0DC] p-2.5 font-mono font-bold focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-mono font-bold uppercase text-[#090808]">
                  EXPRESS SHIPPING FEE ({currencyConfig.currencySymbol})
                </label>
                <input
                  type="number"
                  value={shipping.expressShippingFee}
                  onChange={(e) => updateShipping({ expressShippingFee: Number(e.target.value) })}
                  className="w-full bg-[#F0EFED] border border-[#E1E0DC] p-2.5 font-mono font-bold focus:outline-none"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-mono font-bold uppercase text-[#090808]">
                ESTIMATED DELIVERY COPY (STANDARD)
              </label>
              <input
                type="text"
                value={shipping.estimatedStandardDays}
                onChange={(e) => updateShipping({ estimatedStandardDays: e.target.value })}
                className="w-full bg-[#F0EFED] border border-[#E1E0DC] p-2.5 focus:outline-none"
              />
            </div>
          </div>
        )}

        {/* TAB: NOTIFICATIONS */}
        {activeTab === 'notifications' && (
          <div className="space-y-4 max-w-2xl text-xs">
            <div className="space-y-3">
              {[
                { key: 'notifyNewOrderEmail', label: 'Instant Email Alert on New Placed Order' },
                { key: 'notifyLowStockEmail', label: 'Low Stock Emergency Restock Alerts (< 10 units)' },
                { key: 'notifyOrderStatusCustomer', label: 'Automated Carrier Dispatch Email to Customer' },
                { key: 'notifyAdminDigestDaily', label: 'Daily Executive Operations Summary' },
              ].map((item) => (
                <div key={item.key} className="flex items-center justify-between p-3 bg-[#F0EFED] border border-[#E1E0DC]">
                  <span className="font-bold text-[#090808]">{item.label}</span>
                  <input
                    type="checkbox"
                    checked={Boolean(notifications[item.key as keyof typeof notifications])}
                    onChange={(e) => updateNotifications({ [item.key]: e.target.checked })}
                    className="w-4 h-4 accent-[#090808]"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB: MEDIA & UPLOADS */}
        {activeTab === 'media' && (
          <div className="space-y-4 max-w-2xl text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[11px] font-mono font-bold uppercase text-[#090808]">
                  MAX UPLOAD SIZE (MB)
                </label>
                <input
                  type="number"
                  value={mediaConfig.maxUploadSizeMb}
                  onChange={(e) => updateMediaConfig({ maxUploadSizeMb: Number(e.target.value) })}
                  className="w-full bg-[#F0EFED] border border-[#E1E0DC] p-2.5 font-mono font-bold focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-mono font-bold uppercase text-[#090808]">
                  MAX GALLERY IMAGES PER PRODUCT
                </label>
                <input
                  type="number"
                  value={mediaConfig.maxGalleryImagesPerProduct}
                  onChange={(e) => updateMediaConfig({ maxGalleryImagesPerProduct: Number(e.target.value) })}
                  className="w-full bg-[#F0EFED] border border-[#E1E0DC] p-2.5 font-mono font-bold focus:outline-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB: SECURITY & SESSIONS */}
        {activeTab === 'security' && (
          <div className="space-y-4 max-w-2xl text-xs">
            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-[11px] font-mono font-bold uppercase text-[#090808]">
                  ADMIN SESSION TIMEOUT (MINUTES)
                </label>
                <input
                  type="number"
                  value={security.sessionTimeoutMinutes}
                  onChange={(e) => updateSecurity({ sessionTimeoutMinutes: Number(e.target.value) })}
                  className="w-full bg-[#F0EFED] border border-[#E1E0DC] p-2.5 font-mono font-bold focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-between p-3 bg-[#F0EFED] border border-[#E1E0DC]">
                <div>
                  <p className="font-bold text-[#090808]">REQUIRE RE-AUTHENTICATION</p>
                  <p className="text-[11px] text-[#302F2E]">Prompt for confirmation before performing permanent deletions or staff role changes.</p>
                </div>
                <input
                  type="checkbox"
                  checked={security.requireReauthForSensitiveActions}
                  onChange={(e) => updateSecurity({ requireReauthForSensitiveActions: e.target.checked })}
                  className="w-4 h-4 accent-[#090808]"
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB: ADMIN ACCESS QUICK JUMP */}
        {activeTab === 'access' && (
          <div className="space-y-4 max-w-2xl text-xs">
            <div className="p-6 bg-[#F0EFED] border border-[#E1E0DC] space-y-3">
              <Users size={28} className="text-[#090808]" />
              <h3 className="font-display text-base font-bold uppercase text-[#090808]">
                STAFF & RBAC PERMISSIONS CENTER
              </h3>
              <p className="text-xs text-[#302F2E]">
                Manage team invitations, roles (SUPER_ADMIN, ADMIN, STAFF), active status, and granular module capability toggles.
              </p>
              <Link
                to="/admin/staff"
                className="inline-flex items-center gap-2 px-4 py-2 bg-[#090808] text-white text-xs font-mono font-bold uppercase hover:opacity-85"
              >
                <span>OPEN STAFF & RBAC MATRIX</span>
                <ExternalLink size={12} />
              </Link>
            </div>
          </div>
        )}

        {/* TAB: SEO & METADATA */}
        {activeTab === 'seo' && (
          <div className="space-y-4 max-w-2xl text-xs">
            <div className="space-y-1">
              <label className="text-[11px] font-mono font-bold uppercase text-[#090808]">DEFAULT PAGE META TITLE</label>
              <input
                type="text"
                value={seo.metaTitle}
                onChange={(e) => updateSEO({ metaTitle: e.target.value })}
                className="w-full bg-[#F0EFED] border border-[#E1E0DC] p-2.5 font-bold focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-mono font-bold uppercase text-[#090808]">DEFAULT META DESCRIPTION</label>
              <textarea
                rows={3}
                value={seo.metaDescription}
                onChange={(e) => updateSEO({ metaDescription: e.target.value })}
                className="w-full bg-[#F0EFED] border border-[#E1E0DC] p-2.5 focus:outline-none"
              />
            </div>

            {/* Social OG Image Selector */}
            <div className="p-3 bg-[#F0EFED] border border-[#E1E0DC] space-y-2">
              <label className="text-[11px] font-mono font-bold uppercase text-[#090808] block">
                SOCIAL SHARE PREVIEW (OG IMAGE)
              </label>
              <div className="flex items-center gap-3">
                <div className="w-24 h-16 bg-white border border-[#E1E0DC] overflow-hidden">
                  <img src={seo.ogImageUrl} alt="OG Preview" className="w-full h-full object-cover" />
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setMediaTarget('OG_IMAGE')
                    setMediaPickerOpen(true)
                  }}
                  className="px-3 py-1.5 bg-[#090808] text-white text-[10px] font-mono font-bold uppercase hover:opacity-85 flex items-center gap-1.5"
                >
                  <Upload size={12} />
                  <span>SELECT OG IMAGE VIA MEDIA PICKER</span>
                </button>
              </div>
            </div>
          </div>
        )}

      </div>

    </div>
  )
}

export default AdminSettings

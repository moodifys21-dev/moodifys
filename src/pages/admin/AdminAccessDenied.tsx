import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { ShieldAlert, ArrowLeft, RefreshCw, KeyRound } from 'lucide-react'
import { useAdminAuth } from '@/hooks/useAdminAuth'
import { useAuthStore } from '@/stores/authStore'
import { AdminRole, ROLE_LABELS } from '@/types/admin'

export const AdminAccessDenied: React.FC = () => {
  const { activeRole, setDemoRole, refreshAdminSession } = useAdminAuth()
  const { user } = useAuthStore()
  const location = useLocation()

  const demoRoles: AdminRole[] = [
    'SUPER_ADMIN',
    'ADMIN',
    'MANAGER',
    'FULFILLMENT_MANAGER',
    'INVENTORY_MANAGER',
    'CONTENT_MANAGER',
    'CUSTOMER_SUPPORT',
  ]

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-4">
      <div className="max-w-lg w-full bg-white border border-[#BEBDBB] p-8 text-center space-y-6 shadow-sm">
        
        {/* Security Shield Icon */}
        <div className="w-16 h-16 mx-auto bg-[#090808] text-white flex items-center justify-center">
          <ShieldAlert size={32} />
        </div>

        {/* Title */}
        <div className="space-y-2">
          <span className="text-[10px] font-mono font-bold tracking-[0.25em] text-[#9E2A2B] uppercase">
            SECURITY PROTOCOL // 403 FORBIDDEN
          </span>
          <h1 className="font-display text-2xl font-bold uppercase tracking-tight text-[#090808]">
            ACCESS RESTRICTED
          </h1>
          <p className="text-xs text-[#302F2E] leading-relaxed">
            Your current account credentials do not possess the required cryptographic permissions to access the path:{' '}
            <span className="font-mono bg-[#F0EFED] px-1.5 py-0.5 text-[#090808]">
              {location.pathname}
            </span>
          </p>
        </div>

        {/* User Context */}
        <div className="bg-[#F0EFED] p-4 text-left font-mono text-[11px] space-y-1.5 border border-[#E1E0DC]">
          <div className="flex justify-between">
            <span className="text-[#BEBDBB]">AUTHENTICATED:</span>
            <span className="font-bold text-[#090808]">{user?.email || 'ANONYMOUS'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#BEBDBB]">ASSIGNED ROLE:</span>
            <span className="font-bold text-[#9E2A2B]">{activeRole || 'UNPRIVILEGED CUSTOMER'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#BEBDBB]">RLS ENFORCEMENT:</span>
            <span className="font-bold text-emerald-700">ACTIVE // SECURE</span>
          </div>
        </div>

        {/* Role Switcher for QA / Testing */}
        <div className="border-t border-[#E1E0DC] pt-5 space-y-3">
          <div className="flex items-center justify-center gap-1.5 text-[10px] font-mono text-[#BEBDBB] uppercase">
            <KeyRound size={12} />
            <span>SWITCH DEMO SECURITY CONTEXT</span>
          </div>
          <div className="flex flex-wrap gap-1.5 justify-center">
            {demoRoles.map((role) => (
              <button
                key={role}
                type="button"
                onClick={() => setDemoRole(role)}
                className={`text-[9px] font-mono font-bold px-2 py-1 uppercase transition-colors ${
                  activeRole === role
                    ? 'bg-[#090808] text-white'
                    : 'bg-[#E1E0DC] text-[#302F2E] hover:bg-[#090808] hover:text-white'
                }`}
              >
                {ROLE_LABELS[role]}
              </button>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
          <button
            type="button"
            onClick={() => refreshAdminSession()}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-bold tracking-wider uppercase border border-[#090808] text-[#090808] hover:bg-[#F0EFED] transition-colors"
          >
            <RefreshCw size={13} />
            <span>RE-AUTHENTICATE</span>
          </button>
          <Link
            to="/shop"
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-bold tracking-wider uppercase bg-[#090808] text-white hover:opacity-90 transition-opacity"
          >
            <ArrowLeft size={13} />
            <span>RETURN TO STOREFRONT</span>
          </Link>
        </div>

      </div>
    </div>
  )
}

export default AdminAccessDenied

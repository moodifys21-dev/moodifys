import React from 'react'
import { Link } from 'react-router-dom'
import { useAuthStore } from '@/stores/authStore'
import { useOrderStore } from '@/stores/orderStore'
import { formatPrice, formatDate } from '@/lib/utils'
import { Package, Sparkles, ArrowRight } from 'lucide-react'

export const AccountOverview: React.FC = () => {
  const { user } = useAuthStore()
  const { orders } = useOrderStore()

  const recentOrder = orders[0]

  return (
    <div className="space-y-6">
      {/* Profile Overview Card */}
      <div className="bg-white border border-[#E1E0DC] p-6 rounded-sm space-y-4">
        <div className="flex items-center justify-between border-b border-[#E1E0DC] pb-4">
          <div>
            <p className="text-[11px] font-bold tracking-[0.2em] text-[#BEBDBB] uppercase">
              MEMBER PROFILE
            </p>
            <h2 className="font-display text-lg font-bold uppercase text-[#090808]">
              {user?.fullName || 'Vikramaditya Sen'}
            </h2>
          </div>
          <span className="text-xs font-mono font-bold bg-[#F0EFED] px-2.5 py-1 rounded text-[#302F2E]">
            ARCHIVE TIER: FOUNDER
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono text-[#302F2E]">
          <div>
            <span className="text-[#BEBDBB] block uppercase text-[10px]">EMAIL</span>
            <strong>{user?.email || 'enter@moodifys.com'}</strong>
          </div>
          <div>
            <span className="text-[#BEBDBB] block uppercase text-[10px]">PHONE</span>
            <strong>{user?.phone || '+91 98765 43210'}</strong>
          </div>
          <div>
            <span className="text-[#BEBDBB] block uppercase text-[10px]">TOTAL ACQUISITIONS</span>
            <strong>{orders.length} ORDERS</strong>
          </div>
        </div>
      </div>

      {/* Quick Action Tiles */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link
          to="/account/orders"
          className="bg-white border border-[#E1E0DC] p-5 rounded-sm hover:border-[#090808] transition-all group"
        >
          <div className="flex items-center justify-between mb-3">
            <Package size={20} className="text-[#090808]" />
            <ArrowRight size={14} className="text-[#BEBDBB] group-hover:text-[#090808] transition-colors" />
          </div>
          <h3 className="font-display text-sm font-bold uppercase text-[#090808]">
            TRACK ORDERS ({orders.length})
          </h3>
          <p className="text-[11px] text-[#302F2E] mt-1">
            Real-time fulfillment & tracking status.
          </p>
        </Link>

        <Link
          to="/account/designs"
          className="bg-white border border-[#E1E0DC] p-5 rounded-sm hover:border-[#090808] transition-all group"
        >
          <div className="flex items-center justify-between mb-3">
            <Sparkles size={20} className="text-[#090808]" />
            <ArrowRight size={14} className="text-[#BEBDBB] group-hover:text-[#090808] transition-colors" />
          </div>
          <h3 className="font-display text-sm font-bold uppercase text-[#090808]">
            SAVED CREATIONS (3)
          </h3>
          <p className="text-[11px] text-[#302F2E] mt-1">
            Re-order or customize in studio.
          </p>
        </Link>

        <Link
          to="/customize"
          className="bg-[#090808] text-white border border-[#090808] p-5 rounded-sm hover:bg-[#302F2E] transition-all group"
        >
          <div className="flex items-center justify-between mb-3">
            <Sparkles size={20} />
            <ArrowRight size={14} />
          </div>
          <h3 className="font-display text-sm font-bold uppercase">
            OPEN STUDIO
          </h3>
          <p className="text-[11px] text-[#E1E0DC] mt-1">
            Create your next bespoke piece.
          </p>
        </Link>
      </div>

      {/* Latest Order Highlight */}
      {recentOrder && (
        <div className="bg-white border border-[#E1E0DC] p-6 rounded-sm space-y-4">
          <div className="flex items-center justify-between border-b border-[#E1E0DC] pb-3">
            <div>
              <p className="text-[11px] font-bold tracking-[0.2em] text-[#BEBDBB] uppercase">
                MOST RECENT ORDER
              </p>
              <h3 className="font-display text-base font-bold uppercase text-[#090808]">
                {recentOrder.id}
              </h3>
            </div>
            <span className="text-[10px] font-bold uppercase px-2.5 py-1 rounded bg-amber-50 text-amber-900 border border-amber-200">
              STATUS: {recentOrder.status.toUpperCase()}
            </span>
          </div>

          <div className="divide-y divide-[#F0EFED]">
            {recentOrder.items.map((item) => (
              <div key={item.id} className="py-2.5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-14 bg-[#F0EFED] border border-[#E1E0DC] rounded-sm overflow-hidden flex-shrink-0">
                    <img
                      src={item.productImage}
                      alt={item.productName}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <p className="font-display text-xs font-bold uppercase text-[#090808]">
                      {item.productName}
                    </p>
                    <p className="text-[10px] text-[#302F2E] font-mono uppercase">
                      {item.color} • {item.size} • QTY: {item.quantity}
                    </p>
                  </div>
                </div>
                <span className="font-mono font-bold text-xs text-[#090808]">
                  {formatPrice(item.unitPrice * item.quantity)}
                </span>
              </div>
            ))}
          </div>

          <div className="pt-2 flex items-center justify-between text-xs">
            <span className="text-[#302F2E]">PLACED ON {formatDate(recentOrder.createdAt)}</span>
            <Link
              to="/account/orders"
              className="font-bold text-[#090808] hover:underline underline-offset-4 uppercase"
            >
              VIEW DETAILS →
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}

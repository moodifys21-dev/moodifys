import React, { useState } from 'react'
import { useOrderStore } from '@/stores/orderStore'
import { formatPrice, formatDate } from '@/lib/utils'
import { OrderStatus } from '@/types/order'
import { Package, Truck, CheckCircle2, Clock, ChevronDown, ChevronUp } from 'lucide-react'

export const AccountOrders: React.FC = () => {
  const { orders } = useOrderStore()
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null)

  const filteredOrders = orders.filter((o) => {
    if (filterStatus === 'all') return true
    return o.status === filterStatus
  })

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'delivered':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded uppercase">
            <CheckCircle2 size={11} />
            DELIVERED
          </span>
        )
      case 'shipped':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-blue-800 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded uppercase">
            <Truck size={11} />
            IN TRANSIT
          </span>
        )
      case 'processing':
      case 'confirmed':
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded uppercase">
            <Clock size={11} />
            IN PRODUCTION
          </span>
        )
    }
  }

  return (
    <div className="space-y-6">
      {/* Header & Filter Tabs */}
      <div className="bg-white border border-[#E1E0DC] p-5 rounded-sm flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-lg font-bold uppercase text-[#090808]">
            ORDER ARCHIVE ({filteredOrders.length})
          </h2>
          <p className="text-xs text-[#302F2E]">
            Track status, fulfillment progress, and item invoices.
          </p>
        </div>

        {/* Status Pills */}
        <div className="flex items-center gap-1 bg-[#F0EFED] p-1 border border-[#BEBDBB] rounded-sm text-xs font-bold uppercase">
          {['all', 'processing', 'shipped', 'delivered'].map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setFilterStatus(st)}
              className={`px-3 py-1 rounded-sm transition-colors ${
                filterStatus === st
                  ? 'bg-[#090808] text-white'
                  : 'text-[#302F2E] hover:text-[#090808]'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <div className="bg-white border border-[#E1E0DC] p-12 text-center rounded-sm space-y-3">
          <Package size={32} className="mx-auto text-[#BEBDBB]" />
          <p className="font-display text-sm font-bold uppercase text-[#090808]">
            NO ORDERS FOUND
          </p>
          <p className="text-xs text-[#302F2E]">
            No orders match the selected status filter.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => {
            const isExpanded = expandedOrderId === order.id
            return (
              <div
                key={order.id}
                className="bg-white border border-[#E1E0DC] rounded-sm overflow-hidden"
              >
                {/* Order Top Bar */}
                <div className="p-5 flex flex-wrap items-center justify-between gap-4 border-b border-[#E1E0DC] bg-[#FAFAFA]">
                  <div className="flex items-center gap-4">
                    <div>
                      <p className="text-[10px] text-[#BEBDBB] uppercase font-mono">ORDER ID</p>
                      <p className="font-display text-sm font-bold uppercase text-[#090808]">
                        {order.id}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] text-[#BEBDBB] uppercase font-mono">DATE PLACED</p>
                      <p className="text-xs font-bold text-[#302F2E]">
                        {formatDate(order.createdAt)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    {getStatusBadge(order.status)}
                    <div className="text-right">
                      <p className="text-[10px] text-[#BEBDBB] uppercase font-mono">TOTAL</p>
                      <p className="font-mono font-bold text-xs sm:text-sm text-[#090808]">
                        {formatPrice(order.total)}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setExpandedOrderId(isExpanded ? null : order.id)}
                      className="p-1.5 border border-[#BEBDBB] text-[#302F2E] hover:text-[#090808] rounded transition-colors"
                      aria-label="Toggle details"
                    >
                      {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>
                  </div>
                </div>

                {/* Items Preview */}
                <div className="p-5 divide-y divide-[#F0EFED]">
                  {order.items.map((item) => (
                    <div key={item.id} className="py-3 first:pt-0 last:pb-0 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-16 bg-[#F0EFED] border border-[#E1E0DC] rounded-sm overflow-hidden flex-shrink-0">
                          <img
                            src={item.productImage}
                            alt={item.productName}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <p className="font-display text-xs sm:text-sm font-bold uppercase text-[#090808]">
                            {item.productName}
                          </p>
                          <p className="text-xs text-[#302F2E] font-mono uppercase">
                            COLOR: {item.color} • SIZE: {item.size} • QTY: {item.quantity}
                          </p>
                        </div>
                      </div>
                      <span className="font-mono font-bold text-xs sm:text-sm text-[#090808]">
                        {formatPrice(item.unitPrice * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Expanded Details Section */}
                {isExpanded && (
                  <div className="p-5 bg-[#F0EFED] border-t border-[#E1E0DC] grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div>
                      <p className="font-bold tracking-wider text-[11px] uppercase text-[#090808] mb-1">
                        SHIPPING ADDRESS
                      </p>
                      <p className="text-[#302F2E]">{order.shippingAddress.fullName}</p>
                      <p className="text-[#302F2E]">{order.shippingAddress.addressLine1}</p>
                      <p className="text-[#302F2E]">
                        {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.postalCode}
                      </p>
                      <p className="font-mono text-[#302F2E]">{order.shippingAddress.phone}</p>
                    </div>

                    <div>
                      <p className="font-bold tracking-wider text-[11px] uppercase text-[#090808] mb-1">
                        COST BREAKDOWN
                      </p>
                      <div className="space-y-1 text-[#302F2E]">
                        <div className="flex justify-between">
                          <span>Subtotal:</span>
                          <span className="font-mono">{formatPrice(order.subtotal)}</span>
                        </div>
                        {order.discount > 0 && (
                          <div className="flex justify-between text-emerald-700">
                            <span>Discount:</span>
                            <span className="font-mono">-{formatPrice(order.discount)}</span>
                          </div>
                        )}
                        <div className="flex justify-between">
                          <span>Shipping:</span>
                          <span className="font-mono">{order.shipping === 0 ? 'FREE' : formatPrice(order.shipping)}</span>
                        </div>
                        <div className="flex justify-between font-bold text-[#090808] pt-1 border-t border-[#BEBDBB]">
                          <span>Grand Total:</span>
                          <span className="font-mono">{formatPrice(order.total)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

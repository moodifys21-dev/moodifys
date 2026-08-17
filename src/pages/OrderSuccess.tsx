import React from 'react'
import { useParams, Link } from 'react-router-dom'
import { Container } from '@/components/ui/Container'
import { Button } from '@/components/ui/Button'
import { useOrderStore } from '@/stores/orderStore'
import { formatPrice, formatDate } from '@/lib/utils'
import {
  CheckCircle2,
  ArrowRight,
} from 'lucide-react'

export const OrderSuccess: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>()
  const { getOrderById, orders } = useOrderStore()

  const order = orderId ? getOrderById(orderId) : orders[0]

  const estimatedDelivery = new Date()
  estimatedDelivery.setDate(estimatedDelivery.getDate() + 4)

  return (
    <div className="w-full py-12 md:py-16 bg-[#F0EFED]">
      <Container size="tight">
        
        {/* Main Confirmation Card */}
        <div className="bg-white border border-[#E1E0DC] p-6 sm:p-10 rounded-sm space-y-8 shadow-sm">
          
          {/* Header Banner */}
          <div className="text-center space-y-3 pb-6 border-b border-[#E1E0DC]">
            <div className="w-16 h-16 bg-[#090808] text-white rounded-full flex items-center justify-center mx-auto mb-2">
              <CheckCircle2 size={32} />
            </div>
            <p className="text-[11px] font-bold tracking-[0.25em] text-[#BEBDBB] uppercase">
              TRANSACTION CONFIRMED
            </p>
            <h1 className="font-display text-2xl sm:text-4xl font-bold uppercase tracking-tight text-[#090808]">
              THANK YOU FOR YOUR ORDER
            </h1>
            <p className="text-xs text-[#302F2E] font-mono">
              ORDER REFERENCE: <strong className="text-[#090808]">{order?.id || orderId}</strong>
            </p>
          </div>

          {/* Timeline Status */}
          <div className="bg-[#F0EFED] p-6 rounded-sm space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold tracking-wider uppercase text-[#090808]">
                ESTIMATED ARRIVAL
              </span>
              <span className="text-xs font-mono font-bold text-[#090808]">
                {formatDate(estimatedDelivery.toISOString())}
              </span>
            </div>

            {/* Stepper */}
            <div className="grid grid-cols-4 gap-2 pt-2 text-center">
              <div className="space-y-1">
                <div className="h-1.5 bg-[#090808] rounded-full" />
                <span className="text-[9px] font-bold tracking-wider uppercase text-[#090808] block">
                  ORDER PLACED
                </span>
              </div>
              <div className="space-y-1">
                <div className="h-1.5 bg-[#090808] rounded-full animate-pulse" />
                <span className="text-[9px] font-bold tracking-wider uppercase text-[#090808] block">
                  IN PRODUCTION
                </span>
              </div>
              <div className="space-y-1">
                <div className="h-1.5 bg-[#BEBDBB]/40 rounded-full" />
                <span className="text-[9px] font-bold tracking-wider uppercase text-[#BEBDBB] block">
                  DISPATCHED
                </span>
              </div>
              <div className="space-y-1">
                <div className="h-1.5 bg-[#BEBDBB]/40 rounded-full" />
                <span className="text-[9px] font-bold tracking-wider uppercase text-[#BEBDBB] block">
                  DELIVERED
                </span>
              </div>
            </div>
          </div>

          {/* Order Details Grid */}
          {order && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2 text-xs">
              <div className="space-y-2 p-4 bg-[#F0EFED] rounded-sm">
                <p className="font-bold tracking-wider text-[11px] uppercase text-[#090808]">
                  SHIPPING DESTINATION
                </p>
                <div className="text-[#302F2E] space-y-0.5">
                  <p className="font-semibold text-[#090808]">{order.shippingAddress.fullName}</p>
                  <p>{order.shippingAddress.addressLine1}</p>
                  {order.shippingAddress.addressLine2 && <p>{order.shippingAddress.addressLine2}</p>}
                  <p>{order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.postalCode}</p>
                  <p className="font-mono pt-1 text-[11px]">{order.shippingAddress.phone}</p>
                </div>
              </div>

              <div className="space-y-2 p-4 bg-[#F0EFED] rounded-sm">
                <p className="font-bold tracking-wider text-[11px] uppercase text-[#090808]">
                  PAYMENT & INVOICE
                </p>
                <div className="space-y-1 text-[#302F2E]">
                  <div className="flex justify-between">
                    <span>ITEMS ({order.items.length}):</span>
                    <span className="font-mono">{formatPrice(order.subtotal)}</span>
                  </div>
                  {order.discount > 0 && (
                    <div className="flex justify-between text-emerald-700">
                      <span>SAVINGS:</span>
                      <span className="font-mono">-{formatPrice(order.discount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>SHIPPING:</span>
                    <span className="font-mono">{order.shipping === 0 ? 'FREE' : formatPrice(order.shipping)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-[#090808] pt-1 border-t border-[#BEBDBB]/40">
                    <span>TOTAL PAID:</span>
                    <span className="font-mono">{formatPrice(order.total)}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Ordered Pieces List */}
          {order && (
            <div className="space-y-3 pt-2">
              <p className="text-[11px] font-bold tracking-[0.2em] text-[#BEBDBB] uppercase">
                ACQUIRED PIECES
              </p>
              <div className="divide-y divide-[#E1E0DC]">
                {order.items.map((item) => (
                  <div key={item.id} className="py-3 flex items-center justify-between gap-4">
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
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-3 pt-4 border-t border-[#E1E0DC]">
            <Link to="/account/orders" className="block">
              <Button variant="ink" size="md" className="w-full justify-between">
                <span>TRACK IN ACCOUNT PORTAL</span>
                <ArrowRight size={15} />
              </Button>
            </Link>

            <Link to="/shop" className="block">
              <Button variant="outline" size="md" className="w-full">
                EXPLORE MORE PIECES
              </Button>
            </Link>
          </div>

          <div className="text-center pt-2">
            <p className="text-[10px] text-[#BEBDBB] uppercase tracking-wider">
              A CONFIRMATION EMAIL WITH TRACKING DETAILS HAS BEEN DISPATCHED.
            </p>
          </div>

        </div>

      </Container>
    </div>
  )
}

export default OrderSuccess

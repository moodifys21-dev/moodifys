import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useOrderStore } from '@/stores/orderStore'
import { Order, OrderStatus } from '@/types/order'
import { formatPrice, formatDate } from '@/lib/utils'
import {
  Truck,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  ShieldAlert,
} from 'lucide-react'

export const AdminFulfillment: React.FC = () => {
  const { orders, updateOrderStatus, updateOrderShipping } = useOrderStore()
  const [activeTab, setActiveTab] = useState<'board' | 'table'>('board')
  const [trackingModalOrder, setTrackingModalOrder] = useState<Order | null>(null)
  const [courierName, setCourierName] = useState('Blue Dart Express')
  const [trackingCode, setTrackingCode] = useState('')
  const [qcModalOrder, setQcModalOrder] = useState<Order | null>(null)
  const [qcReason, setQcReason] = useState('PRINT MISALIGNED')

  // Stages in progressive order
  const stages: { key: OrderStatus; label: string; next?: OrderStatus; nextLabel?: string }[] = [
    { key: 'pending', label: 'NEW / PENDING', next: 'confirmed', nextLabel: 'CONFIRM ORDER' },
    { key: 'confirmed', label: 'CONFIRMED', next: 'production', nextLabel: 'START PRODUCTION' },
    { key: 'production', label: 'IN PRODUCTION', next: 'quality_check', nextLabel: 'SEND TO QC' },
    { key: 'quality_check', label: 'QUALITY CHECK', next: 'packed', nextLabel: 'PASS QC & PACK' },
    { key: 'packed', label: 'PACKED', next: 'ready_to_ship', nextLabel: 'READY TO SHIP' },
    { key: 'ready_to_ship', label: 'READY TO SHIP', next: 'shipped', nextLabel: 'DISPATCH / SHIP' },
    { key: 'shipped', label: 'IN TRANSIT / SHIPPED', next: 'delivered', nextLabel: 'MARK DELIVERED' },
    { key: 'delivered', label: 'DELIVERED' },
  ]

  // Map order status to stage key (normalizing 'processing' to 'production')
  const getStageKey = (status: OrderStatus): OrderStatus => {
    if (status === 'processing') return 'production'
    return status
  }

  const handleAdvanceStage = (order: Order, nextStage: OrderStatus) => {
    if (nextStage === 'shipped' && !order.trackingNumber) {
      setTrackingModalOrder(order)
      return
    }
    updateOrderStatus(order.id, nextStage, undefined, 'Fulfillment Station')
  }

  const handleSaveTrackingAndShip = (e: React.FormEvent) => {
    e.preventDefault()
    if (!trackingModalOrder) return
    updateOrderShipping(trackingModalOrder.id, courierName, trackingCode || `TRK-${Date.now()}`)
    updateOrderStatus(trackingModalOrder.id, 'shipped', undefined, 'Dispatch Hub')
    setTrackingModalOrder(null)
    setTrackingCode('')
  }

  const handleQcFail = (e: React.FormEvent) => {
    e.preventDefault()
    if (!qcModalOrder) return
    updateOrderStatus(qcModalOrder.id, 'production', `QC Failed: ${qcReason}`, 'QC Station')
    setQcModalOrder(null)
  }

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#BEBDBB]/30">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono font-bold tracking-[0.25em] bg-[#090808] text-white px-2 py-0.5 uppercase">
              WORKSHOP & LOGISTICS
            </span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold uppercase tracking-tight text-[#090808]">
            FULFILLMENT PIPELINE
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/admin/fulfillment/production"
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-mono font-bold uppercase bg-[#090808] text-white hover:opacity-85 transition-opacity"
          >
            <Sparkles size={13} className="text-amber-400" />
            <span>PRINT WORKSHOP QUEUE</span>
          </Link>

          {/* View Toggle */}
          <div className="flex border border-[#E1E0DC] bg-white p-0.5">
            <button
              type="button"
              onClick={() => setActiveTab('board')}
              className={`px-3 py-1 text-xs font-mono font-bold uppercase transition-colors ${
                activeTab === 'board' ? 'bg-[#090808] text-white' : 'text-[#302F2E] hover:bg-[#F0EFED]'
              }`}
            >
              KANBAN PIPELINE
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('table')}
              className={`px-3 py-1 text-xs font-mono font-bold uppercase transition-colors ${
                activeTab === 'table' ? 'bg-[#090808] text-white' : 'text-[#302F2E] hover:bg-[#F0EFED]'
              }`}
            >
              LIST VIEW
            </button>
          </div>
        </div>
      </div>

      {/* KANBAN PIPELINE BOARD */}
      {activeTab === 'board' ? (
        <div className="flex gap-4 overflow-x-auto pb-6 pt-1 select-none">
          {stages.map((stage) => {
            const stageOrders = orders.filter((o) => getStageKey(o.status) === stage.key)

            return (
              <div
                key={stage.key}
                className="w-72 sm:w-80 flex-shrink-0 bg-white border border-[#E1E0DC] flex flex-col max-h-[75vh]"
              >
                {/* Stage Header */}
                <div className="p-3 bg-[#F0EFED] border-b border-[#E1E0DC] flex items-center justify-between">
                  <span className="font-mono text-[10px] font-bold text-[#090808] uppercase tracking-wider">
                    {stage.label}
                  </span>
                  <span className="font-mono text-[10px] font-bold bg-[#090808] text-white px-1.5 py-0.2">
                    {stageOrders.length}
                  </span>
                </div>

                {/* Cards Column */}
                <div className="p-3 space-y-3 overflow-y-auto flex-1 bg-[#FAFAFA]">
                  {stageOrders.length === 0 ? (
                    <div className="py-10 text-center text-[10px] font-mono text-[#BEBDBB] uppercase border border-dashed border-[#E1E0DC]">
                      NO ORDERS IN STAGE
                    </div>
                  ) : (
                    stageOrders.map((order) => {
                      const isCustom = order.items.some(
                        (i) => i.productName.includes('[CUSTOM:') || i.designId
                      )

                      return (
                        <div
                          key={order.id}
                          className="bg-white border border-[#E1E0DC] p-3.5 space-y-2.5 shadow-xs hover:border-[#090808] transition-colors"
                        >
                          <div className="flex items-start justify-between">
                            <div>
                              <Link
                                to={`/admin/orders`}
                                className="font-mono font-bold text-xs text-[#090808] hover:underline"
                              >
                                #{order.id}
                              </Link>
                              <p className="text-[11px] font-medium text-[#302F2E]">
                                {order.shippingAddress.fullName}
                              </p>
                            </div>
                            <span className="font-mono font-bold text-xs text-[#090808]">
                              {formatPrice(order.total)}
                            </span>
                          </div>

                          {/* Items Summary */}
                          <div className="space-y-1 text-[11px] text-[#302F2E] border-t border-b border-[#F0EFED] py-2">
                            {order.items.map((item, idx) => (
                              <div key={idx} className="flex justify-between items-center">
                                <span className="truncate max-w-[170px] font-medium">
                                  {item.productName}
                                </span>
                                <span className="font-mono text-[#BEBDBB] text-[10px]">
                                  {item.color}/{item.size} ×{item.quantity}
                                </span>
                              </div>
                            ))}
                          </div>

                          {/* Badges */}
                          <div className="flex items-center justify-between text-[10px]">
                            {isCustom ? (
                              <span className="inline-flex items-center gap-1 font-mono font-bold text-amber-900 bg-amber-50 border border-amber-200 px-1.5 py-0.5 text-[9px] uppercase">
                                <Sparkles size={9} className="text-amber-600" />
                                BESPOKE
                              </span>
                            ) : (
                              <span className="font-mono text-[#BEBDBB] text-[9px] uppercase">
                                BLANK
                              </span>
                            )}
                            <span className="font-mono text-[#BEBDBB] text-[9px]">
                              {formatDate(order.createdAt)}
                            </span>
                          </div>

                          {/* Progressive Action Button */}
                          {stage.next && (
                            <div className="pt-1 flex gap-1.5">
                              {stage.key === 'quality_check' && (
                                <button
                                  type="button"
                                  onClick={() => setQcModalOrder(order)}
                                  className="px-2 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-800 text-[10px] font-mono font-bold uppercase border border-rose-200 transition-colors"
                                  title="Reject QC & return to Production"
                                >
                                  FAIL QC
                                </button>
                              )}

                              <button
                                type="button"
                                onClick={() => handleAdvanceStage(order, stage.next!)}
                                className="flex-1 inline-flex items-center justify-center gap-1 px-2 py-1.5 bg-[#090808] text-white hover:opacity-85 text-[10px] font-mono font-bold uppercase transition-opacity"
                              >
                                <span>{stage.nextLabel}</span>
                                <ChevronRight size={11} />
                              </button>
                            </div>
                          )}

                          {stage.key === 'delivered' && (
                            <div className="flex items-center justify-center gap-1 text-[10px] font-mono font-bold text-emerald-800 bg-emerald-50 py-1 border border-emerald-200 uppercase">
                              <CheckCircle2 size={11} />
                              <span>FULFILLED & ARCHIVED</span>
                            </div>
                          )}

                        </div>
                      )
                    })
                  )}
                </div>

              </div>
            )
          })}
        </div>
      ) : (
        /* TABLE VIEW */
        <div className="bg-white border border-[#E1E0DC] overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F0EFED] text-[#BEBDBB] uppercase text-[10px] font-mono border-b border-[#E1E0DC]">
              <tr>
                <th className="p-3.5 pl-5">ORDER ID</th>
                <th className="p-3.5">CUSTOMER</th>
                <th className="p-3.5">CURRENT STAGE</th>
                <th className="p-3.5">ITEMS</th>
                <th className="p-3.5">COURIER & TRACKING</th>
                <th className="p-3.5 pr-5 text-right">ADVANCE PROGRESSION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F0EFED]">
              {orders.map((order) => {
                const currentStage = stages.find((s) => s.key === getStageKey(order.status))
                return (
                  <tr key={order.id} className="hover:bg-[#FAFAFA] transition-colors">
                    <td className="p-3.5 pl-5 font-mono font-bold text-[#090808]">
                      #{order.id}
                    </td>
                    <td className="p-3.5 font-medium text-[#090808]">
                      {order.shippingAddress.fullName}
                      <span className="block text-[10px] font-mono text-[#BEBDBB]">
                        {order.shippingAddress.city}
                      </span>
                    </td>
                    <td className="p-3.5">
                      <span className="inline-flex items-center gap-1 text-[9px] font-mono font-bold bg-[#090808] text-white px-2 py-0.5 uppercase">
                        {order.status.toUpperCase().replace('_', ' ')}
                      </span>
                    </td>
                    <td className="p-3.5 text-[#302F2E]">
                      {order.items.length} garments
                    </td>
                    <td className="p-3.5 font-mono text-[11px]">
                      {order.courier ? (
                        <div>
                          <p className="font-bold text-[#090808]">{order.courier}</p>
                          <p className="text-[#BEBDBB] text-[10px]">{order.trackingNumber}</p>
                        </div>
                      ) : (
                        <span className="text-[#BEBDBB] italic">Pending dispatch</span>
                      )}
                    </td>
                    <td className="p-3.5 pr-5 text-right">
                      {currentStage?.next ? (
                        <button
                          type="button"
                          onClick={() => handleAdvanceStage(order, currentStage.next!)}
                          className="inline-flex items-center gap-1 px-3 py-1 bg-[#090808] text-white text-[10px] font-mono font-bold uppercase hover:opacity-85 transition-opacity"
                        >
                          <span>{currentStage.nextLabel}</span>
                          <ArrowRight size={11} />
                        </button>
                      ) : (
                        <span className="text-[10px] font-mono text-emerald-800 font-bold uppercase">
                          COMPLETED
                        </span>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* MODAL: DISPATCH & TRACKING NUMBER INPUT */}
      {trackingModalOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white border border-[#090808] p-6 max-w-md w-full space-y-4 shadow-2xl">
            <div className="flex items-center gap-2">
              <Truck size={16} />
              <h3 className="font-display text-sm font-bold uppercase tracking-wider text-[#090808]">
                DISPATCH ORDER #{trackingModalOrder.id}
              </h3>
            </div>
            <p className="text-xs text-[#302F2E]">
              Assign courier partner and tracking code to notify customer and mark order as Shipped.
            </p>

            <form onSubmit={handleSaveTrackingAndShip} className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="text-[10px] font-mono font-bold uppercase text-[#BEBDBB]">
                  COURIER PARTNER
                </label>
                <select
                  value={courierName}
                  onChange={(e) => setCourierName(e.target.value)}
                  className="w-full bg-[#F0EFED] border border-[#E1E0DC] p-2 font-mono text-xs focus:outline-none"
                >
                  <option value="Blue Dart Express">Blue Dart Express (Air Priority)</option>
                  <option value="Delhivery Surface">Delhivery Surface</option>
                  <option value="DTDC Premium">DTDC Premium</option>
                  <option value="FedEx Logistics">FedEx Express</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono font-bold uppercase text-[#BEBDBB]">
                  AWB TRACKING CODE
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. BD-891049219IN"
                  value={trackingCode}
                  onChange={(e) => setTrackingCode(e.target.value)}
                  className="w-full bg-[#F0EFED] border border-[#E1E0DC] p-2 font-mono text-xs focus:outline-none"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setTrackingModalOrder(null)}
                  className="flex-1 py-2 border border-[#090808] text-xs font-mono font-bold uppercase hover:bg-[#F0EFED]"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 bg-[#090808] text-white text-xs font-mono font-bold uppercase hover:opacity-85"
                >
                  CONFIRM DISPATCH
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: QC FAILURE WORKFLOW */}
      {qcModalOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white border border-[#9E2A2B] p-6 max-w-md w-full space-y-4 shadow-2xl">
            <div className="flex items-center gap-2 text-[#9E2A2B]">
              <ShieldAlert size={18} />
              <h3 className="font-display text-sm font-bold uppercase tracking-wider">
                QC INSPECTION REJECTION
              </h3>
            </div>
            <p className="text-xs text-[#302F2E]">
              Flagging order #{qcModalOrder.id} will return it to the Production Workshop queue with a mandatory defect reason.
            </p>

            <form onSubmit={handleQcFail} className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="text-[10px] font-mono font-bold uppercase text-[#BEBDBB]">
                  DEFECT / ISSUE REASON
                </label>
                <select
                  value={qcReason}
                  onChange={(e) => setQcReason(e.target.value)}
                  className="w-full bg-[#F0EFED] border border-[#E1E0DC] p-2 font-mono text-xs focus:outline-none"
                >
                  <option value="PRINT MISALIGNED">PRINT MISALIGNED</option>
                  <option value="COLOR DENSITY ISSUE">COLOR DENSITY / BLEED ISSUE</option>
                  <option value="DAMAGED GARMENT BLANK">DAMAGED GARMENT BLANK</option>
                  <option value="WRONG SIZE / FIT">WRONG SIZE / COLOR PULLED</option>
                  <option value="LOW RESOLUTION ARTIFACT">LOW RESOLUTION ARTWORK DEFECT</option>
                </select>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setQcModalOrder(null)}
                  className="flex-1 py-2 border border-[#090808] text-xs font-mono font-bold uppercase hover:bg-[#F0EFED]"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 bg-[#9E2A2B] text-white text-xs font-mono font-bold uppercase hover:opacity-90"
                >
                  REJECT & RETURN
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  )
}

export default AdminFulfillment

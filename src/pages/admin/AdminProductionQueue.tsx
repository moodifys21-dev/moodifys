import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useOrderStore } from '@/stores/orderStore'
import { Order } from '@/types/order'
import { formatDate } from '@/lib/utils'
import {
  Sparkles,
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  Download,
  Play,
  Pause,
} from 'lucide-react'

export const AdminProductionQueue: React.FC = () => {
  const { orders, updateOrderStatus, addInternalNote } = useOrderStore()
  const [pausedOrders, setPausedOrders] = useState<string[]>([])
  const [issueModalOrder, setIssueModalOrder] = useState<Order | null>(null)
  const [issueNote, setIssueNote] = useState('')

  // Filter orders that are in production or contain custom pieces
  const customOrders = orders.filter(
    (o) =>
      (o.status === 'production' || o.status === 'processing' || o.status === 'confirmed' || o.status === 'quality_check') &&
      o.items.some((i) => i.productName.includes('[CUSTOM:') || i.designId)
  )

  const togglePause = (orderId: string) => {
    if (pausedOrders.includes(orderId)) {
      setPausedOrders(pausedOrders.filter((id) => id !== orderId))
    } else {
      setPausedOrders([...pausedOrders, orderId])
    }
  }

  const handleCompleteToQc = (orderId: string) => {
    updateOrderStatus(orderId, 'quality_check', 'Production run completed. Sent to QC Station.', 'Workshop DTG Bed 1')
  }

  const handleFlagIssue = (e: React.FormEvent) => {
    e.preventDefault()
    if (!issueModalOrder || !issueNote.trim()) return
    addInternalNote(issueModalOrder.id, `WORKSHOP ISSUE: ${issueNote}`, 'DTG Machine Operator')
    setIssueModalOrder(null)
    setIssueNote('')
  }

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#BEBDBB]/30">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Link
              to="/admin/fulfillment"
              className="text-[10px] font-mono font-bold text-[#302F2E] hover:text-[#090808] flex items-center gap-1 uppercase"
            >
              <ArrowLeft size={11} />
              <span>BACK TO FULFILLMENT PIPELINE</span>
            </Link>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold uppercase tracking-tight text-[#090808] flex items-center gap-2.5">
            <Sparkles size={24} className="text-amber-500" />
            <span>PRINT WORKSHOP & PRODUCTION QUEUE</span>
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <span className="font-mono text-xs font-bold bg-[#090808] text-white px-3 py-1.5 uppercase">
            {customOrders.length} ACTIVE PRINT RUNS
          </span>
        </div>
      </div>

      {/* WORKSHOP STATUS BANNER */}
      <div className="bg-[#1A1919] text-white p-4 border border-[#302F2E] flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse" />
          <div>
            <p className="font-mono text-xs font-bold uppercase tracking-wider">
              DTG PRINT SYSTEM // BED STATUS: ONLINE
            </p>
            <p className="text-[11px] text-[#BEBDBB]">
              Direct-to-garment 300DPI raster engine active. Ready for batch rasterization.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs font-mono text-[#BEBDBB]">
          <span>RESOLUTION: 300 DPI</span>
          <span>•</span>
          <span>PROFILE: ARCHIVAL INKJET</span>
        </div>
      </div>

      {/* PRODUCTION QUEUE GRID */}
      {customOrders.length === 0 ? (
        <div className="bg-white border border-[#E1E0DC] p-16 text-center space-y-3">
          <CheckCircle2 size={36} className="mx-auto text-emerald-600" />
          <p className="font-mono text-xs font-bold text-[#090808] uppercase">
            WORKSHOP QUEUE CLEAR
          </p>
          <p className="text-xs text-[#302F2E] max-w-sm mx-auto">
            All bespoke print pieces have completed manufacturing and moved to Quality Check or Packaging.
          </p>
          <Link
            to="/admin/fulfillment"
            className="inline-block mt-2 px-4 py-2 bg-[#090808] text-white text-xs font-mono font-bold uppercase"
          >
            VIEW FULFILLMENT PIPELINE
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {customOrders.map((order) => {
            const isPaused = pausedOrders.includes(order.id)
            const customItems = order.items.filter(
              (i) => i.productName.includes('[CUSTOM:') || i.designId
            )

            return (
              <div
                key={order.id}
                className={`bg-white border p-6 space-y-5 transition-all shadow-xs ${
                  isPaused
                    ? 'border-amber-400 bg-amber-50/20'
                    : 'border-[#E1E0DC] hover:border-[#090808]'
                }`}
              >
                {/* Card Header */}
                <div className="flex items-start justify-between border-b border-[#E1E0DC] pb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-sm text-[#090808]">
                        ORDER #{order.id}
                      </span>
                      <span className="text-[9px] font-mono font-bold bg-amber-100 text-amber-900 px-1.5 py-0.2 uppercase border border-amber-300">
                        {order.status.toUpperCase()}
                      </span>
                      {isPaused && (
                        <span className="text-[9px] font-mono font-bold bg-rose-100 text-rose-900 px-1.5 py-0.2 uppercase">
                          PAUSED
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-[#302F2E] mt-0.5">
                      Client: {order.shippingAddress.fullName} • Placed {formatDate(order.createdAt)}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => togglePause(order.id)}
                    className={`p-1.5 border text-xs font-mono font-bold uppercase flex items-center gap-1 transition-colors ${
                      isPaused
                        ? 'bg-amber-500 text-white border-amber-600'
                        : 'border-[#E1E0DC] text-[#302F2E] hover:bg-[#F0EFED]'
                    }`}
                  >
                    {isPaused ? <Play size={12} /> : <Pause size={12} />}
                    <span>{isPaused ? 'RESUME' : 'PAUSE'}</span>
                  </button>
                </div>

                {/* Custom Items Spec */}
                <div className="space-y-4">
                  {customItems.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex flex-col sm:flex-row gap-4 bg-[#F0EFED] p-4 border border-[#E1E0DC]"
                    >
                      <img
                        src={item.productImage}
                        alt={item.productName}
                        className="w-28 h-36 object-cover bg-white border border-[#BEBDBB] flex-shrink-0"
                      />

                      <div className="space-y-2 flex-1 text-xs">
                        <p className="font-display font-bold text-sm text-[#090808]">
                          {item.productName}
                        </p>

                        <div className="grid grid-cols-2 gap-2 font-mono text-[11px] bg-white p-2 border border-[#E1E0DC]">
                          <div>
                            <span className="text-[#BEBDBB]">BLANK COLOR:</span>{' '}
                            <strong className="text-[#090808]">{item.color}</strong>
                          </div>
                          <div>
                            <span className="text-[#BEBDBB]">GARMENT SIZE:</span>{' '}
                            <strong className="text-[#090808]">{item.size}</strong>
                          </div>
                          <div>
                            <span className="text-[#BEBDBB]">PRINT ZONE:</span>{' center chest (front)'}
                          </div>
                          <div>
                            <span className="text-[#BEBDBB]">RUN QUANTITY:</span>{' '}
                            <strong className="text-[#090808]">{item.quantity} pc</strong>
                          </div>
                        </div>

                        {/* Download Artwork */}
                        <div className="flex items-center gap-3 pt-1">
                          <a
                            href={item.productImage}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 text-[11px] font-mono font-bold uppercase bg-white border border-[#090808] px-2.5 py-1 text-[#090808] hover:bg-[#090808] hover:text-white transition-colors"
                          >
                            <Download size={12} />
                            <span>DOWNLOAD HIGH-RES 300DPI</span>
                          </a>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Workshop Actions */}
                <div className="flex flex-wrap gap-2 pt-2 border-t border-[#E1E0DC]">
                  <button
                    type="button"
                    onClick={() => handleCompleteToQc(order.id)}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 bg-[#090808] text-white text-xs font-mono font-bold uppercase hover:opacity-85 transition-opacity"
                  >
                    <CheckCircle2 size={13} className="text-emerald-400" />
                    <span>COMPLETE & SEND TO QC</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setIssueModalOrder(order)}
                    className="px-3 py-2.5 border border-[#9E2A2B] text-[#9E2A2B] hover:bg-rose-50 text-xs font-mono font-bold uppercase transition-colors"
                  >
                    FLAG DEFECT
                  </button>
                </div>

              </div>
            )
          })}
        </div>
      )}

      {/* ISSUE MODAL */}
      {issueModalOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white border border-[#9E2A2B] p-6 max-w-md w-full space-y-4 shadow-2xl">
            <div className="flex items-center gap-2 text-[#9E2A2B]">
              <AlertTriangle size={18} />
              <h3 className="font-display text-sm font-bold uppercase tracking-wider">
                FLAG PRODUCTION DEFECT
              </h3>
            </div>
            <p className="text-xs text-[#302F2E]">
              Add internal note explaining the machine or fabric defect for Order #{issueModalOrder.id}.
            </p>

            <form onSubmit={handleFlagIssue} className="space-y-3 text-xs">
              <textarea
                required
                rows={3}
                placeholder="e.g. Blank fabric snagged during hooping; pulling replacement blank from inventory."
                value={issueNote}
                onChange={(e) => setIssueNote(e.target.value)}
                className="w-full bg-[#F0EFED] border border-[#E1E0DC] p-2.5 text-xs focus:outline-none"
              />

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setIssueModalOrder(null)}
                  className="flex-1 py-2 border border-[#090808] text-xs font-mono font-bold uppercase hover:bg-[#F0EFED]"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 bg-[#9E2A2B] text-white text-xs font-mono font-bold uppercase hover:opacity-90"
                >
                  SAVE DEFECT RECORD
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  )
}

export default AdminProductionQueue

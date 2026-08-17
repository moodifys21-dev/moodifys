import React, { useState, useMemo } from 'react'
import { useOrderStore } from '@/stores/orderStore'
import { Order, OrderStatus } from '@/types/order'
import { formatPrice, formatDate } from '@/lib/utils'
import {
  Search,
  Package,
  Sparkles,
  Eye,
  Clock,
  Truck,
  FileText,
  User,
  MapPin,
  CreditCard,
  ExternalLink,
  Printer,
  Download,
} from 'lucide-react'

export const AdminOrders: React.FC = () => {
  const { orders, updateOrderStatus, updateOrderShipping, addInternalNote } = useOrderStore()

  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [paymentFilter, setPaymentFilter] = useState<string>('all')
  const [onlyCustom, setOnlyCustom] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)

  // Tracking form modal state
  const [courierInput, setCourierInput] = useState('')
  const [trackingInput, setTrackingInput] = useState('')
  const [newNoteInput, setNewNoteInput] = useState('')

  // Filter orders
  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      // Search
      const q = searchQuery.toLowerCase().trim()
      if (q) {
        const matchesId = o.id.toLowerCase().includes(q)
        const matchesCustomer = o.shippingAddress.fullName.toLowerCase().includes(q)
        const matchesCity = o.shippingAddress.city.toLowerCase().includes(q)
        const matchesItem = o.items.some((i) => i.productName.toLowerCase().includes(q))
        if (!matchesId && !matchesCustomer && !matchesCity && !matchesItem) return false
      }

      // Status
      if (statusFilter !== 'all') {
        if (statusFilter === 'production' && o.status === 'processing') {
          // treat processing as production
        } else if (o.status !== statusFilter) {
          return false
        }
      }

      // Payment
      if (paymentFilter !== 'all' && o.paymentStatus !== paymentFilter) {
        return false
      }

      // Custom piece filter
      if (onlyCustom) {
        const isCustom = o.items.some((i) => i.productName.includes('[CUSTOM:') || i.designId)
        if (!isCustom) return false
      }

      return true
    })
  }, [orders, searchQuery, statusFilter, paymentFilter, onlyCustom])

  const openInspector = (order: Order) => {
    setSelectedOrder(order)
    setCourierInput(order.courier || '')
    setTrackingInput(order.trackingNumber || '')
  }

  const handleStatusChange = (orderId: string, newStatus: OrderStatus) => {
    updateOrderStatus(orderId, newStatus, undefined, 'Admin Control Center')
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder((prev) => (prev ? { ...prev, status: newStatus } : null))
    }
  }

  const handleSaveShipping = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedOrder) return
    updateOrderShipping(selectedOrder.id, courierInput, trackingInput)
    setSelectedOrder((prev) =>
      prev ? { ...prev, courier: courierInput, trackingNumber: trackingInput } : null
    )
  }

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedOrder || !newNoteInput.trim()) return
    addInternalNote(selectedOrder.id, newNoteInput.trim(), 'Operations Admin')
    setNewNoteInput('')
    // Refresh selected order view
    const updated = orders.find((o) => o.id === selectedOrder.id)
    if (updated) setSelectedOrder(updated)
  }

  const statusPills: { label: string; value: string; count?: number }[] = [
    { label: 'ALL', value: 'all', count: orders.length },
    { label: 'PENDING', value: 'pending', count: orders.filter((o) => o.status === 'pending').length },
    { label: 'PRODUCTION', value: 'production', count: orders.filter((o) => o.status === 'production' || o.status === 'processing').length },
    { label: 'QUALITY CHECK', value: 'quality_check', count: orders.filter((o) => o.status === 'quality_check').length },
    { label: 'PACKED', value: 'packed', count: orders.filter((o) => o.status === 'packed').length },
    { label: 'READY TO SHIP', value: 'ready_to_ship', count: orders.filter((o) => o.status === 'ready_to_ship').length },
    { label: 'SHIPPED', value: 'shipped', count: orders.filter((o) => o.status === 'shipped').length },
    { label: 'DELIVERED', value: 'delivered', count: orders.filter((o) => o.status === 'delivered').length },
    { label: 'CANCELLED', value: 'cancelled', count: orders.filter((o) => o.status === 'cancelled').length },
  ]

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#BEBDBB]/30">
        <div>
          <span className="text-[10px] font-mono font-bold tracking-[0.25em] text-[#BEBDBB] uppercase">
            STORE OPERATIONS
          </span>
          <h1 className="font-display text-2xl sm:text-3xl font-bold uppercase tracking-tight text-[#090808]">
            ORDER CONTROL & FULFILLMENT
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-mono font-bold uppercase border border-[#090808] hover:bg-[#F0EFED] transition-colors"
          >
            <Printer size={13} />
            <span>PRINT BATCH SLIPS</span>
          </button>
        </div>
      </div>

      {/* FILTER TABS & SEARCH BAR */}
      <div className="bg-white border border-[#E1E0DC] p-4 space-y-4 shadow-xs">
        
        {/* Top Search & Toggles */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="relative flex-1 min-w-[280px]">
            <Search
              size={14}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#BEBDBB]"
            />
            <input
              type="text"
              placeholder="Search by Order ID, Customer Name, City, Product..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#F0EFED] border border-[#E1E0DC] pl-10 pr-4 py-2 text-xs text-[#090808] placeholder-[#BEBDBB] focus:outline-none focus:border-[#090808]"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Payment Filter */}
            <div className="flex items-center gap-1 text-xs">
              <span className="text-[10px] font-mono text-[#BEBDBB] uppercase">PAYMENT:</span>
              <select
                value={paymentFilter}
                onChange={(e) => setPaymentFilter(e.target.value)}
                className="bg-[#F0EFED] border border-[#E1E0DC] px-2.5 py-1.5 text-xs font-mono font-bold uppercase focus:outline-none"
              >
                <option value="all">ALL</option>
                <option value="paid">PAID</option>
                <option value="pending">PENDING</option>
                <option value="refunded">REFUNDED</option>
              </select>
            </div>

            {/* Custom Only Toggle */}
            <button
              type="button"
              onClick={() => setOnlyCustom(!onlyCustom)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono font-bold uppercase border transition-colors ${
                onlyCustom
                  ? 'bg-[#090808] text-white border-[#090808]'
                  : 'bg-white text-[#302F2E] border-[#E1E0DC] hover:border-[#090808]'
              }`}
            >
              <Sparkles size={12} className={onlyCustom ? 'text-amber-400' : 'text-amber-600'} />
              <span>CUSTOM PIECES ONLY</span>
            </button>
          </div>
        </div>

        {/* Status Pills */}
        <div className="flex flex-wrap gap-1 border-t border-[#E1E0DC] pt-3">
          {statusPills.map((pill) => (
            <button
              key={pill.value}
              type="button"
              onClick={() => setStatusFilter(pill.value)}
              className={`px-3 py-1 text-[10px] font-mono font-bold uppercase transition-colors flex items-center gap-1.5 ${
                statusFilter === pill.value
                  ? 'bg-[#090808] text-white'
                  : 'bg-[#F0EFED] text-[#302F2E] hover:bg-[#E1E0DC]'
              }`}
            >
              <span>{pill.label}</span>
              {pill.count !== undefined && (
                <span
                  className={`px-1 py-0.2 rounded-xs text-[9px] ${
                    statusFilter === pill.value ? 'bg-[#302F2E] text-white' : 'bg-[#E1E0DC] text-[#090808]'
                  }`}
                >
                  {pill.count}
                </span>
              )}
            </button>
          ))}
        </div>

      </div>

      {/* ORDERS MASTER TABLE */}
      <div className="bg-white border border-[#E1E0DC] overflow-hidden shadow-xs">
        {filteredOrders.length === 0 ? (
          <div className="p-16 text-center space-y-3">
            <Package size={32} className="mx-auto text-[#BEBDBB]" />
            <p className="font-mono text-xs font-bold text-[#BEBDBB] uppercase">
              NO MATCHING ORDERS FOUND
            </p>
            <p className="text-xs text-[#302F2E] max-w-sm mx-auto">
              Try refining your search keyword or clearing the active status filters.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-[#F0EFED] text-[#BEBDBB] uppercase text-[10px] font-mono border-b border-[#E1E0DC]">
                <tr>
                  <th className="p-4 pl-6">ORDER ID</th>
                  <th className="p-4">CUSTOMER</th>
                  <th className="p-4">PIECES</th>
                  <th className="p-4">CUSTOM STUDIO</th>
                  <th className="p-4">TOTAL</th>
                  <th className="p-4">PAYMENT</th>
                  <th className="p-4">FULFILLMENT STAGE</th>
                  <th className="p-4">DATE</th>
                  <th className="p-4 pr-6 text-right">ACTIONS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E1E0DC]">
                {filteredOrders.map((order) => {
                  const hasCustom = order.items.some(
                    (i) => i.productName.includes('[CUSTOM:') || i.designId
                  )

                  return (
                    <tr key={order.id} className="hover:bg-[#FAFAFA] transition-colors">
                      
                      {/* ID */}
                      <td className="p-4 pl-6 font-mono font-bold text-[#090808]">
                        <button
                          type="button"
                          onClick={() => openInspector(order)}
                          className="hover:underline text-[#090808] flex items-center gap-1 text-left"
                        >
                          <span>{order.id}</span>
                          <ExternalLink size={11} className="text-[#BEBDBB]" />
                        </button>
                      </td>

                      {/* Customer */}
                      <td className="p-4">
                        <div className="font-medium text-[#090808]">{order.shippingAddress.fullName}</div>
                        <div className="text-[10px] text-[#BEBDBB] font-mono">
                          {order.shippingAddress.city}, {order.shippingAddress.state}
                        </div>
                      </td>

                      {/* Pieces */}
                      <td className="p-4 text-[#302F2E]">
                        <span className="font-mono font-bold text-[#090808]">{order.items.length}</span>{' '}
                        {order.items.length === 1 ? 'garment' : 'garments'}
                      </td>

                      {/* Custom Studio Indicator */}
                      <td className="p-4">
                        {hasCustom ? (
                          <span className="inline-flex items-center gap-1 text-[9px] font-mono font-bold uppercase bg-amber-50 text-amber-900 border border-amber-300 px-2 py-0.5">
                            <Sparkles size={10} className="text-amber-600" />
                            BESPOKE PRINT
                          </span>
                        ) : (
                          <span className="text-[10px] font-mono text-[#BEBDBB] uppercase">
                            STANDARD BLANK
                          </span>
                        )}
                      </td>

                      {/* Total */}
                      <td className="p-4 font-mono font-bold text-[#090808]">
                        {formatPrice(order.total)}
                      </td>

                      {/* Payment */}
                      <td className="p-4">
                        <span className={`inline-flex items-center text-[9px] font-mono font-bold px-2 py-0.5 uppercase ${
                          order.paymentStatus === 'paid'
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-300'
                            : 'bg-amber-50 text-amber-800 border border-amber-300'
                        }`}>
                          {order.paymentStatus.toUpperCase()}
                        </span>
                      </td>

                      {/* Fulfillment Selector */}
                      <td className="p-4">
                        <select
                          value={order.status === 'processing' ? 'production' : order.status}
                          onChange={(e) => handleStatusChange(order.id, e.target.value as OrderStatus)}
                          className="bg-[#F0EFED] border border-[#E1E0DC] text-[10px] font-mono font-bold uppercase px-2 py-1 focus:outline-none focus:border-[#090808]"
                        >
                          <option value="pending">PENDING</option>
                          <option value="confirmed">CONFIRMED</option>
                          <option value="production">PRODUCTION</option>
                          <option value="quality_check">QUALITY CHECK</option>
                          <option value="packed">PACKED</option>
                          <option value="ready_to_ship">READY TO SHIP</option>
                          <option value="shipped">SHIPPED</option>
                          <option value="out_for_delivery">OUT FOR DELIVERY</option>
                          <option value="delivered">DELIVERED</option>
                          <option value="cancelled">CANCELLED</option>
                        </select>
                      </td>

                      {/* Date */}
                      <td className="p-4 font-mono text-[11px] text-[#BEBDBB]">
                        {formatDate(order.createdAt)}
                      </td>

                      {/* Actions */}
                      <td className="p-4 pr-6 text-right">
                        <button
                          type="button"
                          onClick={() => openInspector(order)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-mono font-bold uppercase bg-[#090808] text-white hover:opacity-85 transition-opacity"
                        >
                          <Eye size={12} />
                          <span>INSPECT</span>
                        </button>
                      </td>

                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* INTERACTIVE ORDER DETAIL INSPECTOR MODAL */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white border border-[#090808] w-full max-w-4xl max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6 shadow-2xl relative my-8">
            
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-4 border-b border-[#E1E0DC]">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono font-bold tracking-widest bg-[#090808] text-white px-2 py-0.5 uppercase">
                    ORDER SPECIFICATION
                  </span>
                  <span className="font-mono text-xs text-[#BEBDBB]">
                    {formatDate(selectedOrder.createdAt)}
                  </span>
                </div>
                <h2 className="font-display text-2xl font-bold uppercase tracking-tight text-[#090808] mt-1">
                  ORDER #{selectedOrder.id}
                </h2>
              </div>

              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="text-xs font-mono font-bold px-3 py-1 border border-[#090808] hover:bg-[#090808] hover:text-white uppercase transition-colors"
              >
                CLOSE [ESC]
              </button>
            </div>

            {/* 3-Column Info Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              
              {/* Customer Info */}
              <div className="bg-[#F0EFED] p-4 border border-[#E1E0DC] space-y-2">
                <div className="flex items-center gap-1.5 font-mono text-[10px] font-bold text-[#BEBDBB] uppercase">
                  <User size={12} />
                  <span>CUSTOMER</span>
                </div>
                <p className="font-bold text-sm text-[#090808]">
                  {selectedOrder.shippingAddress.fullName}
                </p>
                <p className="font-mono text-xs text-[#302F2E]">
                  {selectedOrder.shippingAddress.phone}
                </p>
                <p className="text-[11px] text-[#BEBDBB] font-mono">
                  USER ID: {selectedOrder.userId}
                </p>
              </div>

              {/* Shipping Address */}
              <div className="bg-[#F0EFED] p-4 border border-[#E1E0DC] space-y-2">
                <div className="flex items-center gap-1.5 font-mono text-[10px] font-bold text-[#BEBDBB] uppercase">
                  <MapPin size={12} />
                  <span>DISPATCH ADDRESS</span>
                </div>
                <p className="text-xs text-[#090808]">
                  {selectedOrder.shippingAddress.addressLine1}
                </p>
                <p className="text-xs text-[#302F2E]">
                  {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} - {selectedOrder.shippingAddress.postalCode}
                </p>
                <p className="text-[10px] font-mono text-[#BEBDBB] uppercase">
                  {selectedOrder.shippingAddress.country}
                </p>
              </div>

              {/* Payment Info */}
              <div className="bg-[#F0EFED] p-4 border border-[#E1E0DC] space-y-2">
                <div className="flex items-center gap-1.5 font-mono text-[10px] font-bold text-[#BEBDBB] uppercase">
                  <CreditCard size={12} />
                  <span>PAYMENT SETTLEMENT</span>
                </div>
                <p className="font-mono font-bold text-sm text-[#090808]">
                  {formatPrice(selectedOrder.total)}
                </p>
                <p className="text-xs text-[#302F2E]">
                  {selectedOrder.paymentMethod || 'Online Gateway'}
                </p>
                <div className="flex items-center gap-2">
                  <span className="text-[9px] font-mono font-bold uppercase bg-emerald-100 text-emerald-800 px-1.5 py-0.5">
                    {selectedOrder.paymentStatus.toUpperCase()}
                  </span>
                  {selectedOrder.transactionRef && (
                    <span className="text-[9px] font-mono text-[#BEBDBB] truncate">
                      {selectedOrder.transactionRef}
                    </span>
                  )}
                </div>
              </div>

            </div>

            {/* ORDER ITEMS LIST & CUSTOM PRINT INSPECTION */}
            <div className="space-y-3">
              <h3 className="font-display text-sm font-bold uppercase tracking-wider text-[#090808]">
                GARMENT SPECIFICATIONS & CUSTOM ARTWORK
              </h3>

              <div className="divide-y divide-[#E1E0DC] border border-[#E1E0DC]">
                {selectedOrder.items.map((item, idx) => {
                  const isCustom = item.productName.includes('[CUSTOM:') || item.designId

                  return (
                    <div key={item.id || idx} className="p-4 bg-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <img
                          src={item.productImage}
                          alt={item.productName}
                          className="w-16 h-20 object-cover bg-[#F0EFED] border border-[#E1E0DC]"
                        />
                        <div className="space-y-1">
                          <p className="font-bold text-sm text-[#090808]">
                            {item.productName}
                          </p>
                          <div className="flex items-center gap-3 font-mono text-xs text-[#302F2E]">
                            <span>COLOR: <strong className="text-[#090808]">{item.color}</strong></span>
                            <span>•</span>
                            <span>SIZE: <strong className="text-[#090808]">{item.size}</strong></span>
                            <span>•</span>
                            <span>QTY: <strong className="text-[#090808]">{item.quantity}</strong></span>
                          </div>
                          {isCustom && (
                            <span className="inline-flex items-center gap-1 text-[9px] font-mono font-bold uppercase bg-amber-50 text-amber-900 border border-amber-200 px-2 py-0.5">
                              <Sparkles size={10} className="text-amber-600" />
                              PRINT READY CANVAS // ARCHIVAL RESOLUTION
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="text-right flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto">
                        <p className="font-mono font-bold text-base text-[#090808]">
                          {formatPrice(item.unitPrice * item.quantity)}
                        </p>
                        {isCustom && (
                          <a
                            href={item.productImage}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 text-[10px] font-mono font-bold uppercase text-[#090808] hover:underline underline-offset-2 mt-1"
                          >
                            <Download size={11} />
                            <span>DOWNLOAD HIGH-RES RASTER</span>
                          </a>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* SHIPPING & TRACKING ASSIGNMENT */}
            <div className="bg-[#F0EFED] p-5 border border-[#E1E0DC] space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-display text-xs font-bold uppercase tracking-wider text-[#090808] flex items-center gap-2">
                  <Truck size={14} />
                  <span>LOGISTICS & COURIER DISPATCH</span>
                </h4>
                {selectedOrder.trackingNumber && (
                  <span className="text-[10px] font-mono font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5">
                    ASSIGNED
                  </span>
                )}
              </div>

              <form onSubmit={handleSaveShipping} className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
                <div className="sm:col-span-5 space-y-1">
                  <label className="text-[10px] font-mono font-bold uppercase text-[#BEBDBB]">
                    COURIER PARTNER
                  </label>
                  <input
                    type="text"
                    value={courierInput}
                    onChange={(e) => setCourierInput(e.target.value)}
                    placeholder="e.g. Blue Dart, Delhivery, FedEx"
                    className="w-full bg-white border border-[#E1E0DC] px-3 py-1.5 text-xs text-[#090808] focus:outline-none focus:border-[#090808]"
                  />
                </div>

                <div className="sm:col-span-5 space-y-1">
                  <label className="text-[10px] font-mono font-bold uppercase text-[#BEBDBB]">
                    AWB / TRACKING CODE
                  </label>
                  <input
                    type="text"
                    value={trackingInput}
                    onChange={(e) => setTrackingInput(e.target.value)}
                    placeholder="e.g. BD-994812301IN"
                    className="w-full bg-white border border-[#E1E0DC] px-3 py-1.5 text-xs font-mono text-[#090808] focus:outline-none focus:border-[#090808]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <button
                    type="submit"
                    className="w-full px-3 py-1.5 bg-[#090808] text-white text-xs font-mono font-bold uppercase hover:opacity-85 transition-opacity"
                  >
                    SAVE
                  </button>
                </div>
              </form>
            </div>

            {/* INTERNAL STAFF NOTES & EVENT TIMELINE */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              
              {/* Internal Notes */}
              <div className="space-y-3">
                <h4 className="font-display text-xs font-bold uppercase tracking-wider text-[#090808] flex items-center gap-1.5">
                  <FileText size={13} />
                  <span>INTERNAL STAFF NOTES (CONFIDENTIAL)</span>
                </h4>

                <form onSubmit={handleAddNote} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Add private note for workshop staff..."
                    value={newNoteInput}
                    onChange={(e) => setNewNoteInput(e.target.value)}
                    className="flex-1 bg-[#F0EFED] border border-[#E1E0DC] px-3 py-1.5 text-xs text-[#090808] focus:outline-none focus:border-[#090808]"
                  />
                  <button
                    type="submit"
                    className="px-3 py-1.5 bg-[#090808] text-white text-xs font-mono font-bold uppercase hover:opacity-85 transition-opacity"
                  >
                    ADD
                  </button>
                </form>

                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {(selectedOrder.internalNotes || []).length === 0 ? (
                    <p className="text-[11px] font-mono text-[#BEBDBB] italic">
                      No internal notes recorded yet.
                    </p>
                  ) : (
                    selectedOrder.internalNotes?.map((note) => (
                      <div key={note.id} className="p-2.5 bg-[#F0EFED] border border-[#E1E0DC] space-y-1 text-xs">
                        <div className="flex items-center justify-between text-[10px] font-mono text-[#BEBDBB]">
                          <strong className="text-[#090808] uppercase">{note.author}</strong>
                          <span>{formatDate(note.createdAt)}</span>
                        </div>
                        <p className="text-[#302F2E]">{note.note}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Event Timeline */}
              <div className="space-y-3">
                <h4 className="font-display text-xs font-bold uppercase tracking-wider text-[#090808] flex items-center gap-1.5">
                  <Clock size={13} />
                  <span>ORDER EVENT TIMELINE</span>
                </h4>

                <div className="border-l-2 border-[#090808] pl-4 space-y-3 max-h-56 overflow-y-auto">
                  {(selectedOrder.events || []).map((evt) => (
                    <div key={evt.id} className="space-y-0.5 text-xs">
                      <p className="font-bold text-[#090808]">{evt.event}</p>
                      <div className="flex items-center gap-2 text-[10px] font-mono text-[#BEBDBB]">
                        <span>{evt.actor}</span>
                        <span>•</span>
                        <span>{formatDate(evt.timestamp)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  )
}

export default AdminOrders

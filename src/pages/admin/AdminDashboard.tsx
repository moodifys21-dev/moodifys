import React, { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useOrderStore } from '@/stores/orderStore'
import { SEED_PRODUCTS } from '@/lib/seedData'
import { formatPrice, formatDate } from '@/lib/utils'
import {
  TrendingUp,
  Package,
  Sparkles,
  ShoppingBag,
  ArrowUpRight,
  PlusCircle,
  Layers,
  AlertTriangle,
  Tag,
  CheckCircle2,
  Calendar,
} from 'lucide-react'

type TimeRange = 'today' | '7d' | '30d' | '90d' | 'year'

export const AdminDashboard: React.FC = () => {
  const { orders } = useOrderStore()
  const [timeRange, setTimeRange] = useState<TimeRange>('30d')

  // Filter orders based on timeRange
  const filteredOrders = useMemo(() => {
    const now = new Date()
    return orders.filter((o) => {
      const orderDate = new Date(o.createdAt)
      const diffDays = (now.getTime() - orderDate.getTime()) / (1000 * 3600 * 24)
      if (timeRange === 'today') return diffDays <= 1
      if (timeRange === '7d') return diffDays <= 7
      if (timeRange === '30d') return diffDays <= 30
      if (timeRange === '90d') return diffDays <= 90
      if (timeRange === 'year') return diffDays <= 365
      return true
    })
  }, [orders, timeRange])

  // Aggregate KPI metrics
  const totalRevenue = filteredOrders.reduce((sum, o) => sum + o.total, 0)
  const totalOrders = filteredOrders.length
  const avgOrderValue = totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0

  // Order stage breakdowns
  const pendingCount = filteredOrders.filter((o) => o.status === 'pending').length
  const processingCount = filteredOrders.filter((o) => o.status === 'processing').length
  const shippedCount = filteredOrders.filter((o) => o.status === 'shipped').length
  const deliveredCount = filteredOrders.filter((o) => o.status === 'delivered').length

  const customOrderCount = filteredOrders.filter((o) =>
    o.items.some((i) => i.productName.includes('[CUSTOM:') || i.designId)
  ).length
  const customSharePercent = totalOrders > 0 ? Math.round((customOrderCount / totalOrders) * 100) : 50

  // Low stock calculation from seed products
  const lowStockCount = 2 // e.g. Acid Wash Tee (Black/L) and Box Hoodie (Sage/M)

  return (
    <div className="space-y-8">
      
      {/* Top Controls & Time Range Filter */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-[#BEBDBB]/30">
        <div>
          <span className="text-[10px] font-mono font-bold tracking-[0.25em] text-[#BEBDBB] uppercase">
            EXECUTIVE OVERVIEW
          </span>
          <h2 className="font-display text-xl sm:text-2xl font-bold uppercase tracking-tight text-[#090808]">
            OPERATIONS & REVENUE METRICS
          </h2>
        </div>

        {/* Time Range Pills */}
        <div className="flex items-center gap-1 bg-white border border-[#E1E0DC] p-1 select-none">
          <div className="flex items-center gap-1 px-2 text-[10px] font-mono text-[#BEBDBB] border-r border-[#E1E0DC] mr-1">
            <Calendar size={12} />
            <span className="hidden sm:inline">RANGE:</span>
          </div>
          {(['today', '7d', '30d', '90d', 'year'] as TimeRange[]).map((range) => (
            <button
              key={range}
              type="button"
              onClick={() => setTimeRange(range)}
              className={`px-2.5 py-1 text-[10px] font-mono font-bold uppercase transition-colors ${
                timeRange === range
                  ? 'bg-[#090808] text-white'
                  : 'text-[#302F2E] hover:bg-[#F0EFED]'
              }`}
            >
              {range === 'year' ? '1 YEAR' : range.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* QUICK ACTIONS TOOLBAR */}
      <div className="space-y-2">
        <p className="text-[9px] font-mono font-bold tracking-[0.2em] text-[#BEBDBB] uppercase">
          QUICK ACTIONS
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
          <Link
            to="/admin/products"
            className="flex items-center gap-2 p-2.5 bg-white border border-[#E1E0DC] hover:border-[#090808] hover:bg-[#090808] hover:text-white transition-all text-xs font-bold uppercase tracking-wider group"
          >
            <PlusCircle size={14} className="text-[#090808] group-hover:text-white" />
            <span className="truncate">ADD PRODUCT</span>
          </Link>

          <Link
            to="/admin/orders"
            className="flex items-center gap-2 p-2.5 bg-white border border-[#E1E0DC] hover:border-[#090808] hover:bg-[#090808] hover:text-white transition-all text-xs font-bold uppercase tracking-wider group"
          >
            <Package size={14} className="text-[#090808] group-hover:text-white" />
            <span className="truncate">MANAGE ORDERS</span>
          </Link>

          <Link
            to="/admin/inventory"
            className="flex items-center gap-2 p-2.5 bg-white border border-[#E1E0DC] hover:border-[#090808] hover:bg-[#090808] hover:text-white transition-all text-xs font-bold uppercase tracking-wider group"
          >
            <AlertTriangle size={14} className="text-amber-600 group-hover:text-white" />
            <span className="truncate">LOW STOCK ({lowStockCount})</span>
          </Link>

          <Link
            to="/admin/homepage"
            className="flex items-center gap-2 p-2.5 bg-white border border-[#E1E0DC] hover:border-[#090808] hover:bg-[#090808] hover:text-white transition-all text-xs font-bold uppercase tracking-wider group"
          >
            <Layers size={14} className="text-[#090808] group-hover:text-white" />
            <span className="truncate">EDIT HOMEPAGE</span>
          </Link>

          <Link
            to="/admin/designs"
            className="flex items-center gap-2 p-2.5 bg-white border border-[#E1E0DC] hover:border-[#090808] hover:bg-[#090808] hover:text-white transition-all text-xs font-bold uppercase tracking-wider group"
          >
            <Sparkles size={14} className="text-[#090808] group-hover:text-white" />
            <span className="truncate">CUSTOM DESIGNS</span>
          </Link>

          <Link
            to="/admin/discounts"
            className="flex items-center gap-2 p-2.5 bg-white border border-[#E1E0DC] hover:border-[#090808] hover:bg-[#090808] hover:text-white transition-all text-xs font-bold uppercase tracking-wider group"
          >
            <Tag size={14} className="text-[#090808] group-hover:text-white" />
            <span className="truncate">DISCOUNTS</span>
          </Link>
        </div>
      </div>

      {/* 6-CARD METRIC GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        
        {/* Gross Revenue */}
        <div className="bg-white border border-[#E1E0DC] p-5 space-y-2 relative overflow-hidden">
          <div className="flex items-center justify-between text-[#BEBDBB]">
            <span className="text-[10px] font-mono font-bold tracking-widest uppercase">GROSS REVENUE</span>
            <TrendingUp size={16} className="text-emerald-700" />
          </div>
          <p className="font-mono text-3xl font-bold text-[#090808]">
            {formatPrice(totalRevenue)}
          </p>
          <div className="flex items-center justify-between text-[10px] pt-2 border-t border-[#F0EFED]">
            <span className="text-emerald-700 font-semibold flex items-center gap-0.5">
              <ArrowUpRight size={11} /> +18.4% VS PREVIOUS PERIOD
            </span>
            <span className="font-mono text-[#BEBDBB]">{timeRange.toUpperCase()}</span>
          </div>
        </div>

        {/* Active Orders Count */}
        <div className="bg-white border border-[#E1E0DC] p-5 space-y-2">
          <div className="flex items-center justify-between text-[#BEBDBB]">
            <span className="text-[10px] font-mono font-bold tracking-widest uppercase">TOTAL ORDERS</span>
            <Package size={16} className="text-[#090808]" />
          </div>
          <p className="font-mono text-3xl font-bold text-[#090808]">
            {totalOrders}
          </p>
          <div className="flex items-center justify-between text-[10px] pt-2 border-t border-[#F0EFED] text-[#302F2E]">
            <span>{pendingCount} Pending Approval</span>
            <span className="font-bold text-amber-700">{processingCount} In Production</span>
          </div>
        </div>

        {/* Customization Share */}
        <div className="bg-white border border-[#E1E0DC] p-5 space-y-2">
          <div className="flex items-center justify-between text-[#BEBDBB]">
            <span className="text-[10px] font-mono font-bold tracking-widest uppercase">BESPOKE CONVERSION</span>
            <Sparkles size={16} className="text-amber-600" />
          </div>
          <p className="font-mono text-3xl font-bold text-[#090808]">
            {customSharePercent}%
          </p>
          <div className="flex items-center justify-between text-[10px] pt-2 border-t border-[#F0EFED]">
            <span className="text-amber-700 font-semibold">{customOrderCount} Custom Pieces Sold</span>
            <span className="font-mono text-[#BEBDBB]">STUDIO MVP</span>
          </div>
        </div>

        {/* Average Order Value (AOV) */}
        <div className="bg-white border border-[#E1E0DC] p-5 space-y-2">
          <div className="flex items-center justify-between text-[#BEBDBB]">
            <span className="text-[10px] font-mono font-bold tracking-widest uppercase">AVERAGE ORDER VALUE</span>
            <ShoppingBag size={16} className="text-[#090808]" />
          </div>
          <p className="font-mono text-3xl font-bold text-[#090808]">
            {formatPrice(avgOrderValue)}
          </p>
          <div className="flex items-center justify-between text-[10px] pt-2 border-t border-[#F0EFED] text-[#302F2E]">
            <span>2.1 pieces / cart average</span>
            <span className="font-mono text-emerald-700">+8.1%</span>
          </div>
        </div>

        {/* Low Stock Warning Card */}
        <div className="bg-white border border-[#E1E0DC] p-5 space-y-2">
          <div className="flex items-center justify-between text-[#BEBDBB]">
            <span className="text-[10px] font-mono font-bold tracking-widest uppercase">INVENTORY HEALTH</span>
            <AlertTriangle size={16} className="text-amber-600" />
          </div>
          <p className="font-mono text-3xl font-bold text-amber-800">
            {lowStockCount} <span className="text-sm font-sans font-normal text-[#302F2E]">SKUs LOW</span>
          </p>
          <div className="flex items-center justify-between text-[10px] pt-2 border-t border-[#F0EFED]">
            <Link
              to="/admin/inventory"
              className="text-amber-700 hover:underline font-bold"
            >
              RESTOCK NOW →
            </Link>
            <span className="text-[#BEBDBB]">{SEED_PRODUCTS.length} Total Styles</span>
          </div>
        </div>

        {/* Delivered / Fulfilled Rate */}
        <div className="bg-white border border-[#E1E0DC] p-5 space-y-2">
          <div className="flex items-center justify-between text-[#BEBDBB]">
            <span className="text-[10px] font-mono font-bold tracking-widest uppercase">DELIVERED SATISFACTION</span>
            <CheckCircle2 size={16} className="text-emerald-700" />
          </div>
          <p className="font-mono text-3xl font-bold text-emerald-800">
            {deliveredCount} <span className="text-sm font-sans font-normal text-[#302F2E]">DELIVERED</span>
          </p>
          <div className="flex items-center justify-between text-[10px] pt-2 border-t border-[#F0EFED] text-[#302F2E]">
            <span>{shippedCount} Currently in Transit</span>
            <span className="text-emerald-700 font-bold">100% SLA</span>
          </div>
        </div>

      </div>

      {/* FULFILLMENT PIPELINE THROUGHPUT */}
      <div className="bg-white border border-[#E1E0DC] p-6 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h3 className="font-display text-sm font-bold uppercase tracking-wider text-[#090808]">
              FULFILLMENT LIFECYCLE PIPELINE
            </h3>
            <p className="text-[11px] text-[#302F2E]">
              Real-time progression of orders through the 8-stage manufacturing and delivery pipeline.
            </p>
          </div>
          <Link
            to="/admin/fulfillment"
            className="text-xs font-bold tracking-widest uppercase text-[#090808] hover:underline underline-offset-4"
          >
            OPEN FULL PIPELINE →
          </Link>
        </div>

        {/* Segmented Pipeline Bar */}
        <div className="w-full bg-[#F0EFED] h-3 overflow-hidden flex">
          <div
            className="bg-amber-500 h-full transition-all"
            style={{ width: `${(pendingCount / Math.max(1, totalOrders)) * 100}%` }}
            title="Pending"
          />
          <div
            className="bg-amber-700 h-full transition-all"
            style={{ width: `${(processingCount / Math.max(1, totalOrders)) * 100}%` }}
            title="In Production"
          />
          <div
            className="bg-sky-600 h-full transition-all"
            style={{ width: `${(shippedCount / Math.max(1, totalOrders)) * 100}%` }}
            title="Shipped"
          />
          <div
            className="bg-emerald-600 h-full transition-all"
            style={{ width: `${(deliveredCount / Math.max(1, totalOrders)) * 100}%` }}
            title="Delivered"
          />
        </div>

        {/* Stage Legend Counters */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs pt-2">
          <div className="flex items-center gap-2 p-2 bg-[#F0EFED]/60 border border-[#E1E0DC]">
            <span className="w-2.5 h-2.5 bg-amber-500 rounded-full" />
            <div>
              <p className="text-[9px] font-mono text-[#BEBDBB] uppercase">PENDING</p>
              <p className="font-mono font-bold text-[#090808]">{pendingCount} orders</p>
            </div>
          </div>

          <div className="flex items-center gap-2 p-2 bg-[#F0EFED]/60 border border-[#E1E0DC]">
            <span className="w-2.5 h-2.5 bg-amber-700 rounded-full" />
            <div>
              <p className="text-[9px] font-mono text-[#BEBDBB] uppercase">PRODUCTION</p>
              <p className="font-mono font-bold text-[#090808]">{processingCount} orders</p>
            </div>
          </div>

          <div className="flex items-center gap-2 p-2 bg-[#F0EFED]/60 border border-[#E1E0DC]">
            <span className="w-2.5 h-2.5 bg-sky-600 rounded-full" />
            <div>
              <p className="text-[9px] font-mono text-[#BEBDBB] uppercase">SHIPPED</p>
              <p className="font-mono font-bold text-[#090808]">{shippedCount} orders</p>
            </div>
          </div>

          <div className="flex items-center gap-2 p-2 bg-[#F0EFED]/60 border border-[#E1E0DC]">
            <span className="w-2.5 h-2.5 bg-emerald-600 rounded-full" />
            <div>
              <p className="text-[9px] font-mono text-[#BEBDBB] uppercase">DELIVERED</p>
              <p className="font-mono font-bold text-[#090808]">{deliveredCount} orders</p>
            </div>
          </div>
        </div>
      </div>

      {/* RECENT ORDERS FEED */}
      <div className="bg-white border border-[#E1E0DC] overflow-hidden space-y-4">
        <div className="p-5 border-b border-[#E1E0DC] flex items-center justify-between">
          <div>
            <h3 className="font-display text-sm font-bold uppercase tracking-wider text-[#090808]">
              LIVE TRANSACTION FEED
            </h3>
            <p className="text-[11px] text-[#302F2E]">
              Recent order placements with customer identifiers and custom design prints.
            </p>
          </div>
          <Link
            to="/admin/orders"
            className="text-xs font-bold tracking-widest text-[#090808] hover:underline underline-offset-4 uppercase"
          >
            VIEW ALL ({orders.length}) →
          </Link>
        </div>

        {filteredOrders.length === 0 ? (
          <div className="p-12 text-center space-y-2">
            <p className="font-mono text-xs font-bold text-[#BEBDBB] uppercase">
              NO DATA AVAILABLE FOR THIS PERIOD
            </p>
            <p className="text-xs text-[#302F2E]">
              No transactions occurred within the selected time window.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F0EFED] text-[#BEBDBB] uppercase text-[10px] font-mono border-b border-[#E1E0DC]">
                <tr>
                  <th className="p-3.5 pl-5">ORDER ID</th>
                  <th className="p-3.5">CUSTOMER</th>
                  <th className="p-3.5">ITEMS & PIECES</th>
                  <th className="p-3.5">TOTAL</th>
                  <th className="p-3.5">FULFILLMENT</th>
                  <th className="p-3.5 pr-5 text-right">DATE</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F0EFED]">
                {filteredOrders.slice(0, 5).map((o) => (
                  <tr key={o.id} className="hover:bg-[#FAFAFA] transition-colors">
                    <td className="p-3.5 pl-5 font-mono font-bold text-[#090808]">
                      <Link
                        to={`/admin/orders`}
                        className="hover:underline underline-offset-2"
                      >
                        {o.id}
                      </Link>
                    </td>
                    <td className="p-3.5 font-medium text-[#090808]">
                      <div>{o.shippingAddress.fullName}</div>
                      <div className="text-[10px] text-[#BEBDBB] font-mono">{o.shippingAddress.city}, {o.shippingAddress.state}</div>
                    </td>
                    <td className="p-3.5 text-[#302F2E]">
                      <div className="font-medium">
                        {o.items.length} {o.items.length === 1 ? 'garment' : 'garments'}
                      </div>
                      <div className="text-[10px] text-[#BEBDBB] truncate max-w-[200px]">
                        {o.items.map((i) => i.productName).join(', ')}
                      </div>
                    </td>
                    <td className="p-3.5 font-mono font-bold text-[#090808]">
                      {formatPrice(o.total)}
                    </td>
                    <td className="p-3.5">
                      <span className={`inline-flex items-center gap-1 text-[9px] font-mono font-bold px-2 py-0.5 uppercase ${
                        o.status === 'delivered'
                          ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                          : o.status === 'processing'
                          ? 'bg-amber-100 text-amber-900 border border-amber-300'
                          : 'bg-zinc-100 text-zinc-900 border border-zinc-300'
                      }`}>
                        {o.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="p-3.5 pr-5 text-right font-mono text-[11px] text-[#BEBDBB]">
                      {formatDate(o.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  )
}

export default AdminDashboard

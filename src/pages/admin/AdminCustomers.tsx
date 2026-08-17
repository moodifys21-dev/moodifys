import React, { useState, useMemo } from 'react'
import { useCustomerStore } from '@/stores/customerStore'
import { Customer, CustomerStatus, CustomerTier } from '@/types/customer'
import { formatPrice, formatDate } from '@/lib/utils'
import {
  Users,
  Search,
  Crown,
  ShieldAlert,
  Sparkles,
  Eye,
  X,
  Tag,
  MessageSquare,
  DollarSign,
} from 'lucide-react'

export const AdminCustomers: React.FC = () => {
  const { customers, updateCustomerStatus, updateCustomerTier, addCustomerTag, removeCustomerTag, addCustomerNote } = useCustomerStore()

  const [searchQuery, setSearchQuery] = useState('')
  const [tierFilter, setTierFilter] = useState<string>('all')
  const [statusFilter, setStatusFilter] = useState<string>('all')

  // Dossier Modal
  const [inspectedCustomer, setInspectedCustomer] = useState<Customer | null>(null)
  const [newTagInput, setNewTagInput] = useState('')
  const [newNoteInput, setNewNoteInput] = useState('')

  // Metrics
  const totalCustomers = customers.length
  const vipCustomers = customers.filter((c) => c.tier === 'GOLD_VIP' || c.tier === 'PLATINUM_VIP').length
  const totalLTV = customers.reduce((sum, c) => sum + c.lifetimeSpent, 0)
  const averageLTV = totalCustomers > 0 ? Math.round(totalLTV / totalCustomers) : 0
  const customOrdersTotal = customers.reduce((sum, c) => sum + c.customOrdersCount, 0)
  const allOrdersTotal = customers.reduce((sum, c) => sum + c.totalOrders, 0)
  const bespokeAdoptionRate = allOrdersTotal > 0 ? Math.round((customOrdersTotal / allOrdersTotal) * 100) : 0

  const filteredCustomers = useMemo(() => {
    return customers.filter((c) => {
      // Search
      const q = searchQuery.toLowerCase().trim()
      if (q) {
        const matchesName = c.fullName.toLowerCase().includes(q)
        const matchesEmail = c.email.toLowerCase().includes(q)
        const matchesPhone = c.phone.toLowerCase().includes(q)
        const matchesCity = c.primaryCity.toLowerCase().includes(q)
        if (!matchesName && !matchesEmail && !matchesPhone && !matchesCity) return false
      }

      // Tier
      if (tierFilter !== 'all' && c.tier !== tierFilter) {
        return false
      }

      // Status
      if (statusFilter !== 'all' && c.status !== statusFilter) {
        return false
      }

      return true
    })
  }, [customers, searchQuery, tierFilter, statusFilter])

  const handleAddTag = (e: React.FormEvent) => {
    e.preventDefault()
    if (!inspectedCustomer || !newTagInput.trim()) return
    addCustomerTag(inspectedCustomer.id, newTagInput.trim())
    setNewTagInput('')
    
    // Refresh modal
    const updated = customers.find((c) => c.id === inspectedCustomer.id)
    if (updated) setInspectedCustomer(updated)
  }

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault()
    if (!inspectedCustomer || !newNoteInput.trim()) return
    addCustomerNote(inspectedCustomer.id, newNoteInput.trim(), 'Operations Staff')
    setNewNoteInput('')

    // Refresh modal
    const updated = customers.find((c) => c.id === inspectedCustomer.id)
    if (updated) setInspectedCustomer(updated)
  }

  return (
    <div className="space-y-6 pb-20">
      
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#BEBDBB]/30">
        <div>
          <span className="text-[10px] font-mono font-bold tracking-[0.25em] text-[#BEBDBB] uppercase">
            CLIENT RELATIONSHIP MANAGEMENT
          </span>
          <h1 className="font-display text-2xl sm:text-3xl font-bold uppercase tracking-tight text-[#090808]">
            CUSTOMER DIRECTORY & VIP PROFILES
          </h1>
        </div>
      </div>

      {/* 4-COLUMN CRM KPI METRICS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-white border border-[#E1E0DC] p-5 space-y-2">
          <div className="flex items-center justify-between text-[#BEBDBB]">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider">TOTAL CLIENTS</span>
            <Users size={16} className="text-[#090808]" />
          </div>
          <p className="font-mono text-3xl font-bold text-[#090808]">
            {totalCustomers} <span className="text-xs font-sans text-[#302F2E] font-normal">ACCOUNTS</span>
          </p>
          <p className="text-[10px] font-mono text-[#BEBDBB]">
            Registered member accounts
          </p>
        </div>

        <div className="bg-white border border-[#E1E0DC] p-5 space-y-2">
          <div className="flex items-center justify-between text-[#BEBDBB]">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider">VIP MEMBERS</span>
            <Crown size={16} className="text-amber-600" />
          </div>
          <p className="font-mono text-3xl font-bold text-amber-700">
            {vipCustomers} <span className="text-xs font-sans text-[#302F2E] font-normal">VIPs</span>
          </p>
          <p className="text-[10px] font-mono text-amber-800">
            Gold & Platinum status clients
          </p>
        </div>

        <div className="bg-white border border-[#E1E0DC] p-5 space-y-2">
          <div className="flex items-center justify-between text-[#BEBDBB]">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider">AVERAGE LTV</span>
            <DollarSign size={16} className="text-emerald-700" />
          </div>
          <p className="font-mono text-3xl font-bold text-emerald-800">
            {formatPrice(averageLTV)}
          </p>
          <p className="text-[10px] font-mono text-[#BEBDBB]">
            Lifetime expenditure per customer
          </p>
        </div>

        <div className="bg-white border border-[#E1E0DC] p-5 space-y-2">
          <div className="flex items-center justify-between text-[#BEBDBB]">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider">BESPOKE ADOPTION</span>
            <Sparkles size={16} className="text-[#090808]" />
          </div>
          <p className="font-mono text-3xl font-bold text-[#090808]">
            {bespokeAdoptionRate}%
          </p>
          <p className="text-[10px] font-mono text-emerald-700">
            Orders customized in 2D studio
          </p>
        </div>

      </div>

      {/* SEARCH & FILTERS */}
      <div className="bg-white border border-[#E1E0DC] p-4 space-y-4 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-4">
          
          <div className="relative flex-1 min-w-[280px]">
            <Search
              size={14}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#BEBDBB]"
            />
            <input
              type="text"
              placeholder="Search clients by name, email, phone, or city..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#F0EFED] border border-[#E1E0DC] pl-10 pr-4 py-2 text-xs text-[#090808] placeholder-[#BEBDBB] focus:outline-none focus:border-[#090808]"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* VIP Tier Filter */}
            <div className="flex items-center gap-1 text-xs">
              <span className="text-[10px] font-mono text-[#BEBDBB] uppercase">TIER:</span>
              <select
                value={tierFilter}
                onChange={(e) => setTierFilter(e.target.value)}
                className="bg-[#F0EFED] border border-[#E1E0DC] px-2.5 py-1.5 text-xs font-mono font-bold uppercase focus:outline-none"
              >
                <option value="all">ALL TIERS</option>
                <option value="STANDARD">STANDARD</option>
                <option value="SILVER">SILVER</option>
                <option value="GOLD_VIP">GOLD VIP</option>
                <option value="PLATINUM_VIP">PLATINUM VIP</option>
              </select>
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-1 text-xs">
              <span className="text-[10px] font-mono text-[#BEBDBB] uppercase">ACCOUNT:</span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-[#F0EFED] border border-[#E1E0DC] px-2.5 py-1.5 text-xs font-mono font-bold uppercase focus:outline-none"
              >
                <option value="all">ALL STATUSES</option>
                <option value="ACTIVE">ACTIVE</option>
                <option value="FLAGGED">FLAGGED (REVIEW)</option>
                <option value="SUSPENDED">SUSPENDED</option>
              </select>
            </div>
          </div>

        </div>
      </div>

      {/* MASTER CUSTOMER TABLE */}
      <div className="bg-white border border-[#E1E0DC] overflow-hidden shadow-xs">
        {filteredCustomers.length === 0 ? (
          <div className="p-16 text-center space-y-3">
            <Users size={32} className="mx-auto text-[#BEBDBB]" />
            <p className="font-mono text-xs font-bold text-[#BEBDBB] uppercase">
              NO CLIENT ACCOUNTS MATCHING CRITERIA
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-[#F0EFED] text-[#BEBDBB] uppercase text-[10px] font-mono border-b border-[#E1E0DC]">
                <tr>
                  <th className="p-4 pl-6">CLIENT NAME / CONTACT</th>
                  <th className="p-4">VIP STATUS</th>
                  <th className="p-4">ORDERS (BESPOKE)</th>
                  <th className="p-4">LIFETIME SPENT</th>
                  <th className="p-4">LOCATION</th>
                  <th className="p-4">ACCOUNT HEALTH</th>
                  <th className="p-4 pr-6 text-right">ACTIONS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E1E0DC]">
                {filteredCustomers.map((cust) => (
                  <tr key={cust.id} className="hover:bg-[#FAFAFA] transition-colors">
                    
                    {/* Name & Contact */}
                    <td className="p-4 pl-6">
                      <p className="font-bold text-xs text-[#090808]">{cust.fullName}</p>
                      <p className="text-[10px] font-mono text-[#BEBDBB]">{cust.email}</p>
                      <p className="text-[10px] font-mono text-[#302F2E]">{cust.phone}</p>
                    </td>

                    {/* VIP Status */}
                    <td className="p-4">
                      <span className={`inline-flex items-center gap-1 text-[9px] font-mono font-bold px-2 py-0.5 uppercase border ${
                        cust.tier === 'PLATINUM_VIP'
                          ? 'bg-purple-50 text-purple-900 border-purple-300'
                          : cust.tier === 'GOLD_VIP'
                          ? 'bg-amber-50 text-amber-900 border-amber-300'
                          : cust.tier === 'SILVER'
                          ? 'bg-zinc-100 text-zinc-800 border-zinc-300'
                          : 'bg-[#F0EFED] text-[#302F2E] border-[#E1E0DC]'
                      }`}>
                        {cust.tier.includes('VIP') && <Crown size={10} className="text-amber-600" />}
                        {cust.tier.replace(/_/g, ' ')}
                      </span>
                    </td>

                    {/* Orders */}
                    <td className="p-4 font-mono text-xs">
                      <strong className="text-[#090808]">{cust.totalOrders}</strong> total{' '}
                      <span className="text-[#BEBDBB]">({cust.customOrdersCount} bespoke)</span>
                    </td>

                    {/* Lifetime Spend */}
                    <td className="p-4 font-mono font-bold text-xs text-emerald-800">
                      {formatPrice(cust.lifetimeSpent)}
                    </td>

                    {/* Location */}
                    <td className="p-4 text-xs text-[#302F2E]">
                      {cust.primaryCity}, {cust.primaryState}
                    </td>

                    {/* Status */}
                    <td className="p-4">
                      <span className={`inline-flex items-center gap-1 text-[9px] font-mono font-bold px-2 py-0.5 uppercase border ${
                        cust.status === 'ACTIVE'
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                          : cust.status === 'FLAGGED'
                          ? 'bg-amber-50 text-amber-900 border-amber-300'
                          : 'bg-rose-50 text-rose-900 border-rose-300'
                      }`}>
                        {cust.status === 'FLAGGED' && <ShieldAlert size={10} className="text-amber-600" />}
                        {cust.status}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="p-4 pr-6 text-right">
                      <button
                        type="button"
                        onClick={() => setInspectedCustomer(cust)}
                        className="px-2.5 py-1 bg-[#090808] text-white hover:opacity-85 text-[10px] font-mono font-bold uppercase transition-opacity flex items-center gap-1 ml-auto"
                      >
                        <Eye size={11} />
                        <span>VIEW DOSSIER</span>
                      </button>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* MODAL: CUSTOMER DOSSIER & CRM RECORD */}
      {inspectedCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white border border-[#090808] p-6 max-w-2xl w-full space-y-5 shadow-2xl max-h-[90vh] overflow-y-auto">
            
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-[#E1E0DC] pb-3">
              <div>
                <span className="text-[10px] font-mono font-bold tracking-widest text-[#BEBDBB] uppercase">
                  CLIENT RELATIONSHIP PROFILE
                </span>
                <h3 className="font-display text-xl font-bold uppercase text-[#090808]">
                  {inspectedCustomer.fullName}
                </h3>
                <p className="text-xs font-mono text-[#302F2E]">
                  {inspectedCustomer.email} • {inspectedCustomer.phone}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setInspectedCustomer(null)}
                className="p-1 text-[#090808] hover:opacity-70"
              >
                <X size={18} />
              </button>
            </div>

            {/* Quick Metrics Strip */}
            <div className="grid grid-cols-3 gap-3 p-3 bg-[#F0EFED] border border-[#E1E0DC] text-xs font-mono">
              <div>
                <span className="text-[10px] text-[#BEBDBB] uppercase block">LIFETIME VALUE</span>
                <strong className="text-emerald-800 text-sm">{formatPrice(inspectedCustomer.lifetimeSpent)}</strong>
              </div>
              <div>
                <span className="text-[10px] text-[#BEBDBB] uppercase block">TOTAL ORDERS</span>
                <strong className="text-[#090808] text-sm">{inspectedCustomer.totalOrders} ({inspectedCustomer.customOrdersCount} Bespoke)</strong>
              </div>
              <div>
                <span className="text-[10px] text-[#BEBDBB] uppercase block">AVERAGE BASKET</span>
                <strong className="text-[#090808] text-sm">{formatPrice(inspectedCustomer.averageOrderValue)}</strong>
              </div>
            </div>

            {/* Tier & Status Controls */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase text-[#090808]">
                  VIP LOYALTY TIER
                </label>
                <select
                  value={inspectedCustomer.tier}
                  onChange={(e) => {
                    const newTier = e.target.value as CustomerTier
                    updateCustomerTier(inspectedCustomer.id, newTier)
                    setInspectedCustomer({ ...inspectedCustomer, tier: newTier })
                  }}
                  className="w-full bg-[#F0EFED] border border-[#E1E0DC] p-2 text-xs font-bold uppercase focus:outline-none"
                >
                  <option value="STANDARD">STANDARD</option>
                  <option value="SILVER">SILVER</option>
                  <option value="GOLD_VIP">GOLD VIP</option>
                  <option value="PLATINUM_VIP">PLATINUM VIP</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase text-[#090808]">
                  ACCOUNT STATUS & RISK LEVEL
                </label>
                <select
                  value={inspectedCustomer.status}
                  onChange={(e) => {
                    const newStatus = e.target.value as CustomerStatus
                    updateCustomerStatus(inspectedCustomer.id, newStatus)
                    setInspectedCustomer({ ...inspectedCustomer, status: newStatus })
                  }}
                  className="w-full bg-[#F0EFED] border border-[#E1E0DC] p-2 text-xs font-bold uppercase focus:outline-none"
                >
                  <option value="ACTIVE">ACTIVE</option>
                  <option value="FLAGGED">FLAGGED (PAYMENT RISK)</option>
                  <option value="SUSPENDED">SUSPENDED</option>
                </select>
              </div>
            </div>

            {/* Tags Manager */}
            <div className="space-y-2 border-t border-[#E1E0DC] pt-3">
              <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-[#090808] uppercase">
                <Tag size={13} />
                <span>CUSTOMER SEGMENT TAGS</span>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {inspectedCustomer.tags.map((t) => (
                  <span
                    key={t}
                    className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#F0EFED] border border-[#E1E0DC] text-[10px] font-mono font-bold text-[#090808]"
                  >
                    <span>{t}</span>
                    <button
                      type="button"
                      onClick={() => {
                        removeCustomerTag(inspectedCustomer.id, t)
                        setInspectedCustomer({
                          ...inspectedCustomer,
                          tags: inspectedCustomer.tags.filter((tag) => tag !== t),
                        })
                      }}
                      className="text-[#BEBDBB] hover:text-rose-600"
                    >
                      <X size={10} />
                    </button>
                  </span>
                ))}
              </div>

              <form onSubmit={handleAddTag} className="flex gap-2 pt-1">
                <input
                  type="text"
                  placeholder="Add custom tag (e.g. VIP_GIFT_RECIPIENT)"
                  value={newTagInput}
                  onChange={(e) => setNewTagInput(e.target.value)}
                  className="flex-1 bg-[#F0EFED] border border-[#E1E0DC] p-2 text-xs text-[#090808] focus:outline-none"
                />
                <button
                  type="submit"
                  className="px-3 py-2 bg-[#090808] text-white text-xs font-mono font-bold uppercase hover:opacity-85"
                >
                  ADD TAG
                </button>
              </form>
            </div>

            {/* Internal CRM Staff Notes */}
            <div className="space-y-2 border-t border-[#E1E0DC] pt-3">
              <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-[#090808] uppercase">
                <MessageSquare size={13} />
                <span>INTERNAL STAFF CRM NOTES ({inspectedCustomer.notes.length})</span>
              </div>

              <div className="space-y-2 max-h-40 overflow-y-auto">
                {inspectedCustomer.notes.length === 0 ? (
                  <p className="text-xs font-mono text-[#BEBDBB]">No internal notes recorded yet.</p>
                ) : (
                  inspectedCustomer.notes.map((n) => (
                    <div key={n.id} className="p-2.5 bg-[#F0EFED] border border-[#E1E0DC] space-y-1 text-xs">
                      <div className="flex items-center justify-between font-mono text-[10px] text-[#BEBDBB]">
                        <strong className="text-[#090808]">{n.author}</strong>
                        <span>{formatDate(n.createdAt)}</span>
                      </div>
                      <p className="text-[#302F2E]">{n.note}</p>
                    </div>
                  ))
                )}
              </div>

              <form onSubmit={handleAddNote} className="flex gap-2 pt-1">
                <input
                  type="text"
                  placeholder="Record internal client conversation note..."
                  value={newNoteInput}
                  onChange={(e) => setNewNoteInput(e.target.value)}
                  className="flex-1 bg-[#F0EFED] border border-[#E1E0DC] p-2 text-xs text-[#090808] focus:outline-none"
                />
                <button
                  type="submit"
                  className="px-3 py-2 bg-[#090808] text-white text-xs font-mono font-bold uppercase hover:opacity-85"
                >
                  ADD NOTE
                </button>
              </form>
            </div>

            <div className="flex justify-end pt-3 border-t border-[#E1E0DC]">
              <button
                type="button"
                onClick={() => setInspectedCustomer(null)}
                className="px-5 py-2 bg-[#090808] text-white text-xs font-mono font-bold uppercase hover:opacity-85"
              >
                DONE
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  )
}

export default AdminCustomers

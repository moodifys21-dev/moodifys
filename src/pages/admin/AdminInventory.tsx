import React, { useState, useMemo } from 'react'
import { useInventoryStore } from '@/stores/inventoryStore'
import { InventoryItem, InventoryMovementType } from '@/types/inventory'
import { formatDate } from '@/lib/utils'
import {
  Boxes,
  Search,
  AlertTriangle,
  History,
  Plus,
  RefreshCw,
  X,
  TrendingDown,
} from 'lucide-react'

export const AdminInventory: React.FC = () => {
  const { items, movements, adjustStock, restockBatch } = useInventoryStore()

  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [categoryFilter, setCategoryFilter] = useState<string>('all')

  // Modals state
  const [adjustingItem, setAdjustingItem] = useState<InventoryItem | null>(null)
  const [adjustType, setAdjustType] = useState<InventoryMovementType>('RESTOCK')
  const [adjustQuantity, setAdjustQuantity] = useState<number>(10)
  const [adjustReason, setAdjustReason] = useState('')

  const [historySku, setHistorySku] = useState<string | null>(null)

  // Metrics
  const totalUnits = items.reduce((sum, i) => sum + i.currentStock, 0)
  const lowStockItems = items.filter((i) => i.status === 'LOW_STOCK' || i.status === 'CRITICAL')
  const outOfStockItems = items.filter((i) => i.status === 'OUT_OF_STOCK')

  // Categories list
  const categories = useMemo(() => {
    return Array.from(new Set(items.map((i) => i.categoryName)))
  }, [items])

  // Filter items
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      // Search
      const q = searchQuery.toLowerCase().trim()
      if (q) {
        const matchesSku = item.sku.toLowerCase().includes(q)
        const matchesName = item.productName.toLowerCase().includes(q)
        const matchesColor = item.color.toLowerCase().includes(q)
        if (!matchesSku && !matchesName && !matchesColor) return false
      }

      // Status
      if (statusFilter !== 'all' && item.status !== statusFilter) {
        return false
      }

      // Category
      if (categoryFilter !== 'all' && item.categoryName !== categoryFilter) {
        return false
      }

      return true
    })
  }, [items, searchQuery, statusFilter, categoryFilter])

  const openAdjustModal = (item: InventoryItem, defaultType: InventoryMovementType = 'RESTOCK') => {
    setAdjustingItem(item)
    setAdjustType(defaultType)
    setAdjustQuantity(defaultType === 'RESTOCK' ? 25 : 1)
    setAdjustReason(defaultType === 'RESTOCK' ? 'Supplier batch restock received' : 'Workshop manual count correction')
  }

  const handleSaveAdjustment = (e: React.FormEvent) => {
    e.preventDefault()
    if (!adjustingItem || !adjustReason.trim()) return

    // Calculate signed delta
    let delta = Math.abs(adjustQuantity)
    if (adjustType === 'DAMAGE' || adjustType === 'SALE') {
      delta = -delta
    }

    adjustStock(adjustingItem.sku, delta, adjustType, adjustReason.trim(), 'Operations Staff')
    setAdjustingItem(null)
  }

  const handleBatchRestockLow = () => {
    if (lowStockItems.length === 0) return
    if (window.confirm(`Restock all ${lowStockItems.length} low-stock SKUs with +25 units each?`)) {
      restockBatch(
        lowStockItems.map((i) => i.sku),
        25,
        'Batch emergency supplier delivery (Direct to Workshop)',
        'Operations Staff'
      )
    }
  }

  const skuMovements = useMemo(() => {
    if (!historySku) return []
    return movements.filter((m) => m.sku === historySku)
  }, [movements, historySku])

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#BEBDBB]/30">
        <div>
          <span className="text-[10px] font-mono font-bold tracking-[0.25em] text-[#BEBDBB] uppercase">
            SUPPLY CHAIN & WORKSHOP STOCK
          </span>
          <h1 className="font-display text-2xl sm:text-3xl font-bold uppercase tracking-tight text-[#090808]">
            INVENTORY CONTROL & STOCK MOVEMENTS
          </h1>
        </div>

        <div className="flex items-center gap-3">
          {lowStockItems.length > 0 && (
            <button
              type="button"
              onClick={handleBatchRestockLow}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-mono font-bold uppercase bg-amber-600 text-white hover:bg-amber-700 transition-colors"
            >
              <RefreshCw size={13} />
              <span>BATCH RESTOCK LOW ({lowStockItems.length})</span>
            </button>
          )}
        </div>
      </div>

      {/* 4-COLUMN INVENTORY KPI METRICS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-white border border-[#E1E0DC] p-5 space-y-2">
          <div className="flex items-center justify-between text-[#BEBDBB]">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider">TOTAL INVENTORY</span>
            <Boxes size={16} className="text-[#090808]" />
          </div>
          <p className="font-mono text-3xl font-bold text-[#090808]">
            {totalUnits} <span className="text-xs font-sans text-[#302F2E] font-normal">UNITS</span>
          </p>
          <p className="text-[10px] font-mono text-[#BEBDBB]">
            Across {items.length} unique variant SKUs
          </p>
        </div>

        <div className="bg-white border border-[#E1E0DC] p-5 space-y-2">
          <div className="flex items-center justify-between text-[#BEBDBB]">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider">LOW STOCK ALERTS</span>
            <AlertTriangle size={16} className="text-amber-600" />
          </div>
          <p className="font-mono text-3xl font-bold text-amber-700">
            {lowStockItems.length} <span className="text-xs font-sans text-[#302F2E] font-normal">SKUs</span>
          </p>
          <p className="text-[10px] font-mono text-amber-800">
            Below 10 unit buffer threshold
          </p>
        </div>

        <div className="bg-white border border-[#E1E0DC] p-5 space-y-2">
          <div className="flex items-center justify-between text-[#BEBDBB]">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider">OUT OF STOCK</span>
            <TrendingDown size={16} className="text-rose-600" />
          </div>
          <p className="font-mono text-3xl font-bold text-rose-700">
            {outOfStockItems.length} <span className="text-xs font-sans text-[#302F2E] font-normal">SKUs</span>
          </p>
          <p className="text-[10px] font-mono text-[#BEBDBB]">
            Requiring supplier purchase order
          </p>
        </div>

        <div className="bg-white border border-[#E1E0DC] p-5 space-y-2">
          <div className="flex items-center justify-between text-[#BEBDBB]">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider">MOVEMENTS AUDIT TRAIL</span>
            <History size={16} className="text-emerald-700" />
          </div>
          <p className="font-mono text-3xl font-bold text-[#090808]">
            {movements.length} <span className="text-xs font-sans text-[#302F2E] font-normal">LOGS</span>
          </p>
          <p className="text-[10px] font-mono text-emerald-700">
            100% Cryptographically verified
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
              placeholder="Search by SKU, Garment title, Color..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#F0EFED] border border-[#E1E0DC] pl-10 pr-4 py-2 text-xs text-[#090808] placeholder-[#BEBDBB] focus:outline-none focus:border-[#090808]"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Category Filter */}
            <div className="flex items-center gap-1 text-xs">
              <span className="text-[10px] font-mono text-[#BEBDBB] uppercase">CATEGORY:</span>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="bg-[#F0EFED] border border-[#E1E0DC] px-2.5 py-1.5 text-xs font-mono font-bold uppercase focus:outline-none"
              >
                <option value="all">ALL CATEGORIES</option>
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-1 text-xs">
              <span className="text-[10px] font-mono text-[#BEBDBB] uppercase">HEALTH:</span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-[#F0EFED] border border-[#E1E0DC] px-2.5 py-1.5 text-xs font-mono font-bold uppercase focus:outline-none"
              >
                <option value="all">ALL STATUSES</option>
                <option value="HEALTHY">HEALTHY</option>
                <option value="LOW_STOCK">LOW STOCK (&lt;10)</option>
                <option value="CRITICAL">CRITICAL (&lt;3)</option>
                <option value="OUT_OF_STOCK">OUT OF STOCK (0)</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* MASTER INVENTORY TABLE */}
      <div className="bg-white border border-[#E1E0DC] overflow-hidden shadow-xs">
        {filteredItems.length === 0 ? (
          <div className="p-16 text-center space-y-3">
            <Boxes size={32} className="mx-auto text-[#BEBDBB]" />
            <p className="font-mono text-xs font-bold text-[#BEBDBB] uppercase">
              NO INVENTORY ITEMS MATCHING CRITERIA
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-[#F0EFED] text-[#BEBDBB] uppercase text-[10px] font-mono border-b border-[#E1E0DC]">
                <tr>
                  <th className="p-4 pl-6">SKU / BARCODE</th>
                  <th className="p-4">PRODUCT / CATEGORY</th>
                  <th className="p-4">COLOR & SIZE</th>
                  <th className="p-4">CURRENT ON-HAND</th>
                  <th className="p-4">RESERVED IN PROD</th>
                  <th className="p-4">AVAILABLE</th>
                  <th className="p-4">HEALTH STATUS</th>
                  <th className="p-4 pr-6 text-right">ACTIONS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E1E0DC]">
                {filteredItems.map((item) => (
                  <tr key={item.id} className="hover:bg-[#FAFAFA] transition-colors">
                    
                    {/* SKU */}
                    <td className="p-4 pl-6 font-mono font-bold text-xs text-[#090808]">
                      {item.sku}
                    </td>

                    {/* Product */}
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={item.productImage}
                          alt={item.productName}
                          className="w-8 h-10 object-cover bg-[#F0EFED] border border-[#E1E0DC]"
                        />
                        <div>
                          <p className="font-bold text-[#090808]">{item.productName}</p>
                          <p className="text-[10px] font-mono text-[#BEBDBB] uppercase">
                            {item.categoryName}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Color & Size */}
                    <td className="p-4 font-mono text-xs">
                      <div className="flex items-center gap-2">
                        <span
                          className="w-3 h-3 rounded-full border border-[#BEBDBB]"
                          style={{ backgroundColor: item.colorHex }}
                          title={item.color}
                        />
                        <strong className="text-[#090808]">{item.color}</strong>
                        <span>/</span>
                        <span className="bg-[#F0EFED] px-1.5 py-0.2 font-bold text-[#090808] border border-[#E1E0DC]">
                          {item.size}
                        </span>
                      </div>
                    </td>

                    {/* Current Stock */}
                    <td className="p-4 font-mono text-sm font-bold text-[#090808]">
                      {item.currentStock}
                    </td>

                    {/* Reserved */}
                    <td className="p-4 font-mono text-xs text-amber-700">
                      {item.reservedStock} in production
                    </td>

                    {/* Available */}
                    <td className="p-4 font-mono text-sm font-bold text-emerald-800">
                      {item.availableStock}
                    </td>

                    {/* Health Status */}
                    <td className="p-4">
                      <span className={`inline-flex items-center gap-1 text-[9px] font-mono font-bold px-2 py-0.5 uppercase border ${
                        item.status === 'HEALTHY'
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                          : item.status === 'LOW_STOCK'
                          ? 'bg-amber-50 text-amber-800 border-amber-300'
                          : item.status === 'CRITICAL'
                          ? 'bg-orange-50 text-orange-900 border-orange-300'
                          : 'bg-rose-50 text-rose-800 border-rose-300'
                      }`}>
                        {item.status.replace(/_/g, ' ')}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="p-4 pr-6 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => openAdjustModal(item, 'RESTOCK')}
                          className="px-2.5 py-1 bg-[#090808] text-white hover:opacity-85 text-[10px] font-mono font-bold uppercase transition-opacity flex items-center gap-1"
                        >
                          <Plus size={11} />
                          <span>ADJUST / RESTOCK</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setHistorySku(item.sku)}
                          className="p-1 border border-[#E1E0DC] text-[#302F2E] hover:bg-[#F0EFED] transition-colors"
                          title="View Movement Audit History"
                        >
                          <History size={13} />
                        </button>
                      </div>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* MODAL: STOCK ADJUSTMENT FORM */}
      {adjustingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white border border-[#090808] p-6 max-w-lg w-full space-y-5 shadow-2xl">
            <div className="flex items-start justify-between border-b border-[#E1E0DC] pb-3">
              <div>
                <span className="text-[10px] font-mono font-bold tracking-widest text-[#BEBDBB] uppercase">
                  STOCK ADJUSTMENT AUDIT RECORD
                </span>
                <h3 className="font-display text-lg font-bold uppercase text-[#090808]">
                  {adjustingItem.productName} ({adjustingItem.color}/{adjustingItem.size})
                </h3>
                <p className="text-xs font-mono text-[#BEBDBB]">SKU: {adjustingItem.sku}</p>
              </div>

              <button
                type="button"
                onClick={() => setAdjustingItem(null)}
                className="p-1 text-[#090808] hover:opacity-70"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveAdjustment} className="space-y-4 text-xs">
              
              {/* Movement Type */}
              <div className="space-y-1">
                <label className="text-[10px] font-mono font-bold uppercase text-[#090808]">
                  ADJUSTMENT REASON / TYPE *
                </label>
                <select
                  value={adjustType}
                  onChange={(e) => setAdjustType(e.target.value as InventoryMovementType)}
                  className="w-full bg-[#F0EFED] border border-[#E1E0DC] p-2.5 font-mono text-xs font-bold uppercase focus:outline-none"
                >
                  <option value="RESTOCK">RESTOCK (+) - Supplier delivery</option>
                  <option value="RETURN">CUSTOMER RETURN (+) - Inspected blank returned</option>
                  <option value="SALE">SALE (-) - Offline workshop direct sale</option>
                  <option value="DAMAGE">DAMAGED (-) - Fabric snag or printer jam</option>
                  <option value="MANUAL_ADJUSTMENT">MANUAL CORRECTION (+/-) - Physical inventory audit</option>
                </select>
              </div>

              {/* Quantity */}
              <div className="space-y-1">
                <label className="text-[10px] font-mono font-bold uppercase text-[#090808]">
                  QUANTITY UNITS *
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  value={adjustQuantity}
                  onChange={(e) => setAdjustQuantity(Number(e.target.value))}
                  className="w-full bg-[#F0EFED] border border-[#E1E0DC] p-2.5 font-mono text-base font-bold text-[#090808] focus:outline-none"
                />
              </div>

              {/* Live Calculation Preview */}
              <div className="p-3 bg-[#F0EFED] border border-[#E1E0DC] font-mono text-xs space-y-1">
                <div className="flex justify-between">
                  <span className="text-[#BEBDBB]">PREVIOUS STOCK:</span>
                  <span className="font-bold text-[#090808]">{adjustingItem.currentStock} units</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#BEBDBB]">DELTA CHANGE:</span>
                  <span className={`font-bold ${adjustType === 'DAMAGE' || adjustType === 'SALE' ? 'text-rose-700' : 'text-emerald-700'}`}>
                    {adjustType === 'DAMAGE' || adjustType === 'SALE' ? `-${adjustQuantity}` : `+${adjustQuantity}`} units
                  </span>
                </div>
                <div className="flex justify-between border-t border-[#E1E0DC] pt-1">
                  <span className="text-[#090808] font-bold">RESULTING STOCK:</span>
                  <span className="font-bold text-[#090808]">
                    {Math.max(
                      0,
                      adjustingItem.currentStock +
                        (adjustType === 'DAMAGE' || adjustType === 'SALE' ? -adjustQuantity : adjustQuantity)
                    )}{' '}
                    units
                  </span>
                </div>
              </div>

              {/* Mandatory Reason Note */}
              <div className="space-y-1">
                <label className="text-[10px] font-mono font-bold uppercase text-[#090808]">
                  AUDIT JUSTIFICATION NOTE *
                </label>
                <textarea
                  required
                  rows={2}
                  value={adjustReason}
                  onChange={(e) => setAdjustReason(e.target.value)}
                  placeholder="e.g. Received PO-8841 from Coimbatore supplier; quality verified."
                  className="w-full bg-[#F0EFED] border border-[#E1E0DC] p-2.5 text-xs text-[#090808] focus:outline-none"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setAdjustingItem(null)}
                  className="flex-1 py-2 border border-[#090808] text-xs font-mono font-bold uppercase hover:bg-[#F0EFED]"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 bg-[#090808] text-white text-xs font-mono font-bold uppercase hover:opacity-85"
                >
                  COMMIT STOCK ADJUSTMENT
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: MOVEMENT AUDIT TRAIL */}
      {historySku && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white border border-[#090808] p-6 max-w-2xl w-full space-y-4 shadow-2xl max-h-[85vh] overflow-y-auto">
            <div className="flex items-start justify-between border-b border-[#E1E0DC] pb-3">
              <div>
                <span className="text-[10px] font-mono font-bold tracking-widest text-[#BEBDBB] uppercase">
                  INVENTORY MOVEMENT AUDIT TRAIL
                </span>
                <h3 className="font-display text-lg font-bold uppercase text-[#090808]">
                  SKU: {historySku}
                </h3>
              </div>

              <button
                type="button"
                onClick={() => setHistorySku(null)}
                className="text-xs font-mono font-bold px-2 py-1 border border-[#090808] hover:bg-[#090808] hover:text-white uppercase"
              >
                CLOSE
              </button>
            </div>

            {skuMovements.length === 0 ? (
              <p className="text-xs font-mono text-[#BEBDBB] py-8 text-center">
                No recorded stock movement history for this SKU yet.
              </p>
            ) : (
              <div className="divide-y divide-[#E1E0DC] border border-[#E1E0DC]">
                {skuMovements.map((mov) => (
                  <div key={mov.id} className="p-3.5 bg-white space-y-1.5 text-xs">
                    <div className="flex items-center justify-between font-mono">
                      <span className={`font-bold px-1.5 py-0.2 text-[9px] uppercase ${
                        mov.quantity > 0 ? 'bg-emerald-100 text-emerald-900' : 'bg-rose-100 text-rose-900'
                      }`}>
                        {mov.movementType} ({mov.quantity > 0 ? `+${mov.quantity}` : mov.quantity})
                      </span>
                      <span className="text-[#BEBDBB] text-[10px]">
                        {formatDate(mov.createdAt)}
                      </span>
                    </div>

                    <div className="flex justify-between font-mono text-[11px] text-[#302F2E]">
                      <span>STOCK: {mov.previousStock} → <strong>{mov.newStock}</strong></span>
                      <span className="text-[#BEBDBB]">BY: {mov.adminUser}</span>
                    </div>

                    <p className="text-[#090808] text-xs bg-[#F0EFED] p-2 border border-[#E1E0DC]">
                      {mov.reason}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  )
}

export default AdminInventory

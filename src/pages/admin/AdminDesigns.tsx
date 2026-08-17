import React, { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useDesignGalleryStore } from '@/stores/designGalleryStore'
import { BespokeDesign } from '@/types/design'
import {
  Sparkles,
  Search,
  Download,
  Eye,
  Layers,
  ShieldAlert,
  X,
  Type,
  Image as ImageIcon,
  Trash2,
} from 'lucide-react'

export const AdminDesigns: React.FC = () => {
  const { designs, updateDesignStatus, deleteDesign } = useDesignGalleryStore()

  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [zoneFilter, setZoneFilter] = useState<string>('all')

  // Inspector Modal
  const [inspectedDesign, setInspectedDesign] = useState<BespokeDesign | null>(null)
  const [flagReasonInput, setFlagReasonInput] = useState('')
  const [showFlagInput, setShowFlagInput] = useState(false)

  const filteredDesigns = useMemo(() => {
    return designs.filter((d) => {
      // Search
      const q = searchQuery.toLowerCase().trim()
      if (q) {
        const titleText = (d.title || d.name || '').toLowerCase()
        const custName = (d.customerName || '').toLowerCase()
        const custEmail = (d.customerEmail || '').toLowerCase()
        const orderNum = (d.associatedOrderId || '').toLowerCase()
        const layersText = (d.layers || []).some((l) => l.content.toLowerCase().includes(q))
        
        const matchesTitle = titleText.includes(q)
        const matchesCust = custName.includes(q) || custEmail.includes(q)
        const matchesOrder = orderNum.includes(q)
        if (!matchesTitle && !matchesCust && !matchesOrder && !layersText) return false
      }

      // Status
      if (statusFilter !== 'all' && (d.status || 'ORDERED') !== statusFilter) {
        return false
      }

      // Zone
      if (zoneFilter !== 'all' && (d.printZone || 'CHEST_CENTER') !== zoneFilter) {
        return false
      }

      return true
    })
  }, [designs, searchQuery, statusFilter, zoneFilter])

  const handleFlagDesign = () => {
    if (!inspectedDesign || !flagReasonInput.trim()) return
    updateDesignStatus(inspectedDesign.id, 'FLAGGED_COPYRIGHT', flagReasonInput.trim())
    setShowFlagInput(false)
    setFlagReasonInput('')
    setInspectedDesign({
      ...inspectedDesign,
      status: 'FLAGGED_COPYRIGHT',
      flagReason: flagReasonInput.trim(),
    })
  }

  const handleApproveDesign = () => {
    if (!inspectedDesign) return
    updateDesignStatus(inspectedDesign.id, 'ORDERED')
    setInspectedDesign({ ...inspectedDesign, status: 'ORDERED' })
  }

  const handleDownloadAsset = (url?: string, filename?: string) => {
    if (!url) return
    const link = document.createElement('a')
    link.href = url
    link.download = `${filename || 'bespoke-design'}-300dpi-print.png`
    link.target = '_blank'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="space-y-6 pb-20">
      
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#BEBDBB]/30">
        <div>
          <span className="text-[10px] font-mono font-bold tracking-[0.25em] text-[#BEBDBB] uppercase">
            STUDIO ATELIER & DTG BLUEPRINTS
          </span>
          <h1 className="font-display text-2xl sm:text-3xl font-bold uppercase tracking-tight text-[#090808]">
            BESPOKE CUSTOM DESIGNS GALLERY
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/customize"
            target="_blank"
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#090808] text-white text-xs font-mono font-bold uppercase hover:opacity-85 transition-opacity"
          >
            <Sparkles size={14} />
            <span>OPEN 2D CANVAS STUDIO</span>
          </Link>
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
              placeholder="Search by design title, client, order ID, or typography text..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#F0EFED] border border-[#E1E0DC] pl-10 pr-4 py-2 text-xs text-[#090808] placeholder-[#BEBDBB] focus:outline-none focus:border-[#090808]"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Status Filter */}
            <div className="flex items-center gap-1 text-xs">
              <span className="text-[10px] font-mono text-[#BEBDBB] uppercase">STATUS:</span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-[#F0EFED] border border-[#E1E0DC] px-2.5 py-1.5 text-xs font-mono font-bold uppercase focus:outline-none"
              >
                <option value="all">ALL DESIGNS</option>
                <option value="ORDERED">ORDERED & PRODUCED</option>
                <option value="SAVED_DRAFT">SAVED DRAFT</option>
                <option value="FLAGGED_COPYRIGHT">FLAGGED (COPYRIGHT)</option>
              </select>
            </div>

            {/* Zone Filter */}
            <div className="flex items-center gap-1 text-xs">
              <span className="text-[10px] font-mono text-[#BEBDBB] uppercase">PRINT ZONE:</span>
              <select
                value={zoneFilter}
                onChange={(e) => setZoneFilter(e.target.value)}
                className="bg-[#F0EFED] border border-[#E1E0DC] px-2.5 py-1.5 text-xs font-mono font-bold uppercase focus:outline-none"
              >
                <option value="all">ALL PRINT ZONES</option>
                <option value="CHEST_CENTER">CENTER CHEST</option>
                <option value="BACK_OVERSIZED">OVERSIZED BACK</option>
                <option value="LEFT_POCKET">LEFT POCKET</option>
                <option value="SLEEVE">SLEEVE</option>
              </select>
            </div>
          </div>

        </div>
      </div>

      {/* DESIGNS CARD GRID */}
      {filteredDesigns.length === 0 ? (
        <div className="bg-white border border-[#E1E0DC] p-16 text-center space-y-3">
          <Sparkles size={36} className="mx-auto text-[#BEBDBB]" />
          <p className="font-mono text-xs font-bold text-[#BEBDBB] uppercase">
            NO BESPOKE DESIGNS FOUND
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDesigns.map((design) => {
            const currentTitle = design.title || design.name || 'UNTITLED CUSTOM PIECE'
            const currentZone = design.printZone || 'CHEST_CENTER'
            const currentStatus = design.status || 'ORDERED'
            const currentBlank = design.productName || 'OVERSIZED STUDIO TEE'
            const currentColor = design.productColor || design.selectedColor || 'Black'
            const currentSize = design.productSize || design.selectedSize || 'L'

            return (
              <div
                key={design.id}
                className="bg-white border border-[#E1E0DC] hover:border-[#090808] transition-all overflow-hidden flex flex-col justify-between shadow-xs"
              >
                <div>
                  {/* Visual Canvas Image Preview */}
                  <div className="relative aspect-4/3 bg-[#F0EFED] overflow-hidden border-b border-[#E1E0DC]">
                    <img
                      src={design.previewUrl}
                      alt={currentTitle}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 left-3 bg-[#090808]/90 text-white font-mono text-[9px] font-bold px-2 py-1 uppercase tracking-widest">
                      {currentZone.replace(/_/g, ' ')}
                    </div>
                    <div className="absolute top-3 right-3">
                      <span className={`px-2 py-0.5 text-[9px] font-mono font-bold uppercase border ${
                        currentStatus === 'ORDERED'
                          ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                          : currentStatus === 'SAVED_DRAFT'
                          ? 'bg-zinc-100 text-zinc-800 border-zinc-300'
                          : 'bg-rose-100 text-rose-900 border-rose-300'
                      }`}>
                        {currentStatus.replace(/_/g, ' ')}
                      </span>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="p-4 space-y-2 text-xs">
                    <div>
                      <h3 className="font-bold text-sm text-[#090808] uppercase">
                        {currentTitle}
                      </h3>
                      <p className="text-[10px] font-mono text-[#BEBDBB]">
                        BLANK: {currentBlank} ({currentColor}/{currentSize})
                      </p>
                    </div>

                    <div className="p-2.5 bg-[#F0EFED] border border-[#E1E0DC] space-y-1 font-mono text-[11px]">
                      <div className="flex justify-between">
                        <span className="text-[#BEBDBB]">CREATOR:</span>
                        <span className="font-bold text-[#090808]">{design.customerName || 'Guest Atelier'}</span>
                      </div>
                      {design.associatedOrderId && (
                        <div className="flex justify-between">
                          <span className="text-[#BEBDBB]">ORDER:</span>
                          <span className="font-bold text-emerald-700">{design.associatedOrderId}</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span className="text-[#BEBDBB]">LAYERS:</span>
                        <span className="text-[#302F2E]">{(design.layers || []).length || design.layersCount || 1} element(s)</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions Footer */}
                <div className="p-4 pt-0 flex items-center justify-between gap-2 border-t border-[#E1E0DC]/60 mt-2">
                  <button
                    type="button"
                    onClick={() => setInspectedDesign(design)}
                    className="flex-1 py-1.5 bg-[#090808] text-white hover:opacity-85 text-[10px] font-mono font-bold uppercase transition-opacity flex items-center justify-center gap-1.5"
                  >
                    <Eye size={12} />
                    <span>INSPECT BLUEPRINT</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDownloadAsset(design.highResArtworkUrl || design.previewUrl, currentTitle)}
                    className="p-1.5 border border-[#E1E0DC] text-[#090808] hover:bg-[#F0EFED] transition-colors"
                    title="Download 300DPI Print Asset"
                  >
                    <Download size={13} />
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      if (window.confirm(`Delete design "${currentTitle}" permanently?`)) {
                        deleteDesign(design.id)
                      }
                    }}
                    className="p-1.5 border border-[#E1E0DC] text-[#BEBDBB] hover:text-rose-700 hover:bg-rose-50 transition-colors"
                    title="Delete Design"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>

              </div>
            )
          })}
        </div>
      )}

      {/* MODAL: DESIGN BLUEPRINT & LAYER INSPECTOR */}
      {inspectedDesign && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white border border-[#090808] p-6 max-w-3xl w-full space-y-5 shadow-2xl max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-start justify-between border-b border-[#E1E0DC] pb-3">
              <div>
                <span className="text-[10px] font-mono font-bold tracking-widest text-[#BEBDBB] uppercase">
                  DTG PRINT SPECIFICATIONS & CANVAS BLUEPRINT
                </span>
                <h3 className="font-display text-xl font-bold uppercase text-[#090808]">
                  {inspectedDesign.title || inspectedDesign.name || 'UNTITLED CUSTOM PIECE'}
                </h3>
                <p className="text-xs font-mono text-[#302F2E]">
                  Client: {inspectedDesign.customerName || 'Registered Client'} ({inspectedDesign.customerEmail || 'client@moodifys.in'})
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setInspectedDesign(null)
                  setShowFlagInput(false)
                }}
                className="p-1 text-[#090808] hover:opacity-70"
              >
                <X size={18} />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              
              {/* High-res Image Pane */}
              <div className="space-y-3">
                <div className="border border-[#E1E0DC] bg-[#F0EFED] p-2 aspect-3/4 flex items-center justify-center">
                  <img
                    src={inspectedDesign.highResArtworkUrl || inspectedDesign.previewUrl}
                    alt={inspectedDesign.title || inspectedDesign.name || 'Artwork Preview'}
                    className="max-h-full max-w-full object-contain"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => handleDownloadAsset(inspectedDesign.highResArtworkUrl || inspectedDesign.previewUrl, inspectedDesign.title || inspectedDesign.name || 'custom-design')}
                  className="w-full py-2 bg-[#090808] text-white text-xs font-mono font-bold uppercase hover:opacity-85 transition-opacity flex items-center justify-center gap-2 shadow-md"
                >
                  <Download size={13} />
                  <span>DOWNLOAD 300DPI PRINT ASSET (PNG)</span>
                </button>
              </div>

              {/* Technical Print Specs & Layers Breakdown */}
              <div className="space-y-4 text-xs font-mono">
                
                {/* Print Specs Box */}
                <div className="p-3 bg-[#F0EFED] border border-[#E1E0DC] space-y-1.5 text-[11px]">
                  <div className="flex justify-between">
                    <span className="text-[#BEBDBB]">GARMENT BLANK:</span>
                    <span className="font-bold text-[#090808]">{inspectedDesign.productName || 'OVERSIZED STUDIO TEE'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#BEBDBB]">COLOR & SIZE:</span>
                    <span className="font-bold text-[#090808]">
                      {inspectedDesign.productColor || inspectedDesign.selectedColor || 'Black'} / {inspectedDesign.productSize || inspectedDesign.selectedSize || 'L'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#BEBDBB]">PRINT BED ZONE:</span>
                    <span className="font-bold text-[#090808]">{inspectedDesign.printZone || 'CHEST_CENTER'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#BEBDBB]">PRINT DIMENSIONS:</span>
                    <span className="font-bold text-[#090808]">{inspectedDesign.printDimensions || '12 × 16 in (30 × 40 cm)'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#BEBDBB]">OUTPUT RESOLUTION:</span>
                    <span className="font-bold text-emerald-800">{inspectedDesign.dpi || 300} DPI (CMYK READY)</span>
                  </div>
                </div>

                {/* Canvas Layers Breakdown */}
                <div className="space-y-2">
                  <span className="text-[10px] font-bold uppercase text-[#090808] flex items-center gap-1">
                    <Layers size={12} />
                    <span>CANVAS LAYERS ({(inspectedDesign.layers || []).length})</span>
                  </span>

                  <div className="space-y-1.5 max-h-36 overflow-y-auto">
                    {(inspectedDesign.layers || []).map((layer) => (
                      <div
                        key={layer.id}
                        className="p-2 bg-white border border-[#E1E0DC] flex items-center justify-between text-[10px]"
                      >
                        <div className="flex items-center gap-2">
                          {layer.type === 'text' ? (
                            <Type size={12} className="text-[#090808]" />
                          ) : (
                            <ImageIcon size={12} className="text-[#090808]" />
                          )}
                          <span className="font-bold text-[#090808] truncate max-w-[160px]">
                            {layer.content}
                          </span>
                        </div>
                        <span className="text-[#BEBDBB]">
                          {layer.fontFamily ? `FONT: ${layer.fontFamily}` : 'VECTOR RASTER'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Flagging / Approval Controls */}
                <div className="pt-3 border-t border-[#E1E0DC] space-y-2">
                  {showFlagInput ? (
                    <div className="space-y-2">
                      <textarea
                        rows={2}
                        placeholder="Reason for copyright / trademark violation..."
                        value={flagReasonInput}
                        onChange={(e) => setFlagReasonInput(e.target.value)}
                        className="w-full bg-[#F0EFED] border border-[#E1E0DC] p-2 text-xs text-[#090808] focus:outline-none"
                      />
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => setShowFlagInput(false)}
                          className="flex-1 py-1.5 border border-[#090808] text-[10px] font-bold uppercase"
                        >
                          CANCEL
                        </button>
                        <button
                          type="button"
                          onClick={handleFlagDesign}
                          className="flex-1 py-1.5 bg-rose-900 text-white text-[10px] font-bold uppercase hover:opacity-85"
                        >
                          CONFIRM FLAG
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between gap-2">
                      {inspectedDesign.status === 'FLAGGED_COPYRIGHT' ? (
                        <button
                          type="button"
                          onClick={handleApproveDesign}
                          className="px-3 py-1.5 bg-emerald-800 text-white text-[10px] font-bold uppercase hover:opacity-85"
                        >
                          CLEAR FLAG & APPROVE
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setShowFlagInput(true)}
                          className="text-rose-700 hover:underline text-[10px] font-bold uppercase flex items-center gap-1"
                        >
                          <ShieldAlert size={12} />
                          <span>FLAG FOR COPYRIGHT VIOLATION</span>
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => setInspectedDesign(null)}
                        className="px-4 py-1.5 border border-[#090808] text-[10px] font-bold uppercase hover:bg-[#F0EFED]"
                      >
                        CLOSE
                      </button>
                    </div>
                  )}
                </div>

              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  )
}

export default AdminDesigns

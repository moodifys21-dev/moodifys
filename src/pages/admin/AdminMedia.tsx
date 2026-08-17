import React, { useState, useMemo, useRef } from 'react'
import { useMediaStore } from '@/stores/mediaStore'
import { MediaAsset, MediaFolder } from '@/types/media'
import { formatDate } from '@/lib/utils'
import {
  Image as ImageIcon,
  Upload,
  Search,
  Grid,
  List,
  Copy,
  Check,
  Trash2,
  X,
  Eye,
  AlertTriangle,
  UploadCloud,
} from 'lucide-react'

export const AdminMedia: React.FC = () => {
  const { assets, uploadFile, updateAsset, deleteAsset } = useMediaStore()

  const [selectedFolder, setSelectedFolder] = useState<MediaFolder | 'ALL'>('ALL')
  const [searchQuery, setSearchQuery] = useState('')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  // Inspector modal
  const [inspectedAsset, setInspectedAsset] = useState<MediaAsset | null>(null)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [inUseError, setInUseError] = useState<string | null>(null)

  // Upload modal
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false)
  const [uploadFolder, setUploadFolder] = useState<MediaFolder>('General')
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState<number | null>(null)

  const folders: (MediaFolder | 'ALL')[] = [
    'ALL',
    'Homepage',
    'Products',
    'Categories',
    'Custom Designs',
    'Marketing',
    'General',
  ]

  const filteredAssets = useMemo(() => {
    return assets.filter((a) => {
      // Folder
      if (selectedFolder !== 'ALL' && a.folder !== selectedFolder) {
        return false
      }

      // Search
      const q = searchQuery.toLowerCase().trim()
      if (q) {
        const matchesTitle = a.title.toLowerCase().includes(q)
        const matchesFile = a.fileName.toLowerCase().includes(q)
        const matchesAlt = a.altText.toLowerCase().includes(q)
        if (!matchesTitle && !matchesFile && !matchesAlt) return false
      }

      return true
    })
  }, [assets, selectedFolder, searchQuery])

  const handleCopyUrl = (url: string, id: string) => {
    navigator.clipboard.writeText(url)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const handleDirectComputerUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return
    const files = Array.from(e.target.files)

    setIsUploading(true)
    setUploadProgress(20)

    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      await uploadFile(file, uploadFolder, 'Admin Operator')
      setUploadProgress(Math.round(((i + 1) / files.length) * 100))
    }

    setTimeout(() => {
      setIsUploading(false)
      setUploadProgress(null)
      setIsUploadModalOpen(false)
    }, 500)

    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleDelete = (id: string) => {
    setInUseError(null)
    const result = deleteAsset(id)
    if (!result.success) {
      setInUseError(result.error || 'Cannot delete asset while in use.')
      return
    }

    if (inspectedAsset?.id === id) {
      setInspectedAsset(null)
    }
  }

  return (
    <div className="space-y-6">
      
      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/jpeg,image/png,image/webp,image/jpg"
        onChange={handleDirectComputerUpload}
        className="hidden"
      />

      {/* In-Use Guard Alert Banner */}
      {inUseError && (
        <div className="p-4 bg-rose-50 border border-rose-300 text-rose-900 text-xs font-mono flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2.5">
            <AlertTriangle size={16} className="text-rose-700 shrink-0" />
            <span className="font-bold">{inUseError}</span>
          </div>
          <button
            type="button"
            onClick={() => setInUseError(null)}
            className="text-rose-700 hover:text-rose-950 font-bold uppercase"
          >
            DISMISS
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#BEBDBB]/30">
        <div>
          <span className="text-[10px] font-mono font-bold tracking-[0.25em] text-[#BEBDBB] uppercase">
            DIGITAL ASSET MANAGEMENT
          </span>
          <h1 className="font-display text-2xl sm:text-3xl font-bold uppercase tracking-tight text-[#090808]">
            MEDIA LIBRARY & CDN ASSETS
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setIsUploadModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#090808] text-white text-xs font-mono font-bold uppercase hover:opacity-85 transition-opacity shadow-md"
          >
            <Upload size={14} />
            <span>UPLOAD FROM COMPUTER</span>
          </button>
        </div>
      </div>

      {/* FILTER BAR & VIEW TOGGLES */}
      <div className="bg-white border border-[#E1E0DC] p-4 space-y-4 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-4">
          
          {/* Search */}
          <div className="relative flex-1 min-w-[280px]">
            <Search
              size={14}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#BEBDBB]"
            />
            <input
              type="text"
              placeholder="Search assets by title, filename, or alt text..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#F0EFED] border border-[#E1E0DC] pl-10 pr-4 py-2 text-xs text-[#090808] placeholder-[#BEBDBB] focus:outline-none focus:border-[#090808]"
            />
          </div>

          {/* Folder Filter Tabs */}
          <div className="flex flex-wrap items-center gap-1.5">
            {folders.map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setSelectedFolder(f)}
                className={`px-3 py-1.5 font-mono text-xs font-bold uppercase border transition-colors ${
                  selectedFolder === f
                    ? 'bg-[#090808] text-white border-[#090808]'
                    : 'bg-[#F0EFED] text-[#302F2E] border-[#E1E0DC] hover:border-[#090808]'
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center border border-[#E1E0DC]">
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              className={`p-2 transition-colors ${
                viewMode === 'grid' ? 'bg-[#090808] text-white' : 'bg-[#F0EFED] text-[#302F2E] hover:bg-[#E1E0DC]'
              }`}
              title="Grid View"
            >
              <Grid size={14} />
            </button>
            <button
              type="button"
              onClick={() => setViewMode('list')}
              className={`p-2 transition-colors ${
                viewMode === 'list' ? 'bg-[#090808] text-white' : 'bg-[#F0EFED] text-[#302F2E] hover:bg-[#E1E0DC]'
              }`}
              title="List Table View"
            >
              <List size={14} />
            </button>
          </div>

        </div>
      </div>

      {/* ASSET DISPLAY */}
      {filteredAssets.length === 0 ? (
        <div className="bg-white border border-[#E1E0DC] p-16 text-center space-y-3">
          <ImageIcon size={36} className="mx-auto text-[#BEBDBB]" />
          <p className="font-mono text-xs font-bold text-[#BEBDBB] uppercase">
            NO MEDIA ASSETS FOUND IN THIS FOLDER
          </p>
          <p className="text-xs text-[#302F2E] max-w-sm mx-auto">
            Upload new high-res fashion photography from your computer.
          </p>
          <button
            type="button"
            onClick={() => setIsUploadModalOpen(true)}
            className="inline-block px-4 py-2 bg-[#090808] text-white text-xs font-mono font-bold uppercase"
          >
            + UPLOAD ASSET
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        /* GRID VIEW */
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {filteredAssets.map((asset) => {
            const inUse = asset.usedIn && asset.usedIn.length > 0
            return (
              <div
                key={asset.id}
                onClick={() => setInspectedAsset(asset)}
                className="group bg-white border border-[#E1E0DC] hover:border-[#090808] transition-all cursor-pointer overflow-hidden flex flex-col justify-between"
              >
                <div className="relative aspect-3/4 bg-[#F0EFED] overflow-hidden">
                  <img
                    src={asset.url}
                    alt={asset.altText}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  
                  {/* Badges */}
                  <div className="absolute top-2 left-2 right-2 flex items-center justify-between pointer-events-none">
                    <span className="bg-[#090808]/85 text-white text-[8px] font-mono font-bold px-1.5 py-0.5 uppercase tracking-wider">
                      {asset.folder}
                    </span>

                    {inUse && (
                      <span className="bg-emerald-800 text-white text-[8px] font-mono font-bold px-1.5 py-0.5 uppercase shadow-xs">
                        IMAGE IN USE
                      </span>
                    )}
                  </div>

                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <span className="p-2 bg-white text-[#090808] rounded-full shadow-md">
                      <Eye size={14} />
                    </span>
                  </div>
                </div>

                <div className="p-2.5 space-y-1">
                  <p className="font-bold text-[11px] text-[#090808] truncate">
                    {asset.title}
                  </p>
                  <div className="flex items-center justify-between text-[10px] font-mono text-[#BEBDBB]">
                    <span>{asset.dimensions}</span>
                    <span>{asset.fileSize}</span>
                  </div>
                  {inUse && (
                    <p className="text-[9px] font-mono text-emerald-800 truncate font-bold">
                      {asset.usedIn?.[0].location}
                    </p>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        /* LIST TABLE VIEW */
        <div className="bg-white border border-[#E1E0DC] overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-[#F0EFED] text-[#BEBDBB] uppercase text-[10px] font-mono border-b border-[#E1E0DC]">
                <tr>
                  <th className="p-4 pl-6">PREVIEW</th>
                  <th className="p-4">ASSET TITLE / FILE</th>
                  <th className="p-4">FOLDER</th>
                  <th className="p-4">STATUS</th>
                  <th className="p-4">RESOLUTION</th>
                  <th className="p-4">SIZE</th>
                  <th className="p-4 pr-6 text-right">ACTIONS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E1E0DC]">
                {filteredAssets.map((asset) => {
                  const inUse = asset.usedIn && asset.usedIn.length > 0
                  return (
                    <tr key={asset.id} className="hover:bg-[#FAFAFA] transition-colors">
                      
                      <td className="p-4 pl-6">
                        <img
                          src={asset.url}
                          alt={asset.altText}
                          className="w-10 h-14 object-cover bg-[#F0EFED] border border-[#E1E0DC]"
                        />
                      </td>

                      <td className="p-4">
                        <p className="font-bold text-[#090808] text-xs">{asset.title}</p>
                        <p className="text-[10px] font-mono text-[#BEBDBB]">{asset.fileName}</p>
                      </td>

                      <td className="p-4 font-mono text-[10px] uppercase font-bold text-[#302F2E]">
                        {asset.folder}
                      </td>

                      <td className="p-4">
                        {inUse ? (
                          <div>
                            <span className="px-2 py-0.5 bg-emerald-100 text-emerald-900 border border-emerald-300 font-mono text-[9px] font-bold uppercase">
                              IMAGE IN USE
                            </span>
                            <p className="text-[9px] font-mono text-[#BEBDBB] mt-0.5 truncate max-w-[160px]">
                              {asset.usedIn?.map((u) => u.location).join(', ')}
                            </p>
                          </div>
                        ) : (
                          <span className="text-[#BEBDBB] font-mono text-[10px]">UNATTACHED</span>
                        )}
                      </td>

                      <td className="p-4 font-mono text-xs text-[#090808]">
                        {asset.dimensions}
                      </td>

                      <td className="p-4 font-mono text-xs text-[#BEBDBB]">
                        {asset.fileSize}
                      </td>

                      <td className="p-4 pr-6 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleCopyUrl(asset.url, asset.id)}
                            className="p-1.5 border border-[#E1E0DC] text-[#090808] hover:bg-[#F0EFED] transition-colors"
                            title="Copy Direct CDN URL"
                          >
                            {copiedId === asset.id ? (
                              <Check size={12} className="text-emerald-700" />
                            ) : (
                              <Copy size={12} />
                            )}
                          </button>

                          <button
                            type="button"
                            onClick={() => setInspectedAsset(asset)}
                            className="p-1.5 bg-[#090808] text-white hover:opacity-85 transition-opacity"
                            title="Inspect Metadata"
                          >
                            <Eye size={12} />
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDelete(asset.id)}
                            className="p-1.5 border border-[#E1E0DC] text-[#BEBDBB] hover:text-rose-700 hover:bg-rose-50 transition-colors"
                            title="Delete Asset"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </td>

                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODAL: MEDIA INSPECTOR */}
      {inspectedAsset && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white border border-[#090808] p-6 max-w-2xl w-full space-y-5 shadow-2xl max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-start justify-between border-b border-[#E1E0DC] pb-3">
              <div>
                <span className="text-[10px] font-mono font-bold tracking-widest text-[#BEBDBB] uppercase">
                  ASSET METADATA & USAGE INSPECTOR
                </span>
                <h3 className="font-display text-lg font-bold uppercase text-[#090808]">
                  {inspectedAsset.title}
                </h3>
              </div>

              <button
                type="button"
                onClick={() => setInspectedAsset(null)}
                className="p-1 text-[#090808] hover:opacity-70"
              >
                <X size={18} />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              
              {/* Asset Full Preview */}
              <div className="space-y-2">
                <div className="border border-[#E1E0DC] bg-[#F0EFED] p-2">
                  <img
                    src={inspectedAsset.url}
                    alt={inspectedAsset.altText}
                    className="w-full h-64 object-contain mx-auto"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => handleCopyUrl(inspectedAsset.url, inspectedAsset.id)}
                  className="w-full py-2 bg-[#090808] text-white text-xs font-mono font-bold uppercase hover:opacity-85 transition-opacity flex items-center justify-center gap-1.5"
                >
                  {copiedId === inspectedAsset.id ? (
                    <>
                      <Check size={13} className="text-emerald-400" />
                      <span>COPIED TO CLIPBOARD!</span>
                    </>
                  ) : (
                    <>
                      <Copy size={13} />
                      <span>COPY DIRECT CDN URL</span>
                    </>
                  )}
                </button>
              </div>

              {/* Technical Details & Form */}
              <div className="space-y-4 text-xs font-mono">
                <div className="p-3 bg-[#F0EFED] border border-[#E1E0DC] space-y-1.5 text-[11px]">
                  <div className="flex justify-between">
                    <span className="text-[#BEBDBB]">FOLDER:</span>
                    <span className="font-bold text-[#090808]">{inspectedAsset.folder}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#BEBDBB]">FILENAME:</span>
                    <span className="font-bold text-[#090808] truncate max-w-[140px]">{inspectedAsset.fileName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#BEBDBB]">RESOLUTION:</span>
                    <span className="font-bold text-[#090808]">{inspectedAsset.dimensions}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#BEBDBB]">FILE SIZE:</span>
                    <span className="font-bold text-[#090808]">{inspectedAsset.fileSize}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#BEBDBB]">UPLOADED:</span>
                    <span className="text-[#302F2E]">{formatDate(inspectedAsset.createdAt)}</span>
                  </div>
                </div>

                {/* Where Image is Being Used */}
                <div className="p-3 bg-zinc-50 border border-zinc-200 space-y-1">
                  <span className="text-[10px] font-bold uppercase text-[#090808] block">
                    ACTIVE WHERE USED:
                  </span>
                  {inspectedAsset.usedIn && inspectedAsset.usedIn.length > 0 ? (
                    <ul className="list-disc list-inside text-[11px] text-emerald-800 space-y-0.5">
                      {inspectedAsset.usedIn.map((u, i) => (
                        <li key={i}>{u.location} ({u.type})</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-[10px] text-[#BEBDBB]">
                      Not currently attached to any active product or CMS section.
                    </p>
                  )}
                </div>

                {/* Editable Alt Text */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase text-[#090808]">
                    ACCESSIBILITY ALT TEXT
                  </label>
                  <textarea
                    rows={2}
                    value={inspectedAsset.altText}
                    onChange={(e) => {
                      const updated = { ...inspectedAsset, altText: e.target.value }
                      setInspectedAsset(updated)
                      updateAsset(inspectedAsset.id, { altText: e.target.value })
                    }}
                    className="w-full bg-[#F0EFED] border border-[#E1E0DC] p-2 text-xs font-sans text-[#090808] focus:outline-none"
                  />
                </div>

                <div className="pt-2 border-t border-[#E1E0DC] flex justify-between items-center">
                  <button
                    type="button"
                    onClick={() => handleDelete(inspectedAsset.id)}
                    className="text-rose-700 hover:underline text-xs uppercase font-bold flex items-center gap-1"
                  >
                    <Trash2 size={12} />
                    <span>PERMANENT DELETE</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setInspectedAsset(null)}
                    className="px-4 py-2 border border-[#090808] text-xs uppercase font-bold hover:bg-[#F0EFED]"
                  >
                    DONE
                  </button>
                </div>

              </div>

            </div>

          </div>
        </div>
      )}

      {/* MODAL: UPLOAD FROM COMPUTER */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white border border-[#090808] p-6 max-w-lg w-full space-y-5 shadow-2xl">
            <div className="flex items-start justify-between border-b border-[#E1E0DC] pb-3">
              <div>
                <span className="text-[10px] font-mono font-bold tracking-widest text-[#BEBDBB] uppercase">
                  SUPABASE STORAGE
                </span>
                <h3 className="font-display text-lg font-bold uppercase text-[#090808]">
                  UPLOAD IMAGES FROM COMPUTER
                </h3>
              </div>

              <button
                type="button"
                onClick={() => setIsUploadModalOpen(false)}
                className="p-1 text-[#090808] hover:opacity-70"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              
              <div className="space-y-1">
                <label className="text-[10px] font-mono font-bold uppercase text-[#090808]">
                  DESTINATION FOLDER *
                </label>
                <select
                  value={uploadFolder}
                  onChange={(e) => setUploadFolder(e.target.value as MediaFolder)}
                  className="w-full bg-[#F0EFED] border border-[#E1E0DC] p-2.5 font-mono text-xs font-bold uppercase focus:outline-none"
                >
                  <option value="Homepage">Homepage</option>
                  <option value="Products">Products</option>
                  <option value="Categories">Categories</option>
                  <option value="Custom Designs">Custom Designs</option>
                  <option value="Marketing">Marketing</option>
                  <option value="General">General</option>
                </select>
              </div>

              {/* Drag and Drop Zone */}
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-[#BEBDBB] hover:border-[#090808] bg-[#FAFAFA] p-8 text-center cursor-pointer transition-all space-y-2"
              >
                <UploadCloud size={36} className="mx-auto text-[#090808]" />
                <p className="font-display font-bold text-xs uppercase text-[#090808]">
                  CLICK TO SELECT ONE OR MULTIPLE IMAGES
                </p>
                <p className="font-mono text-[10px] text-[#BEBDBB]">
                  Allowed formats: JPG, JPEG, PNG, WEBP (Max 10MB per file)
                </p>
              </div>

              {isUploading && (
                <div className="space-y-2 p-3 bg-[#F0EFED] border border-[#E1E0DC]">
                  <div className="flex justify-between font-mono text-[11px] font-bold">
                    <span>UPLOADING TO SUPABASE STORAGE...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div className="w-full bg-[#E1E0DC] h-2">
                    <div
                      className="bg-[#090808] h-full transition-all"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>
              )}

              <div className="flex justify-end pt-3 border-t border-[#E1E0DC]">
                <button
                  type="button"
                  onClick={() => setIsUploadModalOpen(false)}
                  className="px-4 py-2 border border-[#090808] text-xs font-mono font-bold uppercase hover:bg-[#F0EFED]"
                >
                  CANCEL
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  )
}

export default AdminMedia

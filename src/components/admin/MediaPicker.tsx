import React, { useState, useRef } from 'react'
import { useMediaStore } from '@/stores/mediaStore'
import { MediaAsset, MediaFolder } from '@/types/media'
import {
  UploadCloud,
  Image as ImageIcon,
  Search,
  Check,
  X,
  AlertCircle,
} from 'lucide-react'

interface MediaPickerProps {
  isOpen: boolean
  onClose: () => void
  onSelect: (imageUrl: string, asset?: MediaAsset) => void
  defaultFolder?: MediaFolder
  title?: string
}

export const MediaPicker: React.FC<MediaPickerProps> = ({
  isOpen,
  onClose,
  onSelect,
  defaultFolder = 'General',
  title = 'SELECT OR UPLOAD IMAGE',
}) => {
  const { assets, uploadFile } = useMediaStore()

  const [activeTab, setActiveTab] = useState<'upload' | 'library'>('library')
  const [selectedFolder, setSelectedFolder] = useState<string>(defaultFolder || 'ALL')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedAsset, setSelectedAsset] = useState<MediaAsset | null>(null)

  // Upload State
  const [isDragging, setIsDragging] = useState(false)
  const [uploadProgress, setUploadProgress] = useState<number | null>(null)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [targetFolder, setTargetFolder] = useState<MediaFolder>(defaultFolder || 'General')
  const fileInputRef = useRef<HTMLInputElement>(null)

  if (!isOpen) return null

  const folders: (MediaFolder | 'ALL')[] = [
    'ALL',
    'Homepage',
    'Products',
    'Categories',
    'Custom Designs',
    'Marketing',
    'General',
  ]

  const filteredAssets = assets.filter((asset) => {
    if (selectedFolder !== 'ALL' && asset.folder !== selectedFolder) {
      return false
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim()
      return (
        asset.title.toLowerCase().includes(q) ||
        asset.fileName.toLowerCase().includes(q) ||
        asset.altText.toLowerCase().includes(q)
      )
    }
    return true
  })

  const validateAndUpload = async (file: File) => {
    setUploadError(null)

    // 1. Validation
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg']
    if (!allowedTypes.includes(file.type)) {
      setUploadError('Invalid file type. Allowed formats: JPG, JPEG, PNG, WEBP.')
      return
    }

    if (file.size > 10 * 1024 * 1024) {
      setUploadError('File size exceeds 10MB limit.')
      return
    }

    // 2. Simulated Upload Progress
    setUploadProgress(15)
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (!prev) return 30
        if (prev >= 90) {
          clearInterval(interval)
          return 90
        }
        return prev + 25
      })
    }, 120)

    try {
      const created = await uploadFile(file, targetFolder, 'Admin Operator')
      clearInterval(interval)
      setUploadProgress(100)

      setTimeout(() => {
        setUploadProgress(null)
        setSelectedAsset(created)
        setActiveTab('library')
        // Automatically select the uploaded image
        onSelect(created.url, created)
        onClose()
      }, 500)
    } catch {
      clearInterval(interval)
      setUploadProgress(null)
      setUploadError('Failed to upload image. Please try again.')
    }
  }

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      validateAndUpload(e.dataTransfer.files[0])
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndUpload(e.target.files[0])
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
      <div className="bg-white border border-[#090808] w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="p-4 bg-[#090808] text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <ImageIcon size={18} className="text-white" />
            <span className="font-display text-sm font-bold tracking-wider uppercase">
              {title}
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1 text-[#BEBDBB] hover:text-white transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-[#E1E0DC] bg-[#F0EFED] text-xs font-mono font-bold uppercase">
          <button
            type="button"
            onClick={() => setActiveTab('library')}
            className={`flex-1 py-3 px-4 border-r border-[#E1E0DC] text-center transition-colors ${
              activeTab === 'library'
                ? 'bg-white text-[#090808] border-b-2 border-b-[#090808]'
                : 'text-[#302F2E] hover:bg-white/60'
            }`}
          >
            SELECT FROM MEDIA LIBRARY ({assets.length})
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('upload')}
            className={`flex-1 py-3 px-4 text-center transition-colors ${
              activeTab === 'upload'
                ? 'bg-white text-[#090808] border-b-2 border-b-[#090808]'
                : 'text-[#302F2E] hover:bg-white/60'
            }`}
          >
            + UPLOAD FROM COMPUTER
          </button>
        </div>

        {/* TAB 1: MEDIA LIBRARY */}
        {activeTab === 'library' && (
          <div className="flex-1 flex flex-col min-h-0 p-4 space-y-4 overflow-y-auto">
            
            {/* Search & Folder Filters */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#E1E0DC]">
              <div className="relative flex-1 min-w-[220px]">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#BEBDBB]" />
                <input
                  type="text"
                  placeholder="Search media assets..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#F0EFED] border border-[#E1E0DC] pl-9 pr-3 py-1.5 text-xs text-[#090808] placeholder-[#BEBDBB] focus:outline-none focus:border-[#090808]"
                />
              </div>

              {/* Folder Pills */}
              <div className="flex flex-wrap gap-1">
                {folders.map((f) => (
                  <button
                    key={f}
                    type="button"
                    onClick={() => setSelectedFolder(f)}
                    className={`px-2.5 py-1 text-[10px] font-mono font-bold uppercase transition-colors ${
                      selectedFolder === f
                        ? 'bg-[#090808] text-white'
                        : 'bg-[#F0EFED] text-[#302F2E] hover:bg-[#E1E0DC]'
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            {/* Assets Grid */}
            {filteredAssets.length === 0 ? (
              <div className="py-16 text-center space-y-2">
                <ImageIcon size={32} className="mx-auto text-[#BEBDBB]" />
                <p className="font-mono text-xs text-[#BEBDBB] uppercase font-bold">
                  NO IMAGES FOUND IN THIS FOLDER
                </p>
                <button
                  type="button"
                  onClick={() => setActiveTab('upload')}
                  className="inline-block mt-2 px-3 py-1.5 bg-[#090808] text-white text-[11px] font-mono font-bold uppercase"
                >
                  UPLOAD FIRST IMAGE
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 overflow-y-auto flex-1 p-1">
                {filteredAssets.map((asset) => {
                  const isSelected = selectedAsset?.id === asset.id
                  return (
                    <div
                      key={asset.id}
                      onClick={() => setSelectedAsset(asset)}
                      className={`group relative aspect-4/3 bg-[#F0EFED] border-2 cursor-pointer transition-all overflow-hidden flex flex-col justify-end ${
                        isSelected
                          ? 'border-[#090808] ring-2 ring-[#090808]/20 shadow-md'
                          : 'border-[#E1E0DC] hover:border-[#090808]'
                      }`}
                    >
                      <img
                        src={asset.url}
                        alt={asset.altText}
                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />

                      {/* Top Badges */}
                      <div className="absolute top-2 left-2 right-2 flex items-center justify-between pointer-events-none">
                        <span className="bg-[#090808]/85 text-white text-[8px] font-mono font-bold px-1.5 py-0.5 uppercase tracking-wider">
                          {asset.folder}
                        </span>

                        {asset.usedIn && asset.usedIn.length > 0 && (
                          <span className="bg-emerald-800 text-white text-[8px] font-mono font-bold px-1.5 py-0.5 uppercase">
                            IN USE
                          </span>
                        )}
                      </div>

                      {/* Check icon if selected */}
                      {isSelected && (
                        <div className="absolute inset-0 bg-[#090808]/30 flex items-center justify-center pointer-events-none">
                          <div className="w-8 h-8 rounded-full bg-[#090808] text-white flex items-center justify-center shadow-lg">
                            <Check size={18} />
                          </div>
                        </div>
                      )}

                      {/* Bottom Caption */}
                      <div className="relative z-10 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-2 text-white text-left">
                        <p className="text-[10px] font-bold truncate leading-tight">
                          {asset.title}
                        </p>
                        <p className="text-[9px] font-mono text-zinc-300 truncate">
                          {asset.fileSize}
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}

            {/* Selected Asset Details Footer */}
            {selectedAsset && (
              <div className="p-3 bg-[#F0EFED] border border-[#E1E0DC] flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
                <div className="flex items-center gap-3">
                  <img
                    src={selectedAsset.url}
                    alt={selectedAsset.altText}
                    className="w-12 h-12 object-cover border border-[#090808]"
                  />
                  <div>
                    <p className="font-bold text-[#090808] uppercase text-[11px] truncate max-w-xs">
                      {selectedAsset.title}
                    </p>
                    <p className="text-[10px] text-[#BEBDBB]">
                      {selectedAsset.fileName} • {selectedAsset.fileSize} • {selectedAsset.dimensions}
                    </p>
                    {selectedAsset.usedIn && selectedAsset.usedIn.length > 0 && (
                      <p className="text-[10px] text-emerald-700 font-bold">
                        ACTIVE ON: {selectedAsset.usedIn.map((u) => u.location).join(', ')}
                      </p>
                    )}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    onSelect(selectedAsset.url, selectedAsset)
                    onClose()
                  }}
                  className="px-5 py-2.5 bg-[#090808] text-white text-xs font-mono font-bold uppercase hover:opacity-85 transition-opacity flex items-center gap-1.5 shadow-md"
                >
                  <Check size={14} />
                  <span>USE THIS IMAGE</span>
                </button>
              </div>
            )}

          </div>
        )}

        {/* TAB 2: UPLOAD FROM COMPUTER */}
        {activeTab === 'upload' && (
          <div className="p-6 space-y-6 overflow-y-auto">
            
            {/* Target Folder Selector */}
            <div className="space-y-1.5 text-xs font-mono">
              <label className="text-[11px] font-bold uppercase text-[#090808] block">
                DESTINATION STORAGE FOLDER *
              </label>
              <select
                value={targetFolder}
                onChange={(e) => setTargetFolder(e.target.value as MediaFolder)}
                className="w-full bg-[#F0EFED] border border-[#E1E0DC] p-2.5 text-xs font-bold uppercase focus:outline-none"
              >
                <option value="Homepage">Homepage (Hero, Editorial, Banners)</option>
                <option value="Products">Products (Garment Catalogs & Gallery)</option>
                <option value="Categories">Categories (Category Cards)</option>
                <option value="Custom Designs">Custom Designs (2D Studio Canvas Graphics)</option>
                <option value="Marketing">Marketing (Promotions, Social OG)</option>
                <option value="General">General (Site Logos, Icons)</option>
              </select>
            </div>

            {/* Drag & Drop Area */}
            <div
              onDragOver={(e) => {
                e.preventDefault()
                setIsDragging(true)
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleFileDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed p-10 text-center cursor-pointer transition-all ${
                isDragging
                  ? 'border-[#090808] bg-[#F0EFED]'
                  : 'border-[#BEBDBB] hover:border-[#090808] bg-[#FAFAFA]'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/jpg"
                onChange={handleFileChange}
                className="hidden"
              />

              <UploadCloud size={40} className="mx-auto text-[#090808] mb-3" />
              
              <p className="font-display font-bold text-sm uppercase text-[#090808]">
                DRAG & DROP IMAGE HERE OR CLICK TO BROWSE COMPUTER
              </p>
              
              <p className="text-xs font-mono text-[#BEBDBB] mt-1">
                Supported formats: JPG, JPEG, PNG, WEBP (Max: 10MB)
              </p>
            </div>

            {/* Error Banner */}
            {uploadError && (
              <div className="p-3 bg-rose-50 border border-rose-300 text-rose-800 text-xs font-mono flex items-center gap-2">
                <AlertCircle size={14} className="text-rose-700 shrink-0" />
                <span>{uploadError}</span>
              </div>
            )}

            {/* Upload Progress Indicator */}
            {uploadProgress !== null && (
              <div className="space-y-2 p-4 bg-[#F0EFED] border border-[#E1E0DC]">
                <div className="flex justify-between text-xs font-mono font-bold">
                  <span className="text-[#090808]">
                    {uploadProgress < 100 ? `UPLOADING TO SUPABASE STORAGE... ${uploadProgress}%` : 'UPLOAD COMPLETE! ATTACHING...'}
                  </span>
                  <span className="text-emerald-700">{uploadProgress}%</span>
                </div>
                <div className="w-full bg-[#E1E0DC] h-2 overflow-hidden">
                  <div
                    className="bg-[#090808] h-full transition-all duration-200"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>
            )}

          </div>
        )}

        {/* Footer */}
        <div className="p-3 bg-[#F0EFED] border-t border-[#E1E0DC] flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 border border-[#090808] text-xs font-mono font-bold uppercase hover:bg-white transition-colors"
          >
            CANCEL
          </button>
        </div>

      </div>
    </div>
  )
}

export default MediaPicker

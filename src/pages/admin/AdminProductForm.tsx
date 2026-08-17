import React, { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useProductCatalogStore } from '@/stores/productCatalogStore'
import { useMediaStore } from '@/stores/mediaStore'
import { Product, ProductColor, ProductVariant } from '@/types/product'
import { formatPrice, slugify } from '@/lib/utils'
import { MediaPicker } from '@/components/admin/MediaPicker'
import {
  ArrowLeft,
  Save,
  Sparkles,
  Layers,
  DollarSign,
  Palette,
  Image as ImageIcon,
  Sliders,
  CheckCircle2,
  Trash2,
  Upload,
  Plus,
  Star,
  RotateCw,
} from 'lucide-react'

type MediaPickerTarget = 'PRIMARY' | 'HOVER' | 'ADD_GALLERY' | { type: 'REPLACE_GALLERY'; index: number } | null

export const AdminProductForm: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { products, categories, addProduct, updateProduct } = useProductCatalogStore()
  const { uploadFile } = useMediaStore()

  const isEditMode = Boolean(id && id !== 'new')
  const existingProduct = isEditMode ? products.find((p) => p.id === id) : null

  // Tab navigation
  const [activeTab, setActiveTab] = useState<'general' | 'pricing' | 'variants' | 'media' | 'customization' | 'details' | 'publishing'>('general')

  // Media Picker Dialog State
  const [mediaPickerOpen, setMediaPickerOpen] = useState(false)
  const [mediaPickerTarget, setMediaPickerTarget] = useState<MediaPickerTarget>(null)
  const directFileInputRef = useRef<HTMLInputElement>(null)
  const [directUploadTarget, setDirectUploadTarget] = useState<'PRIMARY' | 'HOVER' | 'GALLERY'>('PRIMARY')

  // Form State
  const [name, setName] = useState('')
  const [slug, setSlug] = useState('')
  const [categoryId, setCategoryId] = useState(categories[0]?.id || 'cat-tshirts')
  const [description, setDescription] = useState('')
  const [shortDescription, setShortDescription] = useState('')
  
  const [basePrice, setBasePrice] = useState(999)
  const [compareAtPrice, setCompareAtPrice] = useState(1299)
  
  const [imageUrl, setImageUrl] = useState('https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80')
  const [hoverImageUrl, setHoverImageUrl] = useState('https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800&auto=format&fit=crop&q=80')
  const [galleryImages, setGalleryImages] = useState<string[]>([])
  
  const [isCustomizable, setIsCustomizable] = useState(true)
  const [isNew, setIsNew] = useState(false)
  const [isFeatured, setIsFeatured] = useState(false)
  const [status, setStatus] = useState<'active' | 'draft' | 'archived'>('active')
  
  const [materials, setMaterials] = useState('100% Ring-Spun Combed Heavyweight Cotton')
  const [fabricWeight, setFabricWeight] = useState('240 GSM')
  const [fit, setFit] = useState('Boxy Oversized Drop-Shoulder')
  const [careInstructions, setCareInstructions] = useState('Machine wash cold, air dry flat.')
  const [seoTitle, setSeoTitle] = useState('')
  const [seoDescription, setSeoDescription] = useState('')

  // Colors & Sizes
  const [colors, setColors] = useState<ProductColor[]>([
    { name: 'Black', hex: '#090808' },
    { name: 'Off White', hex: '#E1E0DC' },
    { name: 'Charcoal', hex: '#302F2E' },
  ])
  const [newColorName, setNewColorName] = useState('')
  const [newColorHex, setNewColorHex] = useState('#1A1919')

  const [sizes, setSizes] = useState<string[]>(['XS', 'S', 'M', 'L', 'XL', 'XXL'])
  const [variants, setVariants] = useState<ProductVariant[]>([])

  // Load existing data if editing
  useEffect(() => {
    if (existingProduct) {
      setName(existingProduct.name)
      setSlug(existingProduct.slug)
      setCategoryId(existingProduct.categoryId)
      setDescription(existingProduct.description || '')
      setShortDescription(existingProduct.shortDescription || '')
      setBasePrice(existingProduct.basePrice)
      setCompareAtPrice(existingProduct.compareAtPrice || existingProduct.basePrice * 1.25)
      setImageUrl(existingProduct.imageUrl)
      setHoverImageUrl(existingProduct.hoverImageUrl || '')
      setGalleryImages(
        existingProduct.galleryImages ||
        ([existingProduct.imageUrl, existingProduct.hoverImageUrl].filter((x): x is string => Boolean(x)))
      )
      setIsCustomizable(existingProduct.isCustomizable)
      setIsNew(existingProduct.isNew)
      setIsFeatured(existingProduct.isFeatured || false)
      setStatus(existingProduct.status || (existingProduct.isActive ? 'active' : 'draft'))
      setMaterials(existingProduct.materials || '')
      setFabricWeight(existingProduct.fabricWeight || '240 GSM')
      setFit(existingProduct.fit || '')
      setCareInstructions(existingProduct.careInstructions || '')
      setSeoTitle(existingProduct.seoTitle || existingProduct.name)
      setSeoDescription(existingProduct.seoDescription || '')
      setColors(existingProduct.colors || [])
      setSizes(existingProduct.sizes || [])
      setVariants(existingProduct.variants || [])
    }
  }, [existingProduct])

  // Sync slug from name
  const handleNameChange = (val: string) => {
    setName(val)
    if (!isEditMode) {
      setSlug(slugify(val))
    }
  }

  // Variant generator
  const handleGenerateVariants = () => {
    const generated: ProductVariant[] = []
    colors.forEach((col) => {
      sizes.forEach((sz) => {
        const sku = `${slug.toUpperCase() || 'GARMENT'}-${col.name.toUpperCase().slice(0, 3)}-${sz}`
        generated.push({
          id: `var-${Date.now()}-${col.name}-${sz}`,
          productId: existingProduct?.id || 'new',
          color: col.name,
          colorHex: col.hex,
          size: sz,
          sku,
          price: basePrice,
          stock: 25,
          isActive: true,
        })
      })
    })
    setVariants(generated)
  }

  const handleAddColor = () => {
    if (!newColorName.trim()) return
    setColors([...colors, { name: newColorName.trim(), hex: newColorHex }])
    setNewColorName('')
  }

  const handleRemoveColor = (nameToRemove: string) => {
    setColors(colors.filter((c) => c.name !== nameToRemove))
  }

  const handleToggleSize = (sizeVal: string) => {
    if (sizes.includes(sizeVal)) {
      setSizes(sizes.filter((s) => s !== sizeVal))
    } else {
      setSizes([...sizes, sizeVal])
    }
  }

  // Media Picker Handler
  const handleMediaSelected = (url: string) => {
    if (!mediaPickerTarget) return

    if (mediaPickerTarget === 'PRIMARY') {
      setImageUrl(url)
    } else if (mediaPickerTarget === 'HOVER') {
      setHoverImageUrl(url)
    } else if (mediaPickerTarget === 'ADD_GALLERY') {
      setGalleryImages((prev) => [...prev, url])
    } else if (typeof mediaPickerTarget === 'object' && mediaPickerTarget.type === 'REPLACE_GALLERY') {
      const idx = mediaPickerTarget.index
      setGalleryImages((prev) => prev.map((img, i) => (i === idx ? url : img)))
    }

    setMediaPickerTarget(null)
  }

  // Direct Computer File Upload
  const handleDirectComputerUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return
    const files = Array.from(e.target.files)

    for (const file of files) {
      try {
        const created = await uploadFile(file, 'Products', 'Admin Operator')
        if (directUploadTarget === 'PRIMARY') {
          setImageUrl(created.url)
        } else if (directUploadTarget === 'HOVER') {
          setHoverImageUrl(created.url)
        } else if (directUploadTarget === 'GALLERY') {
          setGalleryImages((prev) => [...prev, created.url])
        }
      } catch (err) {
        console.error('Upload failed:', err)
      }
    }

    if (directFileInputRef.current) {
      directFileInputRef.current.value = ''
    }
  }

  const triggerDirectUpload = (target: 'PRIMARY' | 'HOVER' | 'GALLERY') => {
    setDirectUploadTarget(target)
    directFileInputRef.current?.click()
  }

  const handleSave = (e?: React.FormEvent, overrideStatus?: 'active' | 'draft' | 'archived') => {
    if (e) e.preventDefault()
    const targetCategory = categories.find((c) => c.id === categoryId)
    const finalStatus = overrideStatus || status

    let finalVariants = variants
    if (finalVariants.length === 0) {
      colors.forEach((col) => {
        sizes.forEach((sz) => {
          finalVariants.push({
            id: `var-${Date.now()}-${col.name}-${sz}`,
            productId: existingProduct?.id || 'new',
            color: col.name,
            colorHex: col.hex,
            size: sz,
            sku: `${(slug || 'GARMENT').toUpperCase()}-${col.name.toUpperCase().slice(0, 3)}-${sz}`,
            price: Number(basePrice),
            stock: 25,
            isActive: true,
          })
        })
      })
    }

    const payload: Product = {
      id: isEditMode && existingProduct ? existingProduct.id : `prod-${Date.now()}`,
      name: name || 'UNTITLED GARMENT PIECE',
      slug: slug || `garment-${Date.now()}`,
      description,
      shortDescription,
      categoryId,
      categoryName: targetCategory?.name || 'T-SHIRTS',
      basePrice: Number(basePrice),
      compareAtPrice: Number(compareAtPrice),
      imageUrl: imageUrl || galleryImages[0] || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80',
      hoverImageUrl,
      galleryImages: galleryImages.length > 0 ? galleryImages : [imageUrl, hoverImageUrl].filter(Boolean),
      isCustomizable,
      isActive: finalStatus === 'active',
      isNew,
      isFeatured,
      status: finalStatus,
      colors,
      sizes,
      variants: finalVariants,
      materials,
      fabricWeight,
      fit,
      careInstructions,
      seoTitle,
      seoDescription,
    }

    if (isEditMode && existingProduct) {
      updateProduct(existingProduct.id, payload)
    } else {
      addProduct(payload)
    }

    navigate('/admin/products')
  }

  const tabs: { key: typeof activeTab; label: string; icon: React.ReactNode }[] = [
    { key: 'general', label: '1. GENERAL INFO', icon: <Layers size={14} /> },
    { key: 'pricing', label: '2. PRICING & TIERS', icon: <DollarSign size={14} /> },
    { key: 'variants', label: '3. COLORS & SIZES', icon: <Palette size={14} /> },
    { key: 'media', label: '4. MEDIA & GALLERY', icon: <ImageIcon size={14} /> },
    { key: 'customization', label: '5. STUDIO SPECS', icon: <Sparkles size={14} /> },
    { key: 'details', label: '6. FABRIC & SEO', icon: <Sliders size={14} /> },
    { key: 'publishing', label: '7. PUBLISHING', icon: <CheckCircle2 size={14} /> },
  ]

  return (
    <div className="space-y-6 pb-20">
      
      {/* Hidden File Input for Direct Computer Uploads */}
      <input
        ref={directFileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/jpg"
        multiple={directUploadTarget === 'GALLERY'}
        onChange={handleDirectComputerUpload}
        className="hidden"
      />

      {/* Global Media Picker Modal */}
      <MediaPicker
        isOpen={mediaPickerOpen}
        onClose={() => {
          setMediaPickerOpen(false)
          setMediaPickerTarget(null)
        }}
        onSelect={handleMediaSelected}
        defaultFolder="Products"
        title="PRODUCT MEDIA & DIGITAL ASSET SELECTOR"
      />

      {/* Top Header & Sticky Actions */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#BEBDBB]/30">
        <div>
          <Link
            to="/admin/products"
            className="inline-flex items-center gap-1.5 text-[10px] font-mono font-bold tracking-widest text-[#BEBDBB] uppercase hover:text-[#090808] transition-colors mb-1"
          >
            <ArrowLeft size={12} />
            <span>BACK TO GARMENT CATALOG</span>
          </Link>
          <h1 className="font-display text-2xl sm:text-3xl font-bold uppercase tracking-tight text-[#090808]">
            {isEditMode ? `EDIT GARMENT: ${name || 'BLANK'}` : 'CREATE NEW GARMENT BLANK'}
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => handleSave(undefined, 'draft')}
            className="px-4 py-2 border border-[#090808] text-xs font-mono font-bold uppercase hover:bg-[#F0EFED] transition-colors"
          >
            SAVE AS DRAFT
          </button>

          <button
            type="button"
            onClick={() => handleSave(undefined, 'active')}
            className="inline-flex items-center gap-2 px-5 py-2 bg-[#090808] text-white text-xs font-mono font-bold uppercase hover:opacity-85 transition-opacity shadow-md"
          >
            <Save size={14} />
            <span>{isEditMode ? 'SAVE & PUBLISH' : 'CREATE & PUBLISH'}</span>
          </button>
        </div>
      </div>

      {/* 7-TAB STEPPER NAVIGATION */}
      <div className="flex border-b border-[#E1E0DC] overflow-x-auto bg-white">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-2 px-4 py-3 text-xs font-mono font-bold uppercase tracking-wider whitespace-nowrap transition-colors border-b-2 ${
              activeTab === tab.key
                ? 'border-[#090808] text-[#090808] bg-[#F0EFED]/50'
                : 'border-transparent text-[#BEBDBB] hover:text-[#090808]'
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* TAB PANELS */}
      <form onSubmit={(e) => handleSave(e)} className="bg-white border border-[#E1E0DC] p-6 space-y-6">
        
        {/* TAB 1: GENERAL INFO */}
        {activeTab === 'general' && (
          <div className="space-y-5 max-w-2xl">
            <div className="space-y-1">
              <label className="text-[11px] font-mono font-bold uppercase text-[#090808]">
                GARMENT BLANK NAME *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. ACID WASH OVERSIZED VINTAGE TEE"
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                className="w-full bg-[#F0EFED] border border-[#E1E0DC] p-3 text-xs font-bold text-[#090808] uppercase focus:outline-none focus:border-[#090808]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[11px] font-mono font-bold uppercase text-[#090808]">
                  URL SLUG (PERMALINK) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="acid-wash-vintage-tee"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  className="w-full bg-[#F0EFED] border border-[#E1E0DC] p-3 font-mono text-xs text-[#302F2E] focus:outline-none focus:border-[#090808]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-mono font-bold uppercase text-[#090808]">
                  CATALOG CATEGORY *
                </label>
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="w-full bg-[#F0EFED] border border-[#E1E0DC] p-3 text-xs font-mono font-bold uppercase focus:outline-none focus:border-[#090808]"
                >
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-mono font-bold uppercase text-[#090808]">
                EDITORIAL DESCRIPTION (DETAILED) *
              </label>
              <textarea
                rows={5}
                required
                placeholder="Detailed garment composition, silhouette styling, and archival inspiration..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-[#F0EFED] border border-[#E1E0DC] p-3 text-xs text-[#090808] focus:outline-none focus:border-[#090808]"
              />
            </div>
          </div>
        )}

        {/* TAB 2: PRICING */}
        {activeTab === 'pricing' && (
          <div className="space-y-5 max-w-2xl">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-1">
                <label className="text-[11px] font-mono font-bold uppercase text-[#090808]">
                  BASE RETAIL PRICE *
                </label>
                <input
                  type="number"
                  required
                  value={basePrice}
                  onChange={(e) => setBasePrice(Number(e.target.value))}
                  className="w-full bg-[#F0EFED] border border-[#E1E0DC] p-3 font-mono text-base font-bold text-[#090808] focus:outline-none focus:border-[#090808]"
                />
                <p className="text-[10px] font-mono text-emerald-800">
                  Formatted: {formatPrice(basePrice)}
                </p>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-mono font-bold uppercase text-[#090808]">
                  COMPARE-AT PRICE (MSRP)
                </label>
                <input
                  type="number"
                  value={compareAtPrice}
                  onChange={(e) => setCompareAtPrice(Number(e.target.value))}
                  className="w-full bg-[#F0EFED] border border-[#E1E0DC] p-3 font-mono text-base text-[#302F2E] focus:outline-none focus:border-[#090808]"
                />
                <p className="text-[10px] font-mono text-[#BEBDBB]">
                  Formatted: {formatPrice(compareAtPrice)}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: COLORS & SIZES */}
        {activeTab === 'variants' && (
          <div className="space-y-6 max-w-3xl">
            {/* Color Swatch Manager */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-display text-sm font-bold uppercase text-[#090808]">
                  FABRIC COLORWAYS ({colors.length})
                </h3>
              </div>

              <div className="flex flex-wrap gap-3">
                {colors.map((col) => (
                  <div
                    key={col.name}
                    className="flex items-center gap-2 px-3 py-1.5 bg-[#F0EFED] border border-[#E1E0DC] text-xs font-mono"
                  >
                    <span
                      className="w-3.5 h-3.5 rounded-full border border-black/20"
                      style={{ backgroundColor: col.hex }}
                    />
                    <span className="font-bold text-[#090808]">{col.name}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveColor(col.name)}
                      className="text-[#BEBDBB] hover:text-rose-600 ml-1"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                ))}
              </div>

              <div className="flex gap-2 pt-2">
                <input
                  type="text"
                  placeholder="New Color Name (e.g. Mineral Sage)"
                  value={newColorName}
                  onChange={(e) => setNewColorName(e.target.value)}
                  className="bg-[#F0EFED] border border-[#E1E0DC] p-2 text-xs text-[#090808] focus:outline-none"
                />
                <input
                  type="color"
                  value={newColorHex}
                  onChange={(e) => setNewColorHex(e.target.value)}
                  className="w-9 h-9 border border-[#E1E0DC] cursor-pointer bg-white"
                />
                <button
                  type="button"
                  onClick={handleAddColor}
                  className="px-3 py-2 bg-[#090808] text-white text-xs font-mono font-bold uppercase hover:opacity-85"
                >
                  ADD COLOR
                </button>
              </div>
            </div>

            {/* Size Manager */}
            <div className="space-y-3 pt-4 border-t border-[#E1E0DC]">
              <h3 className="font-display text-sm font-bold uppercase text-[#090808]">
                AVAILABLE SIZES
              </h3>
              <div className="flex flex-wrap gap-2">
                {['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL', 'ADJUSTABLE'].map((sz) => (
                  <button
                    key={sz}
                    type="button"
                    onClick={() => handleToggleSize(sz)}
                    className={`px-3 py-1.5 font-mono text-xs font-bold uppercase border transition-colors ${
                      sizes.includes(sz)
                        ? 'bg-[#090808] text-white border-[#090808]'
                        : 'bg-[#F0EFED] text-[#302F2E] border-[#E1E0DC] hover:border-[#090808]'
                    }`}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>

            {/* Variant Matrix Generator */}
            <div className="pt-4 border-t border-[#E1E0DC] flex items-center justify-between">
              <div>
                <p className="font-bold text-xs text-[#090808]">SKU VARIANT MATRIX</p>
                <p className="text-[10px] font-mono text-[#BEBDBB]">
                  {variants.length} combinations generated ({colors.length} colors × {sizes.length} sizes)
                </p>
              </div>
              <button
                type="button"
                onClick={handleGenerateVariants}
                className="px-3 py-2 border border-[#090808] text-xs font-mono font-bold uppercase hover:bg-[#F0EFED]"
              >
                REGENERATE MATRIX
              </button>
            </div>
          </div>
        )}

        {/* TAB 4: MEDIA & GALLERY (ENHANCED COMPUTER UPLOADS & MEDIAPICKER) */}
        {activeTab === 'media' && (
          <div className="space-y-8 max-w-4xl">
            
            {/* Section 1 & 2: Primary and Hover Images */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* PRIMARY PRODUCT IMAGE */}
              <div className="p-4 bg-[#F0EFED] border border-[#E1E0DC] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono font-bold uppercase text-[#090808] flex items-center gap-1.5">
                    <Star size={13} className="text-amber-600 fill-amber-500" />
                    <span>PRIMARY PRODUCT IMAGE *</span>
                  </span>
                  {imageUrl && (
                    <button
                      type="button"
                      onClick={() => setImageUrl('')}
                      className="text-[10px] font-mono text-rose-700 hover:underline uppercase"
                    >
                      REMOVE
                    </button>
                  )}
                </div>

                {/* Preview Box */}
                <div className="aspect-4/3 bg-white border border-[#E1E0DC] overflow-hidden flex items-center justify-center relative group">
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt="Primary Preview"
                      className="w-full h-full object-contain p-2"
                    />
                  ) : (
                    <div className="text-center p-4 text-[#BEBDBB]">
                      <ImageIcon size={32} className="mx-auto mb-1" />
                      <p className="font-mono text-[10px] uppercase font-bold">NO PRIMARY IMAGE</p>
                    </div>
                  )}
                </div>

                {/* Buttons */}
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => triggerDirectUpload('PRIMARY')}
                    className="flex-1 py-2 bg-[#090808] text-white text-[10px] font-mono font-bold uppercase hover:opacity-85 transition-opacity flex items-center justify-center gap-1"
                  >
                    <Upload size={12} />
                    <span>UPLOAD FROM COMPUTER</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setMediaPickerTarget('PRIMARY')
                      setMediaPickerOpen(true)
                    }}
                    className="flex-1 py-2 border border-[#090808] text-[#090808] text-[10px] font-mono font-bold uppercase hover:bg-white transition-colors flex items-center justify-center gap-1"
                  >
                    <ImageIcon size={12} />
                    <span>SELECT FROM MEDIA</span>
                  </button>
                </div>
              </div>

              {/* HOVER / EDITORIAL IMAGE */}
              <div className="p-4 bg-[#F0EFED] border border-[#E1E0DC] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono font-bold uppercase text-[#090808] flex items-center gap-1.5">
                    <RotateCw size={13} className="text-[#302F2E]" />
                    <span>HOVER / EDITORIAL IMAGE</span>
                  </span>
                  {hoverImageUrl && (
                    <button
                      type="button"
                      onClick={() => setHoverImageUrl('')}
                      className="text-[10px] font-mono text-rose-700 hover:underline uppercase"
                    >
                      REMOVE
                    </button>
                  )}
                </div>

                {/* Preview Box */}
                <div className="aspect-4/3 bg-white border border-[#E1E0DC] overflow-hidden flex items-center justify-center relative group">
                  {hoverImageUrl ? (
                    <img
                      src={hoverImageUrl}
                      alt="Hover Preview"
                      className="w-full h-full object-contain p-2"
                    />
                  ) : (
                    <div className="text-center p-4 text-[#BEBDBB]">
                      <ImageIcon size={32} className="mx-auto mb-1" />
                      <p className="font-mono text-[10px] uppercase font-bold">NO HOVER IMAGE</p>
                    </div>
                  )}
                </div>

                {/* Buttons */}
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => triggerDirectUpload('HOVER')}
                    className="flex-1 py-2 bg-[#090808] text-white text-[10px] font-mono font-bold uppercase hover:opacity-85 transition-opacity flex items-center justify-center gap-1"
                  >
                    <Upload size={12} />
                    <span>UPLOAD FROM COMPUTER</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setMediaPickerTarget('HOVER')
                      setMediaPickerOpen(true)
                    }}
                    className="flex-1 py-2 border border-[#090808] text-[#090808] text-[10px] font-mono font-bold uppercase hover:bg-white transition-colors flex items-center justify-center gap-1"
                  >
                    <ImageIcon size={12} />
                    <span>SELECT FROM MEDIA</span>
                  </button>
                </div>
              </div>

            </div>

            {/* Section 3: PRODUCT GALLERY IMAGES (MULTI-UPLOAD & REORDER) */}
            <div className="space-y-4 pt-4 border-t border-[#E1E0DC]">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h3 className="font-display text-sm font-bold uppercase text-[#090808]">
                    PRODUCT GALLERY & CAROUSEL IMAGES ({galleryImages.length})
                  </h3>
                  <p className="text-[10px] font-mono text-[#BEBDBB]">
                    Drag or select images to showcase lifestyle, detail, fabric, and angles.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => triggerDirectUpload('GALLERY')}
                    className="px-3 py-1.5 bg-[#090808] text-white text-xs font-mono font-bold uppercase hover:opacity-85 flex items-center gap-1.5"
                  >
                    <Upload size={12} />
                    <span>+ UPLOAD FROM COMPUTER</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setMediaPickerTarget('ADD_GALLERY')
                      setMediaPickerOpen(true)
                    }}
                    className="px-3 py-1.5 border border-[#090808] text-xs font-mono font-bold uppercase hover:bg-[#F0EFED] flex items-center gap-1.5"
                  >
                    <Plus size={12} />
                    <span>SELECT FROM MEDIA</span>
                  </button>
                </div>
              </div>

              {galleryImages.length === 0 ? (
                <div className="p-8 bg-[#F0EFED] border border-dashed border-[#BEBDBB] text-center space-y-2">
                  <ImageIcon size={28} className="mx-auto text-[#BEBDBB]" />
                  <p className="font-mono text-xs text-[#BEBDBB] uppercase font-bold">
                    NO GALLERY IMAGES ADDED YET
                  </p>
                  <p className="text-[10px] font-mono text-[#302F2E]">
                    Click above to upload multiple high-res product photos from your computer.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {galleryImages.map((img, idx) => (
                    <div
                      key={idx}
                      className="group bg-white border border-[#E1E0DC] hover:border-[#090808] transition-all overflow-hidden flex flex-col justify-between shadow-xs"
                    >
                      <div className="relative aspect-square bg-[#F0EFED] overflow-hidden">
                        <img
                          src={img}
                          alt={`Gallery ${idx + 1}`}
                          className="w-full h-full object-cover"
                        />
                        <span className="absolute top-1.5 left-1.5 bg-[#090808]/80 text-white font-mono text-[9px] font-bold px-1.5 py-0.5">
                          #{idx + 1}
                        </span>

                        {imageUrl === img && (
                          <span className="absolute top-1.5 right-1.5 bg-amber-600 text-white font-mono text-[8px] font-bold px-1.5 py-0.5 uppercase">
                            PRIMARY
                          </span>
                        )}
                        {hoverImageUrl === img && imageUrl !== img && (
                          <span className="absolute top-1.5 right-1.5 bg-zinc-800 text-white font-mono text-[8px] font-bold px-1.5 py-0.5 uppercase">
                            HOVER
                          </span>
                        )}
                      </div>

                      {/* Action buttons on card */}
                      <div className="p-2 bg-[#F0EFED] space-y-1 text-[10px] font-mono">
                        <div className="flex gap-1">
                          <button
                            type="button"
                            onClick={() => setImageUrl(img)}
                            className="flex-1 py-1 bg-white border border-[#E1E0DC] hover:border-[#090808] font-bold uppercase text-[9px]"
                            title="Set as Primary Catalog Shot"
                          >
                            SET PRIMARY
                          </button>
                          <button
                            type="button"
                            onClick={() => setHoverImageUrl(img)}
                            className="flex-1 py-1 bg-white border border-[#E1E0DC] hover:border-[#090808] font-bold uppercase text-[9px]"
                            title="Set as Hover Profile"
                          >
                            SET HOVER
                          </button>
                        </div>

                        <div className="flex justify-between items-center pt-1 border-t border-[#E1E0DC]">
                          <button
                            type="button"
                            onClick={() => {
                              setMediaPickerTarget({ type: 'REPLACE_GALLERY', index: idx })
                              setMediaPickerOpen(true)
                            }}
                            className="text-[#302F2E] hover:underline uppercase text-[9px] font-bold"
                          >
                            REPLACE
                          </button>

                          <button
                            type="button"
                            onClick={() => setGalleryImages((prev) => prev.filter((_, i) => i !== idx))}
                            className="text-rose-700 hover:underline uppercase text-[9px] font-bold"
                          >
                            REMOVE
                          </button>
                        </div>
                      </div>

                    </div>
                  ))}
                </div>
              )}

            </div>

          </div>
        )}

        {/* TAB 5: CUSTOMIZATION STUDIO */}
        {activeTab === 'customization' && (
          <div className="space-y-5 max-w-2xl">
            <div className="flex items-center justify-between p-4 bg-[#F0EFED] border border-[#E1E0DC]">
              <div>
                <p className="font-bold text-sm text-[#090808]">ENABLE IN 2D CUSTOMIZER STUDIO</p>
                <p className="text-xs text-[#302F2E]">
                  Allows customers to add typography, graphics, and vector uploads in Fabric.js canvas.
                </p>
              </div>
              <input
                type="checkbox"
                checked={isCustomizable}
                onChange={(e) => setIsCustomizable(e.target.checked)}
                className="w-5 h-5 accent-[#090808] cursor-pointer"
              />
            </div>
          </div>
        )}

        {/* TAB 6: FABRIC & SEO */}
        {activeTab === 'details' && (
          <div className="space-y-5 max-w-2xl">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[11px] font-mono font-bold uppercase text-[#090808]">
                  FABRIC COMPOSITION
                </label>
                <input
                  type="text"
                  value={materials}
                  onChange={(e) => setMaterials(e.target.value)}
                  className="w-full bg-[#F0EFED] border border-[#E1E0DC] p-2.5 text-xs text-[#090808] focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-mono font-bold uppercase text-[#090808]">
                  FABRIC WEIGHT (GSM)
                </label>
                <input
                  type="text"
                  value={fabricWeight}
                  onChange={(e) => setFabricWeight(e.target.value)}
                  className="w-full bg-[#F0EFED] border border-[#E1E0DC] p-2.5 text-xs text-[#090808] focus:outline-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 7: PUBLISHING */}
        {activeTab === 'publishing' && (
          <div className="space-y-5 max-w-2xl">
            <div className="space-y-1">
              <label className="text-[11px] font-mono font-bold uppercase text-[#090808]">
                CATALOG VISIBILITY STATUS *
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as 'active' | 'draft' | 'archived')}
                className="w-full bg-[#F0EFED] border border-[#E1E0DC] p-3 text-xs font-mono font-bold uppercase focus:outline-none"
              >
                <option value="active">ACTIVE — VISIBLE TO PUBLIC SHOPPERS</option>
                <option value="draft">DRAFT — HIDDEN FROM PUBLIC</option>
                <option value="archived">ARCHIVED — RETIRED LOOKBOOK PIECE</option>
              </select>
            </div>
          </div>
        )}

      </form>

      {/* BOTTOM STICKY ACTION BAR */}
      <div className="fixed bottom-0 left-0 right-0 z-30 bg-[#090808] text-white border-t border-[#302F2E] p-4 flex items-center justify-between shadow-2xl">
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
          <div className="hidden sm:flex items-center gap-3 text-xs font-mono text-[#BEBDBB]">
            <span>GARMENT: <strong className="text-white">{name || 'UNTITLED'}</strong></span>
            <span>•</span>
            <span>PRICE: <strong className="text-white">{formatPrice(basePrice)}</strong></span>
            <span>•</span>
            <span>STATUS: <strong className="text-emerald-400 uppercase">{status}</strong></span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <Link
              to="/admin/products"
              className="px-4 py-2 border border-[#BEBDBB] text-xs font-mono font-bold uppercase hover:bg-white hover:text-[#090808] transition-colors"
            >
              CANCEL
            </Link>
            <button
              type="button"
              onClick={() => handleSave(undefined, status)}
              className="px-6 py-2 bg-white text-[#090808] text-xs font-mono font-bold uppercase hover:bg-[#E1E0DC] transition-colors flex items-center gap-2 shadow-lg"
            >
              <Save size={14} />
              <span>SAVE ALL CHANGES</span>
            </button>
          </div>
        </div>
      </div>

    </div>
  )
}

export default AdminProductForm

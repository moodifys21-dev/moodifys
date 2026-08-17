import React, { useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import { useProductCatalogStore } from '@/stores/productCatalogStore'
import { useMediaStore } from '@/stores/mediaStore'
import { Category } from '@/types/product'
import { MediaPicker } from '@/components/admin/MediaPicker'
import {
  Plus,
  ArrowUp,
  ArrowDown,
  Edit2,
  Trash2,
  X,
  ExternalLink,
  Image as ImageIcon,
  Upload,
  Copy,
} from 'lucide-react'

export const AdminCategories: React.FC = () => {
  const { categories, products, addCategory, updateCategory, deleteCategory, reorderCategories } = useProductCatalogStore()
  const { uploadFile } = useMediaStore()

  // Modal State
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [isNewCategoryModal, setIsNewCategoryModal] = useState(false)

  // Media Picker State
  const [mediaPickerOpen, setMediaPickerOpen] = useState(false)
  const [mediaTargetType, setMediaTargetType] = useState<'DESKTOP' | 'MOBILE'>('DESKTOP')
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Form State
  const [name, setName] = useState('')
  const [slug, setSlug] = useState('')
  const [description, setDescription] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [mobileImageUrl, setMobileImageUrl] = useState('')
  const [altText, setAltText] = useState('')
  const [buttonText, setButtonText] = useState('SHOP NOW →')
  const [buttonUrl, setButtonUrl] = useState('')
  const [isActive, setIsActive] = useState(true)
  const [isVisible, setIsVisible] = useState(true)

  const openCreateModal = () => {
    setName('')
    setSlug('')
    setDescription('')
    setImageUrl('https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80')
    setMobileImageUrl('')
    setAltText('')
    setButtonText('SHOP NOW →')
    setButtonUrl('/shop')
    setIsActive(true)
    setIsVisible(true)
    setIsNewCategoryModal(true)
    setEditingCategory(null)
  }

  const openEditModal = (cat: Category) => {
    setEditingCategory(cat)
    setName(cat.name)
    setSlug(cat.slug)
    setDescription(cat.description || '')
    setImageUrl(cat.imageUrl || '')
    setMobileImageUrl(cat.mobileImageUrl || '')
    setAltText(cat.altText || '')
    setButtonText(cat.buttonText || `SHOP ${cat.name} →`)
    setButtonUrl(cat.buttonUrl || `/shop/${cat.slug}`)
    setIsActive(cat.isActive)
    setIsVisible(cat.isVisible !== false)
    setIsNewCategoryModal(false)
  }

  const handleNameChange = (val: string) => {
    setName(val)
    if (isNewCategoryModal) {
      const generatedSlug = val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
      setSlug(generatedSlug)
      setButtonText(`SHOP ${val.toUpperCase()} →`)
      setButtonUrl(`/shop/${generatedSlug}`)
    }
  }

  const handleMediaSelected = (url: string) => {
    if (mediaTargetType === 'DESKTOP') {
      setImageUrl(url)
    } else {
      setMobileImageUrl(url)
    }
    setMediaPickerOpen(false)
  }

  const handleDirectComputerUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return
    const file = e.target.files[0]

    try {
      const created = await uploadFile(file, 'Categories', 'Admin Operator')
      if (mediaTargetType === 'DESKTOP') {
        setImageUrl(created.url)
      } else {
        setMobileImageUrl(created.url)
      }
    } catch (err) {
      console.error('Category cover upload failed:', err)
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const triggerUpload = (target: 'DESKTOP' | 'MOBILE') => {
    setMediaTargetType(target)
    fileInputRef.current?.click()
  }

  const openPickerFor = (target: 'DESKTOP' | 'MOBILE') => {
    setMediaTargetType(target)
    setMediaPickerOpen(true)
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !slug.trim()) return

    if (isNewCategoryModal) {
      const newCat: Category = {
        id: `cat-${Date.now()}`,
        name: name.trim().toUpperCase(),
        slug: slug.trim().toLowerCase(),
        description: description.trim(),
        imageUrl,
        mobileImageUrl,
        altText: altText.trim(),
        buttonText: buttonText.trim(),
        buttonUrl: buttonUrl.trim(),
        sortOrder: categories.length + 1,
        isActive,
        isVisible,
      }
      addCategory(newCat)
      setIsNewCategoryModal(false)
    } else if (editingCategory) {
      updateCategory(editingCategory.id, {
        name: name.trim().toUpperCase(),
        slug: slug.trim().toLowerCase(),
        description: description.trim(),
        imageUrl,
        mobileImageUrl,
        altText: altText.trim(),
        buttonText: buttonText.trim(),
        buttonUrl: buttonUrl.trim(),
        isActive,
        isVisible,
      })
      setEditingCategory(null)
    }
  }

  const handleDuplicate = (cat: Category) => {
    const duplicated: Category = {
      ...cat,
      id: `cat-${Date.now()}`,
      name: `${cat.name} (COPY)`,
      slug: `${cat.slug}-copy-${Math.floor(Math.random() * 1000)}`,
      sortOrder: categories.length + 1,
    }
    addCategory(duplicated)
  }

  const handleMove = (index: number, direction: 'up' | 'down') => {
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === categories.length - 1)
    ) {
      return
    }

    const targetIndex = direction === 'up' ? index - 1 : index + 1
    const copy = [...categories]
    const temp = copy[index]
    copy[index] = copy[targetIndex]
    copy[targetIndex] = temp

    const reordered = copy.map((c, i) => ({ ...c, sortOrder: i + 1 }))
    reorderCategories(reordered)
  }

  const handleDelete = (cat: Category) => {
    const attachedCount = products.filter((p) => p.categoryId === cat.id).length
    if (attachedCount > 0) {
      alert(`Cannot delete category "${cat.name}" because ${attachedCount} products are currently assigned to it. Please reassign products first.`)
      return
    }

    if (window.confirm(`Are you sure you want to delete category "${cat.name}"?`)) {
      deleteCategory(cat.id)
    }
  }

  return (
    <div className="space-y-6">
      
      {/* Hidden File Input for Direct Computer Uploads */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/jpg"
        onChange={handleDirectComputerUpload}
        className="hidden"
      />

      {/* Global Media Picker */}
      <MediaPicker
        isOpen={mediaPickerOpen}
        onClose={() => setMediaPickerOpen(false)}
        onSelect={handleMediaSelected}
        defaultFolder="Categories"
        title="CATEGORY COVER MEDIA SELECTOR"
      />

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#BEBDBB]/30">
        <div>
          <span className="text-[10px] font-mono font-bold tracking-[0.25em] text-[#BEBDBB] uppercase">
            CATALOG ARCHITECTURE
          </span>
          <h1 className="font-display text-2xl sm:text-3xl font-bold uppercase tracking-tight text-[#090808]">
            CATEGORIES & SEQUENCE MANAGER
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={openCreateModal}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#090808] text-white text-xs font-mono font-bold uppercase hover:opacity-85 transition-opacity shadow-md"
          >
            <Plus size={14} />
            <span>CREATE CATEGORY</span>
          </button>
        </div>
      </div>

      {/* CATEGORIES DIRECTORY LIST */}
      <div className="bg-white border border-[#E1E0DC] overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-[#F0EFED] text-[#BEBDBB] uppercase text-[10px] font-mono border-b border-[#E1E0DC]">
              <tr>
                <th className="p-4 pl-6 w-16">SEQ</th>
                <th className="p-4">COVER</th>
                <th className="p-4">CATEGORY NAME / SLUG</th>
                <th className="p-4">HOMEPAGE STRIP</th>
                <th className="p-4">ATTACHED PRODUCTS</th>
                <th className="p-4">CATALOG STATUS</th>
                <th className="p-4 pr-6 text-right">REORDER & ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E1E0DC]">
              {categories.map((cat, index) => {
                const attachedProductsCount = products.filter((p) => p.categoryId === cat.id).length
                const isStripVisible = cat.isVisible !== false && cat.isActive !== false

                return (
                  <tr key={cat.id} className="hover:bg-[#FAFAFA] transition-colors">
                    
                    {/* Seq number */}
                    <td className="p-4 pl-6 font-mono font-bold text-xs text-[#090808]">
                      0{index + 1}
                    </td>

                    {/* Cover image */}
                    <td className="p-4">
                      <div className="w-12 h-14 bg-[#F0EFED] border border-[#E1E0DC] overflow-hidden">
                        {cat.imageUrl ? (
                          <img
                            src={cat.imageUrl}
                            alt={cat.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-[#BEBDBB] font-mono text-[9px]">
                            N/A
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Category Details */}
                    <td className="p-4">
                      <p className="font-bold text-[#090808] text-sm uppercase">{cat.name}</p>
                      <p className="text-[10px] font-mono text-[#BEBDBB]">
                        /shop/{cat.slug}
                      </p>
                      {cat.description && (
                        <p className="text-xs text-[#302F2E] line-clamp-1 mt-0.5 max-w-sm">
                          {cat.description}
                        </p>
                      )}
                    </td>

                    {/* Homepage Strip status */}
                    <td className="p-4">
                      <button
                        type="button"
                        onClick={() => {
                          const next = !isStripVisible
                          updateCategory(cat.id, { isVisible: next, isActive: next })
                        }}
                        className={`text-[9px] font-mono font-bold px-2 py-0.5 uppercase border ${
                          isStripVisible
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                            : 'bg-zinc-100 text-zinc-600 border-zinc-300'
                        }`}
                      >
                        {isStripVisible ? 'STRIP (ON)' : 'STRIP (OFF)'}
                      </button>
                    </td>

                    {/* Products count */}
                    <td className="p-4 font-mono text-xs text-[#090808]">
                      <span className="font-bold">{attachedProductsCount}</span> garments
                    </td>

                    {/* Status */}
                    <td className="p-4">
                      <span className={`inline-flex items-center text-[9px] font-mono font-bold px-2 py-0.5 uppercase border ${
                        cat.isActive
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                          : 'bg-zinc-100 text-zinc-600 border-zinc-300'
                      }`}>
                        {cat.isActive ? 'ACTIVE' : 'DRAFT'}
                      </span>
                    </td>

                    {/* Actions & Reorder */}
                    <td className="p-4 pr-6 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        
                        {/* Sequence Buttons */}
                        <button
                          type="button"
                          disabled={index === 0}
                          onClick={() => handleMove(index, 'up')}
                          className="p-1 border border-[#E1E0DC] text-[#302F2E] hover:bg-[#F0EFED] disabled:opacity-30 transition-colors"
                          title="Move Category Up"
                        >
                          <ArrowUp size={12} />
                        </button>
                        <button
                          type="button"
                          disabled={index === categories.length - 1}
                          onClick={() => handleMove(index, 'down')}
                          className="p-1 border border-[#E1E0DC] text-[#302F2E] hover:bg-[#F0EFED] disabled:opacity-30 transition-colors"
                          title="Move Category Down"
                        >
                          <ArrowDown size={12} />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDuplicate(cat)}
                          className="p-1 border border-[#E1E0DC] text-[#302F2E] hover:bg-[#F0EFED] transition-colors"
                          title="Duplicate Category"
                        >
                          <Copy size={12} />
                        </button>

                        <Link
                          to={`/shop/${cat.slug}`}
                          target="_blank"
                          className="p-1 border border-[#E1E0DC] text-[#302F2E] hover:bg-[#F0EFED] transition-colors"
                          title="View on Storefront"
                        >
                          <ExternalLink size={12} />
                        </Link>

                        <button
                          type="button"
                          onClick={() => openEditModal(cat)}
                          className="p-1 border border-[#090808] bg-[#090808] text-white hover:opacity-85 transition-opacity"
                          title="Edit Category"
                        >
                          <Edit2 size={12} />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDelete(cat)}
                          className="p-1 border border-[#E1E0DC] text-[#BEBDBB] hover:text-rose-700 hover:bg-rose-50 transition-colors"
                          title="Delete Category"
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

      {/* CREATE / EDIT CATEGORY MODAL */}
      {(isNewCategoryModal || editingCategory) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white border border-[#090808] p-6 max-w-lg w-full space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between border-b border-[#E1E0DC] pb-3">
              <div>
                <span className="text-[10px] font-mono font-bold tracking-widest text-[#BEBDBB] uppercase">
                  CATALOG CATEGORY EDITOR
                </span>
                <h3 className="font-display text-lg font-bold uppercase text-[#090808]">
                  {isNewCategoryModal ? 'CREATE NEW CATEGORY' : `EDIT: ${editingCategory?.name}`}
                </h3>
              </div>

              <button
                type="button"
                onClick={() => {
                  setIsNewCategoryModal(false)
                  setEditingCategory(null)
                }}
                className="p-1 text-[#090808] hover:opacity-70"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              
              <div className="space-y-1">
                <label className="text-[10px] font-mono font-bold uppercase text-[#090808]">
                  CATEGORY DISPLAY NAME *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. MEN"
                  value={name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  className="w-full bg-[#F0EFED] border border-[#E1E0DC] p-2.5 font-bold uppercase text-xs text-[#090808] focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono font-bold uppercase text-[#090808]">
                  SLUG HANDLE (URL PATH) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="men"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  className="w-full bg-[#F0EFED] border border-[#E1E0DC] p-2.5 font-mono text-xs text-[#090808] focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono font-bold uppercase text-[#090808]">
                  EDITORIAL SHORT DESCRIPTION
                </label>
                <textarea
                  rows={2}
                  placeholder="Elevated everyday essentials & custom tees..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-[#F0EFED] border border-[#E1E0DC] p-2.5 text-xs text-[#090808] focus:outline-none"
                />
              </div>

              {/* COVER / THUMBNAIL IMAGE (DESKTOP) */}
              <div className="space-y-2 p-3 bg-[#F0EFED] border border-[#E1E0DC]">
                <label className="text-[10px] font-mono font-bold uppercase text-[#090808] block">
                  DESKTOP COVER IMAGE
                </label>

                <div className="flex items-center gap-3">
                  <div className="w-14 h-16 bg-white border border-[#E1E0DC] overflow-hidden shrink-0">
                    {imageUrl ? (
                      <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[#BEBDBB] font-mono text-[9px]">
                        N/A
                      </div>
                    )}
                  </div>

                  <div className="flex-1 space-y-1.5">
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => triggerUpload('DESKTOP')}
                        className="px-2.5 py-1.5 bg-[#090808] text-white text-[10px] font-mono font-bold uppercase hover:opacity-85 flex items-center gap-1"
                      >
                        <Upload size={11} />
                        <span>COMPUTER UPLOAD</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => openPickerFor('DESKTOP')}
                        className="px-2.5 py-1.5 border border-[#090808] bg-white text-[#090808] text-[10px] font-mono font-bold uppercase hover:bg-[#F0EFED] flex items-center gap-1"
                      >
                        <ImageIcon size={11} />
                        <span>MEDIA LIBRARY</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* BUTTON CTA AND LINK */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono font-bold uppercase text-[#090808]">
                    CTA BUTTON LABEL
                  </label>
                  <input
                    type="text"
                    value={buttonText}
                    onChange={(e) => setButtonText(e.target.value)}
                    className="w-full bg-[#F0EFED] border border-[#E1E0DC] p-2 text-xs font-bold focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-mono font-bold uppercase text-[#090808]">
                    DESTINATION URL
                  </label>
                  <input
                    type="text"
                    value={buttonUrl}
                    onChange={(e) => setButtonUrl(e.target.value)}
                    className="w-full bg-[#F0EFED] border border-[#E1E0DC] p-2 font-mono text-xs focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-2 pt-2 border-t border-[#E1E0DC]">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="cat-strip-active"
                    checked={isVisible}
                    onChange={(e) => setIsVisible(e.target.checked)}
                    className="w-4 h-4 accent-[#090808]"
                  />
                  <label htmlFor="cat-strip-active" className="text-xs font-bold text-[#090808] cursor-pointer">
                    Show in 4-Column Homepage Black Strip
                  </label>
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="cat-active"
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                    className="w-4 h-4 accent-[#090808]"
                  />
                  <label htmlFor="cat-active" className="text-xs font-bold text-[#090808] cursor-pointer">
                    Category is Active in Catalog Filters
                  </label>
                </div>
              </div>

              <div className="flex gap-2 pt-3 border-t border-[#E1E0DC]">
                <button
                  type="button"
                  onClick={() => {
                    setIsNewCategoryModal(false)
                    setEditingCategory(null)
                  }}
                  className="flex-1 py-2 border border-[#090808] text-xs font-mono font-bold uppercase hover:bg-[#F0EFED]"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 bg-[#090808] text-white text-xs font-mono font-bold uppercase hover:opacity-85"
                >
                  {isNewCategoryModal ? 'CREATE CATEGORY' : 'SAVE CHANGES'}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  )
}

export default AdminCategories

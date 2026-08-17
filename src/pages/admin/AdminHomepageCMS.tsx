import React, { useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import { useCMSStore } from '@/stores/cmsStore'
import { useMediaStore } from '@/stores/mediaStore'
import { useProductCatalogStore } from '@/stores/productCatalogStore'
import { MediaPicker } from '@/components/admin/MediaPicker'
import { Category } from '@/types/product'
import {
  Save,
  ArrowUp,
  ArrowDown,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Image as ImageIcon,
  Upload,
  Eye,
  CheckCircle2,
  Plus,
  Trash2,
  Copy,
  Edit2,
  X,
  Sparkles,
} from 'lucide-react'

type CMSMediaTarget =
  | 'HERO_CENTER'
  | 'EDITORIAL_DESKTOP'
  | 'EDITORIAL_MOBILE'
  | 'CUSTOMIZATION_IMAGE'
  | { type: 'CATEGORY_DESKTOP'; id: string }
  | { type: 'CATEGORY_MOBILE'; id: string }
  | null

export const AdminHomepageCMS: React.FC = () => {
  const {
    config,
    isDraft,
    updateHero,
    updateEditorial,
    updateFeaturedProducts,
    updateTrustStrip,
    updateCustomizationCTA,
    reorderSections,
    toggleSectionVisibility,
    publishLive,
  } = useCMSStore()

  const { uploadFile } = useMediaStore()
  const { categories, addCategory, updateCategory, deleteCategory, reorderCategories } = useProductCatalogStore()

  const [activeAccordion, setActiveAccordion] = useState<string>('editorial')
  const [mediaPickerOpen, setMediaPickerOpen] = useState(false)
  const [mediaPickerTarget, setMediaPickerTarget] = useState<CMSMediaTarget>(null)

  const directFileInputRef = useRef<HTMLInputElement>(null)
  const [directUploadTarget, setDirectUploadTarget] = useState<CMSMediaTarget>('EDITORIAL_DESKTOP')

  const [savedAlert, setSavedAlert] = useState(false)
  const [previewSection, setPreviewSection] = useState<'editorial' | 'categories' | null>(null)

  // Category modal state for Add/Edit Category
  const [categoryModalOpen, setCategoryModalOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [catName, setCatName] = useState('')
  const [catSlug, setCatSlug] = useState('')
  const [catDesc, setCatDesc] = useState('')
  const [catImg, setCatImg] = useState('')
  const [catMobileImg, setCatMobileImg] = useState('')
  const [catAlt, setCatAlt] = useState('')
  const [catBtnText, setCatBtnText] = useState('SHOP NOW →')
  const [catBtnUrl, setCatBtnUrl] = useState('')
  const [catVisible, setCatVisible] = useState(true)

  const sectionLabels: Record<string, string> = {
    hero: '1. HERO HIGH-FASHION SHOWCASE',
    categoryBands: '2. CATEGORY SHOWCASE STRIP (BLACK BG)',
    editorial: '3. CUSTOMIZATION SUITE ("MAKE IT YOURS")',
    trustStrip: '4. TRUST SIGNALS & CRAFT PROMISES',
    featuredProducts: '5. CURATED BEST OF MOODIFYS GRID',
    customizationCTA: '6. CUSTOMIZER STUDIO LAUNCH BANNER',
  }

  const handleMoveSection = (index: number, direction: 'up' | 'down') => {
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === config.sectionsOrder.length - 1)
    ) {
      return
    }

    const targetIndex = direction === 'up' ? index - 1 : index + 1
    const copy = [...config.sectionsOrder]
    const temp = copy[index]
    copy[index] = copy[targetIndex]
    copy[targetIndex] = temp
    reorderSections(copy)
  }

  const toggleAccordion = (key: string) => {
    setActiveAccordion(activeAccordion === key ? '' : key)
  }

  const triggerSavedFeedback = () => {
    setSavedAlert(true)
    setTimeout(() => setSavedAlert(false), 3000)
  }

  const handleMediaSelected = (url: string) => {
    if (!mediaPickerTarget) return

    if (mediaPickerTarget === 'HERO_CENTER') {
      updateHero({ centerImageUrl: url })
    } else if (mediaPickerTarget === 'EDITORIAL_DESKTOP') {
      updateEditorial({ imageUrl: url })
    } else if (mediaPickerTarget === 'EDITORIAL_MOBILE') {
      updateEditorial({ mobileImageUrl: url })
    } else if (mediaPickerTarget === 'CUSTOMIZATION_IMAGE') {
      updateCustomizationCTA({ backgroundImageUrl: url })
    } else if (typeof mediaPickerTarget === 'object' && mediaPickerTarget.type === 'CATEGORY_DESKTOP') {
      updateCategory(mediaPickerTarget.id, { imageUrl: url })
      if (editingCategory && editingCategory.id === mediaPickerTarget.id) {
        setCatImg(url)
      }
    } else if (typeof mediaPickerTarget === 'object' && mediaPickerTarget.type === 'CATEGORY_MOBILE') {
      updateCategory(mediaPickerTarget.id, { mobileImageUrl: url })
      if (editingCategory && editingCategory.id === mediaPickerTarget.id) {
        setCatMobileImg(url)
      }
    }

    setMediaPickerTarget(null)
    setMediaPickerOpen(false)
  }

  const handleDirectUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0 || !directUploadTarget) return
    const file = e.target.files[0]
    const target = directUploadTarget

    try {
      const folder = typeof target === 'object' ? 'Categories' : 'Homepage'
      const created = await uploadFile(file, folder, 'Content Manager')

      if (target === 'HERO_CENTER') {
        updateHero({ centerImageUrl: created.url })
      } else if (target === 'EDITORIAL_DESKTOP') {
        updateEditorial({ imageUrl: created.url })
      } else if (target === 'EDITORIAL_MOBILE') {
        updateEditorial({ mobileImageUrl: created.url })
      } else if (target === 'CUSTOMIZATION_IMAGE') {
        updateCustomizationCTA({ backgroundImageUrl: created.url })
      } else if (typeof target === 'object' && target.type === 'CATEGORY_DESKTOP') {
        updateCategory(target.id, { imageUrl: created.url })
        if (editingCategory && editingCategory.id === target.id) {
          setCatImg(created.url)
        }
      } else if (typeof target === 'object' && target.type === 'CATEGORY_MOBILE') {
        updateCategory(target.id, { mobileImageUrl: created.url })
        if (editingCategory && editingCategory.id === target.id) {
          setCatMobileImg(created.url)
        }
      }
    } catch (err) {
      console.error('Image upload failed:', err)
    }

    if (directFileInputRef.current) {
      directFileInputRef.current.value = ''
    }
  }

  const triggerDirectUpload = (target: CMSMediaTarget) => {
    setDirectUploadTarget(target)
    directFileInputRef.current?.click()
  }

  // Category management handlers
  const openNewCategoryModal = () => {
    setEditingCategory(null)
    setCatName('')
    setCatSlug('')
    setCatDesc('')
    setCatImg('https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=800&auto=format&fit=crop&q=80')
    setCatMobileImg('')
    setCatAlt('')
    setCatBtnText('SHOP NOW →')
    setCatBtnUrl('/shop')
    setCatVisible(true)
    setCategoryModalOpen(true)
  }

  const openEditCategoryModal = (cat: Category) => {
    setEditingCategory(cat)
    setCatName(cat.name)
    setCatSlug(cat.slug)
    setCatDesc(cat.description || '')
    setCatImg(cat.imageUrl || '')
    setCatMobileImg(cat.mobileImageUrl || '')
    setCatAlt(cat.altText || '')
    setCatBtnText(cat.buttonText || `SHOP ${cat.name} →`)
    setCatBtnUrl(cat.buttonUrl || `/shop/${cat.slug}`)
    setCatVisible(cat.isVisible !== false && cat.isActive !== false)
    setCategoryModalOpen(true)
  }

  const handleSaveCategory = (e: React.FormEvent) => {
    e.preventDefault()
    if (!catName.trim() || !catSlug.trim()) return

    if (editingCategory) {
      updateCategory(editingCategory.id, {
        name: catName.trim().toUpperCase(),
        slug: catSlug.trim().toLowerCase(),
        description: catDesc.trim(),
        imageUrl: catImg,
        mobileImageUrl: catMobileImg,
        altText: catAlt.trim(),
        buttonText: catBtnText.trim(),
        buttonUrl: catBtnUrl.trim(),
        isActive: catVisible,
        isVisible: catVisible,
      })
    } else {
      const newCat: Category = {
        id: `cat-${Date.now()}`,
        name: catName.trim().toUpperCase(),
        slug: catSlug.trim().toLowerCase(),
        description: catDesc.trim(),
        imageUrl: catImg,
        mobileImageUrl: catMobileImg,
        altText: catAlt.trim(),
        buttonText: catBtnText.trim(),
        buttonUrl: catBtnUrl.trim(),
        sortOrder: categories.length + 1,
        isActive: catVisible,
        isVisible: catVisible,
      }
      addCategory(newCat)
    }

    setCategoryModalOpen(false)
    setEditingCategory(null)
  }

  const handleDuplicateCategory = (cat: Category) => {
    const duplicated: Category = {
      ...cat,
      id: `cat-${Date.now()}`,
      name: `${cat.name} (COPY)`,
      slug: `${cat.slug}-copy-${Math.floor(Math.random() * 1000)}`,
      sortOrder: categories.length + 1,
    }
    addCategory(duplicated)
  }

  const handleDeleteCategory = (cat: Category) => {
    if (window.confirm(`DELETE CATEGORY?\n\nAre you sure you want to remove "${cat.name}" from the category showcase?`)) {
      deleteCategory(cat.id)
    }
  }

  const handleMoveCategory = (index: number, direction: 'up' | 'down') => {
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

  const toggleCategoryVisibility = (cat: Category) => {
    const nextVis = !(cat.isVisible !== false && cat.isActive !== false)
    updateCategory(cat.id, { isVisible: nextVis, isActive: nextVis })
  }

  return (
    <div className="space-y-6 pb-24">
      
      {/* Hidden File Input for Direct Computer Uploads */}
      <input
        ref={directFileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/jpg"
        onChange={handleDirectUpload}
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
        defaultFolder="Homepage"
        title="HOMEPAGE CMS MEDIA SELECTOR"
      />

      {/* Top Header & Publishing Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#BEBDBB]/30">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono font-bold tracking-[0.25em] text-[#BEBDBB] uppercase">
              STOREFRONT VISUAL BUILDER
            </span>
            {isDraft ? (
              <span className="px-2 py-0.5 bg-amber-100 text-amber-900 font-mono text-[9px] font-bold uppercase border border-amber-300 animate-pulse">
                DRAFT CHANGES UNPUBLISHED
              </span>
            ) : (
              <span className="px-2 py-0.5 bg-emerald-100 text-emerald-900 font-mono text-[9px] font-bold uppercase border border-emerald-300">
                HOMEPAGE PUBLISHED LIVE
              </span>
            )}
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold uppercase tracking-tight text-[#090808]">
            HOMEPAGE CMS DYNAMIC EDITOR
          </h1>
        </div>

        <div className="flex items-center gap-3">
          {savedAlert && (
            <span className="px-3 py-1.5 bg-emerald-100 text-emerald-900 border border-emerald-300 text-xs font-mono font-bold flex items-center gap-1.5">
              <CheckCircle2 size={13} className="text-emerald-700" />
              <span>SAVED AS DRAFT</span>
            </span>
          )}

          <Link
            to="/"
            target="_blank"
            className="inline-flex items-center gap-1.5 px-3 py-2 border border-[#090808] text-[#090808] text-xs font-mono font-bold uppercase hover:bg-[#F0EFED] transition-colors"
          >
            <ExternalLink size={13} />
            <span className="hidden sm:inline">VIEW LIVE STORE</span>
          </Link>

          <button
            type="button"
            onClick={() => {
              triggerSavedFeedback()
            }}
            className="inline-flex items-center gap-1.5 px-4 py-2 border border-[#090808] bg-white text-[#090808] text-xs font-mono font-bold uppercase hover:bg-[#F0EFED] shadow-xs"
          >
            <Save size={13} />
            <span>SAVE DRAFT</span>
          </button>

          <button
            type="button"
            onClick={() => {
              publishLive()
              triggerSavedFeedback()
            }}
            className="inline-flex items-center gap-1.5 px-5 py-2 bg-[#090808] text-white text-xs font-mono font-bold uppercase hover:opacity-85 shadow-md"
          >
            <CheckCircle2 size={13} />
            <span>PUBLISH LIVE</span>
          </button>
        </div>
      </div>

      {/* SECTION ORDER REORDER PANEL */}
      <div className="bg-white border border-[#E1E0DC] p-5 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="font-display text-base font-bold uppercase text-[#090808]">
              PAGE SECTION SEQUENCE ORGANIZER
            </h2>
            <p className="text-xs font-mono text-[#BEBDBB]">
              Reorder section layout sequence or toggle visibility on public storefront.
            </p>
          </div>
        </div>

        <div className="space-y-2">
          {config.sectionsOrder.map((sectionKey, index) => {
            const sectionObj = (config as unknown as Record<string, { isEnabled?: boolean }>)[sectionKey]
            const isVisible = sectionObj?.isEnabled ?? true
            return (
              <div
                key={sectionKey}
                className={`flex items-center justify-between p-3 border text-xs font-mono transition-colors ${
                  isVisible
                    ? 'bg-[#F0EFED] border-[#E1E0DC] text-[#090808]'
                    : 'bg-zinc-100/60 border-zinc-200 text-zinc-400 opacity-60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="font-bold text-[10px] w-5 text-center">
                    0{index + 1}
                  </span>
                  <span className="font-bold uppercase">
                    {sectionLabels[sectionKey] || sectionKey}
                  </span>
                  {!isVisible && (
                    <span className="px-1.5 py-0.5 bg-zinc-200 text-zinc-600 text-[9px] font-bold">
                      HIDDEN
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => toggleSectionVisibility(sectionKey)}
                    className="px-2 py-1 bg-white border border-[#E1E0DC] text-[10px] font-bold uppercase hover:bg-zinc-50"
                  >
                    {isVisible ? 'HIDE' : 'SHOW'}
                  </button>

                  <button
                    type="button"
                    disabled={index === 0}
                    onClick={() => handleMoveSection(index, 'up')}
                    className="p-1 bg-white border border-[#E1E0DC] hover:bg-zinc-50 disabled:opacity-30"
                    title="Move Up"
                  >
                    <ArrowUp size={12} />
                  </button>

                  <button
                    type="button"
                    disabled={index === config.sectionsOrder.length - 1}
                    onClick={() => handleMoveSection(index, 'down')}
                    className="p-1 bg-white border border-[#E1E0DC] hover:bg-zinc-50 disabled:opacity-30"
                    title="Move Down"
                  >
                    <ArrowDown size={12} />
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* ACCORDION SECTIONS */}
      <div className="space-y-4">
        
        {/* ========================================================================= */}
        {/* SECTION 1: CUSTOMIZATION SUITE ("MAKE IT YOURS") — FULLY EDITABLE */}
        {/* ========================================================================= */}
        <div className="bg-white border-2 border-[#090808] shadow-sm">
          <div className="p-4 flex items-center justify-between bg-[#090808] text-white">
            <div className="flex items-center gap-3">
              <span className="px-2 py-0.5 bg-white text-[#090808] text-[10px] font-mono font-bold uppercase">
                PRIMARY CMS
              </span>
              <h2 className="font-display font-bold text-base uppercase tracking-wide">
                CUSTOMIZATION SUITE ("MAKE IT YOURS.")
              </h2>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setPreviewSection('editorial')}
                className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white text-xs font-mono font-bold uppercase flex items-center gap-1.5 border border-white/20"
              >
                <Eye size={13} />
                <span>PREVIEW</span>
              </button>

              <button
                type="button"
                onClick={() => toggleAccordion('editorial')}
                className="p-1 text-white hover:text-zinc-300"
              >
                {activeAccordion === 'editorial' ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </button>
            </div>
          </div>

          {activeAccordion === 'editorial' && (
            <div className="p-6 space-y-6 text-xs">
              
              {/* STATUS & VISIBILITY BAR */}
              <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-[#F0EFED] border border-[#E1E0DC]">
                <div className="flex items-center gap-3">
                  <span className="font-bold text-xs uppercase text-[#090808]">SECTION VISIBILITY:</span>
                  <button
                    type="button"
                    onClick={() => updateEditorial({ isEnabled: !config.editorial.isEnabled })}
                    className={`px-3 py-1 text-xs font-mono font-bold uppercase border transition-colors ${
                      config.editorial.isEnabled
                        ? 'bg-emerald-800 text-white border-emerald-900'
                        : 'bg-zinc-300 text-zinc-700 border-zinc-400'
                    }`}
                  >
                    {config.editorial.isEnabled ? 'ON (RENDERED ON HOMEPAGE)' : 'OFF (HIDDEN)'}
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-mono text-[#302F2E]">PUBLISH STATE:</span>
                  <span className="px-2 py-0.5 bg-[#090808] text-white font-mono text-[10px] font-bold uppercase">
                    {isDraft ? 'DRAFT' : 'PUBLISHED'}
                  </span>
                </div>
              </div>

              {/* 1. CONTENT FIELDS */}
              <div className="space-y-4">
                <h3 className="font-display font-bold text-sm uppercase text-[#090808] border-b border-[#E1E0DC] pb-2">
                  1. TEXT & EDITORIAL CONTENT
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono font-bold uppercase text-[#090808]">
                      TOP PILL BADGE
                    </label>
                    <input
                      type="text"
                      value={config.editorial.pillText}
                      onChange={(e) => updateEditorial({ pillText: e.target.value })}
                      placeholder="THE CUSTOMIZATION SUITE"
                      className="w-full bg-[#F0EFED] border border-[#E1E0DC] p-2.5 text-xs font-bold text-[#090808] focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-mono font-bold uppercase text-[#090808]">
                      EYEBROW TEXT *
                    </label>
                    <input
                      type="text"
                      value={config.editorial.eyebrow || config.editorial.subHeading}
                      onChange={(e) => updateEditorial({ eyebrow: e.target.value, subHeading: e.target.value })}
                      placeholder="NEW SEASON // PERSONALIZE"
                      className="w-full bg-[#F0EFED] border border-[#E1E0DC] p-2.5 text-xs font-mono font-bold text-[#090808] focus:outline-none"
                    />
                  </div>
                </div>

                {/* MULTILINE HEADLINE TEXTAREA */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] font-mono font-bold uppercase text-[#090808]">
                      MAIN HEADLINE (PRESERVES MULTILINE BREAKS) *
                    </label>
                    <span className="text-[10px] font-mono text-[#BEBDBB]">
                      Enter one word/phrase per line
                    </span>
                  </div>
                  <textarea
                    rows={4}
                    value={config.editorial.headlineText || `${config.editorial.headlineLine1}\n${config.editorial.headlineLine2}\n${config.editorial.headlineLine3}`}
                    onChange={(e) => updateEditorial({ headlineText: e.target.value })}
                    placeholder={"MAKE\nIT\nYOURS."}
                    className="w-full bg-[#F0EFED] border border-[#E1E0DC] p-3 font-display text-base font-bold uppercase tracking-tight text-[#090808] focus:outline-none leading-tight"
                  />
                </div>

                {/* EDITORIAL DESCRIPTION */}
                <div className="space-y-1">
                  <label className="text-[10px] font-mono font-bold uppercase text-[#090808]">
                    EDITORIAL DESCRIPTION PARAGRAPH *
                  </label>
                  <textarea
                    rows={3}
                    value={config.editorial.description}
                    onChange={(e) => updateEditorial({ description: e.target.value })}
                    placeholder="Choose the piece. Add your mood, typography, or custom graphics in high resolution. Preview in real-time and wear a garment that is truly one of one."
                    className="w-full bg-[#F0EFED] border border-[#E1E0DC] p-2.5 text-xs text-[#090808] focus:outline-none leading-relaxed"
                  />
                </div>

                {/* DUAL CTA BUTTONS */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  
                  {/* BUTTON 1 */}
                  <div className="p-4 bg-[#F0EFED] border border-[#E1E0DC] space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs uppercase text-[#090808]">BUTTON 1 (PRIMARY)</span>
                      <label className="flex items-center gap-1.5 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={config.editorial.primaryButtonEnabled !== false}
                          onChange={(e) => updateEditorial({ primaryButtonEnabled: e.target.checked })}
                          className="accent-[#090808]"
                        />
                        <span className="text-[10px] font-mono font-bold">ENABLED</span>
                      </label>
                    </div>

                    <div className="space-y-2">
                      <div>
                        <label className="text-[9px] font-mono uppercase text-[#302F2E] block">LABEL</label>
                        <input
                          type="text"
                          value={config.editorial.primaryCtaText}
                          onChange={(e) => updateEditorial({ primaryCtaText: e.target.value })}
                          className="w-full bg-white border border-[#E1E0DC] p-2 text-xs font-bold focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-[9px] font-mono uppercase text-[#302F2E] block">DESTINATION URL</label>
                        <input
                          type="text"
                          value={config.editorial.primaryCtaLink}
                          onChange={(e) => updateEditorial({ primaryCtaLink: e.target.value })}
                          className="w-full bg-white border border-[#E1E0DC] p-2 font-mono text-xs focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  {/* BUTTON 2 */}
                  <div className="p-4 bg-[#F0EFED] border border-[#E1E0DC] space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs uppercase text-[#090808]">BUTTON 2 (SECONDARY)</span>
                      <label className="flex items-center gap-1.5 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={config.editorial.secondaryButtonEnabled !== false}
                          onChange={(e) => updateEditorial({ secondaryButtonEnabled: e.target.checked })}
                          className="accent-[#090808]"
                        />
                        <span className="text-[10px] font-mono font-bold">ENABLED</span>
                      </label>
                    </div>

                    <div className="space-y-2">
                      <div>
                        <label className="text-[9px] font-mono uppercase text-[#302F2E] block">LABEL</label>
                        <input
                          type="text"
                          value={config.editorial.secondaryCtaText}
                          onChange={(e) => updateEditorial({ secondaryCtaText: e.target.value })}
                          className="w-full bg-white border border-[#E1E0DC] p-2 text-xs font-bold focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-[9px] font-mono uppercase text-[#302F2E] block">DESTINATION URL</label>
                        <input
                          type="text"
                          value={config.editorial.secondaryCtaLink}
                          onChange={(e) => updateEditorial({ secondaryCtaLink: e.target.value })}
                          className="w-full bg-white border border-[#E1E0DC] p-2 font-mono text-xs focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>

                </div>
              </div>

              {/* 2. MEDIA CONTROLS (DESKTOP & MOBILE) */}
              <div className="space-y-4 pt-4 border-t border-[#E1E0DC]">
                <h3 className="font-display font-bold text-sm uppercase text-[#090808] border-b border-[#E1E0DC] pb-2">
                  2. MEDIA & LIFESTYLE SHOWCASE IMAGES
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* DESKTOP IMAGE */}
                  <div className="p-4 bg-[#F0EFED] border border-[#E1E0DC] space-y-3">
                    <span className="text-[11px] font-mono font-bold uppercase text-[#090808] block">
                      DESKTOP LIFESTYLE IMAGE *
                    </span>

                    <div className="aspect-16/10 bg-white border border-[#E1E0DC] overflow-hidden relative group">
                      {config.editorial.imageUrl ? (
                        <img
                          src={config.editorial.imageUrl}
                          alt="Customization Desktop"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center font-mono text-xs text-[#BEBDBB]">
                          NO IMAGE SET
                        </div>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => triggerDirectUpload('EDITORIAL_DESKTOP')}
                        className="px-3 py-2 bg-[#090808] text-white text-[10px] font-mono font-bold uppercase hover:opacity-85 flex items-center gap-1.5"
                      >
                        <Upload size={12} />
                        <span>UPLOAD FROM COMPUTER</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setMediaPickerTarget('EDITORIAL_DESKTOP')
                          setMediaPickerOpen(true)
                        }}
                        className="px-3 py-2 border border-[#090808] text-[#090808] bg-white text-[10px] font-mono font-bold uppercase hover:bg-[#F0EFED] flex items-center gap-1.5"
                      >
                        <ImageIcon size={12} />
                        <span>MEDIA LIBRARY</span>
                      </button>
                    </div>
                  </div>

                  {/* MOBILE IMAGE (OPTIONAL) */}
                  <div className="p-4 bg-[#F0EFED] border border-[#E1E0DC] space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-[11px] font-mono font-bold uppercase text-[#090808]">
                        MOBILE IMAGE (OPTIONAL)
                      </span>
                      {config.editorial.mobileImageUrl && (
                        <button
                          type="button"
                          onClick={() => updateEditorial({ mobileImageUrl: '' })}
                          className="text-[10px] font-mono text-rose-700 hover:underline uppercase"
                        >
                          REMOVE (USE DESKTOP)
                        </button>
                      )}
                    </div>

                    <div className="aspect-16/10 bg-white border border-[#E1E0DC] overflow-hidden relative group">
                      {config.editorial.mobileImageUrl ? (
                        <img
                          src={config.editorial.mobileImageUrl}
                          alt="Customization Mobile"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center font-mono text-[10px] text-[#BEBDBB] p-4 text-center">
                          <span>FALLBACK: USING DESKTOP IMAGE</span>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => triggerDirectUpload('EDITORIAL_MOBILE')}
                        className="px-3 py-2 bg-[#090808] text-white text-[10px] font-mono font-bold uppercase hover:opacity-85 flex items-center gap-1.5"
                      >
                        <Upload size={12} />
                        <span>UPLOAD MOBILE IMAGE</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setMediaPickerTarget('EDITORIAL_MOBILE')
                          setMediaPickerOpen(true)
                        }}
                        className="px-3 py-2 border border-[#090808] text-[#090808] bg-white text-[10px] font-mono font-bold uppercase hover:bg-[#F0EFED] flex items-center gap-1.5"
                      >
                        <ImageIcon size={12} />
                        <span>SELECT FROM MEDIA</span>
                      </button>
                    </div>
                  </div>

                </div>

                {/* ALT TEXT & IMAGE BADGE */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono font-bold uppercase text-[#090808]">
                      ACCESSIBILITY ALT TEXT
                    </label>
                    <input
                      type="text"
                      value={config.editorial.imageAlt || ''}
                      onChange={(e) => updateEditorial({ imageAlt: e.target.value })}
                      placeholder="Woman wearing customized Moodifys T-shirt"
                      className="w-full bg-[#F0EFED] border border-[#E1E0DC] p-2.5 text-xs focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between items-center">
                      <label className="text-[10px] font-mono font-bold uppercase text-[#090808]">
                        BOTTOM-RIGHT ARCHIVAL WHITE BADGE
                      </label>
                      <label className="flex items-center gap-1 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={config.editorial.imageBadgeEnabled !== false}
                          onChange={(e) => updateEditorial({ imageBadgeEnabled: e.target.checked })}
                          className="accent-[#090808]"
                        />
                        <span className="text-[10px] font-mono font-bold">SHOW</span>
                      </label>
                    </div>
                    <input
                      type="text"
                      value={config.editorial.imageBadgeText}
                      onChange={(e) => updateEditorial({ imageBadgeText: e.target.value })}
                      placeholder="FABRIC 240 GSM // ARCHIVAL PRINT"
                      className="w-full bg-[#F0EFED] border border-[#E1E0DC] p-2.5 text-xs font-mono font-bold focus:outline-none"
                    />
                  </div>
                </div>

              </div>

              {/* SAVE / PREVIEW / PUBLISH FOOTER */}
              <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-[#E1E0DC]">
                <button
                  type="button"
                  onClick={() => setPreviewSection('editorial')}
                  className="px-4 py-2 border border-[#090808] text-[#090808] text-xs font-mono font-bold uppercase hover:bg-[#F0EFED] flex items-center gap-1.5"
                >
                  <Eye size={13} />
                  <span>PREVIEW CUSTOMIZATION SUITE</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => triggerSavedFeedback()}
                    className="px-4 py-2 border border-[#090808] bg-white text-[#090808] text-xs font-mono font-bold uppercase hover:bg-[#F0EFED]"
                  >
                    SAVE AS DRAFT
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      publishLive()
                      triggerSavedFeedback()
                    }}
                    className="px-5 py-2 bg-[#090808] text-white text-xs font-mono font-bold uppercase hover:opacity-85"
                  >
                    PUBLISH SECTION LIVE
                  </button>
                </div>
              </div>

            </div>
          )}
        </div>

        {/* ========================================================================= */}
        {/* SECTION 2: CATEGORY SHOWCASE STRIP (BLACK BG) — FULLY EDITABLE */}
        {/* ========================================================================= */}
        <div className="bg-white border-2 border-[#090808] shadow-sm">
          <div className="p-4 flex items-center justify-between bg-[#090808] text-white">
            <div className="flex items-center gap-3">
              <span className="px-2 py-0.5 bg-white text-[#090808] text-[10px] font-mono font-bold uppercase">
                SHOWCASE STRIP
              </span>
              <h2 className="font-display font-bold text-base uppercase tracking-wide">
                CATEGORY SHOWCASE (BLACK BACKGROUND STRIP)
              </h2>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setPreviewSection('categories')}
                className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white text-xs font-mono font-bold uppercase flex items-center gap-1.5 border border-white/20"
              >
                <Eye size={13} />
                <span>PREVIEW</span>
              </button>

              <button
                type="button"
                onClick={() => toggleAccordion('categoryBands')}
                className="p-1 text-white hover:text-zinc-300"
              >
                {activeAccordion === 'categoryBands' ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </button>
            </div>
          </div>

          {activeAccordion === 'categoryBands' && (
            <div className="p-6 space-y-6 text-xs">
              
              {/* TOP ACTION BAR */}
              <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-[#F0EFED] border border-[#E1E0DC]">
                <div>
                  <span className="font-bold text-xs uppercase text-[#090808]">
                    MANAGE 4-COLUMN CATEGORY STRIP
                  </span>
                  <p className="text-[11px] text-[#302F2E] mt-0.5">
                    Controls MEN, WOMEN, KIDS, ACCESSORIES & custom categories dynamically displayed on black background strip.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={openNewCategoryModal}
                    className="px-4 py-2 bg-[#090808] text-white text-xs font-mono font-bold uppercase hover:opacity-85 flex items-center gap-1.5 shadow-sm"
                  >
                    <Plus size={13} />
                    <span>+ ADD CATEGORY</span>
                  </button>
                </div>
              </div>

              {/* DYNAMIC CATEGORY CARDS GRID */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {categories.map((cat, index) => {
                  const isVis = cat.isVisible !== false && cat.isActive !== false
                  return (
                    <div
                      key={cat.id}
                      className={`border p-3 flex flex-col justify-between space-y-3 transition-all ${
                        isVis
                          ? 'bg-[#F0EFED] border-[#E1E0DC]'
                          : 'bg-zinc-100/70 border-zinc-200 opacity-60'
                      }`}
                    >
                      {/* Top Header of Card */}
                      <div className="flex items-start justify-between">
                        <span className="font-mono font-bold text-[10px] text-[#BEBDBB]">
                          0{index + 1}
                        </span>
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            disabled={index === 0}
                            onClick={() => handleMoveCategory(index, 'up')}
                            className="p-1 border border-[#E1E0DC] bg-white hover:bg-zinc-50 disabled:opacity-30"
                            title="Move Left/Up"
                          >
                            <ArrowUp size={11} />
                          </button>
                          <button
                            type="button"
                            disabled={index === categories.length - 1}
                            onClick={() => handleMoveCategory(index, 'down')}
                            className="p-1 border border-[#E1E0DC] bg-white hover:bg-zinc-50 disabled:opacity-30"
                            title="Move Right/Down"
                          >
                            <ArrowDown size={11} />
                          </button>
                        </div>
                      </div>

                      {/* Image & Direct Actions */}
                      <div className="flex items-center gap-3">
                        <div className="w-16 h-20 bg-white border border-[#E1E0DC] overflow-hidden shrink-0">
                          <img
                            src={cat.imageUrl || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80'}
                            alt={cat.name}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        <div className="space-y-1 flex-1 min-w-0">
                          <h4 className="font-display font-bold text-sm uppercase text-[#090808] truncate">
                            {cat.name}
                          </h4>
                          <p className="text-[11px] text-[#302F2E] line-clamp-2 leading-tight">
                            {cat.description || 'No description provided.'}
                          </p>
                          <p className="text-[10px] font-mono text-[#090808] font-bold pt-1">
                            {cat.buttonText || `SHOP ${cat.name} →`}
                          </p>
                        </div>
                      </div>

                      {/* Card Bottom Controls */}
                      <div className="flex items-center justify-between pt-2 border-t border-[#E1E0DC]/70">
                        <button
                          type="button"
                          onClick={() => toggleCategoryVisibility(cat)}
                          className={`text-[9px] font-mono font-bold px-2 py-0.5 border ${
                            isVis
                              ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                              : 'bg-zinc-200 text-zinc-600 border-zinc-300'
                          }`}
                        >
                          {isVis ? 'VISIBLE (ON)' : 'HIDDEN (OFF)'}
                        </button>

                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => handleDuplicateCategory(cat)}
                            className="p-1 border border-[#E1E0DC] bg-white hover:bg-zinc-50"
                            title="Duplicate Category"
                          >
                            <Copy size={11} />
                          </button>
                          <button
                            type="button"
                            onClick={() => openEditCategoryModal(cat)}
                            className="p-1 border border-[#090808] bg-[#090808] text-white hover:opacity-85"
                            title="Edit Category"
                          >
                            <Edit2 size={11} />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteCategory(cat)}
                            className="p-1 border border-[#E1E0DC] bg-white text-rose-700 hover:bg-rose-50"
                            title="Delete Category"
                          >
                            <Trash2 size={11} />
                          </button>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>

            </div>
          )}
        </div>

        {/* ========================================================================= */}
        {/* SECTION 3: HERO HIGH-FASHION SHOWCASE ACCORDION */}
        {/* ========================================================================= */}
        <div className="bg-white border border-[#E1E0DC] shadow-xs">
          <button
            type="button"
            onClick={() => toggleAccordion('hero')}
            className="w-full p-4 flex items-center justify-between bg-[#F0EFED] text-left hover:bg-[#E1E0DC]/60 transition-colors"
          >
            <span className="font-display font-bold text-sm uppercase text-[#090808]">
              {sectionLabels.hero}
            </span>
            {activeAccordion === 'hero' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>

          {activeAccordion === 'hero' && (
            <div className="p-6 space-y-5 border-t border-[#E1E0DC] text-xs">
              
              <div className="p-4 bg-[#F0EFED] border border-[#E1E0DC] space-y-3">
                <span className="text-[11px] font-mono font-bold uppercase text-[#090808] block">
                  HERO MODEL PORTRAIT *
                </span>

                <div className="flex flex-col sm:flex-row gap-4 items-center">
                  <div className="w-28 h-36 bg-white border border-[#E1E0DC] overflow-hidden shrink-0">
                    <img
                      src={config.hero.centerImageUrl}
                      alt="Hero Focal"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="space-y-2 flex-1 w-full">
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => triggerDirectUpload('HERO_CENTER')}
                        className="px-3 py-2 bg-[#090808] text-white text-[10px] font-mono font-bold uppercase hover:opacity-85 flex items-center gap-1.5"
                      >
                        <Upload size={12} />
                        <span>UPLOAD FROM COMPUTER</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setMediaPickerTarget('HERO_CENTER')
                          setMediaPickerOpen(true)
                        }}
                        className="px-3 py-2 border border-[#090808] text-[#090808] bg-white text-[10px] font-mono font-bold uppercase hover:bg-[#F0EFED] flex items-center gap-1.5"
                      >
                        <ImageIcon size={12} />
                        <span>SELECT FROM MEDIA LIBRARY</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono font-bold uppercase text-[#090808]">
                    TOP TAGLINE
                  </label>
                  <input
                    type="text"
                    value={config.hero.tagline}
                    onChange={(e) => updateHero({ tagline: e.target.value })}
                    className="w-full bg-[#F0EFED] border border-[#E1E0DC] p-2 text-xs font-bold text-[#090808] focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono font-bold uppercase text-[#090808]">
                    EDITION BADGE
                  </label>
                  <input
                    type="text"
                    value={config.hero.editionBadge}
                    onChange={(e) => updateHero({ editionBadge: e.target.value })}
                    className="w-full bg-[#F0EFED] border border-[#E1E0DC] p-2 text-xs font-mono text-[#090808] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono font-bold uppercase text-[#090808]">
                    HEADLINE LINE 1
                  </label>
                  <input
                    type="text"
                    value={config.hero.headlineLine1}
                    onChange={(e) => updateHero({ headlineLine1: e.target.value })}
                    className="w-full bg-[#F0EFED] border border-[#E1E0DC] p-2 text-xs font-bold text-[#090808] focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono font-bold uppercase text-[#090808]">
                    HEADLINE LINE 2
                  </label>
                  <input
                    type="text"
                    value={config.hero.headlineLine2}
                    onChange={(e) => updateHero({ headlineLine2: e.target.value })}
                    className="w-full bg-[#F0EFED] border border-[#E1E0DC] p-2 text-xs font-bold text-[#090808] focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono font-bold uppercase text-[#090808]">
                  EDITORIAL SUBTITLE / INTRO TEXT
                </label>
                <textarea
                  rows={2}
                  value={config.hero.subtitle}
                  onChange={(e) => updateHero({ subtitle: e.target.value })}
                  className="w-full bg-[#F0EFED] border border-[#E1E0DC] p-2 text-xs text-[#090808] focus:outline-none"
                />
              </div>

            </div>
          )}
        </div>

        {/* ========================================================================= */}
        {/* SECTION 4: TRUST SIGNALS & CRAFT PROMISES */}
        {/* ========================================================================= */}
        <div className="bg-white border border-[#E1E0DC] shadow-xs">
          <button
            type="button"
            onClick={() => toggleAccordion('trustStrip')}
            className="w-full p-4 flex items-center justify-between bg-[#F0EFED] text-left hover:bg-[#E1E0DC]/60 transition-colors"
          >
            <span className="font-display font-bold text-sm uppercase text-[#090808]">
              {sectionLabels.trustStrip}
            </span>
            {activeAccordion === 'trustStrip' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>

          {activeAccordion === 'trustStrip' && (
            <div className="p-6 space-y-4 border-t border-[#E1E0DC] text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono font-bold uppercase text-[#090808]">BADGE 1 TITLE</label>
                  <input
                    type="text"
                    value={config.trustStrip.badge1Title}
                    onChange={(e) => updateTrustStrip({ badge1Title: e.target.value })}
                    className="w-full bg-[#F0EFED] border border-[#E1E0DC] p-2 text-xs font-bold focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-mono font-bold uppercase text-[#090808]">BADGE 1 DESCRIPTION</label>
                  <input
                    type="text"
                    value={config.trustStrip.badge1Desc}
                    onChange={(e) => updateTrustStrip({ badge1Desc: e.target.value })}
                    className="w-full bg-[#F0EFED] border border-[#E1E0DC] p-2 text-xs focus:outline-none"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ========================================================================= */}
        {/* SECTION 5: CURATED BEST OF MOODIFYS */}
        {/* ========================================================================= */}
        <div className="bg-white border border-[#E1E0DC] shadow-xs">
          <button
            type="button"
            onClick={() => toggleAccordion('featuredProducts')}
            className="w-full p-4 flex items-center justify-between bg-[#F0EFED] text-left hover:bg-[#E1E0DC]/60 transition-colors"
          >
            <span className="font-display font-bold text-sm uppercase text-[#090808]">
              {sectionLabels.featuredProducts}
            </span>
            {activeAccordion === 'featuredProducts' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>

          {activeAccordion === 'featuredProducts' && (
            <div className="p-6 space-y-5 border-t border-[#E1E0DC] text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono font-bold uppercase text-[#090808]">
                    SECTION TITLE
                  </label>
                  <input
                    type="text"
                    value={config.featuredProducts.title}
                    onChange={(e) => updateFeaturedProducts({ title: e.target.value })}
                    className="w-full bg-[#F0EFED] border border-[#E1E0DC] p-2 text-xs font-bold focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-mono font-bold uppercase text-[#090808]">
                    SUBTITLE
                  </label>
                  <input
                    type="text"
                    value={config.featuredProducts.subTitle}
                    onChange={(e) => updateFeaturedProducts({ subTitle: e.target.value })}
                    className="w-full bg-[#F0EFED] border border-[#E1E0DC] p-2 text-xs focus:outline-none"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

      </div>

      {/* MODAL: ADD / EDIT CATEGORY */}
      {categoryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white border border-[#090808] p-6 max-w-lg w-full space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto text-xs">
            
            <div className="flex items-start justify-between border-b border-[#E1E0DC] pb-3">
              <div>
                <span className="text-[10px] font-mono font-bold tracking-widest text-[#BEBDBB] uppercase">
                  CATEGORY SHOWCASE BUILDER
                </span>
                <h3 className="font-display text-lg font-bold uppercase text-[#090808]">
                  {editingCategory ? `EDIT CATEGORY: ${editingCategory.name}` : 'CREATE NEW CATEGORY'}
                </h3>
              </div>

              <button
                type="button"
                onClick={() => setCategoryModalOpen(false)}
                className="p-1 text-[#090808] hover:opacity-70"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveCategory} className="space-y-4">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono font-bold uppercase text-[#090808]">
                    CATEGORY NAME *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="MEN"
                    value={catName}
                    onChange={(e) => {
                      setCatName(e.target.value)
                      if (!editingCategory) {
                        setCatSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''))
                        setCatBtnText(`SHOP ${e.target.value.toUpperCase()} →`)
                        setCatBtnUrl(`/shop/${e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`)
                      }
                    }}
                    className="w-full bg-[#F0EFED] border border-[#E1E0DC] p-2 font-bold uppercase focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono font-bold uppercase text-[#090808]">
                    SLUG URL HANDLE *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="men"
                    value={catSlug}
                    onChange={(e) => setCatSlug(e.target.value)}
                    className="w-full bg-[#F0EFED] border border-[#E1E0DC] p-2 font-mono focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono font-bold uppercase text-[#090808]">
                  TAGLINE DESCRIPTION
                </label>
                <textarea
                  rows={2}
                  placeholder="Elevated everyday essentials & custom tees."
                  value={catDesc}
                  onChange={(e) => setCatDesc(e.target.value)}
                  className="w-full bg-[#F0EFED] border border-[#E1E0DC] p-2 focus:outline-none"
                />
              </div>

              {/* CATEGORY IMAGE CONTROLS */}
              <div className="p-3 bg-[#F0EFED] border border-[#E1E0DC] space-y-2">
                <span className="text-[10px] font-mono font-bold uppercase text-[#090808] block">
                  CATEGORY IMAGE
                </span>

                <div className="flex items-center gap-3">
                  <div className="w-14 h-16 bg-white border border-[#E1E0DC] overflow-hidden shrink-0">
                    <img
                      src={catImg || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80'}
                      alt="Category Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-1 space-y-1.5">
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => triggerDirectUpload(editingCategory ? { type: 'CATEGORY_DESKTOP', id: editingCategory.id } : 'EDITORIAL_DESKTOP')}
                        className="px-2.5 py-1.5 bg-[#090808] text-white text-[10px] font-mono font-bold uppercase hover:opacity-85 flex items-center gap-1"
                      >
                        <Upload size={11} />
                        <span>COMPUTER UPLOAD</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setMediaPickerTarget(editingCategory ? { type: 'CATEGORY_DESKTOP', id: editingCategory.id } : 'EDITORIAL_DESKTOP')
                          setMediaPickerOpen(true)
                        }}
                        className="px-2.5 py-1.5 border border-[#090808] bg-white text-[#090808] text-[10px] font-mono font-bold uppercase hover:bg-[#F0EFED] flex items-center gap-1"
                      >
                        <ImageIcon size={11} />
                        <span>MEDIA LIBRARY</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono font-bold uppercase text-[#090808]">
                    BUTTON CTA TEXT
                  </label>
                  <input
                    type="text"
                    value={catBtnText}
                    onChange={(e) => setCatBtnText(e.target.value)}
                    className="w-full bg-[#F0EFED] border border-[#E1E0DC] p-2 font-bold focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono font-bold uppercase text-[#090808]">
                    BUTTON DESTINATION URL
                  </label>
                  <input
                    type="text"
                    value={catBtnUrl}
                    onChange={(e) => setCatBtnUrl(e.target.value)}
                    className="w-full bg-[#F0EFED] border border-[#E1E0DC] p-2 font-mono focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <input
                  type="checkbox"
                  id="cat-vis-toggle"
                  checked={catVisible}
                  onChange={(e) => setCatVisible(e.target.checked)}
                  className="w-4 h-4 accent-[#090808]"
                />
                <label htmlFor="cat-vis-toggle" className="text-xs font-bold text-[#090808] cursor-pointer">
                  Show Category in 4-Column Homepage Strip
                </label>
              </div>

              <div className="flex gap-2 pt-3 border-t border-[#E1E0DC]">
                <button
                  type="button"
                  onClick={() => setCategoryModalOpen(false)}
                  className="flex-1 py-2 border border-[#090808] font-mono font-bold uppercase hover:bg-[#F0EFED]"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 bg-[#090808] text-white font-mono font-bold uppercase hover:opacity-85"
                >
                  {editingCategory ? 'SAVE CATEGORY' : 'CREATE CATEGORY'}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* MODAL: LIVE PREVIEW OF SECTIONS */}
      {previewSection && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#090808] border-2 border-white/20 max-w-5xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            
            <div className="p-4 flex items-center justify-between border-b border-[#302F2E] bg-[#090808] sticky top-0 z-10">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 bg-emerald-500 text-white font-mono text-[9px] font-bold uppercase">
                  LIVE PREVIEW (UNSAVED / DRAFT STATE)
                </span>
                <span className="text-white font-mono text-xs uppercase font-bold">
                  {previewSection === 'editorial' ? 'CUSTOMIZATION SUITE PREVIEW' : 'CATEGORY SHOWCASE PREVIEW'}
                </span>
              </div>

              <button
                type="button"
                onClick={() => setPreviewSection(null)}
                className="p-1 text-white hover:text-zinc-300"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6">
              {previewSection === 'editorial' ? (
                /* PREVIEW OF EDITORIAL SUITE */
                <div className="bg-[#E1E0DC]/40 py-12 px-6 border border-[#BEBDBB]">
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                    
                    <div className="lg:col-span-5 space-y-4 text-left">
                      <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#090808] text-white text-[10px] font-bold tracking-[0.22em] uppercase">
                        <Sparkles size={11} />
                        <span>{config.editorial.pillText}</span>
                      </div>

                      <div className="space-y-1">
                        <p className="text-[11px] font-bold tracking-[0.2em] text-[#302F2E] uppercase font-mono">
                          {config.editorial.eyebrow || config.editorial.subHeading}
                        </p>
                        <h2 className="font-display text-3xl sm:text-4xl font-bold uppercase tracking-tight text-[#090808] leading-tight whitespace-pre-line">
                          {config.editorial.headlineText || `${config.editorial.headlineLine1}\n${config.editorial.headlineLine2}\n${config.editorial.headlineLine3}`}
                        </h2>
                      </div>

                      <p className="text-xs sm:text-sm text-[#302F2E] leading-relaxed">
                        {config.editorial.description}
                      </p>

                      <div className="pt-2 flex gap-3">
                        {config.editorial.primaryButtonEnabled !== false && (
                          <div className="px-5 py-2.5 bg-[#090808] text-white font-bold text-xs uppercase">
                            {config.editorial.primaryCtaText} →
                          </div>
                        )}
                        {config.editorial.secondaryButtonEnabled !== false && (
                          <div className="px-5 py-2.5 border border-[#090808] text-[#090808] font-bold text-xs uppercase bg-white">
                            {config.editorial.secondaryCtaText}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="lg:col-span-7 relative aspect-16/10 bg-[#BEBDBB] border border-[#BEBDBB] overflow-hidden">
                      <img
                        src={config.editorial.imageUrl}
                        alt={config.editorial.imageAlt || 'Preview'}
                        className="w-full h-full object-cover"
                      />
                      {config.editorial.imageBadgeEnabled !== false && (
                        <div className="absolute bottom-4 right-4 bg-white px-3 py-1.5 text-[10px] font-mono font-bold tracking-widest text-[#090808] uppercase shadow-md">
                          {config.editorial.imageBadgeText}
                        </div>
                      )}
                    </div>

                  </div>
                </div>
              ) : (
                /* PREVIEW OF CATEGORIES SHOWCASE */
                <div className="bg-[#090808] text-white p-6 border border-[#302F2E]">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {categories
                      .filter((c) => c.isVisible !== false && c.isActive !== false)
                      .map((cat) => (
                        <div key={cat.id} className="flex items-center space-x-4 p-2 bg-[#121111] border border-[#302F2E]">
                          <div className="w-16 h-20 bg-[#302F2E] overflow-hidden shrink-0">
                            <img
                              src={cat.imageUrl}
                              alt={cat.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="space-y-1">
                            <h4 className="font-display text-sm font-bold uppercase text-white">
                              {cat.name}
                            </h4>
                            <p className="text-[10px] text-[#BEBDBB] line-clamp-2">
                              {cat.description}
                            </p>
                            <p className="text-[10px] font-bold uppercase text-white underline pt-1">
                              {cat.buttonText || `SHOP ${cat.name} →`}
                            </p>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 bg-[#121111] border-t border-[#302F2E] flex justify-end">
              <button
                type="button"
                onClick={() => setPreviewSection(null)}
                className="px-5 py-2 bg-white text-[#090808] text-xs font-mono font-bold uppercase hover:opacity-85"
              >
                CLOSE PREVIEW
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  )
}

export default AdminHomepageCMS

import React, { useState, useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useProductCatalogStore } from '@/stores/productCatalogStore'
import { formatPrice } from '@/lib/utils'
import {
  Plus,
  Search,
  Sparkles,
  Edit2,
  Copy,
  Archive,
  ExternalLink,
  Shirt,
  Trash2,
} from 'lucide-react'

export const AdminProducts: React.FC = () => {
  const { products, categories, duplicateProduct, archiveProduct, deleteProductPermanently } = useProductCatalogStore()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const navigate = useNavigate()

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // Search
      const q = searchQuery.toLowerCase().trim()
      if (q) {
        const matchesName = p.name.toLowerCase().includes(q)
        const matchesSlug = p.slug.toLowerCase().includes(q)
        if (!matchesName && !matchesSlug) return false
      }

      // Category
      if (selectedCategory !== 'all' && p.categoryId !== selectedCategory) {
        return false
      }

      // Status
      if (statusFilter !== 'all') {
        const itemStatus = p.status || (p.isActive ? 'active' : 'draft')
        if (itemStatus !== statusFilter) return false
      }

      return true
    })
  }, [products, searchQuery, selectedCategory, statusFilter])

  const handleDuplicate = (id: string) => {
    const dup = duplicateProduct(id)
    if (dup) {
      navigate(`/admin/products/${dup.id}/edit`)
    }
  }

  const handleArchive = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to archive "${name}"? It will be hidden from the storefront.`)) {
      archiveProduct(id)
    }
  }

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Permanent Delete: Are you sure you want to delete "${name}"? This action cannot be undone.`)) {
      deleteProductPermanently(id)
    }
  }

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#BEBDBB]/30">
        <div>
          <span className="text-[10px] font-mono font-bold tracking-[0.25em] text-[#BEBDBB] uppercase">
            CATALOG MANAGEMENT
          </span>
          <h1 className="font-display text-2xl sm:text-3xl font-bold uppercase tracking-tight text-[#090808]">
            GARMENT BLANKS & CATALOG
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/admin/products/new"
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#090808] text-white text-xs font-mono font-bold uppercase hover:opacity-85 transition-opacity"
          >
            <Plus size={14} />
            <span>ADD NEW GARMENT BLANK</span>
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
              placeholder="Search garments by name, SKU, or slug..."
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
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="bg-[#F0EFED] border border-[#E1E0DC] px-2.5 py-1.5 text-xs font-mono font-bold uppercase focus:outline-none"
              >
                <option value="all">ALL CATEGORIES</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-1 text-xs">
              <span className="text-[10px] font-mono text-[#BEBDBB] uppercase">STATUS:</span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-[#F0EFED] border border-[#E1E0DC] px-2.5 py-1.5 text-xs font-mono font-bold uppercase focus:outline-none"
              >
                <option value="all">ALL STATUSES</option>
                <option value="active">ACTIVE</option>
                <option value="draft">DRAFT</option>
                <option value="archived">ARCHIVED</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* PRODUCTS MASTER TABLE */}
      <div className="bg-white border border-[#E1E0DC] overflow-hidden shadow-xs">
        {filteredProducts.length === 0 ? (
          <div className="p-16 text-center space-y-3">
            <Shirt size={32} className="mx-auto text-[#BEBDBB]" />
            <p className="font-mono text-xs font-bold text-[#BEBDBB] uppercase">
              NO GARMENT PIECES FOUND
            </p>
            <p className="text-xs text-[#302F2E] max-w-sm mx-auto">
              Create a new blank garment or refine your search filters.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-[#F0EFED] text-[#BEBDBB] uppercase text-[10px] font-mono border-b border-[#E1E0DC]">
                <tr>
                  <th className="p-4 pl-6">GARMENT PIECE</th>
                  <th className="p-4">CATEGORY</th>
                  <th className="p-4">RETAIL PRICE</th>
                  <th className="p-4">VARIANTS & SIZES</th>
                  <th className="p-4">STUDIO 2D</th>
                  <th className="p-4">STATUS</th>
                  <th className="p-4 pr-6 text-right">ACTIONS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E1E0DC]">
                {filteredProducts.map((p) => {
                  const targetCat = categories.find((c) => c.id === p.categoryId)
                  const itemStatus = p.status || (p.isActive ? 'active' : 'draft')

                  return (
                    <tr key={p.id} className="hover:bg-[#FAFAFA] transition-colors">
                      
                      {/* Garment Image & Name */}
                      <td className="p-4 pl-6">
                        <div className="flex items-center gap-3.5">
                          <img
                            src={p.imageUrl}
                            alt={p.name}
                            className="w-12 h-16 object-cover bg-[#F0EFED] border border-[#E1E0DC]"
                          />
                          <div>
                            <Link
                              to={`/admin/products/${p.id}/edit`}
                              className="font-bold text-xs text-[#090808] hover:underline"
                            >
                              {p.name}
                            </Link>
                            <p className="text-[10px] font-mono text-[#BEBDBB] mt-0.5">
                              /{p.slug}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="p-4 font-mono text-xs text-[#302F2E] uppercase">
                        {targetCat?.name || p.categoryName || 'T-SHIRTS'}
                      </td>

                      {/* Retail Price */}
                      <td className="p-4 font-mono font-bold text-[#090808]">
                        {formatPrice(p.basePrice)}
                        {p.compareAtPrice && p.compareAtPrice > p.basePrice && (
                          <span className="block text-[10px] text-[#BEBDBB] line-through font-normal">
                            {formatPrice(p.compareAtPrice)}
                          </span>
                        )}
                      </td>

                      {/* Variants */}
                      <td className="p-4 text-[#302F2E]">
                        <div className="flex items-center gap-1.5 mb-1">
                          {p.colors.map((c, idx) => (
                            <span
                              key={idx}
                              className="w-3 h-3 rounded-full border border-[#BEBDBB]"
                              style={{ backgroundColor: c.hex }}
                              title={c.name}
                            />
                          ))}
                        </div>
                        <span className="text-[10px] font-mono text-[#BEBDBB]">
                          {p.sizes.join(', ')}
                        </span>
                      </td>

                      {/* Studio Customizable */}
                      <td className="p-4">
                        {p.isCustomizable ? (
                          <span className="inline-flex items-center gap-1 text-[9px] font-mono font-bold uppercase bg-amber-50 text-amber-900 border border-amber-300 px-2 py-0.5">
                            <Sparkles size={10} className="text-amber-600" />
                            STUDIO READY
                          </span>
                        ) : (
                          <span className="text-[10px] font-mono text-[#BEBDBB] uppercase">
                            PLAIN ONLY
                          </span>
                        )}
                      </td>

                      {/* Status */}
                      <td className="p-4">
                        <span className={`inline-flex items-center text-[9px] font-mono font-bold px-2 py-0.5 uppercase ${
                          itemStatus === 'active'
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-300'
                            : itemStatus === 'draft'
                            ? 'bg-zinc-100 text-zinc-800 border border-zinc-300'
                            : 'bg-rose-50 text-rose-800 border border-rose-300'
                        }`}>
                          {itemStatus.toUpperCase()}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="p-4 pr-6 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Link
                            to={`/admin/products/${p.id}/edit`}
                            className="p-1.5 bg-[#090808] text-white hover:opacity-85 transition-opacity"
                            title="Edit Garment Specifications"
                          >
                            <Edit2 size={13} />
                          </Link>

                          <Link
                            to={`/product/${p.slug}`}
                            target="_blank"
                            className="p-1.5 border border-[#E1E0DC] text-[#302F2E] hover:bg-[#F0EFED] transition-colors"
                            title="View on Customer Storefront"
                          >
                            <ExternalLink size={13} />
                          </Link>

                          <button
                            type="button"
                            onClick={() => handleDuplicate(p.id)}
                            className="p-1.5 border border-[#E1E0DC] text-[#302F2E] hover:bg-[#F0EFED] transition-colors"
                            title="Duplicate as New Draft"
                          >
                            <Copy size={13} />
                          </button>

                          <button
                            type="button"
                            onClick={() => handleArchive(p.id, p.name)}
                            className="p-1.5 border border-[#E1E0DC] text-[#9E2A2B] hover:bg-rose-50 transition-colors"
                            title="Soft Archive Garment"
                          >
                            <Archive size={13} />
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDelete(p.id, p.name)}
                            className="p-1.5 border border-[#E1E0DC] text-[#BEBDBB] hover:text-rose-700 hover:bg-rose-50 transition-colors"
                            title="Permanent Delete"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>

                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  )
}

export default AdminProducts

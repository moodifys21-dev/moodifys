import React from 'react'
import { Search, SlidersHorizontal, X } from 'lucide-react'
import { ProductFilterOptions } from '@/types/product'

export interface ShopHeaderProps {
  title: string
  description?: string
  totalCount: number
  filters: ProductFilterOptions
  onUpdateFilters: (updates: Partial<ProductFilterOptions>) => void
  onOpenMobileFilters: () => void
}

export const ShopHeader: React.FC<ShopHeaderProps> = ({
  title,
  description,
  totalCount,
  filters,
  onUpdateFilters,
  onOpenMobileFilters,
}) => {
  return (
    <div className="w-full pb-8 border-b border-[#BEBDBB]/50 mb-8 space-y-6">
      {/* Editorial Title & Count */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-1">
          <p className="text-[11px] font-bold tracking-[0.2em] text-[#BEBDBB] uppercase">
            CATALOG // ARCHIVE
          </p>
          <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold uppercase tracking-tight text-[#090808]">
            {title}
          </h1>
          {description && (
            <p className="text-xs sm:text-sm text-[#302F2E] font-light max-w-xl">
              {description}
            </p>
          )}
        </div>

        <p className="text-xs font-semibold uppercase tracking-widest text-[#302F2E]">
          {totalCount} {totalCount === 1 ? 'PIECE' : 'PIECES'} AVAILABLE
        </p>
      </div>

      {/* Search & Sort Action Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pt-2">
        {/* Search Bar */}
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            value={filters.searchQuery || ''}
            onChange={(e) => onUpdateFilters({ searchQuery: e.target.value })}
            placeholder="SEARCH PIECES, FABRICS, SILHOUETTES..."
            className="w-full bg-white border border-[#BEBDBB] py-2.5 pl-9 pr-8 text-xs tracking-wider text-[#090808] placeholder-[#BEBDBB] focus:outline-none focus:border-[#090808] uppercase"
          />
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[#302F2E]"
          />
          {filters.searchQuery && (
            <button
              type="button"
              onClick={() => onUpdateFilters({ searchQuery: '' })}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#302F2E] hover:text-[#090808]"
              aria-label="Clear search query"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Controls (Sort & Mobile Filter Trigger) */}
        <div className="flex items-center gap-3">
          {/* Mobile Filter Button */}
          <button
            type="button"
            onClick={onOpenMobileFilters}
            className="lg:hidden flex-1 sm:flex-none flex items-center justify-center gap-2 py-2.5 px-4 bg-white border border-[#BEBDBB] text-xs font-bold uppercase tracking-wider text-[#090808] hover:border-[#090808]"
          >
            <SlidersHorizontal size={14} />
            <span>FILTERS</span>
          </button>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2 flex-1 sm:flex-none">
            <span className="hidden sm:inline text-[11px] font-bold tracking-widest text-[#BEBDBB] uppercase">
              SORT:
            </span>
            <select
              value={filters.sortBy || 'featured'}
              onChange={(e) =>
                onUpdateFilters({
                  sortBy: e.target.value as ProductFilterOptions['sortBy'],
                })
              }
              className="w-full sm:w-auto bg-white border border-[#BEBDBB] py-2.5 px-3 text-xs font-semibold tracking-wider text-[#090808] uppercase focus:outline-none focus:border-[#090808] cursor-pointer"
            >
              <option value="featured">FEATURED</option>
              <option value="newest">NEWEST DROPS</option>
              <option value="price-asc">PRICE: LOW → HIGH</option>
              <option value="price-desc">PRICE: HIGH → LOW</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  )
}

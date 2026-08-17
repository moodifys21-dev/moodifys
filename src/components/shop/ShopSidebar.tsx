import React from 'react'
import { Link } from 'react-router-dom'
import { Category, ProductFilterOptions } from '@/types/product'
import { ColorSwatch } from '@/components/ui/ColorSwatch'
import { SizeSelector } from '@/components/ui/SizeSelector'
import { Button } from '@/components/ui/Button'
import { Sparkles, RotateCcw } from 'lucide-react'
import { formatPrice } from '@/lib/utils'

export interface ShopSidebarProps {
  categories: Category[]
  activeCategory?: string
  filters: ProductFilterOptions
  onUpdateFilters: (updates: Partial<ProductFilterOptions>) => void
  onResetFilters: () => void
  totalCount: number
}

const AVAILABLE_COLORS = [
  { name: 'Black', hex: '#090808' },
  { name: 'Charcoal', hex: '#302F2E' },
  { name: 'Warm Gray', hex: '#BEBDBB' },
  { name: 'Off White', hex: '#E1E0DC' },
  { name: 'Pure White', hex: '#FFFFFF' },
]

const AVAILABLE_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL']

export const ShopSidebar: React.FC<ShopSidebarProps> = ({
  categories,
  activeCategory = 'all',
  filters,
  onUpdateFilters,
  onResetFilters,
}) => {
  const hasActiveFilters = Boolean(
    filters.color ||
      filters.size ||
      filters.isCustomizable !== undefined ||
      filters.minPrice ||
      filters.maxPrice ||
      filters.searchQuery
  )

  return (
    <aside className="w-full space-y-8 text-left">
      {/* 1. Category Navigation */}
      <div className="space-y-3 pb-6 border-b border-[#BEBDBB]/40">
        <p className="text-[11px] font-bold tracking-[0.2em] text-[#090808] uppercase">
          CATEGORIES
        </p>
        <div className="space-y-1.5">
          <Link
            to="/shop"
            className={`block text-xs font-semibold uppercase tracking-wider py-1 transition-colors ${
              activeCategory === 'all'
                ? 'text-[#090808] font-bold underline underline-offset-4'
                : 'text-[#302F2E] hover:text-[#090808]'
            }`}
          >
            ALL PRODUCTS
          </Link>
          {categories.map((cat) => {
            const isActive = activeCategory.toLowerCase() === cat.slug.toLowerCase()
            return (
              <Link
                key={cat.id}
                to={`/shop/${cat.slug}`}
                className={`block text-xs font-semibold uppercase tracking-wider py-1 transition-colors ${
                  isActive
                    ? 'text-[#090808] font-bold underline underline-offset-4'
                    : 'text-[#302F2E] hover:text-[#090808]'
                }`}
              >
                {cat.name}
              </Link>
            )
          })}
        </div>
      </div>

      {/* 2. Customizable Only Switch */}
      <div className="pb-6 border-b border-[#BEBDBB]/40">
        <button
          type="button"
          onClick={() =>
            onUpdateFilters({
              isCustomizable:
                filters.isCustomizable === true ? undefined : true,
            })
          }
          className={`w-full flex items-center justify-between p-3 border text-xs font-bold uppercase tracking-wider transition-all duration-150 ${
            filters.isCustomizable === true
              ? 'bg-[#090808] text-white border-[#090808]'
              : 'bg-white text-[#090808] border-[#BEBDBB] hover:border-[#090808]'
          }`}
        >
          <div className="flex items-center gap-2">
            <Sparkles size={14} />
            <span>CUSTOMIZABLE ONLY</span>
          </div>
          <span className="text-[10px] font-mono">
            {filters.isCustomizable === true ? 'ON' : 'OFF'}
          </span>
        </button>
      </div>

      {/* 3. Color Filter */}
      <div className="space-y-3 pb-6 border-b border-[#BEBDBB]/40">
        <div className="flex items-center justify-between">
          <p className="text-[11px] font-bold tracking-[0.2em] text-[#090808] uppercase">
            COLOR
          </p>
          {filters.color && (
            <button
              type="button"
              onClick={() => onUpdateFilters({ color: undefined })}
              className="text-[10px] text-[#302F2E] hover:underline uppercase"
            >
              CLEAR
            </button>
          )}
        </div>
        <ColorSwatch
          colors={AVAILABLE_COLORS}
          selectedColor={filters.color || ''}
          onSelectColor={(col) =>
            onUpdateFilters({
              color: filters.color === col ? undefined : col,
            })
          }
          size="md"
        />
      </div>

      {/* 4. Size Filter */}
      <div className="space-y-3 pb-6 border-b border-[#BEBDBB]/40">
        <div className="flex items-center justify-between">
          <p className="text-[11px] font-bold tracking-[0.2em] text-[#090808] uppercase">
            SIZE
          </p>
          {filters.size && (
            <button
              type="button"
              onClick={() => onUpdateFilters({ size: undefined })}
              className="text-[10px] text-[#302F2E] hover:underline uppercase"
            >
              CLEAR
            </button>
          )}
        </div>
        <SizeSelector
          sizes={AVAILABLE_SIZES}
          selectedSize={filters.size || ''}
          onSelectSize={(sz) =>
            onUpdateFilters({
              size: filters.size === sz ? undefined : sz,
            })
          }
        />
      </div>

      {/* 5. Price Range Filter */}
      <div className="space-y-3 pb-6 border-b border-[#BEBDBB]/40">
        <p className="text-[11px] font-bold tracking-[0.2em] text-[#090808] uppercase">
          PRICE RANGE
        </p>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() =>
              onUpdateFilters({
                minPrice: undefined,
                maxPrice: 1000,
              })
            }
            className={`py-2 px-2 text-[11px] font-semibold tracking-wider border uppercase transition-colors ${
              filters.maxPrice === 1000 && !filters.minPrice
                ? 'bg-[#090808] text-white border-[#090808]'
                : 'bg-white text-[#090808] border-[#BEBDBB] hover:border-[#090808]'
            }`}
          >
            UNDER {formatPrice(1000)}
          </button>
          <button
            type="button"
            onClick={() =>
              onUpdateFilters({
                minPrice: 1000,
                maxPrice: 2000,
              })
            }
            className={`py-2 px-2 text-[11px] font-semibold tracking-wider border uppercase transition-colors ${
              filters.minPrice === 1000 && filters.maxPrice === 2000
                ? 'bg-[#090808] text-white border-[#090808]'
                : 'bg-white text-[#090808] border-[#BEBDBB] hover:border-[#090808]'
            }`}
          >
            {formatPrice(1000)} - {formatPrice(2000)}
          </button>
          <button
            type="button"
            onClick={() =>
              onUpdateFilters({
                minPrice: 2000,
                maxPrice: undefined,
              })
            }
            className={`py-2 px-2 text-[11px] font-semibold tracking-wider border uppercase col-span-2 transition-colors ${
              filters.minPrice === 2000 && !filters.maxPrice
                ? 'bg-[#090808] text-white border-[#090808]'
                : 'bg-white text-[#090808] border-[#BEBDBB] hover:border-[#090808]'
            }`}
          >
            ABOVE {formatPrice(2000)}
          </button>
        </div>
      </div>

      {/* Reset Filters */}
      {hasActiveFilters && (
        <div className="pt-2">
          <Button
            variant="outline"
            size="sm"
            fullWidth
            onClick={onResetFilters}
            className="gap-2"
          >
            <RotateCcw size={13} />
            RESET ALL FILTERS
          </Button>
        </div>
      )}
    </aside>
  )
}

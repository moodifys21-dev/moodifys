import React, { useEffect } from 'react'
import { X } from 'lucide-react'
import { Category, ProductFilterOptions } from '@/types/product'
import { ShopSidebar } from '@/components/shop/ShopSidebar'
import { Button } from '@/components/ui/Button'

export interface MobileFilterDrawerProps {
  isOpen: boolean
  onClose: () => void
  categories: Category[]
  activeCategory?: string
  filters: ProductFilterOptions
  onUpdateFilters: (updates: Partial<ProductFilterOptions>) => void
  onResetFilters: () => void
  totalCount: number
}

export const MobileFilterDrawer: React.FC<MobileFilterDrawerProps> = ({
  isOpen,
  onClose,
  categories,
  activeCategory,
  filters,
  onUpdateFilters,
  onResetFilters,
  totalCount,
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 lg:hidden flex">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Slide Drawer */}
      <div className="relative ml-auto w-full max-w-xs sm:max-w-sm bg-[#F0EFED] h-full shadow-2xl flex flex-col justify-between z-10 overflow-y-auto p-6">
        <div>
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-[#BEBDBB]">
            <h3 className="font-display text-lg font-bold tracking-wider uppercase text-[#090808]">
              FILTERS ({totalCount})
            </h3>
            <button
              type="button"
              onClick={onClose}
              className="p-1 text-[#302F2E] hover:text-[#090808]"
              aria-label="Close filters"
            >
              <X size={20} />
            </button>
          </div>

          {/* Sidebar content */}
          <div className="pt-6">
            <ShopSidebar
              categories={categories}
              activeCategory={activeCategory}
              filters={filters}
              onUpdateFilters={onUpdateFilters}
              onResetFilters={onResetFilters}
              totalCount={totalCount}
            />
          </div>
        </div>

        {/* Footer Apply CTA */}
        <div className="pt-6 border-t border-[#BEBDBB] mt-8">
          <Button size="md" fullWidth onClick={onClose}>
            SHOW {totalCount} PRODUCTS
          </Button>
        </div>
      </div>
    </div>
  )
}

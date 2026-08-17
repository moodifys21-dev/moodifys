import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { Container } from '@/components/ui/Container'
import { Section } from '@/components/ui/Section'
import { ProductCard } from '@/components/product/ProductCard'
import { ShopSidebar } from '@/components/shop/ShopSidebar'
import { ShopHeader } from '@/components/shop/ShopHeader'
import { MobileFilterDrawer } from '@/components/shop/MobileFilterDrawer'
import { EmptyState } from '@/components/ui/EmptyState'
import { Skeleton } from '@/components/ui/Skeleton'
import { useProducts } from '@/hooks/useProducts'
import { ProductFilterOptions } from '@/types/product'
import { Search } from 'lucide-react'

export const Shop: React.FC = () => {
  const { category: urlCategory } = useParams<{ category?: string }>()
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)
  const [wishlist, setWishlist] = useState<string[]>([])

  const [filters, setFilters] = useState<ProductFilterOptions>({
    category: urlCategory || 'all',
    sortBy: 'featured',
  })

  // Sync filters whenever category URL param changes
  useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      category: urlCategory || 'all',
    }))
  }, [urlCategory])

  const { products, categories, isLoading } = useProducts(filters)

  const handleUpdateFilters = (updates: Partial<ProductFilterOptions>) => {
    setFilters((prev) => ({ ...prev, ...updates }))
  }

  const handleResetFilters = () => {
    setFilters({
      category: urlCategory || 'all',
      sortBy: 'featured',
    })
  }

  const toggleWishlist = (id: string) => {
    setWishlist((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    )
  }

  // Determine current active category title & description
  const activeCategoryObj = categories.find(
    (c) => c.slug.toLowerCase() === (urlCategory || '').toLowerCase()
  )
  const pageTitle = activeCategoryObj ? activeCategoryObj.name : 'ALL WEARABLES'
  const pageDescription = activeCategoryObj
    ? activeCategoryObj.description
    : 'Discover heavyweight organic cotton tees, boxy hoodies, relaxed sweatshirts, and accessories designed for customized expression.'

  return (
    <div className="w-full">
      <Section spacing="sm" className="pt-6 md:pt-10 pb-20">
        <Container size="wide">
          {/* Shop Header */}
          <ShopHeader
            title={pageTitle}
            description={pageDescription}
            totalCount={products.length}
            filters={filters}
            onUpdateFilters={handleUpdateFilters}
            onOpenMobileFilters={() => setMobileFiltersOpen(true)}
          />

          {/* Main Catalog Grid & Desktop Sidebar */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            
            {/* Desktop Left Sidebar */}
            <div className="hidden lg:block lg:col-span-3 sticky top-28 bg-[#F0EFED] p-6 border border-[#BEBDBB]/50">
              <ShopSidebar
                categories={categories}
                activeCategory={urlCategory || 'all'}
                filters={filters}
                onUpdateFilters={handleUpdateFilters}
                onResetFilters={handleResetFilters}
                totalCount={products.length}
              />
            </div>

            {/* Right Product Grid Area */}
            <div className="lg:col-span-9">
              {isLoading ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
                  {[1, 2, 3, 4, 5, 6].map((n) => (
                    <div key={n} className="space-y-3">
                      <Skeleton className="w-full aspect-[4/5]" />
                      <Skeleton className="h-3 w-1/3" />
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-4 w-1/4" />
                    </div>
                  ))}
                </div>
              ) : products.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
                  {products.map((product) => (
                    <ProductCard
                      key={product.id}
                      id={product.id}
                      name={product.name}
                      slug={product.slug}
                      category={product.categoryName || 'ESSENTIALS'}
                      price={product.basePrice}
                      imageUrl={product.imageUrl}
                      hoverImageUrl={product.hoverImageUrl}
                      isCustomizable={product.isCustomizable}
                      isNew={product.isNew}
                      colors={product.colors}
                      isWishlisted={wishlist.includes(product.id)}
                      onWishlistToggle={toggleWishlist}
                    />
                  ))}
                </div>
              ) : (
                <EmptyState
                  icon={<Search size={28} />}
                  title="NO PIECES MATCH YOUR FILTERS"
                  description="We couldn't find any products matching your current combination of filters and search queries."
                  actionLabel="RESET ALL FILTERS"
                  onAction={handleResetFilters}
                  className="bg-white border border-[#BEBDBB] p-12 my-8"
                />
              )}
            </div>

          </div>
        </Container>
      </Section>

      {/* Mobile Filters Drawer */}
      <MobileFilterDrawer
        isOpen={mobileFiltersOpen}
        onClose={() => setMobileFiltersOpen(false)}
        categories={categories}
        activeCategory={urlCategory || 'all'}
        filters={filters}
        onUpdateFilters={handleUpdateFilters}
        onResetFilters={handleResetFilters}
        totalCount={products.length}
      />
    </div>
  )
}

export default Shop

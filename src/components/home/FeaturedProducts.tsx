import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { ProductCard } from '@/components/product/ProductCard'
import { ArrowRight } from 'lucide-react'
import { useProducts } from '@/hooks/useProducts'
import { useCMSStore } from '@/stores/cmsStore'
import { Skeleton } from '@/components/ui/Skeleton'

export const FeaturedProducts: React.FC = () => {
  const [wishlist, setWishlist] = useState<string[]>([])
  const { products, isLoading } = useProducts({ sortBy: 'featured' })
  const { config } = useCMSStore()
  const featuredConfig = config.featuredProducts

  if (!featuredConfig.isEnabled) return null

  const toggleWishlist = (id: string) => {
    setWishlist((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    )
  }

  // Display top N featured products configured in CMS
  const featured = products.slice(0, featuredConfig.itemCount || 4)

  return (
    <section className="w-full bg-[#F0EFED] py-16 md:py-24 border-b border-[#E1E0DC]">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-12">
        {/* Section Header */}
        <div className="flex items-end justify-between pb-8 mb-8 border-b border-[#BEBDBB]/40">
          <div>
            <p className="text-[11px] font-bold tracking-[0.2em] text-[#BEBDBB] uppercase mb-1">
              {featuredConfig.subTitle}
            </p>
            <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold uppercase tracking-wider text-[#090808]">
              {featuredConfig.title}
            </h2>
          </div>

          <Link
            to={featuredConfig.viewAllLinkUrl}
            className="group flex items-center gap-1.5 text-xs font-bold tracking-widest text-[#090808] uppercase hover:underline underline-offset-4"
          >
            <span>{featuredConfig.viewAllLinkText}</span>
            <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Dynamic Column Responsive Grid */}
        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="space-y-3">
                <Skeleton className="w-full aspect-4/5" />
                <Skeleton className="h-3 w-1/3" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/4" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            {featured.map((product) => (
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
        )}
      </div>
    </section>
  )
}

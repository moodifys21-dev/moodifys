import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { useProductCatalogStore } from '@/stores/productCatalogStore'
import { useCMSStore } from '@/stores/cmsStore'

export const CategoryBands: React.FC = () => {
  const { categories } = useProductCatalogStore()
  const { config } = useCMSStore()
  const categoryBandsConfig = config.categoryBands

  if (categoryBandsConfig && categoryBandsConfig.isEnabled === false) {
    return null
  }

  // Filter active and visible categories, ordered by sortOrder
  const visibleCategories = categories
    .filter((cat) => cat.isActive !== false && cat.isVisible !== false)
    .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0))

  if (visibleCategories.length === 0) {
    return null
  }

  // Determine grid column class based on number of visible categories
  const count = visibleCategories.length
  let gridColsClass = 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
  if (count === 1) gridColsClass = 'grid-cols-1 max-w-md mx-auto'
  else if (count === 2) gridColsClass = 'grid-cols-1 sm:grid-cols-2 max-w-3xl mx-auto'
  else if (count === 3) gridColsClass = 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto'
  else if (count >= 4) gridColsClass = 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'

  return (
    <section className="bg-[#090808] text-white py-10 sm:py-12 md:py-16 border-b border-[#302F2E]">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-12">
        <div className={`grid gap-6 sm:gap-8 items-center ${gridColsClass}`}>
          {visibleCategories.map((category) => {
            const destUrl = category.buttonUrl || `/shop/${category.slug}`
            const ctaText = category.buttonText || `SHOP ${category.name} →`
            const desktopImg = category.imageUrl || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=600&auto=format&fit=crop&q=80'
            const alt = category.altText || `${category.name} collection`

            return (
              <Link
                key={category.id}
                to={destUrl}
                className="group flex items-center space-x-4 sm:space-x-5 p-3 sm:p-2 bg-[#1A1919]/60 sm:bg-transparent border border-[#302F2E]/80 sm:border-transparent transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#1A1919]"
              >
                {/* Thumbnail image with subtle zoom & natural color */}
                <div className="w-20 h-24 sm:w-24 sm:h-28 flex-shrink-0 overflow-hidden bg-[#302F2E] border border-[#BEBDBB]/20 shadow-md">
                  <picture>
                    {category.mobileImageUrl && (
                      <source media="(max-width: 640px)" srcSet={category.mobileImageUrl} />
                    )}
                    <img
                      src={desktopImg}
                      alt={alt}
                      loading="lazy"
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-all duration-500"
                    />
                  </picture>
                </div>

                {/* Text metadata */}
                <div className="flex-1 space-y-1 text-left min-w-0">
                  <h3 className="font-display text-base sm:text-lg lg:text-xl font-bold tracking-wider uppercase text-white group-hover:text-[#BEBDBB] transition-colors truncate">
                    {category.name}
                  </h3>
                  {category.description && (
                    <p className="text-xs text-[#BEBDBB] font-light leading-snug line-clamp-2">
                      {category.description}
                    </p>
                  )}
                  <div className="pt-1.5 flex items-center gap-1.5 text-[11px] font-bold tracking-widest text-white uppercase group-hover:underline underline-offset-4">
                    <span>{ctaText}</span>
                    <ArrowRight size={13} className="transition-transform group-hover:translate-x-1 shrink-0" />
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default CategoryBands


import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Heart, Sparkles } from 'lucide-react'
import { formatPrice, cn } from '@/lib/utils'
import { Badge } from '@/components/ui/Badge'

export interface ProductCardProps {
  id: string
  name: string
  slug: string
  category: string
  price: number
  imageUrl: string
  hoverImageUrl?: string
  isCustomizable?: boolean
  isNew?: boolean
  colors?: { name: string; hex: string }[]
  onWishlistToggle?: (id: string) => void
  isWishlisted?: boolean
  className?: string
}

export const ProductCard: React.FC<ProductCardProps> = ({
  id,
  name,
  slug,
  category,
  price,
  imageUrl,
  hoverImageUrl,
  isCustomizable = false,
  isNew = false,
  colors = [],
  onWishlistToggle,
  isWishlisted = false,
  className,
}) => {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div
      className={cn(
        'group flex flex-col relative bg-transparent transition-all duration-300',
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container with 4:5 aspect ratio */}
      <div className="relative w-full aspect-[4/5] overflow-hidden bg-[#E1E0DC] border border-[#BEBDBB]/40">
        <Link to={`/product/${slug}`} className="block w-full h-full">
          <img
            src={isHovered && hoverImageUrl ? hoverImageUrl : imageUrl}
            alt={name}
            loading="lazy"
            className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.03]"
          />
        </Link>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 pointer-events-none">
          {isNew && <Badge variant="ink" size="sm">NEW</Badge>}
          {isCustomizable && (
            <Badge variant="light" size="sm" className="gap-1 bg-white/90 backdrop-blur-xs">
              <Sparkles size={10} />
              CUSTOMIZABLE
            </Badge>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            onWishlistToggle?.(id)
          }}
          className={cn(
            'absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-150 backdrop-blur-xs',
            isWishlisted
              ? 'bg-[#090808] text-white'
              : 'bg-white/80 text-[#090808] hover:bg-white hover:text-[#302F2E]'
          )}
          aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart
            size={15}
            className={isWishlisted ? 'fill-current' : ''}
            strokeWidth={1.8}
          />
        </button>

        {/* Quick Customize Action bar on hover */}
        {isCustomizable && (
          <div className="absolute inset-x-0 bottom-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-200 flex items-center justify-center">
            <Link
              to={`/customize/${id}`}
              className="w-full py-2.5 bg-white/95 backdrop-blur-xs border border-[#090808]/20 text-[#090808] hover:bg-[#090808] hover:text-white text-[11px] font-bold tracking-widest uppercase transition-colors text-center flex items-center justify-center gap-1.5 shadow-lg"
            >
              <Sparkles size={13} />
              <span>CUSTOMIZE THIS PIECE</span>
            </Link>
          </div>
        )}
      </div>

      {/* Product Meta */}
      <div className="pt-3.5 pb-1 flex flex-col space-y-1.5">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-semibold tracking-[0.18em] text-[#BEBDBB] uppercase">
            {category}
          </span>
          {colors.length > 0 && (
            <div className="flex items-center gap-1">
              {colors.slice(0, 4).map((c) => (
                <span
                  key={c.name}
                  className="w-2.5 h-2.5 rounded-full border border-black/10"
                  style={{ backgroundColor: c.hex }}
                  title={c.name}
                />
              ))}
            </div>
          )}
        </div>

        <Link
          to={`/product/${slug}`}
          className="font-display text-sm font-semibold tracking-wide text-[#090808] uppercase hover:text-[#302F2E] transition-colors truncate"
        >
          {name}
        </Link>

        <p className="text-xs font-semibold tracking-wider text-[#090808]">
          {formatPrice(price)}
        </p>
      </div>
    </div>
  )
}

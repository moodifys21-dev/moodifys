import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Product } from '@/types/product'
import { formatPrice } from '@/lib/utils'
import { ColorSwatch } from '@/components/ui/ColorSwatch'
import { SizeSelector } from '@/components/ui/SizeSelector'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Modal } from '@/components/ui/Modal'
import { useCartStore } from '@/stores/cartStore'
import {
  Sparkles,
  ShoppingBag,
  Heart,
  ChevronDown,
  ChevronUp,
  Truck,
  ShieldCheck,
  RotateCcw,
  Check,
} from 'lucide-react'

export interface ProductInfoProps {
  product: Product
  onAddToCart?: (
    product: Product,
    selectedColor: string,
    selectedSize: string,
    quantity: number
  ) => void
}

export const ProductInfo: React.FC<ProductInfoProps> = ({
  product,
  onAddToCart,
}) => {
  const { addItem } = useCartStore()
  const [selectedColor, setSelectedColor] = useState(
    product.colors[0]?.name || 'Black'
  )
  const [selectedSize, setSelectedSize] = useState(product.sizes[0] || 'M')
  const [quantity, setQuantity] = useState(1)
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false)
  const [addedNotification, setAddedNotification] = useState(false)

  // Accordion state
  const [openAccordion, setOpenAccordion] = useState<string | null>('materials')

  const toggleAccordion = (id: string) => {
    setOpenAccordion(openAccordion === id ? null : id)
  }

  const handleAddToCartClick = () => {
    if (onAddToCart) {
      onAddToCart(product, selectedColor, selectedSize, quantity)
    } else {
      const colorObj = product.colors.find((c) => c.name === selectedColor)
      addItem({
        productId: product.id,
        name: product.name,
        price: product.basePrice,
        color: selectedColor,
        colorHex: colorObj?.hex || '#090808',
        size: selectedSize,
        quantity,
        imageUrl: product.imageUrl,
        isCustom: false,
      })
    }
    setAddedNotification(true)
    setTimeout(() => setAddedNotification(false), 2500)
  }

  return (
    <div className="w-full space-y-6 text-left">
      {/* Category & Badges */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-bold tracking-[0.2em] text-[#BEBDBB] uppercase">
            {product.categoryName || 'ESSENTIALS'}
          </span>
          {product.isNew && <Badge variant="ink">NEW</Badge>}
          {product.isCustomizable && (
            <Badge variant="light" className="gap-1">
              <Sparkles size={10} />
              CUSTOMIZABLE
            </Badge>
          )}
        </div>

        {/* Wishlist button */}
        <button
          type="button"
          onClick={() => setIsWishlisted(!isWishlisted)}
          className={`p-2 rounded-full border transition-colors ${
            isWishlisted
              ? 'bg-[#090808] text-white border-[#090808]'
              : 'border-[#BEBDBB] text-[#090808] hover:bg-[#E1E0DC]'
          }`}
          aria-label={isWishlisted ? 'Remove from wishlist' : 'Save to wishlist'}
        >
          <Heart size={16} className={isWishlisted ? 'fill-current' : ''} />
        </button>
      </div>

      {/* Product Title & Price */}
      <div className="space-y-2 pb-4 border-b border-[#BEBDBB]/40">
        <h1 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold uppercase tracking-tight text-[#090808]">
          {product.name}
        </h1>
        <p className="text-xl sm:text-2xl font-bold tracking-wide text-[#090808]">
          {formatPrice(product.basePrice)}
        </p>
        <p className="text-xs text-[#302F2E] font-light leading-relaxed pt-1">
          {product.description}
        </p>
      </div>

      {/* Color Selection */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold tracking-widest text-[#090808] uppercase">
            COLOR: <span className="text-[#302F2E] font-normal">{selectedColor}</span>
          </span>
        </div>
        <ColorSwatch
          colors={product.colors}
          selectedColor={selectedColor}
          onSelectColor={setSelectedColor}
          size="lg"
        />
      </div>

      {/* Size Selection */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold tracking-widest text-[#090808] uppercase">
            SIZE: <span className="text-[#302F2E] font-normal">{selectedSize}</span>
          </span>
          <button
            type="button"
            onClick={() => setIsSizeGuideOpen(true)}
            className="text-[11px] font-semibold text-[#302F2E] underline underline-offset-4 uppercase hover:text-[#090808]"
          >
            SIZE GUIDE
          </button>
        </div>
        <SizeSelector
          sizes={product.sizes}
          selectedSize={selectedSize}
          onSelectSize={setSelectedSize}
        />
      </div>

      {/* Quantity Selector */}
      <div className="space-y-2.5">
        <span className="text-xs font-bold tracking-widest text-[#090808] uppercase">
          QUANTITY
        </span>
        <div className="flex items-center w-32 border border-[#BEBDBB] bg-white">
          <button
            type="button"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className="w-10 h-10 flex items-center justify-center text-sm font-bold text-[#090808] hover:bg-[#E1E0DC]"
            aria-label="Decrease quantity"
          >
            -
          </button>
          <span className="flex-1 text-center font-bold text-xs">
            {quantity}
          </span>
          <button
            type="button"
            onClick={() => setQuantity((q) => q + 1)}
            className="w-10 h-10 flex items-center justify-center text-sm font-bold text-[#090808] hover:bg-[#E1E0DC]"
            aria-label="Increase quantity"
          >
            +
          </button>
        </div>
      </div>

      {/* CTAs */}
      <div className="space-y-3 pt-2">
        {product.isCustomizable ? (
          <>
            <Link
              to={`/customize/${product.id}`}
              className="block w-full"
            >
              <Button
                variant="primary"
                size="lg"
                fullWidth
                className="gap-2 shadow-xl py-4 bg-[#090808]"
              >
                <Sparkles size={16} />
                CUSTOMIZE THIS PIECE
              </Button>
            </Link>

            <Button
              variant="outline"
              size="lg"
              fullWidth
              onClick={handleAddToCartClick}
              className="gap-2"
            >
              <ShoppingBag size={16} />
              BUY PLAIN BLANK
            </Button>
          </>
        ) : (
          <Button
            variant="primary"
            size="lg"
            fullWidth
            onClick={handleAddToCartClick}
            className="gap-2 shadow-xl py-4"
          >
            <ShoppingBag size={16} />
            ADD TO CART
          </Button>
        )}

        {addedNotification && (
          <div className="p-3 bg-[#090808] text-white text-xs font-semibold tracking-wider uppercase flex items-center justify-center gap-2 animate-in fade-in">
            <Check size={14} />
            ADDED TO CART SUCCESSFULLY
          </div>
        )}
      </div>

      {/* Trust Pills */}
      <div className="grid grid-cols-3 gap-2 py-4 border-y border-[#BEBDBB]/40 text-center">
        <div className="flex flex-col items-center space-y-1">
          <Truck size={18} className="text-[#090808]" />
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#090808]">
            FREE DELIVERY
          </span>
          <span className="text-[9px] text-[#302F2E]">ON ORDERS OVER {formatPrice(999)}</span>
        </div>
        <div className="flex flex-col items-center space-y-1">
          <RotateCcw size={18} className="text-[#090808]" />
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#090808]">
            EASY RETURNS
          </span>
          <span className="text-[9px] text-[#302F2E]">15-DAY POLICY</span>
        </div>
        <div className="flex flex-col items-center space-y-1">
          <ShieldCheck size={18} className="text-[#090808]" />
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#090808]">
            100% ORGANIC
          </span>
          <span className="text-[9px] text-[#302F2E]">COMBED COTTON</span>
        </div>
      </div>

      {/* Accordions */}
      <div className="space-y-2 pt-2">
        {/* Materials */}
        <div className="border border-[#BEBDBB]/60 bg-white">
          <button
            type="button"
            onClick={() => toggleAccordion('materials')}
            className="w-full flex items-center justify-between p-4 text-xs font-bold uppercase tracking-widest text-[#090808]"
          >
            <span>MATERIALS & SPECIFICATIONS</span>
            {openAccordion === 'materials' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
          {openAccordion === 'materials' && (
            <div className="p-4 pt-0 text-xs text-[#302F2E] space-y-2 border-t border-[#E1E0DC] leading-relaxed">
              <p>• {product.materials || '100% Premium Organic Combed Cotton'}</p>
              <p>• Fabric Weight: 240 GSM heavy single jersey knit</p>
              <p>• Pre-shrunk fabric to preserve structural silhouette over wash cycles</p>
              <p>• Reinforced neck tape and double-needle hem stitching</p>
            </div>
          )}
        </div>

        {/* Fit & Care */}
        <div className="border border-[#BEBDBB]/60 bg-white">
          <button
            type="button"
            onClick={() => toggleAccordion('fit')}
            className="w-full flex items-center justify-between p-4 text-xs font-bold uppercase tracking-widest text-[#090808]"
          >
            <span>FIT & CARE INSTRUCTIONS</span>
            {openAccordion === 'fit' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
          {openAccordion === 'fit' && (
            <div className="p-4 pt-0 text-xs text-[#302F2E] space-y-2 border-t border-[#E1E0DC] leading-relaxed">
              <p>• Fit: {product.fit || 'Modern relaxed tailored drape'}</p>
              <p>• Care: {product.careInstructions || 'Machine wash cold delicate cycle. Do not iron over graphics.'}</p>
            </div>
          )}
        </div>

        {/* Shipping & Delivery */}
        <div className="border border-[#BEBDBB]/60 bg-white">
          <button
            type="button"
            onClick={() => toggleAccordion('shipping')}
            className="w-full flex items-center justify-between p-4 text-xs font-bold uppercase tracking-widest text-[#090808]"
          >
            <span>SHIPPING & RETURNS</span>
            {openAccordion === 'shipping' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
          {openAccordion === 'shipping' && (
            <div className="p-4 pt-0 text-xs text-[#302F2E] space-y-2 border-t border-[#E1E0DC] leading-relaxed">
              <p>• Dispatched within 24-48 hours across all major Indian metros.</p>
              <p>• Standard delivery time: 3-5 business days.</p>
              <p>• Customized pieces are crafted on demand with archival DTG printing.</p>
              <p>• Hassle-free 15-day return window on standard items.</p>
            </div>
          )}
        </div>
      </div>

      {/* Size Guide Modal */}
      <Modal
        isOpen={isSizeGuideOpen}
        onClose={() => setIsSizeGuideOpen(false)}
        title="GARMENT SIZE GUIDE (INCHES)"
        size="lg"
      >
        <div className="space-y-4 py-2 text-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse border border-[#BEBDBB]">
              <thead>
                <tr className="bg-[#090808] text-white">
                  <th className="p-3 border border-[#302F2E]">SIZE</th>
                  <th className="p-3 border border-[#302F2E]">CHEST (IN)</th>
                  <th className="p-3 border border-[#302F2E]">LENGTH (IN)</th>
                  <th className="p-3 border border-[#302F2E]">SHOULDER (IN)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="p-3 border border-[#BEBDBB] font-bold">XS</td>
                  <td className="p-3 border border-[#BEBDBB]">38</td>
                  <td className="p-3 border border-[#BEBDBB]">27</td>
                  <td className="p-3 border border-[#BEBDBB]">18</td>
                </tr>
                <tr className="bg-[#E1E0DC]/30">
                  <td className="p-3 border border-[#BEBDBB] font-bold">S</td>
                  <td className="p-3 border border-[#BEBDBB]">40</td>
                  <td className="p-3 border border-[#BEBDBB]">28</td>
                  <td className="p-3 border border-[#BEBDBB]">19</td>
                </tr>
                <tr>
                  <td className="p-3 border border-[#BEBDBB] font-bold">M</td>
                  <td className="p-3 border border-[#BEBDBB]">42</td>
                  <td className="p-3 border border-[#BEBDBB]">29</td>
                  <td className="p-3 border border-[#BEBDBB]">20</td>
                </tr>
                <tr className="bg-[#E1E0DC]/30">
                  <td className="p-3 border border-[#BEBDBB] font-bold">L</td>
                  <td className="p-3 border border-[#BEBDBB]">44</td>
                  <td className="p-3 border border-[#BEBDBB]">30</td>
                  <td className="p-3 border border-[#BEBDBB]">21</td>
                </tr>
                <tr>
                  <td className="p-3 border border-[#BEBDBB] font-bold">XL</td>
                  <td className="p-3 border border-[#BEBDBB]">46</td>
                  <td className="p-3 border border-[#BEBDBB]">31</td>
                  <td className="p-3 border border-[#BEBDBB]">22</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-[11px] text-[#302F2E]">
            * Measurements may vary slightly by +/- 0.5 inches due to manual cutting tolerances.
          </p>
        </div>
      </Modal>
    </div>
  )
}

import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Container } from '@/components/ui/Container'
import { Section } from '@/components/ui/Section'
import { Button } from '@/components/ui/Button'
import { EmptyState } from '@/components/ui/EmptyState'
import { ProductCard } from '@/components/product/ProductCard'
import {
  useCartStore,
  getCartSubtotal,
  getCartItemCount,
} from '@/stores/cartStore'
import { useProducts } from '@/hooks/useProducts'
import { formatPrice } from '@/lib/utils'
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Tag,
  ArrowLeft,
  Truck,
  RotateCcw,
} from 'lucide-react'

const FREE_SHIPPING_THRESHOLD = 1999

export const Cart: React.FC = () => {
  const navigate = useNavigate()
  const {
    items,
    discountCode,
    discountPercent,
    updateQuantity,
    removeItem,
    clearCart,
    applyDiscount,
    removeDiscount,
  } = useCartStore()

  const { allProducts } = useProducts()
  const [promoInput, setPromoInput] = useState('')
  const [promoMessage, setPromoMessage] = useState<{
    text: string
    isError: boolean
  } | null>(null)

  const subtotal = getCartSubtotal(items)
  const itemCount = getCartItemCount(items)
  const discountAmount = Math.round((subtotal * discountPercent) / 100)
  const shippingFee = subtotal >= FREE_SHIPPING_THRESHOLD || items.length === 0 ? 0 : 150
  const finalTotal = Math.max(0, subtotal - discountAmount + shippingFee)

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault()
    if (!promoInput.trim()) return
    const res = applyDiscount(promoInput)
    setPromoMessage({
      text: res.message,
      isError: !res.success,
    })
    if (res.success) setPromoInput('')
  }

  const recommendations = allProducts.slice(0, 4)

  if (items.length === 0) {
    return (
      <div className="w-full py-20">
        <Container size="wide">
          <EmptyState
            icon={<ShoppingBag size={36} />}
            title="YOUR SHOPPING BAG IS EMPTY"
            description="You haven't added any standard pieces or bespoke studio creations yet."
            actionLabel="EXPLORE THE ARCHIVE"
            actionHref="/shop"
          />
        </Container>
      </div>
    )
  }

  return (
    <div className="w-full py-8 md:py-12">
      <Container size="wide">
        {/* Page Title */}
        <div className="pb-8 border-b border-[#BEBDBB]/40 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-[11px] font-bold tracking-[0.2em] text-[#BEBDBB] uppercase mb-1">
              CURRENT SELECTION
            </p>
            <h1 className="font-display text-3xl sm:text-4xl font-bold uppercase tracking-tight text-[#090808]">
              SHOPPING BAG ({itemCount})
            </h1>
          </div>
          <button
            type="button"
            onClick={clearCart}
            className="text-xs font-bold tracking-widest text-[#302F2E] hover:text-red-600 uppercase underline underline-offset-4 transition-colors"
          >
            CLEAR BAG
          </button>
        </div>

        {/* Main 2-Column Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 pt-8">
          
          {/* Left Column: Items List */}
          <div className="lg:col-span-8 space-y-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex flex-col sm:flex-row gap-5 p-5 bg-white border border-[#E1E0DC] rounded-sm relative"
              >
                {/* Thumbnail */}
                <div className="w-full sm:w-28 h-36 flex-shrink-0 bg-[#F0EFED] border border-[#E1E0DC] rounded-sm overflow-hidden flex items-center justify-center">
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Info */}
                <div className="flex-1 flex flex-col justify-between">
                  <div className="space-y-1.5">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-display text-sm sm:text-base font-bold uppercase tracking-tight text-[#090808]">
                        {item.name}
                      </h3>
                      <button
                        type="button"
                        onClick={() => removeItem(item.id)}
                        className="text-[#BEBDBB] hover:text-red-600 p-1 transition-colors"
                        title="Remove piece"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>

                    {item.isCustom && (
                      <span className="inline-flex items-center gap-1.5 text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded uppercase tracking-wider">
                        <Sparkles size={11} />
                        BESPOKE STUDIO PRINT
                      </span>
                    )}

                    <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-[#302F2E] uppercase pt-1">
                      <span>COLOR: <strong>{item.color}</strong></span>
                      <span>SIZE: <strong>{item.size}</strong></span>
                      <span>UNIT: <strong>{formatPrice(item.price)}</strong></span>
                    </div>
                  </div>

                  {/* Quantity Stepper & Subtotal */}
                  <div className="flex items-center justify-between pt-4 border-t border-[#F0EFED] mt-4">
                    <div className="flex items-center border border-[#BEBDBB] rounded-sm bg-[#F0EFED]">
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="px-2.5 py-1 text-[#302F2E] hover:text-[#090808] transition-colors"
                      >
                        <Minus size={13} />
                      </button>
                      <span className="w-8 text-center text-xs font-mono font-bold text-[#090808]">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="px-2.5 py-1 text-[#302F2E] hover:text-[#090808] transition-colors"
                      >
                        <Plus size={13} />
                      </button>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] text-[#BEBDBB] uppercase font-mono block">TOTAL</span>
                      <span className="font-bold text-sm sm:text-base text-[#090808]">
                        {formatPrice(item.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            <div className="pt-4 flex items-center justify-between">
              <Link
                to="/shop"
                className="inline-flex items-center gap-2 text-xs font-bold tracking-widest text-[#090808] uppercase hover:underline underline-offset-4"
              >
                <ArrowLeft size={14} />
                CONTINUE SHOPPING
              </Link>
            </div>
          </div>

          {/* Right Column: Order Summary Card */}
          <div className="lg:col-span-4">
            <div className="bg-white border border-[#E1E0DC] p-6 rounded-sm space-y-6 sticky top-24">
              <h2 className="font-display text-base font-bold uppercase tracking-wider text-[#090808] pb-3 border-b border-[#E1E0DC]">
                ORDER SUMMARY
              </h2>

              {/* Promo Code Form */}
              <form onSubmit={handleApplyPromo} className="space-y-2">
                <label className="text-[11px] font-bold tracking-[0.2em] text-[#BEBDBB] uppercase block">
                  PROMOTIONAL CODE
                </label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#BEBDBB]" />
                    <input
                      type="text"
                      value={promoInput}
                      onChange={(e) => setPromoInput(e.target.value)}
                      placeholder="ENTER CODE"
                      className="w-full bg-[#F0EFED] border border-[#BEBDBB] pl-9 pr-3 py-2 text-xs font-mono font-bold uppercase tracking-wider text-[#090808] focus:border-[#090808] focus:outline-none"
                    />
                  </div>
                  <Button type="submit" variant="outline" size="sm">
                    APPLY
                  </Button>
                </div>
                {promoMessage && (
                  <p
                    className={`text-xs font-semibold ${
                      promoMessage.isError ? 'text-red-600' : 'text-emerald-700'
                    }`}
                  >
                    {promoMessage.text}
                  </p>
                )}
                {discountCode && (
                  <div className="flex items-center justify-between text-xs text-emerald-800 bg-emerald-50 px-2.5 py-1.5 rounded">
                    <span>CODE: <strong>{discountCode}</strong> ({discountPercent}% OFF)</span>
                    <button
                      type="button"
                      onClick={removeDiscount}
                      className="text-emerald-900 font-bold hover:underline"
                    >
                      REMOVE
                    </button>
                  </div>
                )}
              </form>

              {/* Cost Breakdown */}
              <div className="space-y-2.5 text-xs border-t border-[#E1E0DC] pt-4">
                <div className="flex justify-between text-[#302F2E]">
                  <span>SUBTOTAL</span>
                  <span className="font-bold text-[#090808]">{formatPrice(subtotal)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-semibold">
                    <span>DISCOUNT ({discountPercent}%)</span>
                    <span>-{formatPrice(discountAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-[#302F2E]">
                  <span>SHIPPING</span>
                  <span>{shippingFee === 0 ? 'COMPLIMENTARY' : formatPrice(shippingFee)}</span>
                </div>
                <div className="flex justify-between text-base font-bold text-[#090808] pt-3 border-t border-[#E1E0DC]">
                  <span>ESTIMATED TOTAL</span>
                  <span>{formatPrice(finalTotal)}</span>
                </div>
              </div>

              {/* Checkout Button */}
              <Button
                variant="ink"
                size="lg"
                className="w-full justify-between"
                onClick={() => navigate('/checkout')}
              >
                <span>PROCEED TO CHECKOUT</span>
                <ArrowRight size={16} />
              </Button>

              {/* Assurance Badges */}
              <div className="border-t border-[#E1E0DC] pt-4 space-y-2 text-[11px] text-[#302F2E]">
                <div className="flex items-center gap-2">
                  <Truck size={14} className="text-[#090808]" />
                  <span>Free express delivery on orders over {formatPrice(1999)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <RotateCcw size={14} className="text-[#090808]" />
                  <span>14-day archival exchange policy</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck size={14} className="text-[#090808]" />
                  <span>End-to-end encrypted transactions</span>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Complementary Pieces Carousel */}
        {recommendations.length > 0 && (
          <Section spacing="md" borderedTop className="mt-16">
            <div className="pb-6 mb-6 border-b border-[#BEBDBB]/40">
              <p className="text-[11px] font-bold tracking-[0.2em] text-[#BEBDBB] uppercase mb-1">
                PAIR WITH YOUR SELECTION
              </p>
              <h2 className="font-display text-2xl font-bold uppercase tracking-wider text-[#090808]">
                RECOMMENDED PIECES
              </h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
              {recommendations.map((p) => (
                <ProductCard
                  key={p.id}
                  id={p.id}
                  name={p.name}
                  slug={p.slug}
                  category={p.categoryName || 'ESSENTIALS'}
                  price={p.basePrice}
                  imageUrl={p.imageUrl}
                  hoverImageUrl={p.hoverImageUrl}
                  isCustomizable={p.isCustomizable}
                  isNew={p.isNew}
                  colors={p.colors}
                />
              ))}
            </div>
          </Section>
        )}
      </Container>
    </div>
  )
}

export default Cart

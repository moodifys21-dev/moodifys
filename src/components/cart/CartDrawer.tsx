import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  useCartStore,
  getCartSubtotal,
  getCartItemCount,
} from '@/stores/cartStore'
import { formatPrice } from '@/lib/utils'
import { Button } from '@/components/ui/Button'
import {
  X,
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Tag,
} from 'lucide-react'

const FREE_SHIPPING_THRESHOLD = 1999

export const CartDrawer: React.FC = () => {
  const navigate = useNavigate()
  const {
    items,
    isDrawerOpen,
    discountCode,
    discountPercent,
    closeDrawer,
    updateQuantity,
    removeItem,
    applyDiscount,
    removeDiscount,
  } = useCartStore()

  const [promoInput, setPromoInput] = useState('')
  const [promoMessage, setPromoMessage] = useState<{
    text: string
    isError: boolean
  } | null>(null)

  if (!isDrawerOpen) return null

  const subtotal = getCartSubtotal(items)
  const itemCount = getCartItemCount(items)
  const discountAmount = Math.round((subtotal * discountPercent) / 100)
  const finalTotal = Math.max(0, subtotal - discountAmount)
  const progressToFreeShipping = Math.min(
    100,
    Math.round((subtotal / FREE_SHIPPING_THRESHOLD) * 100)
  )
  const remainingForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal)

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

  const handleCheckoutClick = () => {
    closeDrawer()
    navigate('/checkout')
  }

  return (
    <div className="fixed inset-0 z-50 overflow-hidden select-none">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#090808]/60 backdrop-blur-xs transition-opacity duration-300"
        onClick={closeDrawer}
      />

      {/* Slide-over panel */}
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#F0EFED] text-[#090808] shadow-2xl flex flex-col justify-between border-l border-[#E1E0DC]">
          
          {/* Header */}
          <div className="p-5 border-b border-[#E1E0DC] flex items-center justify-between bg-white">
            <div className="flex items-center space-x-2">
              <ShoppingBag size={18} className="text-[#090808]" />
              <h2 className="font-display font-bold text-sm uppercase tracking-wider text-[#090808]">
                SHOPPING BAG ({itemCount})
              </h2>
            </div>
            <button
              type="button"
              onClick={closeDrawer}
              className="p-1.5 text-[#302F2E] hover:text-[#090808] hover:bg-[#F0EFED] rounded transition-colors"
              aria-label="Close Bag"
            >
              <X size={18} />
            </button>
          </div>

          {/* Free Shipping Progress Strip */}
          <div className="px-5 py-3 bg-[#E1E0DC]/40 border-b border-[#E1E0DC] text-xs">
            {remainingForFreeShipping === 0 ? (
              <p className="font-bold text-emerald-800 flex items-center gap-1.5">
                <Sparkles size={13} />
                YOU HAVE UNLOCKED COMPLIMENTARY SHIPPING!
              </p>
            ) : (
              <p className="text-[#302F2E]">
                Add <strong className="text-[#090808]">{formatPrice(remainingForFreeShipping)}</strong> more for complimentary delivery.
              </p>
            )}
            <div className="w-full bg-[#BEBDBB]/30 h-1.5 rounded-full mt-2 overflow-hidden">
              <div
                className="bg-[#090808] h-full transition-all duration-300"
                style={{ width: `${progressToFreeShipping}%` }}
              />
            </div>
          </div>

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {items.length === 0 ? (
              <div className="py-16 text-center space-y-4">
                <div className="w-12 h-12 rounded-full border border-dashed border-[#BEBDBB] flex items-center justify-center mx-auto text-[#BEBDBB]">
                  <ShoppingBag size={20} />
                </div>
                <div className="space-y-1">
                  <p className="font-display font-bold text-sm uppercase tracking-wider text-[#090808]">
                    YOUR BAG IS EMPTY
                  </p>
                  <p className="text-xs text-[#302F2E]">
                    Explore our curated apparel and customizer studio.
                  </p>
                </div>
                <Button
                  variant="ink"
                  size="sm"
                  onClick={() => {
                    closeDrawer()
                    navigate('/shop')
                  }}
                >
                  EXPLORE ARCHIVE
                </Button>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 p-3.5 bg-white border border-[#E1E0DC] rounded-sm relative group"
                >
                  {/* Thumbnail */}
                  <div className="w-20 h-24 flex-shrink-0 bg-[#F0EFED] border border-[#E1E0DC] overflow-hidden rounded-sm flex items-center justify-center">
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="font-display text-xs font-bold uppercase tracking-tight text-[#090808] line-clamp-2">
                          {item.name}
                        </h4>
                        <button
                          type="button"
                          onClick={() => removeItem(item.id)}
                          className="text-[#BEBDBB] hover:text-red-600 transition-colors p-1"
                          title="Remove piece"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>

                      {item.isCustom && (
                        <span className="inline-flex items-center gap-1 text-[9px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded uppercase mt-1 tracking-wider">
                          <Sparkles size={9} />
                          BESPOKE STUDIO PRINT
                        </span>
                      )}

                      <div className="flex items-center gap-3 text-[11px] text-[#302F2E] uppercase font-mono mt-1">
                        <span>COLOR: {item.color}</span>
                        <span>SIZE: {item.size}</span>
                      </div>
                    </div>

                    {/* Quantity Stepper & Price */}
                    <div className="flex items-center justify-between pt-2 border-t border-[#F0EFED] mt-2">
                      <div className="flex items-center border border-[#BEBDBB] rounded-sm bg-[#F0EFED]">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="p-1 text-[#302F2E] hover:text-[#090808] transition-colors"
                        >
                          <Minus size={11} />
                        </button>
                        <span className="w-6 text-center text-xs font-mono font-bold text-[#090808]">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="p-1 text-[#302F2E] hover:text-[#090808] transition-colors"
                        >
                          <Plus size={11} />
                        </button>
                      </div>

                      <span className="font-bold text-xs text-[#090808]">
                        {formatPrice(item.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer & Checkout Summary */}
          {items.length > 0 && (
            <div className="p-5 bg-white border-t border-[#E1E0DC] space-y-4">
              {/* Promo Code Input */}
              <form onSubmit={handleApplyPromo} className="space-y-1.5">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#BEBDBB]" />
                    <input
                      type="text"
                      value={promoInput}
                      onChange={(e) => setPromoInput(e.target.value)}
                      placeholder="PROMO (e.g. MOOD10)"
                      className="w-full bg-[#F0EFED] border border-[#BEBDBB] pl-8 pr-3 py-1.5 text-xs font-mono font-bold uppercase tracking-wider text-[#090808] focus:border-[#090808] focus:outline-none"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-3 py-1.5 bg-[#090808] text-white text-xs font-bold tracking-wider uppercase hover:bg-[#302F2E] transition-colors"
                  >
                    APPLY
                  </button>
                </div>
                {promoMessage && (
                  <p
                    className={`text-[10px] font-semibold tracking-wide ${
                      promoMessage.isError ? 'text-red-600' : 'text-emerald-700'
                    }`}
                  >
                    {promoMessage.text}
                  </p>
                )}
                {discountCode && (
                  <div className="flex items-center justify-between text-[11px] text-emerald-800 bg-emerald-50 px-2 py-1 rounded">
                    <span>APPLIED: <strong>{discountCode}</strong> ({discountPercent}% OFF)</span>
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

              {/* Price Calculations */}
              <div className="space-y-1.5 text-xs border-t border-[#E1E0DC] pt-3">
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
                  <span>ESTIMATED SHIPPING</span>
                  <span>{remainingForFreeShipping === 0 ? 'FREE' : 'CALCULATED AT CHECKOUT'}</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-[#090808] pt-2 border-t border-[#E1E0DC]">
                  <span>TOTAL ESTIMATE</span>
                  <span>{formatPrice(finalTotal)}</span>
                </div>
              </div>

              {/* Primary Actions */}
              <div className="space-y-2">
                <Button
                  variant="ink"
                  size="md"
                  className="w-full justify-between"
                  onClick={handleCheckoutClick}
                >
                  <span>PROCEED TO CHECKOUT</span>
                  <ArrowRight size={15} />
                </Button>

                <Link
                  to="/cart"
                  onClick={closeDrawer}
                  className="block text-center text-xs font-bold tracking-widest text-[#302F2E] hover:text-[#090808] uppercase py-1"
                >
                  VIEW DETAILED BAG
                </Link>
              </div>

              <div className="flex items-center justify-center gap-1.5 text-[10px] text-[#BEBDBB] uppercase tracking-wider pt-1">
                <ShieldCheck size={12} />
                <span>SECURE ENCRYPTED CHECKOUT</span>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}

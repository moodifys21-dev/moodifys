import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Container } from '@/components/ui/Container'
import { Button } from '@/components/ui/Button'
import {
  useCartStore,
  getCartSubtotal,
  getCartItemCount,
} from '@/stores/cartStore'
import { useOrderStore } from '@/stores/orderStore'
import { useAuthStore } from '@/stores/authStore'
import { formatPrice } from '@/lib/utils'
import { Order, OrderItem } from '@/types/order'
import {
  CreditCard,
  QrCode,
  Banknote,
  ArrowRight,
  ArrowLeft,
  Lock,
} from 'lucide-react'

export const Checkout: React.FC = () => {
  const navigate = useNavigate()
  const { items, discountCode, discountPercent, clearCart } = useCartStore()
  const { addOrder } = useOrderStore()
  const { user } = useAuthStore()

  // Form State
  const [formData, setFormData] = useState({
    fullName: user?.fullName || 'Vikramaditya Sen',
    email: user?.email || 'enter@moodifys.com',
    phone: '+91 98765 43210',
    addressLine1: '42 Indiranagar 100ft Road',
    addressLine2: 'Apartment 4B',
    city: 'Bengaluru',
    state: 'Karnataka',
    postalCode: '560038',
    country: 'India',
  })

  // Shipping Method
  const [shippingMethod, setShippingMethod] = useState<'standard' | 'express'>('standard')

  // Payment Method
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'upi' | 'cod'>('card')
  const [cardData, setCardData] = useState({
    cardNumber: '4111 2222 3333 4444',
    cardExpiry: '12/28',
    cardCvv: '888',
    cardName: 'VIKRAMADITYA SEN',
  })
  const [upiId, setUpiId] = useState('moodifys@okhdfcbank')

  const [isProcessing, setIsProcessing] = useState(false)
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})

  // Calculations
  const subtotal = getCartSubtotal(items)
  const itemCount = getCartItemCount(items)
  const discountAmount = Math.round((subtotal * discountPercent) / 100)
  const baseShippingFee = subtotal >= 1999 || items.length === 0 ? 0 : 150
  const expressExtra = shippingMethod === 'express' ? 150 : 0
  const finalShippingFee = baseShippingFee + expressExtra
  const grandTotal = Math.max(0, subtotal - discountAmount + finalShippingFee)

  if (items.length === 0) {
    return (
      <div className="w-full py-20 text-center">
        <Container size="tight">
          <h2 className="font-display text-2xl font-bold uppercase tracking-wide text-[#090808]">
            YOUR BAG IS EMPTY
          </h2>
          <p className="text-xs text-[#302F2E] mt-2 mb-6">
            Please add pieces to your shopping bag before proceeding to checkout.
          </p>
          <Button variant="ink" onClick={() => navigate('/shop')}>
            RETURN TO SHOP
          </Button>
        </Container>
      </div>
    )
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
    if (formErrors[e.target.name]) {
      setFormErrors({ ...formErrors, [e.target.name]: '' })
    }
  }

  const validateForm = () => {
    const errors: Record<string, string> = {}
    if (!formData.fullName.trim()) errors.fullName = 'Full name is required'
    if (!formData.email.trim() || !formData.email.includes('@')) errors.email = 'Valid email required'
    if (!formData.phone.trim()) errors.phone = 'Phone number is required'
    if (!formData.addressLine1.trim()) errors.addressLine1 = 'Street address is required'
    if (!formData.city.trim()) errors.city = 'City is required'
    if (!formData.state.trim()) errors.state = 'State is required'
    if (!formData.postalCode.trim()) errors.postalCode = 'Postal code is required'

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return

    setIsProcessing(true)

    setTimeout(() => {
      const orderId = `MOOD-${Math.floor(10000 + Math.random() * 90000)}`
      
      const orderItems: OrderItem[] = items.map((item) => ({
        id: `item-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        orderId: orderId,
        productId: item.productId,
        productName: item.name,
        productImage: item.imageUrl,
        color: item.color,
        size: item.size,
        quantity: item.quantity,
        unitPrice: item.price,
      }))

      const newOrder: Order = {
        id: orderId,
        userId: user?.id || 'guest-user',
        status: 'processing',
        paymentStatus: 'paid',
        paymentMethod: paymentMethod === 'upi' ? 'UPI (Instant Settlement)' : 'Credit / Debit Card',
        transactionRef: `pay_${Date.now().toString(36)}`,
        subtotal: subtotal,
        shipping: finalShippingFee,
        discount: discountAmount,
        total: grandTotal,
        currency: 'INR',
        shippingAddress: {
          fullName: formData.fullName,
          phone: formData.phone,
          addressLine1: formData.addressLine1,
          addressLine2: formData.addressLine2,
          city: formData.city,
          state: formData.state,
          postalCode: formData.postalCode,
          country: formData.country,
        },
        items: orderItems,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      addOrder(newOrder)
      clearCart()
      setIsProcessing(false)
      navigate(`/order-success/${orderId}`)
    }, 1200)
  }

  return (
    <div className="w-full py-8 md:py-12 bg-[#F0EFED]">
      <Container size="wide">
        
        {/* Header Breadcrumb */}
        <div className="pb-6 mb-8 border-b border-[#E1E0DC] flex items-center justify-between">
          <div>
            <Link
              to="/cart"
              className="inline-flex items-center gap-1.5 text-xs font-bold tracking-widest text-[#302F2E] hover:text-[#090808] uppercase mb-1"
            >
              <ArrowLeft size={13} />
              RETURN TO BAG
            </Link>
            <h1 className="font-display text-2xl sm:text-3xl font-bold uppercase tracking-tight text-[#090808]">
              CHECKOUT
            </h1>
          </div>
          <div className="flex items-center gap-2 text-xs text-[#302F2E] font-semibold">
            <Lock size={14} className="text-emerald-700" />
            <span className="hidden sm:inline uppercase tracking-wider">256-BIT SSL ENCRYPTED</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          
          {/* Left Column: Multi-Step Forms */}
          <div className="lg:col-span-7 space-y-8">
            
            {/* Step 1: Customer Contact & Shipping Address */}
            <div className="bg-white p-6 sm:p-8 border border-[#E1E0DC] rounded-sm space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-[#E1E0DC]">
                <h2 className="font-display text-sm sm:text-base font-bold uppercase tracking-wider text-[#090808] flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-[#090808] text-white text-xs flex items-center justify-center font-mono">
                    1
                  </span>
                  SHIPPING & CONTACT DETAILS
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="text-[11px] font-bold tracking-[0.2em] text-[#BEBDBB] uppercase block mb-1">
                    FULL NAME *
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className="w-full bg-[#F0EFED] border border-[#BEBDBB] px-3.5 py-2.5 text-xs font-bold text-[#090808] focus:border-[#090808] focus:outline-none uppercase"
                  />
                  {formErrors.fullName && (
                    <p className="text-[10px] text-red-600 mt-1">{formErrors.fullName}</p>
                  )}
                </div>

                <div>
                  <label className="text-[11px] font-bold tracking-[0.2em] text-[#BEBDBB] uppercase block mb-1">
                    EMAIL ADDRESS *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full bg-[#F0EFED] border border-[#BEBDBB] px-3.5 py-2.5 text-xs font-bold text-[#090808] focus:border-[#090808] focus:outline-none"
                  />
                  {formErrors.email && (
                    <p className="text-[10px] text-red-600 mt-1">{formErrors.email}</p>
                  )}
                </div>

                <div>
                  <label className="text-[11px] font-bold tracking-[0.2em] text-[#BEBDBB] uppercase block mb-1">
                    PHONE NUMBER *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full bg-[#F0EFED] border border-[#BEBDBB] px-3.5 py-2.5 text-xs font-bold text-[#090808] focus:border-[#090808] focus:outline-none"
                  />
                  {formErrors.phone && (
                    <p className="text-[10px] text-red-600 mt-1">{formErrors.phone}</p>
                  )}
                </div>

                <div className="sm:col-span-2">
                  <label className="text-[11px] font-bold tracking-[0.2em] text-[#BEBDBB] uppercase block mb-1">
                    STREET ADDRESS *
                  </label>
                  <input
                    type="text"
                    name="addressLine1"
                    value={formData.addressLine1}
                    onChange={handleInputChange}
                    placeholder="HOUSE NO, STREET, AREA"
                    className="w-full bg-[#F0EFED] border border-[#BEBDBB] px-3.5 py-2.5 text-xs font-bold text-[#090808] focus:border-[#090808] focus:outline-none uppercase"
                  />
                  {formErrors.addressLine1 && (
                    <p className="text-[10px] text-red-600 mt-1">{formErrors.addressLine1}</p>
                  )}
                </div>

                <div className="sm:col-span-2">
                  <label className="text-[11px] font-bold tracking-[0.2em] text-[#BEBDBB] uppercase block mb-1">
                    APARTMENT / LANDMARK (OPTIONAL)
                  </label>
                  <input
                    type="text"
                    name="addressLine2"
                    value={formData.addressLine2}
                    onChange={handleInputChange}
                    className="w-full bg-[#F0EFED] border border-[#BEBDBB] px-3.5 py-2.5 text-xs font-bold text-[#090808] focus:border-[#090808] focus:outline-none uppercase"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold tracking-[0.2em] text-[#BEBDBB] uppercase block mb-1">
                    CITY *
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    className="w-full bg-[#F0EFED] border border-[#BEBDBB] px-3.5 py-2.5 text-xs font-bold text-[#090808] focus:border-[#090808] focus:outline-none uppercase"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold tracking-[0.2em] text-[#BEBDBB] uppercase block mb-1">
                    STATE *
                  </label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    className="w-full bg-[#F0EFED] border border-[#BEBDBB] px-3.5 py-2.5 text-xs font-bold text-[#090808] focus:border-[#090808] focus:outline-none uppercase"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold tracking-[0.2em] text-[#BEBDBB] uppercase block mb-1">
                    POSTAL PINCODE *
                  </label>
                  <input
                    type="text"
                    name="postalCode"
                    value={formData.postalCode}
                    onChange={handleInputChange}
                    className="w-full bg-[#F0EFED] border border-[#BEBDBB] px-3.5 py-2.5 text-xs font-bold text-[#090808] focus:border-[#090808] focus:outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold tracking-[0.2em] text-[#BEBDBB] uppercase block mb-1">
                    COUNTRY
                  </label>
                  <input
                    type="text"
                    name="country"
                    disabled
                    value={formData.country}
                    className="w-full bg-[#E1E0DC] border border-[#BEBDBB] px-3.5 py-2.5 text-xs font-bold text-[#302F2E] uppercase cursor-not-allowed"
                  />
                </div>
              </div>
            </div>

            {/* Step 2: Shipping Options */}
            <div className="bg-white p-6 sm:p-8 border border-[#E1E0DC] rounded-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#E1E0DC]">
                <h2 className="font-display text-sm sm:text-base font-bold uppercase tracking-wider text-[#090808] flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-[#090808] text-white text-xs flex items-center justify-center font-mono">
                    2
                  </span>
                  DELIVERY SPEED
                </h2>
              </div>

              <div className="space-y-3">
                <label
                  onClick={() => setShippingMethod('standard')}
                  className={`flex items-center justify-between p-4 border rounded-sm cursor-pointer transition-all ${
                    shippingMethod === 'standard'
                      ? 'border-[#090808] bg-[#F0EFED]'
                      : 'border-[#E1E0DC] hover:border-[#BEBDBB]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                      shippingMethod === 'standard' ? 'border-[#090808] bg-[#090808]' : 'border-[#BEBDBB]'
                    }`}>
                      {shippingMethod === 'standard' && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-[#090808]">
                        STANDARD ARCHIVAL COURIER (3-5 BUSINESS DAYS)
                      </p>
                      <p className="text-[11px] text-[#302F2E]">
                        Fully tracked & insured delivery in custom Moodifys matte box.
                      </p>
                    </div>
                  </div>
                  <span className="font-bold text-xs text-[#090808]">
                    {baseShippingFee === 0 ? 'FREE' : formatPrice(baseShippingFee)}
                  </span>
                </label>

                <label
                  onClick={() => setShippingMethod('express')}
                  className={`flex items-center justify-between p-4 border rounded-sm cursor-pointer transition-all ${
                    shippingMethod === 'express'
                      ? 'border-[#090808] bg-[#F0EFED]'
                      : 'border-[#E1E0DC] hover:border-[#BEBDBB]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                      shippingMethod === 'express' ? 'border-[#090808] bg-[#090808]' : 'border-[#BEBDBB]'
                    }`}>
                      {shippingMethod === 'express' && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-[#090808] flex items-center gap-1.5">
                        <span>EXPRESS AIR COURIER (1-2 BUSINESS DAYS)</span>
                        <span className="bg-amber-100 text-amber-900 text-[9px] px-1.5 py-0.5 rounded font-bold uppercase">
                          PRIORITY
                        </span>
                      </p>
                      <p className="text-[11px] text-[#302F2E]">
                        Priority print dispatch & direct air delivery.
                      </p>
                    </div>
                  </div>
                  <span className="font-bold text-xs text-[#090808]">
                    {formatPrice(baseShippingFee + 150)}
                  </span>
                </label>
              </div>
            </div>

            {/* Step 3: Payment Method */}
            <div className="bg-white p-6 sm:p-8 border border-[#E1E0DC] rounded-sm space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-[#E1E0DC]">
                <h2 className="font-display text-sm sm:text-base font-bold uppercase tracking-wider text-[#090808] flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-[#090808] text-white text-xs flex items-center justify-center font-mono">
                    3
                  </span>
                  PAYMENT METHOD
                </h2>
              </div>

              {/* Payment selector tabs */}
              <div className="grid grid-cols-3 gap-2 border-b border-[#E1E0DC] pb-4">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  className={`py-3 flex flex-col items-center justify-center gap-1.5 border rounded-sm transition-colors text-xs font-bold uppercase tracking-wider ${
                    paymentMethod === 'card'
                      ? 'border-[#090808] bg-[#090808] text-white'
                      : 'border-[#E1E0DC] bg-[#F0EFED] text-[#302F2E] hover:border-[#090808]'
                  }`}
                >
                  <CreditCard size={18} />
                  <span>CARD</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('upi')}
                  className={`py-3 flex flex-col items-center justify-center gap-1.5 border rounded-sm transition-colors text-xs font-bold uppercase tracking-wider ${
                    paymentMethod === 'upi'
                      ? 'border-[#090808] bg-[#090808] text-white'
                      : 'border-[#E1E0DC] bg-[#F0EFED] text-[#302F2E] hover:border-[#090808]'
                  }`}
                >
                  <QrCode size={18} />
                  <span>UPI / QR</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('cod')}
                  className={`py-3 flex flex-col items-center justify-center gap-1.5 border rounded-sm transition-colors text-xs font-bold uppercase tracking-wider ${
                    paymentMethod === 'cod'
                      ? 'border-[#090808] bg-[#090808] text-white'
                      : 'border-[#E1E0DC] bg-[#F0EFED] text-[#302F2E] hover:border-[#090808]'
                  }`}
                >
                  <Banknote size={18} />
                  <span>CASH ON DELIVERY</span>
                </button>
              </div>

              {/* Card Inputs */}
              {paymentMethod === 'card' && (
                <div className="space-y-4 pt-2">
                  <div>
                    <label className="text-[11px] font-bold tracking-[0.2em] text-[#BEBDBB] uppercase block mb-1">
                      CARD NUMBER
                    </label>
                    <input
                      type="text"
                      value={cardData.cardNumber}
                      onChange={(e) => setCardData({ ...cardData, cardNumber: e.target.value })}
                      placeholder="XXXX XXXX XXXX XXXX"
                      className="w-full bg-[#F0EFED] border border-[#BEBDBB] px-3.5 py-2.5 text-xs font-mono font-bold text-[#090808] focus:border-[#090808] focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[11px] font-bold tracking-[0.2em] text-[#BEBDBB] uppercase block mb-1">
                        EXPIRY DATE
                      </label>
                      <input
                        type="text"
                        value={cardData.cardExpiry}
                        onChange={(e) => setCardData({ ...cardData, cardExpiry: e.target.value })}
                        placeholder="MM/YY"
                        className="w-full bg-[#F0EFED] border border-[#BEBDBB] px-3.5 py-2.5 text-xs font-mono font-bold text-[#090808] focus:border-[#090808] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold tracking-[0.2em] text-[#BEBDBB] uppercase block mb-1">
                        CVV / CVC
                      </label>
                      <input
                        type="password"
                        maxLength={4}
                        value={cardData.cardCvv}
                        onChange={(e) => setCardData({ ...cardData, cardCvv: e.target.value })}
                        placeholder="•••"
                        className="w-full bg-[#F0EFED] border border-[#BEBDBB] px-3.5 py-2.5 text-xs font-mono font-bold text-[#090808] focus:border-[#090808] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold tracking-[0.2em] text-[#BEBDBB] uppercase block mb-1">
                      NAME ON CARD
                    </label>
                    <input
                      type="text"
                      value={cardData.cardName}
                      onChange={(e) => setCardData({ ...cardData, cardName: e.target.value })}
                      className="w-full bg-[#F0EFED] border border-[#BEBDBB] px-3.5 py-2.5 text-xs font-bold text-[#090808] focus:border-[#090808] focus:outline-none uppercase"
                    />
                  </div>
                </div>
              )}

              {/* UPI Option */}
              {paymentMethod === 'upi' && (
                <div className="space-y-4 pt-2 text-center p-4 bg-[#F0EFED] rounded-sm">
                  <div className="w-32 h-32 bg-white border border-[#BEBDBB] p-2 mx-auto flex items-center justify-center">
                    <QrCode size={96} className="text-[#090808]" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-bold uppercase tracking-wider text-[#090808]">
                      SCAN QR WITH ANY UPI APP
                    </p>
                    <p className="text-[11px] text-[#302F2E] font-mono">
                      GPay, PhonePe, Paytm, CRED
                    </p>
                  </div>
                  <div className="max-w-xs mx-auto pt-2">
                    <label className="text-[10px] font-bold tracking-[0.2em] text-[#BEBDBB] uppercase block mb-1 text-left">
                      OR ENTER VPA / UPI ID
                    </label>
                    <input
                      type="text"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      className="w-full bg-white border border-[#BEBDBB] px-3 py-2 text-xs font-mono text-[#090808] focus:border-[#090808] focus:outline-none"
                    />
                  </div>
                </div>
              )}

              {/* Cash On Delivery Option */}
              {paymentMethod === 'cod' && (
                <div className="p-4 bg-[#F0EFED] border border-[#BEBDBB] text-xs space-y-2 rounded-sm">
                  <p className="font-bold text-[#090808] uppercase tracking-wide">
                    CASH / UPI ON DELIVERY
                  </p>
                  <p className="text-[#302F2E] leading-relaxed">
                    Pay securely in cash or via digital UPI QR upon delivery to the courier partner.
                  </p>
                </div>
              )}
            </div>

          </div>

          {/* Right Column: Sticky Order Summary */}
          <div className="lg:col-span-5">
            <div className="bg-white border border-[#E1E0DC] p-6 rounded-sm space-y-6 sticky top-24">
              <h2 className="font-display text-base font-bold uppercase tracking-wider text-[#090808] pb-3 border-b border-[#E1E0DC]">
                ORDER SUMMARY ({itemCount})
              </h2>

              {/* Mini Item List */}
              <div className="max-h-80 overflow-y-auto space-y-3 divide-y divide-[#F0EFED] pr-1">
                {items.map((item) => (
                  <div key={item.id} className="pt-3 first:pt-0 flex gap-3">
                    <div className="w-14 h-16 bg-[#F0EFED] border border-[#E1E0DC] rounded-sm overflow-hidden flex-shrink-0">
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <p className="font-display text-xs font-bold uppercase text-[#090808] line-clamp-1">
                          {item.name}
                        </p>
                        <p className="text-[10px] text-[#302F2E] font-mono uppercase">
                          {item.color} • {item.size} • QTY: {item.quantity}
                        </p>
                      </div>
                      <p className="text-xs font-bold text-[#090808] text-right">
                        {formatPrice(item.price * item.quantity)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Cost Summary */}
              <div className="space-y-2 text-xs border-t border-[#E1E0DC] pt-4">
                <div className="flex justify-between text-[#302F2E]">
                  <span>SUBTOTAL</span>
                  <span className="font-bold text-[#090808]">{formatPrice(subtotal)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-semibold">
                    <span>PROMO ({discountCode})</span>
                    <span>-{formatPrice(discountAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-[#302F2E]">
                  <span>DELIVERY ({shippingMethod.toUpperCase()})</span>
                  <span>{finalShippingFee === 0 ? 'COMPLIMENTARY' : formatPrice(finalShippingFee)}</span>
                </div>
                <div className="flex justify-between text-base font-bold text-[#090808] pt-3 border-t border-[#E1E0DC]">
                  <span>FINAL TOTAL</span>
                  <span>{formatPrice(grandTotal)}</span>
                </div>
              </div>

              {/* Submit Button */}
              <Button
                variant="ink"
                size="lg"
                className="w-full justify-between"
                onClick={handlePlaceOrder}
                disabled={isProcessing}
              >
                <span>{isProcessing ? 'AUTHORIZING TRANSACTION...' : 'PLACE ORDER & CONFIRM'}</span>
                <ArrowRight size={16} />
              </Button>

              <div className="border-t border-[#E1E0DC] pt-4 text-center space-y-1">
                <p className="text-[10px] text-[#BEBDBB] uppercase tracking-wider">
                  BY PLACING THIS ORDER YOU AGREE TO MOODIFYS TERMS & ARCHIVAL POLICIES.
                </p>
              </div>
            </div>
          </div>

        </div>
      </Container>
    </div>
  )
}

export default Checkout

import { CustomDesign } from './design'

export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'processing'
  | 'production'
  | 'quality_check'
  | 'packed'
  | 'ready_to_ship'
  | 'shipped'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled'
  | 'refund_requested'
  | 'refunded'
  | 'failed'

export type PaymentStatus = 'paid' | 'pending' | 'failed' | 'refunded'

export interface ShippingAddress {
  id?: string
  fullName: string
  phone: string
  addressLine1: string
  addressLine2?: string
  city: string
  state: string
  postalCode: string
  country: string
}

export interface InternalOrderNote {
  id: string
  author: string
  note: string
  createdAt: string
}

export interface OrderEvent {
  id: string
  event: string
  actor: string
  timestamp: string
  note?: string
}

export interface OrderItem {
  id: string
  orderId: string
  productId: string
  productName: string
  productImage: string
  variantId?: string
  color: string
  size: string
  quantity: number
  unitPrice: number
  designId?: string
  design?: CustomDesign
}

export interface Order {
  id: string
  userId: string
  status: OrderStatus
  paymentStatus: PaymentStatus
  paymentMethod?: string
  transactionRef?: string
  subtotal: number
  shipping: number
  discount: number
  total: number
  currency: string
  shippingAddress: ShippingAddress
  items: OrderItem[]
  courier?: string
  trackingNumber?: string
  estimatedDelivery?: string
  internalNotes?: InternalOrderNote[]
  events?: OrderEvent[]
  createdAt: string
  updatedAt: string
}

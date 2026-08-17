import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Order, OrderStatus, PaymentStatus, InternalOrderNote, OrderEvent } from '@/types/order'

interface OrderStoreState {
  orders: Order[]
  addOrder: (order: Order) => void
  getOrderById: (id: string) => Order | undefined
  updateOrderStatus: (id: string, status: OrderStatus, note?: string, actor?: string) => void
  updateOrderShipping: (id: string, courier: string, trackingNumber: string) => void
  updatePaymentStatus: (id: string, paymentStatus: PaymentStatus) => void
  addInternalNote: (orderId: string, note: string, author: string) => void
}

const INITIAL_MOCK_ORDERS: Order[] = [
  {
    id: 'MOOD-89214',
    userId: 'user-default-1',
    status: 'delivered',
    paymentStatus: 'paid',
    paymentMethod: 'UPI / Razorpay',
    transactionRef: 'pay_live_99812401',
    subtotal: 1998,
    shipping: 0,
    discount: 0,
    total: 1998,
    currency: 'INR',
    courier: 'Blue Dart Express',
    trackingNumber: 'BD-884019234IN',
    shippingAddress: {
      fullName: 'Vikramaditya Sen',
      phone: '+91 98765 43210',
      addressLine1: '42 Indiranagar 100ft Road',
      city: 'Bengaluru',
      state: 'Karnataka',
      postalCode: '560038',
      country: 'India',
    },
    items: [
      {
        id: 'item-seed-1',
        orderId: 'MOOD-89214',
        productId: 'prod-classic-tee',
        productName: 'CLASSIC 240GSM TEE',
        productImage: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80',
        color: 'Black',
        size: 'L',
        quantity: 2,
        unitPrice: 999,
      },
    ],
    internalNotes: [
      {
        id: 'note-1',
        author: 'Fulfillment Lead',
        note: 'Customer requested double-layer recyclable packaging.',
        createdAt: '2026-08-02T14:30:00Z',
      },
    ],
    events: [
      {
        id: 'evt-1',
        event: 'Order Placed & Payment Verified',
        actor: 'Customer Checkout',
        timestamp: '2026-08-02T14:22:00Z',
      },
      {
        id: 'evt-2',
        event: 'Quality Check Passed',
        actor: 'QC Station 2',
        timestamp: '2026-08-03T10:15:00Z',
      },
      {
        id: 'evt-3',
        event: 'Dispatched with Blue Dart',
        actor: 'Shipping Hub',
        timestamp: '2026-08-04T16:00:00Z',
      },
      {
        id: 'evt-4',
        event: 'Successfully Delivered',
        actor: 'Courier Blue Dart',
        timestamp: '2026-08-06T11:00:00Z',
      },
    ],
    createdAt: '2026-08-02T14:22:00Z',
    updatedAt: '2026-08-06T11:00:00Z',
  },
  {
    id: 'MOOD-92041',
    userId: 'user-default-1',
    status: 'production',
    paymentStatus: 'paid',
    paymentMethod: 'Credit Card / Visa',
    transactionRef: 'txn_mock_9921402',
    subtotal: 2499,
    shipping: 0,
    discount: 250,
    total: 2249,
    currency: 'INR',
    courier: 'Delhivery Surface',
    trackingNumber: 'DLHV-PENDING-STAGE',
    shippingAddress: {
      fullName: 'Vikramaditya Sen',
      phone: '+91 98765 43210',
      addressLine1: '42 Indiranagar 100ft Road',
      city: 'Bengaluru',
      state: 'Karnataka',
      postalCode: '560038',
      country: 'India',
    },
    items: [
      {
        id: 'item-seed-2',
        orderId: 'MOOD-92041',
        productId: 'prod-oversized-tee',
        productName: 'OVERSIZED STUDIO TEE [CUSTOM: CYBER NOIR]',
        productImage: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=800&auto=format&fit=crop&q=80',
        color: 'Black',
        size: 'XL',
        quantity: 1,
        unitPrice: 1499,
        designId: 'design-cyber-noir',
        design: {
          id: 'design-cyber-noir',
          userId: 'user-default-1',
          name: 'CYBER NOIR ARCHIVAL',
          productId: 'prod-oversized-tee',
          selectedColor: 'Black',
          selectedSize: 'XL',
          previewUrl: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=800&auto=format&fit=crop&q=80',
          canvasJson: { version: '5.3.0', objects: [{ type: 'text', text: 'CYBER NOIR' }] },
          createdAt: '2026-08-14T09:10:00Z',
          updatedAt: '2026-08-14T09:10:00Z',
        },
      },
      {
        id: 'item-seed-3',
        orderId: 'MOOD-92041',
        productId: 'prod-archival-cap',
        productName: 'ARCHIVAL 6-PANEL CAP',
        productImage: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=800&auto=format&fit=crop&q=80',
        color: 'Black',
        size: 'ADJUSTABLE',
        quantity: 1,
        unitPrice: 799,
      },
    ],
    internalNotes: [
      {
        id: 'note-2',
        author: 'Studio Operator',
        note: 'High density print raster verified at 300DPI.',
        createdAt: '2026-08-14T09:40:00Z',
      },
    ],
    events: [
      {
        id: 'evt-10',
        event: 'Custom Order Placed & Asset Exported',
        actor: 'Customer Web Studio',
        timestamp: '2026-08-14T09:15:00Z',
      },
      {
        id: 'evt-11',
        event: 'Production Queue Initiated (DTG Print Bed 4)',
        actor: 'Automation Dispatch',
        timestamp: '2026-08-14T10:00:00Z',
      },
    ],
    createdAt: '2026-08-14T09:15:00Z',
    updatedAt: '2026-08-14T10:00:00Z',
  },
]

export const useOrderStore = create<OrderStoreState>()(
  persist(
    (set, get) => ({
      orders: INITIAL_MOCK_ORDERS,

      addOrder: (order) => {
        const orderWithDefaults: Order = {
          ...order,
          paymentStatus: order.paymentStatus || 'paid',
          events: order.events || [
            {
              id: `evt-${Date.now()}`,
              event: 'Order Confirmed',
              actor: 'Checkout System',
              timestamp: new Date().toISOString(),
            },
          ],
          internalNotes: order.internalNotes || [],
        }
        set({ orders: [orderWithDefaults, ...get().orders] })
      },

      getOrderById: (id) => {
        return get().orders.find((o) => o.id === id)
      },

      updateOrderStatus: (id, status, note, actor = 'Admin') => {
        set({
          orders: get().orders.map((o) => {
            if (o.id !== id) return o
            const newEvent: OrderEvent = {
              id: `evt-${Date.now()}`,
              event: `Status Updated to ${status.toUpperCase().replace('_', ' ')}`,
              actor,
              timestamp: new Date().toISOString(),
              note,
            }
            return {
              ...o,
              status,
              updatedAt: new Date().toISOString(),
              events: [newEvent, ...(o.events || [])],
            }
          }),
        })
      },

      updateOrderShipping: (id, courier, trackingNumber) => {
        set({
          orders: get().orders.map((o) => {
            if (o.id !== id) return o
            const newEvent: OrderEvent = {
              id: `evt-${Date.now()}`,
              event: `Tracking assigned: ${courier} (${trackingNumber})`,
              actor: 'Shipping Hub',
              timestamp: new Date().toISOString(),
            }
            return {
              ...o,
              courier,
              trackingNumber,
              updatedAt: new Date().toISOString(),
              events: [newEvent, ...(o.events || [])],
            }
          }),
        })
      },

      updatePaymentStatus: (id, paymentStatus) => {
        set({
          orders: get().orders.map((o) =>
            o.id === id
              ? {
                  ...o,
                  paymentStatus,
                  updatedAt: new Date().toISOString(),
                }
              : o
          ),
        })
      },

      addInternalNote: (orderId, noteText, author) => {
        const newNote: InternalOrderNote = {
          id: `note-${Date.now()}`,
          author,
          note: noteText,
          createdAt: new Date().toISOString(),
        }
        set({
          orders: get().orders.map((o) =>
            o.id === orderId
              ? {
                  ...o,
                  internalNotes: [newNote, ...(o.internalNotes || [])],
                }
              : o
          ),
        })
      },
    }),
    {
      name: 'moodifys-orders-storage',
    }
  )
)

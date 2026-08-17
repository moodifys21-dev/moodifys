import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Customer, CustomerStatus, CustomerTier } from '@/types/customer'

interface CustomerStoreState {
  customers: Customer[]

  // Actions
  updateCustomerStatus: (id: string, status: CustomerStatus) => void
  updateCustomerTier: (id: string, tier: CustomerTier) => void
  addCustomerTag: (id: string, tag: string) => void
  removeCustomerTag: (id: string, tag: string) => void
  addCustomerNote: (id: string, note: string, author?: string) => void
}

const SEED_CUSTOMERS: Customer[] = [
  {
    id: 'cust-1',
    fullName: 'Aarav Sharma',
    email: 'aarav.sharma@example.com',
    phone: '+91 98765 43210',
    tier: 'GOLD_VIP',
    status: 'ACTIVE',
    totalOrders: 6,
    customOrdersCount: 4,
    lifetimeSpent: 18450,
    averageOrderValue: 3075,
    primaryCity: 'Mumbai',
    primaryState: 'Maharashtra',
    tags: ['HIGH_SPENDER', 'BESPOKE_STUDIO_REGULAR', 'STREETWEAR_CONNOISSEUR'],
    notes: [
      {
        id: 'cn-1',
        author: 'VIP Relationship Manager',
        note: 'Requested custom high-GSM heavyweight box fit samples with vintage mineral wash.',
        createdAt: '2026-08-10T11:00:00Z',
      },
    ],
    lastOrderDate: '2026-08-15T14:30:00Z',
    registeredAt: '2026-05-12T09:00:00Z',
  },
  {
    id: 'cust-2',
    fullName: 'Rhea Patel',
    email: 'rhea.patel@designstudio.in',
    phone: '+91 91234 56789',
    tier: 'PLATINUM_VIP',
    status: 'ACTIVE',
    totalOrders: 12,
    customOrdersCount: 9,
    lifetimeSpent: 42800,
    averageOrderValue: 3566,
    primaryCity: 'Bengaluru',
    primaryState: 'Karnataka',
    tags: ['DESIGN_COLLECTIVE', 'PLATINUM_INSIDER'],
    notes: [
      {
        id: 'cn-2',
        author: 'Customer Support Lead',
        note: 'Design agency partner ordering limited custom hoodies for launch drops.',
        createdAt: '2026-07-20T16:45:00Z',
      },
    ],
    lastOrderDate: '2026-08-16T18:00:00Z',
    registeredAt: '2026-03-01T10:15:00Z',
  },
  {
    id: 'cust-3',
    fullName: 'Vikramaditya Sengupta',
    email: 'vikram.sen@outlook.com',
    phone: '+91 97480 11223',
    tier: 'STANDARD',
    status: 'ACTIVE',
    totalOrders: 1,
    customOrdersCount: 1,
    lifetimeSpent: 2499,
    averageOrderValue: 2499,
    primaryCity: 'Kolkata',
    primaryState: 'West Bengal',
    tags: ['FIRST_TIME_BUYER'],
    notes: [],
    lastOrderDate: '2026-08-16T12:00:00Z',
    registeredAt: '2026-08-16T11:30:00Z',
  },
  {
    id: 'cust-4',
    fullName: 'Neha Kapoor',
    email: 'neha.k@fashionblog.com',
    phone: '+91 98111 22334',
    tier: 'SILVER',
    status: 'ACTIVE',
    totalOrders: 3,
    customOrdersCount: 2,
    lifetimeSpent: 8900,
    averageOrderValue: 2966,
    primaryCity: 'New Delhi',
    primaryState: 'Delhi',
    tags: ['INFLUENCER', 'LOOKBOOK_COLLAB'],
    notes: [
      {
        id: 'cn-3',
        author: 'PR Manager',
        note: 'Sent gift coupon for Drop 04 campaign collaboration.',
        createdAt: '2026-08-05T14:20:00Z',
      },
    ],
    lastOrderDate: '2026-08-12T10:00:00Z',
    registeredAt: '2026-06-15T08:00:00Z',
  },
  {
    id: 'cust-5',
    fullName: 'Kabir Mehta',
    email: 'kabir.suspicious@tempmail.org',
    phone: '+91 90000 00000',
    tier: 'STANDARD',
    status: 'FLAGGED',
    totalOrders: 2,
    customOrdersCount: 0,
    lifetimeSpent: 4999,
    averageOrderValue: 2499,
    primaryCity: 'Surat',
    primaryState: 'Gujarat',
    tags: ['CHARGEBACK_RISK', 'FLAGGED_IP'],
    notes: [
      {
        id: 'cn-4',
        author: 'Security Officer',
        note: 'Failed 3-D secure verification on multiple credit cards. Flagged for review.',
        createdAt: '2026-08-14T09:30:00Z',
      },
    ],
    lastOrderDate: '2026-08-14T09:15:00Z',
    registeredAt: '2026-08-14T09:00:00Z',
  },
]

export const useCustomerStore = create<CustomerStoreState>()(
  persist(
    (set, get) => ({
      customers: SEED_CUSTOMERS,

      updateCustomerStatus: (id, status) => {
        set({
          customers: get().customers.map((c) =>
            c.id === id ? { ...c, status } : c
          ),
        })
      },

      updateCustomerTier: (id, tier) => {
        set({
          customers: get().customers.map((c) =>
            c.id === id ? { ...c, tier } : c
          ),
        })
      },

      addCustomerTag: (id, tag) => {
        if (!tag.trim()) return
        const formatted = tag.trim().toUpperCase().replace(/\s+/g, '_')
        set({
          customers: get().customers.map((c) =>
            c.id === id && !c.tags.includes(formatted)
              ? { ...c, tags: [...c.tags, formatted] }
              : c
          ),
        })
      },

      removeCustomerTag: (id, tag) => {
        set({
          customers: get().customers.map((c) =>
            c.id === id
              ? { ...c, tags: c.tags.filter((t) => t !== tag) }
              : c
          ),
        })
      },

      addCustomerNote: (id, note, author = 'Admin Staff') => {
        if (!note.trim()) return
        const newNote = {
          id: `cn-${Date.now()}`,
          author,
          note: note.trim(),
          createdAt: new Date().toISOString(),
        }

        set({
          customers: get().customers.map((c) =>
            c.id === id ? { ...c, notes: [newNote, ...c.notes] } : c
          ),
        })
      },
    }),
    {
      name: 'moodifys-customers-storage',
    }
  )
)

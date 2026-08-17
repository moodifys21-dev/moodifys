export type CustomerTier = 'STANDARD' | 'SILVER' | 'GOLD_VIP' | 'PLATINUM_VIP'
export type CustomerStatus = 'ACTIVE' | 'FLAGGED' | 'SUSPENDED'

export interface CustomerNote {
  id: string
  author: string
  note: string
  createdAt: string
}

export interface Customer {
  id: string
  fullName: string
  email: string
  phone: string
  tier: CustomerTier
  status: CustomerStatus
  totalOrders: number
  customOrdersCount: number
  lifetimeSpent: number
  averageOrderValue: number
  primaryCity: string
  primaryState: string
  tags: string[]
  notes: CustomerNote[]
  lastOrderDate: string
  registeredAt: string
}

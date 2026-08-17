import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface CartItem {
  id: string
  productId: string
  name: string
  price: number
  color: string
  colorHex: string
  size: string
  quantity: number
  imageUrl: string
  isCustom: boolean
  designName?: string
  designJson?: Record<string, unknown>
}

interface CartStoreState {
  items: CartItem[]
  isDrawerOpen: boolean
  discountCode: string | null
  discountPercent: number
  
  // Actions
  addItem: (item: Omit<CartItem, 'id'>) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  openDrawer: () => void
  closeDrawer: () => void
  toggleDrawer: () => void
  applyDiscount: (code: string) => { success: boolean; message: string }
  removeDiscount: () => void
}

const VALID_PROMOS: Record<string, number> = {
  MOOD10: 10,
  EDITORIAL20: 20,
  BESPOKE15: 15,
}

export const useCartStore = create<CartStoreState>()(
  persist(
    (set, get) => ({
      items: [],
      isDrawerOpen: false,
      discountCode: null,
      discountPercent: 0,

      addItem: (newItem) => {
        const currentItems = get().items
        // For non-custom items with identical product, color, size: increment quantity
        if (!newItem.isCustom) {
          const existingIndex = currentItems.findIndex(
            (i) =>
              !i.isCustom &&
              i.productId === newItem.productId &&
              i.color === newItem.color &&
              i.size === newItem.size
          )

          if (existingIndex > -1) {
            const updated = [...currentItems]
            updated[existingIndex].quantity += newItem.quantity
            set({ items: updated, isDrawerOpen: true })
            return
          }
        }

        // Otherwise generate unique item entry
        const id = `cart-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`
        set({
          items: [{ ...newItem, id }, ...currentItems],
          isDrawerOpen: true,
        })
      },

      removeItem: (id) => {
        set({ items: get().items.filter((i) => i.id !== id) })
      },

      updateQuantity: (id, quantity) => {
        if (quantity <= 0) {
          get().removeItem(id)
          return
        }
        set({
          items: get().items.map((i) =>
            i.id === id ? { ...i, quantity } : i
          ),
        })
      },

      clearCart: () => {
        set({ items: [], discountCode: null, discountPercent: 0 })
      },

      openDrawer: () => set({ isDrawerOpen: true }),
      closeDrawer: () => set({ isDrawerOpen: false }),
      toggleDrawer: () => set({ isDrawerOpen: !get().isDrawerOpen }),

      applyDiscount: (code: string) => {
        const cleanCode = code.toUpperCase().trim()
        if (VALID_PROMOS[cleanCode]) {
          const percent = VALID_PROMOS[cleanCode]
          set({ discountCode: cleanCode, discountPercent: percent })
          return {
            success: true,
            message: `Promo code ${cleanCode} applied (${percent}% OFF)!`,
          }
        }
        return {
          success: false,
          message: 'Invalid or expired promotional code.',
        }
      },

      removeDiscount: () => {
        set({ discountCode: null, discountPercent: 0 })
      },
    }),
    {
      name: 'moodifys-cart-storage',
      partialize: (state) => ({
        items: state.items,
        discountCode: state.discountCode,
        discountPercent: state.discountPercent,
      }),
    }
  )
)

// Helper selectors
export const getCartSubtotal = (items: CartItem[]): number => {
  return items.reduce((acc, item) => acc + item.price * item.quantity, 0)
}

export const getCartItemCount = (items: CartItem[]): number => {
  return items.reduce((acc, item) => acc + item.quantity, 0)
}

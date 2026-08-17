import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { InventoryItem, InventoryMovement, InventoryMovementType } from '@/types/inventory'
import { SEED_PRODUCTS } from '@/lib/seedData'

interface InventoryStoreState {
  items: InventoryItem[]
  movements: InventoryMovement[]

  // Methods
  adjustStock: (
    sku: string,
    delta: number,
    type: InventoryMovementType,
    reason: string,
    adminUser?: string
  ) => void
  restockBatch: (
    skus: string[],
    quantity: number,
    reason: string,
    adminUser?: string
  ) => void
  getMovementsBySku: (sku: string) => InventoryMovement[]
}

// Generate initial inventory items from seed catalog
const generateSeedInventory = (): InventoryItem[] => {
  const list: InventoryItem[] = []

  SEED_PRODUCTS.forEach((p) => {
    const prefix = p.name.replace(/[^a-zA-Z0-9]/g, '').slice(0, 4).toUpperCase()
    p.colors.forEach((c) => {
      p.sizes.forEach((s) => {
        const sku = `${prefix}-${c.name.slice(0, 3).toUpperCase()}-${s}`
        
        // Mock a couple of low stock SKUs for realistic dashboard alerts
        let stock = 24
        if (p.slug === 'acid-wash-vintage-tee' && c.name === 'Black' && s === 'L') {
          stock = 2 // Critical
        } else if (p.slug === 'heavyweight-box-hoodie' && s === 'M') {
          stock = 6 // Low
        }

        const reserved = p.slug === 'acid-wash-vintage-tee' ? 1 : 0
        const available = Math.max(0, stock - reserved)
        const threshold = 10

        let status: InventoryItem['status'] = 'HEALTHY'
        if (available === 0) status = 'OUT_OF_STOCK'
        else if (available <= 3) status = 'CRITICAL'
        else if (available <= threshold) status = 'LOW_STOCK'

        list.push({
          id: `inv-${sku}`,
          productId: p.id,
          productName: p.name,
          productImage: p.imageUrl,
          categoryName: p.categoryName || 'APPAREL',
          sku,
          color: c.name,
          colorHex: c.hex,
          size: s,
          currentStock: stock,
          reservedStock: reserved,
          availableStock: available,
          lowStockThreshold: threshold,
          status,
          updatedAt: new Date().toISOString(),
        })
      })
    })
  })

  return list
}

const INITIAL_MOVEMENTS: InventoryMovement[] = [
  {
    id: 'mov-1',
    variantId: 'var-acid-black-l',
    sku: 'ACID-BLA-L',
    productName: 'ACID WASH VINTAGE TEE',
    color: 'Black',
    size: 'L',
    adminUser: 'Inventory Manager',
    movementType: 'RESTOCK',
    quantity: 20,
    previousStock: 0,
    newStock: 20,
    reason: 'Initial supplier delivery batch (Tiruppur Mill)',
    createdAt: '2026-08-01T10:00:00Z',
  },
  {
    id: 'mov-2',
    variantId: 'var-acid-black-l',
    sku: 'ACID-BLA-L',
    productName: 'ACID WASH VINTAGE TEE',
    color: 'Black',
    size: 'L',
    adminUser: 'System Checkout',
    movementType: 'SALE',
    quantity: -18,
    previousStock: 20,
    newStock: 2,
    reason: 'Bespoke custom order fulfillment batches',
    createdAt: '2026-08-15T14:30:00Z',
  },
]

export const useInventoryStore = create<InventoryStoreState>()(
  persist(
    (set, get) => ({
      items: generateSeedInventory(),
      movements: INITIAL_MOVEMENTS,

      adjustStock: (sku, delta, type, reason, adminUser = 'Operations Staff') => {
        const item = get().items.find((i) => i.sku === sku)
        if (!item) return

        const previousStock = item.currentStock
        const newStock = Math.max(0, previousStock + delta)
        const available = Math.max(0, newStock - item.reservedStock)

        let status: InventoryItem['status'] = 'HEALTHY'
        if (available === 0) status = 'OUT_OF_STOCK'
        else if (available <= 3) status = 'CRITICAL'
        else if (available <= item.lowStockThreshold) status = 'LOW_STOCK'

        const newMovement: InventoryMovement = {
          id: `mov-${Date.now()}`,
          variantId: item.id,
          sku: item.sku,
          productName: item.productName,
          color: item.color,
          size: item.size,
          adminUser,
          movementType: type,
          quantity: delta,
          previousStock,
          newStock,
          reason,
          createdAt: new Date().toISOString(),
        }

        set({
          items: get().items.map((i) =>
            i.sku === sku
              ? {
                  ...i,
                  currentStock: newStock,
                  availableStock: available,
                  status,
                  updatedAt: new Date().toISOString(),
                }
              : i
          ),
          movements: [newMovement, ...get().movements],
        })
      },

      restockBatch: (skus, quantity, reason, adminUser = 'Operations Staff') => {
        skus.forEach((sku) => {
          get().adjustStock(sku, quantity, 'RESTOCK', reason, adminUser)
        })
      },

      getMovementsBySku: (sku) => {
        return get().movements.filter((m) => m.sku === sku)
      },
    }),
    {
      name: 'moodifys-inventory-storage',
    }
  )
)

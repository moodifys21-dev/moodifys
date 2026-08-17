export type InventoryMovementType =
  | 'RESTOCK'
  | 'SALE'
  | 'RETURN'
  | 'DAMAGE'
  | 'MANUAL_ADJUSTMENT'
  | 'RESERVED'
  | 'RELEASED'

export interface InventoryMovement {
  id: string
  variantId: string
  sku: string
  productName: string
  color: string
  size: string
  adminUser: string
  movementType: InventoryMovementType
  quantity: number
  previousStock: number
  newStock: number
  reason: string
  referenceId?: string
  createdAt: string
}

export interface InventoryItem {
  id: string
  productId: string
  productName: string
  productImage: string
  categoryName: string
  sku: string
  color: string
  colorHex: string
  size: string
  currentStock: number
  reservedStock: number
  availableStock: number
  lowStockThreshold: number
  status: 'HEALTHY' | 'LOW_STOCK' | 'CRITICAL' | 'OUT_OF_STOCK'
  updatedAt: string
}

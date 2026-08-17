export type DesignStatus = 'ORDERED' | 'SAVED_DRAFT' | 'FLAGGED_COPYRIGHT' | 'ARCHIVED'
export type PrintZone = 'CHEST_CENTER' | 'BACK_OVERSIZED' | 'LEFT_POCKET' | 'SLEEVE'

export interface CanvasLayer {
  id: string
  type: 'text' | 'image' | 'shape'
  content: string
  fontFamily?: string
  color?: string
  x: number
  y: number
  scale: number
  rotation: number
}

export interface BespokeDesign {
  id: string
  title?: string
  name?: string
  userId?: string
  productId?: string
  selectedColor?: string
  selectedSize?: string
  previewUrl: string
  highResArtworkUrl?: string
  productName?: string
  productColor?: string
  productSize?: string
  customerName?: string
  customerEmail?: string
  associatedOrderId?: string
  printZone?: PrintZone
  printDimensions?: string
  dpi?: number
  layersCount?: number
  layers?: CanvasLayer[]
  canvasJson?: Record<string, unknown>
  status?: DesignStatus
  flagReason?: string
  createdAt: string
  updatedAt: string
}

// Alias for order item design snapshots
export type CustomDesign = BespokeDesign

import { create } from 'zustand'
import { Product, ProductColor } from '@/types/product'
import { SEED_PRODUCTS } from '@/lib/seedData'

export type ActiveTool = 'text' | 'graphics' | 'upload' | 'layers' | 'product'

export interface CustomizerState {
  // Active product blank
  product: Product
  selectedColor: ProductColor
  selectedSize: string
  
  // Custom design metadata
  designName: string
  previewUrl: string
  isDirty: boolean
  
  // Tool & selection state
  activeTool: ActiveTool
  selectedObjectId: string | null
  
  // Zoom & Viewport
  zoom: number
  showPrintBounds: boolean
  
  // History state flags
  canUndo: boolean
  canRedo: boolean

  // Actions
  setProduct: (product: Product) => void
  setSelectedColor: (color: ProductColor) => void
  setSelectedSize: (size: string) => void
  setDesignName: (name: string) => void
  setPreviewUrl: (url: string) => void
  setIsDirty: (dirty: boolean) => void
  setActiveTool: (tool: ActiveTool) => void
  setSelectedObjectId: (id: string | null) => void
  setZoom: (zoom: number) => void
  setShowPrintBounds: (show: boolean) => void
  setHistoryStatus: (canUndo: boolean, canRedo: boolean) => void
  resetCustomizer: () => void
}

const defaultProduct = SEED_PRODUCTS.find((p) => p.isCustomizable) || SEED_PRODUCTS[0]

export const useCustomizerStore = create<CustomizerState>((set) => ({
  product: defaultProduct,
  selectedColor: defaultProduct.colors[0] || { name: 'Black', hex: '#090808' },
  selectedSize: defaultProduct.sizes[0] || 'M',
  designName: 'UNTITLED PIECE 01',
  previewUrl: '',
  isDirty: false,
  activeTool: 'text',
  selectedObjectId: null,
  zoom: 1,
  showPrintBounds: true,
  canUndo: false,
  canRedo: false,

  setProduct: (product) =>
    set({
      product,
      selectedColor: product.colors[0] || { name: 'Black', hex: '#090808' },
      selectedSize: product.sizes[0] || 'M',
      isDirty: false,
    }),

  setSelectedColor: (selectedColor) => set({ selectedColor, isDirty: true }),
  setSelectedSize: (selectedSize) => set({ selectedSize }),
  setDesignName: (designName) => set({ designName }),
  setPreviewUrl: (previewUrl) => set({ previewUrl }),
  setIsDirty: (isDirty) => set({ isDirty }),
  setActiveTool: (activeTool) => set({ activeTool }),
  setSelectedObjectId: (selectedObjectId) => set({ selectedObjectId }),
  setZoom: (zoom) => set({ zoom }),
  setShowPrintBounds: (showPrintBounds) => set({ showPrintBounds }),
  setHistoryStatus: (canUndo, canRedo) => set({ canUndo, canRedo }),
  resetCustomizer: () =>
    set({
      designName: 'UNTITLED PIECE 01',
      previewUrl: '',
      isDirty: false,
      canUndo: false,
      canRedo: false,
      selectedObjectId: null,
    }),
}))

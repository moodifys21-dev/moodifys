export interface Category {
  id: string
  name: string
  slug: string
  description?: string
  imageUrl?: string
  mobileImageUrl?: string
  altText?: string
  buttonText?: string
  buttonUrl?: string
  sortOrder: number
  isActive: boolean
  isVisible?: boolean
}

export interface ProductColor {
  name: string
  hex: string
}

export interface ProductVariant {
  id: string
  productId: string
  color: string
  colorHex: string
  size: string
  sku: string
  price: number
  stock: number
  imageUrl?: string
  isActive: boolean
}

export interface Product {
  id: string
  name: string
  slug: string
  description: string
  shortDescription?: string
  categoryId: string
  categoryName?: string
  basePrice: number
  compareAtPrice?: number
  imageUrl: string
  thumbnailUrl?: string
  hoverImageUrl?: string
  galleryImages?: string[]
  isCustomizable: boolean
  isActive: boolean
  isFeatured?: boolean
  isNew: boolean
  isArchived?: boolean
  status?: 'active' | 'draft' | 'archived'
  colors: ProductColor[]
  sizes: string[]
  variants?: ProductVariant[]
  materials?: string
  fabricWeight?: string
  fit?: string
  careInstructions?: string
  skuPrefix?: string
  seoTitle?: string
  seoDescription?: string
  createdAt?: string
  updatedAt?: string
}

export interface ProductFilterOptions {
  category?: string
  size?: string
  color?: string
  minPrice?: number
  maxPrice?: number
  isCustomizable?: boolean
  searchQuery?: string
  sortBy?: 'featured' | 'newest' | 'price-asc' | 'price-desc'
}

export type MediaFolder =
  | 'Homepage'
  | 'Products'
  | 'Categories'
  | 'Custom Designs'
  | 'Marketing'
  | 'General'

// Backward compatibility alias
export type MediaCategory = MediaFolder | 'HERO_CAMPAIGN' | 'CUSTOMIZER_ASSETS' | 'EDITORIAL' | 'ICONS_GRAPHICS'

export interface MediaAssetUsage {
  location: string // e.g. "Homepage Hero", "Acid Wash Tee", "Oversized Tees Category"
  type: 'HOMEPAGE' | 'PRODUCT' | 'CATEGORY' | 'STORE_LOGO'
}

export interface MediaAsset {
  id: string
  title: string
  fileName: string
  storagePath?: string
  url: string
  publicUrl?: string
  folder: MediaFolder
  category?: MediaCategory
  mimeType: string
  fileType?: string
  fileSize: string
  dimensions?: string
  altText: string
  uploadedBy: string
  usedIn?: MediaAssetUsage[]
  createdAt: string
  updatedAt?: string
}

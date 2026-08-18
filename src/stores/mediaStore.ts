import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { MediaAsset, MediaFolder } from '@/types/media'
import { useAuditLogStore } from './auditLogStore'
import { uploadMediaFile } from '@/services/mediaService'

interface MediaStoreState {
  assets: MediaAsset[]

  // Methods
  addAsset: (asset: Omit<MediaAsset, 'id' | 'createdAt'>) => MediaAsset
  uploadFile: (file: File, folder: MediaFolder, uploadedBy?: string) => Promise<MediaAsset>
  updateAsset: (id: string, updates: Partial<MediaAsset>) => void
  deleteAsset: (id: string) => { success: boolean; error?: string }
  getAssetsByFolder: (folder?: MediaFolder | 'ALL') => MediaAsset[]
  getAssetUsage: (urlOrId: string) => { location: string; type: string }[]
}

const SEED_MEDIA_ASSETS: MediaAsset[] = [
  {
    id: 'med-1',
    title: 'HERO EDITORIAL LOOKBOOK GIRL',
    fileName: 'hero-editorial-portrait.webp',
    storagePath: 'homepage/hero-editorial-portrait.webp',
    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=1600&auto=format&fit=crop&q=90',
    publicUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=1600&auto=format&fit=crop&q=90',
    folder: 'Homepage',
    mimeType: 'image/webp',
    fileSize: '1.4 MB',
    dimensions: '2400 × 3200 px',
    altText: 'Hero Editorial Lookbook Monochrome Portrait',
    uploadedBy: 'Content Manager',
    usedIn: [
      { location: 'Homepage Hero Model Portrait', type: 'HOMEPAGE' },
      { location: 'Homepage Editorial Customization Block', type: 'HOMEPAGE' },
    ],
    createdAt: '2026-08-10T12:00:00Z',
  },
  {
    id: 'med-2',
    title: 'ACID WASH VINTAGE TEE - STUDIO FRONT',
    fileName: 'acid-wash-vintage-tee-front.webp',
    storagePath: 'products/acid-wash-vintage-tee-front.webp',
    url: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=1200&auto=format&fit=crop&q=90',
    publicUrl: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=1200&auto=format&fit=crop&q=90',
    folder: 'Products',
    mimeType: 'image/webp',
    fileSize: '1.2 MB',
    dimensions: '2400 × 3200 px',
    altText: 'Acid Wash Vintage Oversized Tee Front Angle',
    uploadedBy: 'Content Manager',
    usedIn: [
      { location: 'Product: ACID WASH VINTAGE TEE (Primary Image)', type: 'PRODUCT' },
      { location: 'Category: T-SHIRTS Banner', type: 'CATEGORY' },
    ],
    createdAt: '2026-08-10T12:05:00Z',
  },
  {
    id: 'med-3',
    title: 'ACID WASH VINTAGE TEE - BACK PROFILE',
    fileName: 'acid-wash-vintage-tee-back.webp',
    storagePath: 'products/acid-wash-vintage-tee-back.webp',
    url: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=1200&auto=format&fit=crop&q=90',
    publicUrl: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=1200&auto=format&fit=crop&q=90',
    folder: 'Products',
    mimeType: 'image/webp',
    fileSize: '1.8 MB',
    dimensions: '2400 × 3200 px',
    altText: 'Acid Wash Vintage Oversized Tee Back Profile',
    uploadedBy: 'Content Manager',
    usedIn: [
      { location: 'Product: ACID WASH VINTAGE TEE (Hover Image)', type: 'PRODUCT' },
    ],
    createdAt: '2026-08-10T12:05:00Z',
  },
  {
    id: 'med-4',
    title: 'HEAVYWEIGHT BOX HOODIE - EDITORIAL',
    fileName: 'heavyweight-box-hoodie-editorial.webp',
    storagePath: 'products/heavyweight-box-hoodie-editorial.webp',
    url: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=1200&auto=format&fit=crop&q=90',
    publicUrl: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=1200&auto=format&fit=crop&q=90',
    folder: 'Products',
    mimeType: 'image/webp',
    fileSize: '2.3 MB',
    dimensions: '3000 × 4000 px',
    altText: 'Editorial Model wearing 450GSM Box Hoodie in Brutalist Concrete Hall',
    uploadedBy: 'Creative Director',
    usedIn: [
      { location: 'Product: HEAVYWEIGHT BOX HOODIE (Primary Image)', type: 'PRODUCT' },
      { location: 'Category: HOODIES & SWEATSHIRTS Banner', type: 'CATEGORY' },
    ],
    createdAt: '2026-08-12T09:30:00Z',
  },
  {
    id: 'med-5',
    title: 'FRENCH TERRY CREWNECK - MINIMAL FLAT',
    fileName: 'french-terry-crewneck-flat.webp',
    storagePath: 'products/french-terry-crewneck-flat.webp',
    url: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=1200&auto=format&fit=crop&q=90',
    publicUrl: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=1200&auto=format&fit=crop&q=90',
    folder: 'Products',
    mimeType: 'image/webp',
    fileSize: '1.9 MB',
    dimensions: '2800 × 3500 px',
    altText: 'French Terry Crewneck Sweatshirt Flat Product Shot',
    uploadedBy: 'Content Manager',
    usedIn: [
      { location: 'Product: FRENCH TERRY CREWNECK SWEATSHIRT (Primary Image)', type: 'PRODUCT' },
    ],
    createdAt: '2026-08-13T10:15:00Z',
  },
  {
    id: 'med-6',
    title: 'CUSTOMIZER TEE MOCKUP CANVAS BLANK',
    fileName: 'blank-tshirt-2d-canvas.png',
    storagePath: 'custom-designs/blank-tshirt-2d-canvas.png',
    url: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=1200&auto=format&fit=crop&q=90',
    publicUrl: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=1200&auto=format&fit=crop&q=90',
    folder: 'Custom Designs',
    mimeType: 'image/png',
    fileSize: '3.1 MB',
    dimensions: '2048 × 2048 px',
    altText: 'Flat 2D print bed bounding template for Fabric.js canvas customizer',
    uploadedBy: 'Lead Developer',
    usedIn: [
      { location: '2D Canvas Customizer Blank Template', type: 'HOMEPAGE' },
    ],
    createdAt: '2026-08-01T08:00:00Z',
  },
]

export const useMediaStore = create<MediaStoreState>()(
  persist(
    (set, get) => ({
      assets: SEED_MEDIA_ASSETS,

      addAsset: (newAsset) => {
        const created: MediaAsset = {
          ...newAsset,
          id: `med-${Date.now()}`,
          createdAt: new Date().toISOString(),
        }
        set({ assets: [created, ...get().assets] })

        // Audit Log
        try {
          useAuditLogStore.getState().addLog({
            actorId: 'admin-actor',
            actorName: newAsset.uploadedBy || 'Admin Operator',
            actorRole: 'ADMIN',
            action: 'MEDIA_ASSET_UPLOADED',
            category: 'PRODUCTS',
            entityType: 'MediaAsset',
            entityId: created.id,
            severity: 'INFO',
            ipAddress: '127.0.0.1',
            newData: { fileName: created.fileName, folder: created.folder },
          })
        } catch {
          // ignore
        }

        return created
      },

      uploadFile: async (file: File, folder: MediaFolder, uploadedBy = 'Admin Operator') => {
        const newAsset = await uploadMediaFile(file, folder, uploadedBy)
        set({ assets: [newAsset, ...get().assets] })

        try {
          useAuditLogStore.getState().addLog({
            actorId: 'admin-actor',
            actorName: uploadedBy,
            actorRole: 'ADMIN',
            action: 'MEDIA_UPLOADED_FROM_COMPUTER',
            category: 'PRODUCTS',
            entityType: 'MediaAsset',
            entityId: newAsset.id,
            severity: 'INFO',
            ipAddress: '127.0.0.1',
            newData: { fileName: newAsset.fileName, folder, fileSize: newAsset.fileSize },
          })
        } catch {
          // ignore
        }

        return newAsset
      },

      updateAsset: (id, updates) => {
        set({
          assets: get().assets.map((a) =>
            a.id === id ? { ...a, ...updates, updatedAt: new Date().toISOString() } : a
          ),
        })
      },

      deleteAsset: (id) => {
        const asset = get().assets.find((a) => a.id === id)
        if (!asset) return { success: false, error: 'Asset not found' }

        if (asset.usedIn && asset.usedIn.length > 0) {
          return {
            success: false,
            error: `CANNOT DELETE: Image is currently in use in: ${asset.usedIn.map((u) => u.location).join(', ')}`,
          }
        }

        set({ assets: get().assets.filter((a) => a.id !== id) })

        try {
          useAuditLogStore.getState().addLog({
            actorId: 'admin-actor',
            actorName: 'Admin Operator',
            actorRole: 'ADMIN',
            action: 'MEDIA_ASSET_DELETED',
            category: 'PRODUCTS',
            entityType: 'MediaAsset',
            entityId: id,
            severity: 'WARNING',
            ipAddress: '127.0.0.1',
            oldData: { fileName: asset.fileName, folder: asset.folder },
          })
        } catch {
          // ignore
        }

        return { success: true }
      },

      getAssetsByFolder: (folder) => {
        if (!folder || folder === 'ALL') return get().assets
        return get().assets.filter((a) => a.folder === folder)
      },

      getAssetUsage: (urlOrId) => {
        const asset = get().assets.find((a) => a.id === urlOrId || a.url === urlOrId)
        return asset?.usedIn || []
      },
    }),
    {
      name: 'moodifys-media-storage',
    }
  )
)

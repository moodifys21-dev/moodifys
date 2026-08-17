import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { BespokeDesign, DesignStatus } from '@/types/design'

interface DesignGalleryStoreState {
  designs: BespokeDesign[]

  // Actions
  updateDesignStatus: (id: string, status: DesignStatus, flagReason?: string) => void
  deleteDesign: (id: string) => void
  getDesignById: (id: string) => BespokeDesign | undefined
}

const SEED_DESIGNS: BespokeDesign[] = [
  {
    id: 'des-1',
    title: 'ACID BRUTALIST MANIFESTO',
    previewUrl: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80',
    highResArtworkUrl: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=2400&auto=format&fit=crop&q=95',
    productName: 'ACID WASH VINTAGE TEE',
    productColor: 'Black',
    productSize: 'L',
    customerName: 'Aarav Sharma',
    customerEmail: 'aarav.sharma@example.com',
    associatedOrderId: 'ORD-8841',
    printZone: 'CHEST_CENTER',
    printDimensions: '12 × 16 in (30 × 40 cm)',
    dpi: 300,
    layersCount: 3,
    layers: [
      { id: 'lay-1', type: 'text', content: 'BRUTALISM // 2026', fontFamily: 'Space Grotesk', color: '#FFFFFF', x: 120, y: 140, scale: 1.2, rotation: 0 },
      { id: 'lay-2', type: 'image', content: 'monochrome-geometric-prism.svg', x: 200, y: 280, scale: 1.0, rotation: 15 },
      { id: 'lay-3', type: 'text', content: 'MOODIFYS ATELIER', fontFamily: 'Inter', color: '#E1E0DC', x: 140, y: 460, scale: 0.8, rotation: 0 },
    ],
    status: 'ORDERED',
    createdAt: '2026-08-15T14:20:00Z',
    updatedAt: '2026-08-15T14:30:00Z',
  },
  {
    id: 'des-2',
    title: 'NEO-TOKYO CYBER OVERSIZE',
    previewUrl: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800&auto=format&fit=crop&q=80',
    highResArtworkUrl: 'https://images.unsplash.com/photo-1578587018452-892bacefd3f2?w=2400&auto=format&fit=crop&q=95',
    productName: 'HEAVYWEIGHT BOX HOODIE',
    productColor: 'Charcoal',
    productSize: 'XL',
    customerName: 'Rhea Patel',
    customerEmail: 'rhea.patel@designstudio.in',
    associatedOrderId: 'ORD-9022',
    printZone: 'BACK_OVERSIZED',
    printDimensions: '14 × 18 in (35 × 45 cm)',
    dpi: 300,
    layersCount: 2,
    layers: [
      { id: 'lay-4', type: 'text', content: 'SILENCE IS THE NEW LUXURY', fontFamily: 'Space Grotesk', color: '#E1E0DC', x: 80, y: 120, scale: 1.5, rotation: 0 },
      { id: 'lay-5', type: 'image', content: 'kanji-mood-signature.png', x: 220, y: 320, scale: 1.1, rotation: 0 },
    ],
    status: 'ORDERED',
    createdAt: '2026-08-16T17:45:00Z',
    updatedAt: '2026-08-16T18:00:00Z',
  },
  {
    id: 'des-3',
    title: 'EXPERIMENTAL MONOGRAM DRAFT',
    previewUrl: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=800&auto=format&fit=crop&q=80',
    highResArtworkUrl: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=2400&auto=format&fit=crop&q=95',
    productName: 'FRENCH TERRY CREWNECK SWEATSHIRT',
    productColor: 'Off White',
    productSize: 'M',
    customerName: 'Vikramaditya Sengupta',
    customerEmail: 'vikram.sen@outlook.com',
    printZone: 'LEFT_POCKET',
    printDimensions: '4 × 4 in (10 × 10 cm)',
    dpi: 300,
    layersCount: 1,
    layers: [
      { id: 'lay-6', type: 'text', content: 'V.S.', fontFamily: 'Playfair Display', color: '#090808', x: 180, y: 200, scale: 1.8, rotation: 0 },
    ],
    status: 'SAVED_DRAFT',
    createdAt: '2026-08-16T11:40:00Z',
    updatedAt: '2026-08-16T11:55:00Z',
  },
]

export const useDesignGalleryStore = create<DesignGalleryStoreState>()(
  persist(
    (set, get) => ({
      designs: SEED_DESIGNS,

      updateDesignStatus: (id, status, flagReason) => {
        set({
          designs: get().designs.map((d) =>
            d.id === id
              ? {
                  ...d,
                  status,
                  flagReason: flagReason || d.flagReason,
                  updatedAt: new Date().toISOString(),
                }
              : d
          ),
        })
      },

      deleteDesign: (id) => {
        set({ designs: get().designs.filter((d) => d.id !== id) })
      },

      getDesignById: (id) => get().designs.find((d) => d.id === id),
    }),
    {
      name: 'moodifys-custom-designs-storage',
    }
  )
)

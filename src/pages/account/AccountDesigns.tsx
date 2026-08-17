import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCartStore } from '@/stores/cartStore'
import { Button } from '@/components/ui/Button'
import { formatPrice } from '@/lib/utils'
import { Sparkles, Edit3, ShoppingBag, Plus } from 'lucide-react'

interface SavedDesignItem {
  id: string
  name: string
  productName: string
  productId: string
  color: string
  colorHex: string
  size: string
  price: number
  imageUrl: string
  createdAt: string
}

const MOCK_SAVED_DESIGNS: SavedDesignItem[] = [
  {
    id: 'design-01',
    name: 'CYBER NOIR ARCHIVE',
    productName: 'CLASSIC 240GSM TEE',
    productId: 'prod-classic-tee',
    color: 'Black',
    colorHex: '#090808',
    size: 'L',
    price: 1299,
    imageUrl: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80',
    createdAt: '2026-08-10T11:00:00Z',
  },
  {
    id: 'design-02',
    name: 'BRUTALIST CROSSHAIR',
    productName: 'OVERSIZED STUDIO TEE',
    productId: 'prod-oversized-tee',
    color: 'Off White',
    colorHex: '#E1E0DC',
    size: 'XL',
    price: 1499,
    imageUrl: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=800&auto=format&fit=crop&q=80',
    createdAt: '2026-08-12T16:30:00Z',
  },
  {
    id: 'design-03',
    name: 'MONO ARCHIVE // 2026',
    productName: 'CLASSIC 240GSM TEE',
    productId: 'prod-classic-tee',
    color: 'Charcoal',
    colorHex: '#302F2E',
    size: 'M',
    price: 1299,
    imageUrl: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800&auto=format&fit=crop&q=80',
    createdAt: '2026-08-15T09:00:00Z',
  },
]

export const AccountDesigns: React.FC = () => {
  const navigate = useNavigate()
  const { addItem } = useCartStore()

  const handleQuickAdd = (design: SavedDesignItem) => {
    addItem({
      productId: design.productId,
      name: `${design.productName} [CUSTOM: ${design.name}]`,
      price: design.price,
      color: design.color,
      colorHex: design.colorHex,
      size: design.size,
      quantity: 1,
      imageUrl: design.imageUrl,
      isCustom: true,
      designName: design.name,
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-[#E1E0DC] p-5 rounded-sm flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-lg font-bold uppercase text-[#090808]">
            SAVED CREATIONS ({MOCK_SAVED_DESIGNS.length})
          </h2>
          <p className="text-xs text-[#302F2E]">
            Your personal archive of custom studio blueprints.
          </p>
        </div>
        <Link to="/customize">
          <Button variant="ink" size="sm" className="gap-1.5">
            <Plus size={14} />
            <span>NEW BESPOKE PIECE</span>
          </Button>
        </Link>
      </div>

      {/* Grid of designs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {MOCK_SAVED_DESIGNS.map((design) => (
          <div
            key={design.id}
            className="bg-white border border-[#E1E0DC] rounded-sm overflow-hidden flex flex-col justify-between group hover:border-[#090808] transition-colors shadow-xs"
          >
            {/* Image Preview */}
            <div className="relative aspect-[4/5] bg-[#F0EFED] overflow-hidden">
              <img
                src={design.imageUrl}
                alt={design.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <span className="absolute top-2 left-2 bg-[#090808] text-white text-[9px] font-bold px-2 py-0.5 rounded uppercase flex items-center gap-1">
                <Sparkles size={10} />
                STUDIO CUSTOM
              </span>
            </div>

            {/* Info */}
            <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
              <div>
                <p className="text-[10px] font-mono text-[#BEBDBB] uppercase">
                  {design.productName}
                </p>
                <h3 className="font-display text-sm font-bold uppercase text-[#090808] mt-0.5">
                  {design.name}
                </h3>
                <div className="flex items-center justify-between text-xs text-[#302F2E] font-mono mt-2">
                  <span>{design.color} • {design.size}</span>
                  <span className="font-bold text-[#090808]">{formatPrice(design.price)}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#F0EFED]">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate(`/customize/${design.productId}`)}
                  className="gap-1 text-[11px]"
                >
                  <Edit3 size={12} />
                  <span>EDIT</span>
                </Button>

                <Button
                  variant="ink"
                  size="sm"
                  onClick={() => handleQuickAdd(design)}
                  className="gap-1 text-[11px]"
                >
                  <ShoppingBag size={12} />
                  <span>ADD TO BAG</span>
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

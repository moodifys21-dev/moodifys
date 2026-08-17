import React, { useState } from 'react'
import { Container } from '@/components/ui/Container'
import { Section } from '@/components/ui/Section'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Badge } from '@/components/ui/Badge'
import { ColorSwatch } from '@/components/ui/ColorSwatch'
import { SizeSelector } from '@/components/ui/SizeSelector'
import { Modal } from '@/components/ui/Modal'
import { Skeleton } from '@/components/ui/Skeleton'
import { EmptyState } from '@/components/ui/EmptyState'
import { ErrorState } from '@/components/ui/ErrorState'
import { ProductCard } from '@/components/product/ProductCard'
import { Heart } from 'lucide-react'

export const DesignSystemPreview: React.FC = () => {
  const [selectedColor, setSelectedColor] = useState('Black')
  const [selectedSize, setSelectedSize] = useState('M')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [wishlist, setWishlist] = useState<string[]>(['1'])

  const toggleWishlist = (id: string) => {
    setWishlist((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    )
  }

  const sampleColors = [
    { name: 'Black', hex: '#090808' },
    { name: 'Charcoal', hex: '#302F2E' },
    { name: 'Warm Gray', hex: '#BEBDBB' },
    { name: 'Off White', hex: '#E1E0DC' },
    { name: 'Pure White', hex: '#FFFFFF' },
  ]

  const sampleSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL']

  return (
    <div className="w-full pb-24">
      <Section spacing="sm" borderedBottom className="bg-[#E1E0DC]/30">
        <Container size="wide">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold tracking-[0.2em] text-[#BEBDBB] uppercase">
                MOODIFYS DESIGN SYSTEM
              </p>
              <h1 className="font-display text-3xl font-bold uppercase tracking-wider text-[#090808]">
                UI COMPONENTS & TOKENS
              </h1>
            </div>
            <Badge variant="ink" size="md">PHASE 2 COMPLETE</Badge>
          </div>
        </Container>
      </Section>

      <Container size="wide" className="space-y-16 pt-12">
        {/* Color Palette */}
        <div className="space-y-4">
          <h2 className="font-display text-xl font-bold uppercase tracking-wider border-b border-[#BEBDBB] pb-2">
            1. Brand Color Palette
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
            {sampleColors.map((color) => (
              <div key={color.name} className="border border-[#BEBDBB] bg-white p-3 space-y-2">
                <div
                  className="w-full h-16 border border-black/10"
                  style={{ backgroundColor: color.hex }}
                />
                <div className="text-xs">
                  <p className="font-bold text-[#090808] uppercase">{color.name}</p>
                  <p className="text-[#302F2E] font-mono text-[10px]">{color.hex}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Buttons */}
        <div className="space-y-4">
          <h2 className="font-display text-xl font-bold uppercase tracking-wider border-b border-[#BEBDBB] pb-2">
            2. Editorial Buttons
          </h2>
          <div className="flex flex-wrap items-center gap-4">
            <Button variant="primary" size="lg">PRIMARY BUTTON</Button>
            <Button variant="secondary" size="lg">SECONDARY BUTTON</Button>
            <Button variant="outline" size="lg">OUTLINE BUTTON</Button>
            <Button variant="ghost" size="md">GHOST BUTTON</Button>
            <Button variant="link">TEXT LINK BUTTON</Button>
            <Button variant="primary" size="md" disabled>DISABLED</Button>
          </div>
        </div>

        {/* Inputs */}
        <div className="space-y-4">
          <h2 className="font-display text-xl font-bold uppercase tracking-wider border-b border-[#BEBDBB] pb-2">
            3. Form Inputs & Badges
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Input label="STANDARD INPUT" placeholder="ENTER YOUR CUSTOM TEXT" />
            <Input label="INPUT WITH ERROR" defaultValue="Invalid email" error="Please enter a valid email address" />
            <Input label="DISABLED INPUT" defaultValue="Cannot edit" disabled />
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-4">
            <Badge variant="ink">NEW DROP</Badge>
            <Badge variant="light">CUSTOMIZABLE</Badge>
            <Badge variant="outline">LIMITED EDITION</Badge>
            <Badge variant="accent">BESTSELLER</Badge>
          </div>
        </div>

        {/* Swatches & Selectors */}
        <div className="space-y-4">
          <h2 className="font-display text-xl font-bold uppercase tracking-wider border-b border-[#BEBDBB] pb-2">
            4. Swatches & Size Selectors
          </h2>
          <div className="space-y-6 bg-white p-6 border border-[#BEBDBB]">
            <div>
              <p className="text-[11px] font-bold tracking-widest text-[#BEBDBB] uppercase mb-2">
                SELECTED COLOR: <span className="text-[#090808]">{selectedColor}</span>
              </p>
              <ColorSwatch
                colors={sampleColors}
                selectedColor={selectedColor}
                onSelectColor={setSelectedColor}
                size="lg"
              />
            </div>

            <div>
              <p className="text-[11px] font-bold tracking-widest text-[#BEBDBB] uppercase mb-2">
                SELECTED SIZE: <span className="text-[#090808]">{selectedSize}</span>
              </p>
              <SizeSelector
                sizes={sampleSizes}
                selectedSize={selectedSize}
                onSelectSize={setSelectedSize}
                disabledSizes={['XXL']}
              />
            </div>
          </div>
        </div>

        {/* Product Cards */}
        <div className="space-y-4">
          <h2 className="font-display text-xl font-bold uppercase tracking-wider border-b border-[#BEBDBB] pb-2">
            5. Reusable Product Cards
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <ProductCard
              id="1"
              name="CLASSIC OVERSIZED TEE"
              slug="classic-oversized-tee"
              category="T-SHIRTS"
              price={999}
              imageUrl="https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80"
              hoverImageUrl="https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=800&auto=format&fit=crop&q=80"
              isCustomizable={true}
              isNew={true}
              colors={sampleColors}
              isWishlisted={wishlist.includes('1')}
              onWishlistToggle={toggleWishlist}
            />

            <ProductCard
              id="2"
              name="HEAVYWEIGHT BOX HOODIE"
              slug="heavyweight-box-hoodie"
              category="HOODIES"
              price={1999}
              imageUrl="https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800&auto=format&fit=crop&q=80"
              hoverImageUrl="https://images.unsplash.com/photo-1509967419530-da38b4704bc6?w=800&auto=format&fit=crop&q=80"
              isCustomizable={true}
              colors={sampleColors.slice(0, 3)}
              isWishlisted={wishlist.includes('2')}
              onWishlistToggle={toggleWishlist}
            />

            {/* Skeleton Loading Card Example */}
            <div className="space-y-3">
              <Skeleton className="w-full aspect-[4/5]" />
              <Skeleton className="h-3 w-1/3" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/4" />
            </div>

            <div className="space-y-3">
              <Skeleton className="w-full aspect-[4/5]" />
              <Skeleton className="h-3 w-1/3" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/4" />
            </div>
          </div>
        </div>

        {/* Modals & State Primitives */}
        <div className="space-y-4">
          <h2 className="font-display text-xl font-bold uppercase tracking-wider border-b border-[#BEBDBB] pb-2">
            6. Modal Dialogs & State Primitives
          </h2>
          <div>
            <Button onClick={() => setIsModalOpen(true)}>OPEN MODAL DIALOG</Button>
            <Modal
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
              title="CUSTOMIZER PRESET"
            >
              <div className="space-y-4 py-2">
                <p className="text-xs text-[#302F2E]">
                  This modal dialog is fully accessible, supports escape key triggers, backdrop blur, and responds gracefully across all mobile viewports.
                </p>
                <div className="pt-4 flex justify-end gap-3">
                  <Button variant="outline" size="sm" onClick={() => setIsModalOpen(false)}>
                    CANCEL
                  </Button>
                  <Button size="sm" onClick={() => setIsModalOpen(false)}>
                    CONFIRM
                  </Button>
                </div>
              </div>
            </Modal>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
            <EmptyState
              icon={<Heart size={28} />}
              title="YOUR WISHLIST IS EMPTY"
              description="Explore the collection and save your favorite pieces to customize later."
              actionLabel="EXPLORE PIECES"
              actionHref="/shop"
            />

            <ErrorState
              title="UNABLE TO LOAD PRODUCTS"
              message="We had trouble retrieving the catalog data. Please check your network connection."
              onRetry={() => alert('Retrying...')}
            />
          </div>
        </div>
      </Container>
    </div>
  )
}

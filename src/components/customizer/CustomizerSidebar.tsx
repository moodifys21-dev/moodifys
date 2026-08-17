import React, { useState } from 'react'
import { Type, Sparkles, Shirt, Upload, Check } from 'lucide-react'
import { ActiveTool } from '@/stores/customizerStore'
import { CUSTOMIZER_FONTS, CUSTOMIZER_GRAPHICS } from '@/lib/customizerAssets'
import { Product, ProductColor } from '@/types/product'
import { SEED_PRODUCTS } from '@/lib/seedData'
import { formatPrice } from '@/lib/utils'

interface CustomizerSidebarProps {
  activeTool: ActiveTool
  onSelectTool: (tool: ActiveTool) => void
  product: Product
  selectedColor: ProductColor
  selectedSize: string
  onProductChange: (product: Product) => void
  onColorChange: (color: ProductColor) => void
  onSizeChange: (size: string) => void
  onAddText: (text: string, options?: Record<string, unknown>) => void
  onAddGraphic: (svgString: string, color?: string) => void
  onUploadImage: (file: File) => void
  selectedObjectProps?: Record<string, unknown>
  onUpdateActiveObject?: (props: Record<string, unknown>) => void
}

const COLOR_SWATCHES = [
  { name: 'Pure White', hex: '#FFFFFF' },
  { name: 'Brutal Ink', hex: '#090808' },
  { name: 'Charcoal', hex: '#302F2E' },
  { name: 'Bone / Cream', hex: '#E1E0DC' },
  { name: 'Signal Red', hex: '#E53E3E' },
  { name: 'Acid Volt', hex: '#CCFF00' },
  { name: 'Cobalt', hex: '#2B6CB0' },
]

export const CustomizerSidebar: React.FC<CustomizerSidebarProps> = ({
  activeTool,
  onSelectTool,
  product,
  selectedColor,
  selectedSize,
  onProductChange,
  onColorChange,
  onSizeChange,
  onAddText,
  onAddGraphic,
  onUploadImage,
  selectedObjectProps,
  onUpdateActiveObject,
}) => {
  const [customTextInput, setCustomTextInput] = useState('STUDIO ARCHIVE')
  const [selectedFont, setSelectedFont] = useState('Space Grotesk, sans-serif')
  const [selectedTextColor, setSelectedTextColor] = useState('#FFFFFF')
  const [selectedGraphicColor, setSelectedGraphicColor] = useState('#090808')

  const customizableProducts = SEED_PRODUCTS.filter((p) => p.isCustomizable)

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      onUploadImage(file)
      e.target.value = ''
    }
  }

  return (
    <div className="flex flex-col h-full bg-[#F0EFED] border-r border-[#E1E0DC] select-none">
      {/* Tool Tabs Header */}
      <div className="grid grid-cols-4 border-b border-[#E1E0DC] bg-[#E1E0DC]/40 text-center">
        <button
          type="button"
          onClick={() => onSelectTool('text')}
          className={`py-3 flex flex-col items-center justify-center gap-1 text-[11px] font-bold tracking-wider uppercase transition-colors ${
            activeTool === 'text'
              ? 'bg-[#F0EFED] text-[#090808] border-b-2 border-[#090808]'
              : 'text-[#302F2E] hover:text-[#090808]'
          }`}
        >
          <Type size={16} />
          <span>TEXT</span>
        </button>

        <button
          type="button"
          onClick={() => onSelectTool('graphics')}
          className={`py-3 flex flex-col items-center justify-center gap-1 text-[11px] font-bold tracking-wider uppercase transition-colors ${
            activeTool === 'graphics'
              ? 'bg-[#F0EFED] text-[#090808] border-b-2 border-[#090808]'
              : 'text-[#302F2E] hover:text-[#090808]'
          }`}
        >
          <Sparkles size={16} />
          <span>ARTWORK</span>
        </button>

        <button
          type="button"
          onClick={() => onSelectTool('upload')}
          className={`py-3 flex flex-col items-center justify-center gap-1 text-[11px] font-bold tracking-wider uppercase transition-colors ${
            activeTool === 'upload'
              ? 'bg-[#F0EFED] text-[#090808] border-b-2 border-[#090808]'
              : 'text-[#302F2E] hover:text-[#090808]'
          }`}
        >
          <Upload size={16} />
          <span>UPLOAD</span>
        </button>

        <button
          type="button"
          onClick={() => onSelectTool('product')}
          className={`py-3 flex flex-col items-center justify-center gap-1 text-[11px] font-bold tracking-wider uppercase transition-colors ${
            activeTool === 'product'
              ? 'bg-[#F0EFED] text-[#090808] border-b-2 border-[#090808]'
              : 'text-[#302F2E] hover:text-[#090808]'
          }`}
        >
          <Shirt size={16} />
          <span>GARMENT</span>
        </button>
      </div>

      {/* Tab Panels */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        
        {/* ==================== 1. TEXT TOOL ==================== */}
        {activeTool === 'text' && (
          <div className="space-y-5">
            <div>
              <p className="text-[11px] font-bold tracking-[0.2em] text-[#BEBDBB] uppercase mb-2">
                ADD TYPOGRAPHY
              </p>
              <div className="space-y-2">
                <input
                  type="text"
                  value={customTextInput}
                  onChange={(e) => setCustomTextInput(e.target.value)}
                  placeholder="TYPE YOUR TEXT..."
                  className="w-full bg-[#FFFFFF] border border-[#BEBDBB] px-3 py-2 text-xs font-bold uppercase tracking-wider text-[#090808] focus:border-[#090808] focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() =>
                    onAddText(customTextInput || 'STUDIO ARCHIVE', {
                      fontFamily: selectedFont,
                      fill: selectedTextColor,
                    })
                  }
                  className="w-full bg-[#090808] text-white py-2.5 text-xs font-bold tracking-widest uppercase hover:bg-[#302F2E] transition-colors"
                >
                  + ADD TEXT TO CANVAS
                </button>
              </div>
            </div>

            {/* Font Family Selection */}
            <div>
              <label className="text-[11px] font-bold tracking-[0.2em] text-[#BEBDBB] uppercase block mb-2">
                TYPOGRAPHY STYLE
              </label>
              <div className="grid grid-cols-1 gap-1.5">
                {CUSTOMIZER_FONTS.map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => {
                      setSelectedFont(f.fontFamily)
                      onUpdateActiveObject?.({ fontFamily: f.fontFamily })
                    }}
                    className={`flex items-center justify-between p-2.5 text-xs border text-left transition-all ${
                      selectedFont === f.fontFamily
                        ? 'border-[#090808] bg-white font-bold'
                        : 'border-[#E1E0DC] bg-[#FFFFFF]/60 hover:bg-white'
                    }`}
                  >
                    <span style={{ fontFamily: f.fontFamily }}>{f.name}</span>
                    <span className="text-[9px] uppercase tracking-wider text-[#BEBDBB]">
                      {f.category}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Text Color Swatches */}
            <div>
              <label className="text-[11px] font-bold tracking-[0.2em] text-[#BEBDBB] uppercase block mb-2">
                TEXT COLOR
              </label>
              <div className="flex flex-wrap gap-2">
                {COLOR_SWATCHES.map((swatch) => (
                  <button
                    key={swatch.hex}
                    type="button"
                    onClick={() => {
                      setSelectedTextColor(swatch.hex)
                      onUpdateActiveObject?.({ fill: swatch.hex })
                    }}
                    className={`w-7 h-7 rounded-full border border-[#BEBDBB] flex items-center justify-center transition-transform ${
                      selectedTextColor === swatch.hex
                        ? 'scale-110 ring-2 ring-[#090808]'
                        : 'hover:scale-105'
                    }`}
                    style={{ backgroundColor: swatch.hex }}
                    title={swatch.name}
                  >
                    {selectedTextColor === swatch.hex && (
                      <Check
                        size={12}
                        className={
                          swatch.hex === '#FFFFFF' || swatch.hex === '#CCFF00' || swatch.hex === '#E1E0DC'
                            ? 'text-black'
                            : 'text-white'
                        }
                      />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Typography Presets */}
            <div>
              <label className="text-[11px] font-bold tracking-[0.2em] text-[#BEBDBB] uppercase block mb-2">
                QUICK STYLES
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() =>
                    onAddText('ARCHIVAL // 2026', {
                      fontFamily: 'JetBrains Mono, monospace',
                      fontSize: 18,
                      fontWeight: 'bold',
                      fill: selectedTextColor,
                    })
                  }
                  className="p-2 border border-[#BEBDBB] bg-white text-[10px] font-mono font-bold uppercase hover:border-[#090808] transition-colors text-center"
                >
                  MONO SERIAL
                </button>
                <button
                  type="button"
                  onClick={() =>
                    onAddText('MOODIFYS', {
                      fontFamily: 'Cinzel, serif',
                      fontSize: 32,
                      fontWeight: 'bold',
                      fill: selectedTextColor,
                    })
                  }
                  className="p-2 border border-[#BEBDBB] bg-white text-[10px] font-serif font-bold uppercase hover:border-[#090808] transition-colors text-center"
                >
                  EDITORIAL SERIF
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ==================== 2. GRAPHICS TOOL ==================== */}
        {activeTool === 'graphics' && (
          <div className="space-y-5">
            <div>
              <p className="text-[11px] font-bold tracking-[0.2em] text-[#BEBDBB] uppercase mb-2">
                CURATED ARTWORK & BADGES
              </p>
              <p className="text-xs text-[#302F2E] mb-3">
                Select high-definition vector stamps to stamp onto the garment canvas.
              </p>
            </div>

            {/* Graphic Color Selector */}
            <div>
              <label className="text-[11px] font-bold tracking-[0.2em] text-[#BEBDBB] uppercase block mb-2">
                STAMP COLOR
              </label>
              <div className="flex flex-wrap gap-2">
                {COLOR_SWATCHES.map((swatch) => (
                  <button
                    key={swatch.hex}
                    type="button"
                    onClick={() => {
                      setSelectedGraphicColor(swatch.hex)
                      onUpdateActiveObject?.({ fill: swatch.hex })
                    }}
                    className={`w-7 h-7 rounded-full border border-[#BEBDBB] flex items-center justify-center transition-transform ${
                      selectedGraphicColor === swatch.hex
                        ? 'scale-110 ring-2 ring-[#090808]'
                        : 'hover:scale-105'
                    }`}
                    style={{ backgroundColor: swatch.hex }}
                    title={swatch.name}
                  >
                    {selectedGraphicColor === swatch.hex && (
                      <Check
                        size={12}
                        className={
                          swatch.hex === '#FFFFFF' || swatch.hex === '#CCFF00' || swatch.hex === '#E1E0DC'
                            ? 'text-black'
                            : 'text-white'
                        }
                      />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Artwork Grid */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              {CUSTOMIZER_GRAPHICS.map((g) => (
                <button
                  key={g.id}
                  type="button"
                  onClick={() => onAddGraphic(g.svg, selectedGraphicColor)}
                  className="group flex flex-col items-center justify-center p-4 bg-white border border-[#E1E0DC] hover:border-[#090808] hover:shadow-md transition-all text-center rounded-sm"
                >
                  <div
                    className="w-16 h-16 flex items-center justify-center text-[#090808] group-hover:scale-110 transition-transform"
                    dangerouslySetInnerHTML={{ __html: g.svg }}
                  />
                  <span className="mt-2 text-[10px] font-bold tracking-wider uppercase text-[#302F2E] group-hover:text-[#090808]">
                    {g.name}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ==================== 3. UPLOAD TOOL ==================== */}
        {activeTool === 'upload' && (
          <div className="space-y-5">
            <div>
              <p className="text-[11px] font-bold tracking-[0.2em] text-[#BEBDBB] uppercase mb-2">
                IMAGE UPLOADER
              </p>
              <p className="text-xs text-[#302F2E] mb-4">
                Import high-res PNG, JPG, or SVG graphics directly to your canvas.
              </p>
            </div>

            <label className="flex flex-col items-center justify-center border-2 border-dashed border-[#BEBDBB] hover:border-[#090808] p-8 cursor-pointer bg-white transition-colors text-center rounded-sm">
              <Upload size={28} className="text-[#302F2E] mb-2" />
              <span className="text-xs font-bold uppercase tracking-widest text-[#090808]">
                CHOOSE FILE OR DRAG HERE
              </span>
              <span className="text-[10px] text-[#BEBDBB] tracking-wider uppercase mt-1">
                PNG, JPG, WEBP (MAX 10MB)
              </span>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>

            {/* Opacity adjustment when image is selected */}
            {selectedObjectProps && (
              <div className="pt-4 border-t border-[#E1E0DC] space-y-3">
                <label className="text-[11px] font-bold tracking-[0.2em] text-[#BEBDBB] uppercase block">
                  LAYER OPACITY
                </label>
                <input
                  type="range"
                  min="0.1"
                  max="1"
                  step="0.05"
                  defaultValue="1"
                  onChange={(e) =>
                    onUpdateActiveObject?.({ opacity: parseFloat(e.target.value) })
                  }
                  className="w-full accent-[#090808]"
                />
              </div>
            )}
          </div>
        )}

        {/* ==================== 4. GARMENT TOOL ==================== */}
        {activeTool === 'product' && (
          <div className="space-y-5">
            <div>
              <p className="text-[11px] font-bold tracking-[0.2em] text-[#BEBDBB] uppercase mb-2">
                GARMENT BLANK
              </p>
              <div className="space-y-2">
                {customizableProducts.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => onProductChange(p)}
                    className={`w-full flex items-center justify-between p-3 border text-left transition-all ${
                      product.id === p.id
                        ? 'border-[#090808] bg-white font-bold shadow-sm'
                        : 'border-[#E1E0DC] bg-[#FFFFFF]/60 hover:bg-white'
                    }`}
                  >
                    <div>
                      <p className="text-xs font-display uppercase tracking-wider">{p.name}</p>
                      <p className="text-[10px] text-[#BEBDBB] uppercase tracking-widest font-mono">
                        {formatPrice(p.basePrice)}
                      </p>
                    </div>
                    {product.id === p.id && <Check size={14} className="text-[#090808]" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Garment Color Swatches */}
            <div>
              <label className="text-[11px] font-bold tracking-[0.2em] text-[#BEBDBB] uppercase block mb-2">
                GARMENT FABRIC COLOR
              </label>
              <div className="flex flex-wrap gap-2">
                {product.colors.map((color) => (
                  <button
                    key={color.hex}
                    type="button"
                    onClick={() => onColorChange(color)}
                    className={`w-8 h-8 rounded-full border border-[#BEBDBB] flex items-center justify-center transition-transform ${
                      selectedColor.hex === color.hex
                        ? 'scale-110 ring-2 ring-[#090808]'
                        : 'hover:scale-105'
                    }`}
                    style={{ backgroundColor: color.hex }}
                    title={color.name}
                  >
                    {selectedColor.hex === color.hex && (
                      <Check
                        size={13}
                        className={
                          color.hex === '#FFFFFF' || color.hex === '#E1E0DC'
                            ? 'text-black'
                            : 'text-white'
                        }
                      />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Garment Size Selection */}
            <div>
              <label className="text-[11px] font-bold tracking-[0.2em] text-[#BEBDBB] uppercase block mb-2">
                SELECT SIZE
              </label>
              <div className="grid grid-cols-4 gap-1.5">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => onSizeChange(size)}
                    className={`py-2 text-xs font-bold tracking-wider uppercase border transition-colors ${
                      selectedSize === size
                        ? 'bg-[#090808] text-white border-[#090808]'
                        : 'bg-white text-[#090808] border-[#E1E0DC] hover:border-[#090808]'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}

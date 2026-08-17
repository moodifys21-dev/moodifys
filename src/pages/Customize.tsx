import React, { useRef, useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import {
  CustomizerCanvas,
  CustomizerCanvasRef,
} from '@/components/customizer/CustomizerCanvas'
import { CustomizerToolbar } from '@/components/customizer/CustomizerToolbar'
import { CustomizerSidebar } from '@/components/customizer/CustomizerSidebar'
import { useCustomizerStore } from '@/stores/customizerStore'
import { useCartStore } from '@/stores/cartStore'
import { useProducts } from '@/hooks/useProducts'
import { formatPrice } from '@/lib/utils'
import { Button } from '@/components/ui/Button'
import {
  ShoppingBag,
  Sparkles,
  ArrowLeft,
  Share2,
  Bookmark,
  Check,
  Info,
} from 'lucide-react'

const CUSTOM_PRINT_FEE = 300

export const Customize: React.FC = () => {
  const { productId } = useParams<{ productId?: string }>()
  const canvasRef = useRef<CustomizerCanvasRef | null>(null)
  
  const { allProducts } = useProducts()
  const {
    product,
    selectedColor,
    selectedSize,
    designName,
    activeTool,
    zoom,
    showPrintBounds,
    canUndo,
    canRedo,
    setProduct,
    setSelectedColor,
    setSelectedSize,
    setDesignName,
    setActiveTool,
    setZoom,
    setShowPrintBounds,
    setHistoryStatus,
  } = useCustomizerStore()

  const { addItem } = useCartStore()

  const [hasSelection, setHasSelection] = useState(false)
  const [selectedProps, setSelectedProps] = useState<Record<string, unknown> | undefined>()
  const [isSaved, setIsSaved] = useState(false)
  const [isAddingToCart, setIsAddingToCart] = useState(false)

  // Sync route param if provided
  useEffect(() => {
    if (productId && allProducts.length > 0) {
      const match = allProducts.find(
        (p) => p.id === productId || p.slug === productId
      )
      if (match && match.isCustomizable) {
        setProduct(match)
      }
    }
  }, [productId, allProducts, setProduct])

  // Total calculated price
  const totalPrice = product.basePrice + CUSTOM_PRINT_FEE

  // Add customized item to cart
  const handleAddToCart = () => {
    setIsAddingToCart(true)
    
    // Capture snapshot from canvas
    const snapshotUrl = canvasRef.current?.exportSnapshot() || product.imageUrl
    const canvasJson = canvasRef.current?.exportJSON() || {}

    setTimeout(() => {
      addItem({
        productId: product.id,
        name: `${product.name} [CUSTOM: ${designName.toUpperCase()}]`,
        price: totalPrice,
        color: selectedColor.name,
        colorHex: selectedColor.hex,
        size: selectedSize,
        quantity: 1,
        imageUrl: snapshotUrl,
        isCustom: true,
        designName: designName,
        designJson: canvasJson,
      })
      setIsAddingToCart(false)
    }, 400)
  }

  // Handle local design save
  const handleSaveDesign = () => {
    setIsSaved(true)
    setTimeout(() => setIsSaved(false), 2500)
  }

  return (
    <div className="flex flex-col h-[calc(100vh-5rem)] bg-[#F0EFED] overflow-hidden select-none">
      {/* Studio Sub-Header */}
      <div className="flex items-center justify-between px-4 sm:px-6 py-2.5 bg-[#FFFFFF] border-b border-[#E1E0DC] z-10">
        <div className="flex items-center space-x-3">
          <Link
            to="/shop"
            className="p-1.5 text-[#302F2E] hover:text-[#090808] transition-colors"
            title="Exit Studio"
          >
            <ArrowLeft size={18} />
          </Link>
          <div className="flex items-center space-x-2">
            <Sparkles size={14} className="text-[#090808]" />
            <input
              type="text"
              value={designName}
              onChange={(e) => setDesignName(e.target.value)}
              className="font-display font-bold text-xs sm:text-sm uppercase tracking-wider text-[#090808] bg-transparent border-b border-dashed border-[#BEBDBB] focus:border-[#090808] focus:outline-none px-1 py-0.5"
              placeholder="UNTITLED BESPOKE PIECE"
            />
          </div>
        </div>

        {/* Studio Top Actions */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          <button
            type="button"
            onClick={handleSaveDesign}
            className={`px-3 py-1.5 text-xs font-bold tracking-wider uppercase border flex items-center gap-1.5 transition-colors ${
              isSaved
                ? 'bg-emerald-600 text-white border-emerald-600'
                : 'border-[#BEBDBB] text-[#090808] hover:bg-[#E1E0DC]'
            }`}
          >
            {isSaved ? <Check size={13} /> : <Bookmark size={13} />}
            <span className="hidden sm:inline">{isSaved ? 'SAVED' : 'SAVE'}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              if (navigator.share) {
                navigator.share({
                  title: `Moodifys Custom Design: ${designName}`,
                  url: window.location.href,
                }).catch(() => {})
              }
            }}
            className="p-2 border border-[#BEBDBB] text-[#090808] hover:bg-[#E1E0DC] transition-colors hidden md:flex items-center"
            title="Share Studio Link"
          >
            <Share2 size={14} />
          </button>

          <Button
            variant="ink"
            size="sm"
            onClick={handleAddToCart}
            disabled={isAddingToCart}
            className="gap-1.5"
          >
            <ShoppingBag size={14} />
            <span>{isAddingToCart ? 'PREPARING...' : `ADD TO BAG • ${formatPrice(totalPrice)}`}</span>
          </Button>
        </div>
      </div>

      {/* Main Studio Body: Sidebar Controls + Canvas Viewport */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        
        {/* Left Sidebar Controls (Desktop 360px, Mobile Tabbed Drawer) */}
        <div className="w-full md:w-80 lg:w-96 flex-shrink-0 h-1/3 md:h-full overflow-hidden order-2 md:order-1">
          <CustomizerSidebar
            activeTool={activeTool}
            onSelectTool={setActiveTool}
            product={product}
            selectedColor={selectedColor}
            selectedSize={selectedSize}
            onProductChange={setProduct}
            onColorChange={setSelectedColor}
            onSizeChange={setSelectedSize}
            onAddText={(text, opts) => canvasRef.current?.addText(text, opts)}
            onAddGraphic={(svg, col) => canvasRef.current?.addGraphic(svg, col)}
            onUploadImage={(file) => canvasRef.current?.addImage(file)}
            selectedObjectProps={selectedProps}
            onUpdateActiveObject={(p) => canvasRef.current?.updateActiveObject(p)}
          />
        </div>

        {/* Right Canvas Viewport & Toolbar */}
        <div className="flex-1 flex flex-col h-2/3 md:h-full bg-[#E8E7E3] overflow-hidden order-1 md:order-2">
          {/* Canvas Action Bar */}
          <CustomizerToolbar
            canUndo={canUndo}
            canRedo={canRedo}
            hasSelection={hasSelection}
            zoom={zoom}
            showPrintBounds={showPrintBounds}
            onUndo={() => canvasRef.current?.undo()}
            onRedo={() => canvasRef.current?.redo()}
            onZoomIn={() => setZoom(Math.min(zoom + 0.15, 1.8))}
            onZoomOut={() => setZoom(Math.max(zoom - 0.15, 0.6))}
            onResetZoom={() => setZoom(1)}
            onToggleBounds={() => setShowPrintBounds(!showPrintBounds)}
            onAlignCenter={() => canvasRef.current?.alignCenter()}
            onDuplicate={() => canvasRef.current?.duplicateSelected()}
            onDelete={() => canvasRef.current?.deleteSelected()}
            onClear={() => canvasRef.current?.clear()}
            onBringForward={() => canvasRef.current?.bringForward()}
            onSendBackward={() => canvasRef.current?.sendBackward()}
          />

          {/* Interactive Fabric Canvas Area */}
          <div className="flex-1 flex items-center justify-center p-2 sm:p-6 overflow-auto">
            <CustomizerCanvas
              ref={canvasRef}
              product={product}
              selectedColor={selectedColor}
              showPrintBounds={showPrintBounds}
              zoom={zoom}
              onSelectionChange={(selected, _type, props) => {
                setHasSelection(selected)
                setSelectedProps(props)
              }}
              onHistoryChange={(undoable, redoable) => {
                setHistoryStatus(undoable, redoable)
              }}
            />
          </div>

          {/* Studio Footer Specs Bar */}
          <div className="px-4 py-2 bg-[#F0EFED] border-t border-[#E1E0DC] flex flex-wrap items-center justify-between text-[11px] font-mono text-[#302F2E]">
            <div className="flex items-center space-x-4">
              <span>GARMENT: <strong className="text-[#090808]">{product.name}</strong></span>
              <span>COLOR: <strong className="text-[#090808]">{selectedColor.name}</strong></span>
              <span>SIZE: <strong className="text-[#090808]">{selectedSize}</strong></span>
            </div>
            <div className="flex items-center gap-1.5 text-[#BEBDBB]">
              <Info size={12} />
              <span>Vector DTG High-Density Print Simulation</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}

export default Customize

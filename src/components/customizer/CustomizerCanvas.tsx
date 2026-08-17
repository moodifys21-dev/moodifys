import { useEffect, useRef, useImperativeHandle, forwardRef, useCallback } from 'react'
import * as fabric from 'fabric'
import { Product, ProductColor } from '@/types/product'

export interface CustomizerCanvasRef {
  addText: (text?: string, options?: Record<string, unknown>) => void
  addGraphic: (svgString: string, color?: string) => void
  addImage: (file: File) => void
  deleteSelected: () => void
  duplicateSelected: () => void
  bringForward: () => void
  sendBackward: () => void
  alignCenter: () => void
  undo: () => void
  redo: () => void
  clear: () => void
  exportSnapshot: () => string
  exportJSON: () => Record<string, unknown>
  loadJSON: (json: Record<string, unknown>) => void
  updateActiveObject: (props: Record<string, unknown>) => void
  getActiveObject: () => fabric.FabricObject | null
}

interface CustomizerCanvasProps {
  product: Product
  selectedColor: ProductColor
  showPrintBounds: boolean
  zoom: number
  onSelectionChange?: (hasSelection: boolean, objectType?: string, properties?: Record<string, unknown>) => void
  onHistoryChange?: (canUndo: boolean, canRedo: boolean) => void
  onCanvasModified?: () => void
}

const CANVAS_WIDTH = 500
const CANVAS_HEIGHT = 600
const PRINT_BOUNDS = {
  left: 130,
  top: 150,
  width: 240,
  height: 320,
}

export const CustomizerCanvas = forwardRef<CustomizerCanvasRef, CustomizerCanvasProps>(
  (
    {
      selectedColor,
      showPrintBounds,
      zoom,
      onSelectionChange,
      onHistoryChange,
      onCanvasModified,
    },
    ref
  ) => {
    const canvasElRef = useRef<HTMLCanvasElement | null>(null)
    const fabricCanvasRef = useRef<fabric.Canvas | null>(null)
    const historyRef = useRef<string[]>([])
    const historyIndexRef = useRef<number>(-1)
    const isHistoryLockedRef = useRef<boolean>(false)

    const callbacksRef = useRef({
      onSelectionChange,
      onHistoryChange,
      onCanvasModified,
    })

    useEffect(() => {
      callbacksRef.current = {
        onSelectionChange,
        onHistoryChange,
        onCanvasModified,
      }
    }, [onSelectionChange, onHistoryChange, onCanvasModified])

    // Save history state
    const saveState = useCallback(() => {
      if (isHistoryLockedRef.current || !fabricCanvasRef.current) return
      const json = JSON.stringify(fabricCanvasRef.current.toJSON())
      // Truncate future states if we modified after undo
      if (historyIndexRef.current < historyRef.current.length - 1) {
        historyRef.current = historyRef.current.slice(0, historyIndexRef.current + 1)
      }
      historyRef.current.push(json)
      historyIndexRef.current = historyRef.current.length - 1
      
      const canUndo = historyIndexRef.current > 0
      const canRedo = historyIndexRef.current < historyRef.current.length - 1
      callbacksRef.current.onHistoryChange?.(canUndo, canRedo)
      callbacksRef.current.onCanvasModified?.()
    }, [])

    // Initialize Fabric Canvas
    useEffect(() => {
      if (!canvasElRef.current) return

      const canvas = new fabric.Canvas(canvasElRef.current, {
        width: CANVAS_WIDTH,
        height: CANVAS_HEIGHT,
        preserveObjectStacking: true,
        selectionColor: 'rgba(9, 8, 8, 0.15)',
        selectionBorderColor: '#090808',
        selectionLineWidth: 1,
      })

      fabricCanvasRef.current = canvas

      // Track selection events
      const updateSelection = () => {
        const active = canvas.getActiveObject()
        if (active) {
          let type = 'object'
          if (active.type === 'i-text' || active.type === 'text') type = 'text'
          else if (active.type === 'image') type = 'image'
          else if (active.type === 'group' || active.type === 'path') type = 'graphic'

          callbacksRef.current.onSelectionChange?.(true, type, {
            fill: active.get('fill'),
            fontFamily: (active as fabric.IText).fontFamily,
            fontSize: (active as fabric.IText).fontSize,
            fontWeight: (active as fabric.IText).fontWeight,
            fontStyle: (active as fabric.IText).fontStyle,
            textAlign: (active as fabric.IText).textAlign,
            opacity: active.opacity,
            angle: active.angle,
          })
        } else {
          callbacksRef.current.onSelectionChange?.(false)
        }
      }

      canvas.on('selection:created', updateSelection)
      canvas.on('selection:updated', updateSelection)
      canvas.on('selection:cleared', () => callbacksRef.current.onSelectionChange?.(false))

      // Track modification events for history
      canvas.on('object:modified', saveState)
      canvas.on('object:added', () => {
        if (!isHistoryLockedRef.current) saveState()
      })
      canvas.on('object:removed', () => {
        if (!isHistoryLockedRef.current) saveState()
      })

      // Initial blank state
      saveState()

      return () => {
        canvas.dispose()
        fabricCanvasRef.current = null
      }
    }, [saveState])

    // Imperative methods exposed to parent
    useImperativeHandle(ref, () => ({
      addText: (text = 'PERSONAL MOOD', options = {}) => {
        const canvas = fabricCanvasRef.current
        if (!canvas) return

        const iText = new fabric.IText(text, {
          left: CANVAS_WIDTH / 2,
          top: CANVAS_HEIGHT / 2 - 20,
          originX: 'center',
          originY: 'center',
          fontFamily: 'Inter, sans-serif',
          fontSize: 24,
          fontWeight: 'bold',
          fill: selectedColor.hex === '#090808' ? '#FFFFFF' : '#090808',
          letterSpacing: 200,
          cornerColor: '#090808',
          cornerStrokeColor: '#FFFFFF',
          cornerStyle: 'rect',
          cornerSize: 10,
          transparentCorners: false,
          borderColor: '#090808',
          ...options,
        })

        canvas.add(iText)
        canvas.setActiveObject(iText)
        canvas.renderAll()
      },

      addGraphic: (svgString: string, color?: string) => {
        const canvas = fabricCanvasRef.current
        if (!canvas) return

        fabric.loadSVGFromString(svgString).then((res) => {
          if (!res || !res.objects) return
          const validObjects = res.objects.filter((o): o is fabric.FabricObject => o !== null)
          const obj = fabric.util.groupSVGElements(validObjects, res.options)
          
          obj.set({
            left: CANVAS_WIDTH / 2,
            top: CANVAS_HEIGHT / 2,
            originX: 'center',
            originY: 'center',
            cornerColor: '#090808',
            cornerStrokeColor: '#FFFFFF',
            cornerStyle: 'rect',
            cornerSize: 10,
            transparentCorners: false,
            borderColor: '#090808',
          })

          // Scale nicely inside print zone
          if (obj.width && obj.height) {
            const scale = Math.min(160 / obj.width, 160 / obj.height, 1)
            obj.scale(scale)
          }

          if (color) {
            obj.set('fill', color)
          }

          canvas.add(obj)
          canvas.setActiveObject(obj)
          canvas.renderAll()
        }).catch(err => {
          console.warn('SVG parse error:', err)
        })
      },

      addImage: (file: File) => {
        const canvas = fabricCanvasRef.current
        if (!canvas) return

        const reader = new FileReader()
        reader.onload = (e) => {
          const imgUrl = e.target?.result as string
          if (!imgUrl) return

          const imgEl = new Image()
          imgEl.crossOrigin = 'anonymous'
          imgEl.src = imgUrl
          imgEl.onload = () => {
            const fabricImg = new fabric.FabricImage(imgEl, {
              left: CANVAS_WIDTH / 2,
              top: CANVAS_HEIGHT / 2,
              originX: 'center',
              originY: 'center',
              cornerColor: '#090808',
              cornerStrokeColor: '#FFFFFF',
              cornerStyle: 'rect',
              cornerSize: 10,
              transparentCorners: false,
              borderColor: '#090808',
            })

            // Auto scale to reasonable dimension
            if (fabricImg.width && fabricImg.height) {
              const maxDim = 180
              const scale = Math.min(maxDim / fabricImg.width, maxDim / fabricImg.height, 1)
              fabricImg.scale(scale)
            }

            canvas.add(fabricImg)
            canvas.setActiveObject(fabricImg)
            canvas.renderAll()
          }
        }
        reader.readAsDataURL(file)
      },

      deleteSelected: () => {
        const canvas = fabricCanvasRef.current
        if (!canvas) return
        const active = canvas.getActiveObjects()
        if (active.length > 0) {
          active.forEach((obj) => canvas.remove(obj))
          canvas.discardActiveObject()
          canvas.renderAll()
        }
      },

      duplicateSelected: () => {
        const canvas = fabricCanvasRef.current
        if (!canvas) return
        const active = canvas.getActiveObject()
        if (!active) return

        active.clone().then((cloned) => {
          cloned.set({
            left: (active.left || 0) + 15,
            top: (active.top || 0) + 15,
          })
          canvas.add(cloned)
          canvas.setActiveObject(cloned)
          canvas.renderAll()
        })
      },

      bringForward: () => {
        const canvas = fabricCanvasRef.current
        const active = canvas?.getActiveObject()
        if (canvas && active) {
          canvas.bringObjectForward(active)
          canvas.renderAll()
          saveState()
        }
      },

      sendBackward: () => {
        const canvas = fabricCanvasRef.current
        const active = canvas?.getActiveObject()
        if (canvas && active) {
          canvas.sendObjectBackwards(active)
          canvas.renderAll()
          saveState()
        }
      },

      alignCenter: () => {
        const canvas = fabricCanvasRef.current
        const active = canvas?.getActiveObject()
        if (canvas && active) {
          active.set({
            left: CANVAS_WIDTH / 2,
            top: CANVAS_HEIGHT / 2,
          })
          active.setCoords()
          canvas.renderAll()
          saveState()
        }
      },

      undo: () => {
        const canvas = fabricCanvasRef.current
        if (!canvas || historyIndexRef.current <= 0) return

        isHistoryLockedRef.current = true
        historyIndexRef.current -= 1
        const targetState = historyRef.current[historyIndexRef.current]

        canvas.loadFromJSON(JSON.parse(targetState)).then(() => {
          canvas.renderAll()
          isHistoryLockedRef.current = false
          const canUndo = historyIndexRef.current > 0
          const canRedo = historyIndexRef.current < historyRef.current.length - 1
          callbacksRef.current.onHistoryChange?.(canUndo, canRedo)
          callbacksRef.current.onCanvasModified?.()
        })
      },

      redo: () => {
        const canvas = fabricCanvasRef.current
        if (!canvas || historyIndexRef.current >= historyRef.current.length - 1) return

        isHistoryLockedRef.current = true
        historyIndexRef.current += 1
        const targetState = historyRef.current[historyIndexRef.current]

        canvas.loadFromJSON(JSON.parse(targetState)).then(() => {
          canvas.renderAll()
          isHistoryLockedRef.current = false
          const canUndo = historyIndexRef.current > 0
          const canRedo = historyIndexRef.current < historyRef.current.length - 1
          callbacksRef.current.onHistoryChange?.(canUndo, canRedo)
          callbacksRef.current.onCanvasModified?.()
        })
      },

      clear: () => {
        const canvas = fabricCanvasRef.current
        if (!canvas) return
        canvas.clear()
        saveState()
      },

      exportSnapshot: () => {
        const canvas = fabricCanvasRef.current
        if (!canvas) return ''
        return canvas.toDataURL({
          format: 'png',
          quality: 1,
          multiplier: 1.5,
        })
      },

      exportJSON: () => {
        const canvas = fabricCanvasRef.current
        if (!canvas) return {}
        return canvas.toJSON()
      },

      loadJSON: (json: Record<string, unknown>) => {
        const canvas = fabricCanvasRef.current
        if (!canvas) return
        isHistoryLockedRef.current = true
        canvas.loadFromJSON(json).then(() => {
          canvas.renderAll()
          isHistoryLockedRef.current = false
          saveState()
        })
      },

      updateActiveObject: (props: Record<string, unknown>) => {
        const canvas = fabricCanvasRef.current
        const active = canvas?.getActiveObject()
        if (canvas && active) {
          active.set(props)
          active.setCoords()
          canvas.renderAll()
          saveState()
        }
      },

      getActiveObject: () => {
        return fabricCanvasRef.current?.getActiveObject() || null
      },
    }))

    // Dynamic silhouette backdrop style according to selected color
    const isDarkGarment = selectedColor.hex.toLowerCase() === '#090808' || selectedColor.hex.toLowerCase() === '#302f2e'

    return (
      <div className="relative flex items-center justify-center p-4 select-none overflow-hidden">
        {/* Scale Container */}
        <div
          className="relative transition-transform duration-150 ease-out shadow-2xl rounded-sm border border-[#BEBDBB]/30"
          style={{
            transform: `scale(${zoom})`,
            width: `${CANVAS_WIDTH}px`,
            height: `${CANVAS_HEIGHT}px`,
            backgroundColor: '#F5F4F0',
          }}
        >
          {/* Garment Silhouette Vector Template */}
          <div
            className="absolute inset-0 flex items-center justify-center pointer-events-none transition-colors duration-300"
            style={{ color: selectedColor.hex }}
          >
            <svg
              viewBox="0 0 500 600"
              className="w-full h-full drop-shadow-md"
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* T-Shirt Vector Mockup Shape */}
              <path
                d="M175 60 C190 75 220 85 250 85 C280 85 310 75 325 60 L425 105 L375 210 L330 185 L330 540 L170 540 L170 185 L125 210 L75 105 Z"
                stroke={isDarkGarment ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'}
                strokeWidth="2"
              />
              {/* Collar detail */}
              <path
                d="M175 60 C195 95 305 95 325 60 C305 85 195 85 175 60 Z"
                fill={isDarkGarment ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.06)'}
              />
              {/* Subtle seam lines */}
              <line
                x1="170"
                y1="185"
                x2="330"
                y2="185"
                stroke={isDarkGarment ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)'}
                strokeWidth="1.5"
                strokeDasharray="4 2"
              />
            </svg>
          </div>

          {/* Printable Area Bounds & Alignment Crosshair */}
          {showPrintBounds && (
            <div
              className="absolute pointer-events-none border border-dashed border-[#BEBDBB] transition-opacity"
              style={{
                left: `${PRINT_BOUNDS.left}px`,
                top: `${PRINT_BOUNDS.top}px`,
                width: `${PRINT_BOUNDS.width}px`,
                height: `${PRINT_BOUNDS.height}px`,
                backgroundColor: 'rgba(255,255,255,0.02)',
              }}
            >
              {/* Center crosshair */}
              <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-red-400/20 pointer-events-none" />
              <div className="absolute left-1/2 top-0 bottom-0 w-[1px] bg-red-400/20 pointer-events-none" />
              <span className="absolute top-1 left-2 text-[9px] font-bold font-mono uppercase tracking-widest text-[#BEBDBB]">
                PRINT ZONE (240x320)
              </span>
            </div>
          )}

          {/* Fabric Canvas Target */}
          <canvas ref={canvasElRef} className="absolute inset-0 z-10" />
        </div>
      </div>
    )
  }
)

CustomizerCanvas.displayName = 'CustomizerCanvas'

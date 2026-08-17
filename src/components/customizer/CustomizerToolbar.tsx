import React from 'react'
import {
  Undo2,
  Redo2,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Trash2,
  Copy,
  AlignCenter,
  Layers,
  Eye,
  EyeOff,
  RotateCcw,
} from 'lucide-react'

interface CustomizerToolbarProps {
  canUndo: boolean
  canRedo: boolean
  hasSelection: boolean
  zoom: number
  showPrintBounds: boolean
  onUndo: () => void
  onRedo: () => void
  onZoomIn: () => void
  onZoomOut: () => void
  onResetZoom: () => void
  onToggleBounds: () => void
  onAlignCenter: () => void
  onDuplicate: () => void
  onDelete: () => void
  onClear: () => void
  onBringForward?: () => void
  onSendBackward?: () => void
}

export const CustomizerToolbar: React.FC<CustomizerToolbarProps> = ({
  canUndo,
  canRedo,
  hasSelection,
  zoom,
  showPrintBounds,
  onUndo,
  onRedo,
  onZoomIn,
  onZoomOut,
  onResetZoom,
  onToggleBounds,
  onAlignCenter,
  onDuplicate,
  onDelete,
  onClear,
  onBringForward,
  onSendBackward,
}) => {
  return (
    <div className="flex flex-wrap items-center justify-between gap-2 p-2.5 bg-[#F0EFED] border-b border-[#E1E0DC] select-none">
      {/* History & Edit Operations */}
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={onUndo}
          disabled={!canUndo}
          title="Undo (Ctrl+Z)"
          className={`p-2 rounded transition-colors ${
            canUndo
              ? 'text-[#090808] hover:bg-[#E1E0DC]'
              : 'text-[#BEBDBB] cursor-not-allowed'
          }`}
        >
          <Undo2 size={16} />
        </button>
        <button
          type="button"
          onClick={onRedo}
          disabled={!canRedo}
          title="Redo (Ctrl+Y)"
          className={`p-2 rounded transition-colors ${
            canRedo
              ? 'text-[#090808] hover:bg-[#E1E0DC]'
              : 'text-[#BEBDBB] cursor-not-allowed'
          }`}
        >
          <Redo2 size={16} />
        </button>

        <div className="h-4 w-[1px] bg-[#BEBDBB]/50 mx-1" />

        {/* Selected Object Manipulation */}
        <button
          type="button"
          onClick={onAlignCenter}
          disabled={!hasSelection}
          title="Align to Center"
          className={`p-2 rounded transition-colors ${
            hasSelection
              ? 'text-[#090808] hover:bg-[#E1E0DC]'
              : 'text-[#BEBDBB] cursor-not-allowed'
          }`}
        >
          <AlignCenter size={16} />
        </button>

        <button
          type="button"
          onClick={onDuplicate}
          disabled={!hasSelection}
          title="Duplicate Element"
          className={`p-2 rounded transition-colors ${
            hasSelection
              ? 'text-[#090808] hover:bg-[#E1E0DC]'
              : 'text-[#BEBDBB] cursor-not-allowed'
          }`}
        >
          <Copy size={16} />
        </button>

        {onBringForward && (
          <button
            type="button"
            onClick={onBringForward}
            disabled={!hasSelection}
            title="Bring Forward"
            className={`p-2 rounded transition-colors ${
              hasSelection
                ? 'text-[#090808] hover:bg-[#E1E0DC]'
                : 'text-[#BEBDBB] cursor-not-allowed'
            }`}
          >
            <Layers size={16} />
          </button>
        )}

        {onSendBackward && (
          <button
            type="button"
            onClick={onSendBackward}
            disabled={!hasSelection}
            title="Send Backward"
            className={`p-2 rounded transition-colors ${
              hasSelection
                ? 'text-[#090808] hover:bg-[#E1E0DC]'
                : 'text-[#BEBDBB] cursor-not-allowed'
            }`}
          >
            <Layers size={16} className="rotate-180" />
          </button>
        )}

        <button
          type="button"
          onClick={onDelete}
          disabled={!hasSelection}
          title="Delete (Del)"
          className={`p-2 rounded transition-colors ${
            hasSelection
              ? 'text-red-600 hover:bg-red-50'
              : 'text-[#BEBDBB] cursor-not-allowed'
          }`}
        >
          <Trash2 size={16} />
        </button>
      </div>

      {/* Canvas Viewport & Guide Operations */}
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={onToggleBounds}
          title={showPrintBounds ? 'Hide Print Guide' : 'Show Print Guide'}
          className={`px-2 py-1 text-xs font-semibold flex items-center gap-1.5 rounded transition-colors ${
            showPrintBounds
              ? 'bg-[#090808] text-white'
              : 'text-[#302F2E] hover:bg-[#E1E0DC]'
          }`}
        >
          {showPrintBounds ? <Eye size={13} /> : <EyeOff size={13} />}
          <span className="hidden sm:inline">GUIDE</span>
        </button>

        <div className="h-4 w-[1px] bg-[#BEBDBB]/50 mx-1" />

        <button
          type="button"
          onClick={onZoomOut}
          title="Zoom Out"
          className="p-2 text-[#090808] hover:bg-[#E1E0DC] rounded transition-colors"
        >
          <ZoomOut size={16} />
        </button>
        <span className="text-[11px] font-mono font-bold w-12 text-center text-[#302F2E]">
          {Math.round(zoom * 100)}%
        </span>
        <button
          type="button"
          onClick={onZoomIn}
          title="Zoom In"
          className="p-2 text-[#090808] hover:bg-[#E1E0DC] rounded transition-colors"
        >
          <ZoomIn size={16} />
        </button>
        <button
          type="button"
          onClick={onResetZoom}
          title="Reset Zoom"
          className="p-2 text-[#302F2E] hover:bg-[#E1E0DC] rounded transition-colors"
        >
          <Maximize2 size={14} />
        </button>

        <div className="h-4 w-[1px] bg-[#BEBDBB]/50 mx-1" />

        <button
          type="button"
          onClick={onClear}
          title="Clear Canvas"
          className="px-2.5 py-1 text-xs font-bold text-red-600 hover:bg-red-50 rounded flex items-center gap-1 transition-colors"
        >
          <RotateCcw size={13} />
          <span className="hidden sm:inline">RESET</span>
        </button>
      </div>
    </div>
  )
}

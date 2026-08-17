import React from 'react'
import { cn } from '@/lib/utils'

export interface SizeSelectorProps {
  sizes: string[]
  selectedSize: string
  onSelectSize: (size: string) => void
  disabledSizes?: string[]
  className?: string
}

export const SizeSelector: React.FC<SizeSelectorProps> = ({
  sizes,
  selectedSize,
  onSelectSize,
  disabledSizes = [],
  className,
}) => {
  return (
    <div className={cn('flex items-center gap-2 flex-wrap', className)}>
      {sizes.map((size) => {
        const isSelected = selectedSize.toUpperCase() === size.toUpperCase()
        const isDisabled = disabledSizes.includes(size)

        return (
          <button
            key={size}
            type="button"
            disabled={isDisabled}
            onClick={() => onSelectSize(size)}
            className={cn(
              'min-w-[44px] h-10 px-3 text-xs font-semibold uppercase tracking-wider transition-all duration-150 border flex items-center justify-center',
              isSelected
                ? 'bg-[#090808] text-white border-[#090808]'
                : 'bg-white text-[#090808] border-[#BEBDBB] hover:border-[#090808]',
              isDisabled &&
                'opacity-30 line-through cursor-not-allowed bg-[#E1E0DC] hover:border-[#BEBDBB]'
            )}
            aria-label={`Select size ${size}`}
          >
            {size}
          </button>
        )
      })}
    </div>
  )
}

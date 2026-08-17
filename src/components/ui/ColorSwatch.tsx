import React from 'react'
import { cn } from '@/lib/utils'

export interface ColorOption {
  name: string
  hex: string
}

export interface ColorSwatchProps {
  colors: ColorOption[]
  selectedColor: string
  onSelectColor: (color: string) => void
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export const ColorSwatch: React.FC<ColorSwatchProps> = ({
  colors,
  selectedColor,
  onSelectColor,
  size = 'md',
  className,
}) => {
  const sizeStyles = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  }

  return (
    <div className={cn('flex items-center gap-2 flex-wrap', className)}>
      {colors.map((color) => {
        const isSelected = selectedColor.toLowerCase() === color.name.toLowerCase()
        return (
          <button
            key={color.name}
            type="button"
            onClick={() => onSelectColor(color.name)}
            title={color.name}
            aria-label={`Select color ${color.name}`}
            className={cn(
              'rounded-full transition-all duration-150 p-0.5 border',
              isSelected
                ? 'border-[#090808] ring-1 ring-[#090808] scale-110'
                : 'border-transparent hover:border-[#BEBDBB]'
            )}
          >
            <span
              className={cn(
                'block rounded-full border border-black/10',
                sizeStyles[size]
              )}
              style={{ backgroundColor: color.hex }}
            />
          </button>
        )
      })}
    </div>
  )
}

import React from 'react'
import { cn } from '@/lib/utils'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'ink' | 'secondary' | 'outline' | 'ghost' | 'link'
  size?: 'sm' | 'md' | 'lg'
  fullWidth?: boolean
  children: React.ReactNode
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      fullWidth = false,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-1 focus:ring-[#090808] disabled:opacity-40 disabled:cursor-not-allowed uppercase tracking-wider text-xs'

    const sizeStyles = {
      sm: 'h-9 px-4 text-[11px]',
      md: 'h-12 px-6 text-xs',
      lg: 'h-14 px-8 text-sm font-semibold tracking-widest',
    }

    const variantStyles = {
      primary:
        'bg-[#090808] text-white hover:bg-[#302F2E] active:bg-[#000000] border border-[#090808]',
      ink:
        'bg-[#090808] text-white hover:bg-[#302F2E] active:bg-[#000000] border border-[#090808]',
      secondary:
        'bg-[#302F2E] text-white hover:bg-[#090808] border border-[#302F2E]',
      outline:
        'bg-transparent text-[#090808] border border-[#090808] hover:bg-[#090808] hover:text-white',
      ghost:
        'bg-transparent text-[#090808] hover:bg-[#E1E0DC]/50 border border-transparent',
      link:
        'bg-transparent text-[#090808] hover:underline underline-offset-4 p-0 h-auto border-none tracking-widest font-semibold',
    }

    return (
      <button
        ref={ref}
        disabled={disabled}
        className={cn(
          baseStyles,
          sizeStyles[size],
          variantStyles[variant],
          fullWidth && 'w-full',
          className
        )}
        {...props}
      >
        {children}
      </button>
    )
  }
)

Button.displayName = 'Button'

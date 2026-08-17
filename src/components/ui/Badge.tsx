import React from 'react'
import { cn } from '@/lib/utils'

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'ink' | 'light' | 'outline' | 'accent'
  size?: 'sm' | 'md'
  children: React.ReactNode
}

export const Badge: React.FC<BadgeProps> = ({
  variant = 'ink',
  size = 'sm',
  className,
  children,
  ...props
}) => {
  const variantStyles = {
    ink: 'bg-[#090808] text-white border border-[#090808]',
    light: 'bg-[#E1E0DC] text-[#090808] border border-[#BEBDBB]',
    outline: 'bg-transparent text-[#090808] border border-[#090808]',
    accent: 'bg-[#302F2E] text-white border border-[#302F2E]',
  }

  const sizeStyles = {
    sm: 'text-[9px] px-2 py-0.5 tracking-[0.15em] font-bold',
    md: 'text-[11px] px-2.5 py-1 tracking-[0.18em] font-bold',
  }

  return (
    <span
      className={cn(
        'inline-flex items-center justify-center uppercase font-sans select-none',
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      {...props}
    >
      {children}
    </span>
  )
}

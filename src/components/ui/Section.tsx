import React from 'react'
import { cn } from '@/lib/utils'

export interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode
  borderedTop?: boolean
  borderedBottom?: boolean
  spacing?: 'sm' | 'md' | 'lg' | 'none'
}

export const Section: React.FC<SectionProps> = ({
  children,
  borderedTop = false,
  borderedBottom = false,
  spacing = 'md',
  className,
  ...props
}) => {
  const spacingStyles = {
    none: 'py-0',
    sm: 'py-8 md:py-12',
    md: 'py-16 md:py-24',
    lg: 'py-20 md:py-32',
  }

  return (
    <section
      className={cn(
        'w-full relative',
        spacingStyles[spacing],
        borderedTop && 'border-t border-[#BEBDBB]/40',
        borderedBottom && 'border-b border-[#BEBDBB]/40',
        className
      )}
      {...props}
    >
      {children}
    </section>
  )
}

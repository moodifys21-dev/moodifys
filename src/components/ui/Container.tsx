import React from 'react'
import { cn } from '@/lib/utils'

export interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  size?: 'default' | 'narrow' | 'wide' | 'full' | 'tight'
}

export const Container: React.FC<ContainerProps> = ({
  children,
  size = 'default',
  className,
  ...props
}) => {
  const sizeStyles = {
    tight: 'max-w-3xl',
    narrow: 'max-w-4xl',
    default: 'max-w-7xl',
    wide: 'max-w-[1600px]',
    full: 'max-w-full',
  }

  return (
    <div
      className={cn('mx-auto w-full px-4 sm:px-6 lg:px-8 xl:px-12', sizeStyles[size], className)}
      {...props}
    >
      {children}
    </div>
  )
}

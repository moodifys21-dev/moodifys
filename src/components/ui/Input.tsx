import React from 'react'
import { cn } from '@/lib/utils'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helperText?: string
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = 'text', label, error, helperText, disabled, id, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined)

    return (
      <div className="w-full space-y-1.5 text-left">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-[11px] font-bold uppercase tracking-[0.15em] text-[#090808]"
          >
            {label}
          </label>
        )}
        <div className="relative">
          <input
            id={inputId}
            type={type}
            ref={ref}
            disabled={disabled}
            className={cn(
              'w-full bg-[#FFFFFF] border px-4 py-3 text-xs tracking-wide text-[#090808] placeholder-[#BEBDBB] transition-colors duration-150 focus:outline-none focus:ring-1 focus:ring-[#090808]',
              error
                ? 'border-red-600 focus:border-red-600 focus:ring-red-600'
                : 'border-[#BEBDBB] focus:border-[#090808]',
              disabled && 'bg-[#E1E0DC]/50 cursor-not-allowed opacity-60',
              className
            )}
            {...props}
          />
        </div>
        {error && (
          <p className="text-[11px] font-medium tracking-wide text-red-600">
            {error}
          </p>
        )}
        {!error && helperText && (
          <p className="text-[11px] text-[#302F2E]/70 tracking-wide">
            {helperText}
          </p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'

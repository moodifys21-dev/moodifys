import React from 'react'
import { AlertTriangle, RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'

export interface ErrorStateProps {
  title?: string
  message?: string
  onRetry?: () => void
  className?: string
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'SOMETHING WENT WRONG',
  message = 'We could not complete your request. Please try again.',
  onRetry,
  className,
}) => {
  return (
    <div
      className={cn(
        'w-full py-16 px-6 text-center flex flex-col items-center justify-center max-w-lg mx-auto space-y-4 border border-red-200 bg-red-50/50 p-8',
        className
      )}
    >
      <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center text-red-600 mb-2">
        <AlertTriangle size={24} />
      </div>
      <h3 className="font-display text-xl font-bold uppercase tracking-wider text-[#090808]">
        {title}
      </h3>
      <p className="text-xs text-[#302F2E] max-w-md font-light leading-relaxed">
        {message}
      </p>

      {onRetry && (
        <div className="pt-3">
          <Button size="sm" variant="outline" onClick={onRetry} className="gap-2">
            <RotateCcw size={14} />
            TRY AGAIN
          </Button>
        </div>
      )}
    </div>
  )
}

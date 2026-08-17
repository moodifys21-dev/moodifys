import React from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'

export interface EmptyStateProps {
  icon?: React.ReactNode
  title: string
  description: string
  actionLabel?: string
  actionHref?: string
  onAction?: () => void
  className?: string
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  actionLabel,
  actionHref,
  onAction,
  className,
}) => {
  return (
    <div
      className={cn(
        'w-full py-16 px-6 text-center flex flex-col items-center justify-center max-w-lg mx-auto space-y-4',
        className
      )}
    >
      {icon && (
        <div className="w-16 h-16 rounded-full bg-[#E1E0DC] flex items-center justify-center text-[#302F2E] mb-2">
          {icon}
        </div>
      )}
      <h3 className="font-display text-2xl font-bold uppercase tracking-wider text-[#090808]">
        {title}
      </h3>
      <p className="text-xs md:text-sm text-[#302F2E] max-w-md font-light leading-relaxed">
        {description}
      </p>

      {(actionLabel && (actionHref || onAction)) && (
        <div className="pt-4">
          {actionHref ? (
            <Link to={actionHref}>
              <Button size="md">{actionLabel}</Button>
            </Link>
          ) : (
            <Button size="md" onClick={onAction}>
              {actionLabel}
            </Button>
          )}
        </div>
      )}
    </div>
  )
}

import { ReactNode } from 'react'

type TagVariant = 'neutral' | 'primary' | 'success' | 'warning' | 'danger'

interface TagProps {
  children: ReactNode
  variant?: TagVariant
  icon?: ReactNode
  className?: string
}

const variantStyles: Record<TagVariant, string> = {
  neutral: 'bg-neutral-surface-disabled border-neutral-surface-highlight text-neutral-text-low',
  primary: 'bg-primary-surface border-primary-surface-highlight text-primary-text-low',
  success: 'bg-success-surface border-success-surface-highlight text-success-text-low',
  warning: 'bg-warning-surface border-warning-surface-highlight text-warning-text-low',
  danger: 'bg-danger-surface border-danger-surface-highlight text-danger-text-low',
}

export function Tag({ children, variant = 'neutral', icon, className = '' }: TagProps) {
  return (
    <span
      className={`
        inline-flex items-center gap-1
        px-2 py-0.5
        text-xs font-medium
        border rounded-full
        ${variantStyles[variant]}
        ${className}
      `}
    >
      {icon && <span className="w-3 h-3">{icon}</span>}
      {children}
    </span>
  )
}

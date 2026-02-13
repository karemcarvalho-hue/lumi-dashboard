type BadgeVariant = 'neutral' | 'primary' | 'success' | 'warning' | 'danger'

interface BadgeProps {
  count: number
  variant?: BadgeVariant
  className?: string
}

const variantStyles: Record<BadgeVariant, string> = {
  neutral: 'bg-neutral-surface-disabled text-neutral-text-low',
  primary: 'bg-primary-surface text-primary-text-low',
  success: 'bg-success-surface text-success-text-low',
  warning: 'bg-warning-surface text-warning-text-low',
  danger: 'bg-danger-surface text-danger-text-low',
}

export function Badge({ count, variant = 'neutral', className = '' }: BadgeProps) {
  const displayCount = count > 99 ? '99' : count.toString()
  
  return (
    <span
      className={`
        inline-flex items-center justify-center
        min-w-[20px] h-5 px-1.5
        text-xs font-medium rounded-full
        ${variantStyles[variant]}
        ${className}
      `}
    >
      {displayCount}
    </span>
  )
}

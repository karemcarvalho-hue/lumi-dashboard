import { ButtonHTMLAttributes, ReactNode } from 'react'

type IconButtonVariant = 'ghost' | 'filled'
type IconButtonSize = 'small' | 'medium' | 'large'

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: IconButtonVariant
  size?: IconButtonSize
  icon: ReactNode
  'aria-label': string
}

const variantStyles: Record<IconButtonVariant, string> = {
  ghost: 'text-neutral-text-low hover:bg-neutral-surface-disabled hover:text-neutral-text-high',
  filled: 'bg-neutral-surface-disabled text-neutral-text-high hover:bg-neutral-surface-highlight',
}

const sizeStyles: Record<IconButtonSize, string> = {
  small: 'p-1 w-6 h-6',
  medium: 'p-1.5 w-8 h-8',
  large: 'p-2 w-10 h-10',
}

export function IconButton({
  variant = 'ghost',
  size = 'medium',
  icon,
  className = '',
  ...props
}: IconButtonProps) {
  return (
    <button
      className={`
        inline-flex items-center justify-center rounded-md
        transition-colors duration-150 ease-in-out
        disabled:opacity-50 disabled:cursor-not-allowed
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${className}
      `}
      {...props}
    >
      {icon}
    </button>
  )
}

import { ButtonHTMLAttributes, ReactNode } from 'react'

type ButtonVariant = 'primary' | 'neutral' | 'danger' | 'ai'
type ButtonSize = 'small' | 'medium' | 'large'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  leftIcon?: ReactNode
  rightIcon?: ReactNode
  children?: ReactNode
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: 'bg-primary-interactive text-white hover:bg-primary-interactive-hover',
  neutral: 'bg-white text-neutral-text-high hover:bg-neutral-surface border border-neutral-surface-highlight',
  danger: 'bg-danger-interactive text-white hover:bg-red-700',
  ai: 'border border-primary-interactive-hover text-neutral-text-high shadow-ai-focus hover:bg-primary-surface',
}

const sizeStyles: Record<ButtonSize, string> = {
  small: 'px-2 py-1 text-xs gap-1',
  medium: 'px-3 py-1.5 text-sm gap-1.5',
  large: 'px-4 py-2 text-base gap-2',
}

export function Button({
  variant = 'neutral',
  size = 'medium',
  leftIcon,
  rightIcon,
  children,
  className = '',
  ...props
}: ButtonProps) {
  return (
    <button
      className={`
        inline-flex items-center justify-center font-medium rounded-md
        transition-colors duration-150 ease-in-out
        disabled:opacity-50 disabled:cursor-not-allowed
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${className}
      `}
      {...props}
    >
      {leftIcon && <span className="shrink-0">{leftIcon}</span>}
      {children}
      {rightIcon && <span className="shrink-0">{rightIcon}</span>}
    </button>
  )
}

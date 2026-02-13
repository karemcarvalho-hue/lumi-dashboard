import { AnchorHTMLAttributes, ReactNode } from 'react'

type LinkVariant = 'primary' | 'neutral' | 'danger'

interface LinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  variant?: LinkVariant
  children: ReactNode
  underline?: boolean
}

const variantStyles: Record<LinkVariant, string> = {
  primary: 'text-primary-interactive hover:text-primary-interactive-hover',
  neutral: 'text-neutral-text-low hover:text-neutral-text-high',
  danger: 'text-danger-interactive hover:text-red-700',
}

export function Link({ 
  variant = 'primary', 
  underline = false, 
  children, 
  className = '', 
  ...props 
}: LinkProps) {
  return (
    <a
      className={`
        text-sm font-medium cursor-pointer
        transition-colors duration-150
        ${underline ? 'underline' : 'hover:underline'}
        ${variantStyles[variant]}
        ${className}
      `}
      {...props}
    >
      {children}
    </a>
  )
}

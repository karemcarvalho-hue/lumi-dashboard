import { InputHTMLAttributes, ReactNode } from 'react'
import { SearchIcon } from '../Icons'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  leftIcon?: ReactNode
  rightIcon?: ReactNode
  error?: string
}

export function Input({ leftIcon, rightIcon, error, className = '', ...props }: InputProps) {
  return (
    <div className={`relative ${className}`}>
      {leftIcon && (
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-text-low">
          {leftIcon}
        </span>
      )}
      <input
        className={`
          w-full h-9 px-3 py-2
          ${leftIcon ? 'pl-9' : ''}
          ${rightIcon ? 'pr-9' : ''}
          text-sm text-neutral-text-high
          bg-white border rounded-md
          placeholder:text-neutral-text-disabled
          focus:outline-none focus:ring-2 focus:ring-primary-surface focus:border-primary-interactive
          disabled:bg-neutral-surface disabled:cursor-not-allowed
          ${error ? 'border-danger-interactive' : 'border-neutral-surface-highlight'}
        `}
        {...props}
      />
      {rightIcon && (
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-text-low">
          {rightIcon}
        </span>
      )}
      {error && (
        <p className="mt-1 text-xs text-danger-text-low">{error}</p>
      )}
    </div>
  )
}

export function SearchInput({ className = '', ...props }: Omit<InputProps, 'leftIcon'>) {
  return (
    <Input
      leftIcon={<SearchIcon className="w-4 h-4" />}
      placeholder="Buscar"
      className={className}
      {...props}
    />
  )
}

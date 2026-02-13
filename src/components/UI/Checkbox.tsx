import { InputHTMLAttributes } from 'react'

interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string
  indeterminate?: boolean
}

export function Checkbox({ label, indeterminate, className = '', ...props }: CheckboxProps) {
  return (
    <label className={`inline-flex items-center gap-2 cursor-pointer ${className}`}>
      <input
        type="checkbox"
        ref={(el) => {
          if (el) {
            el.indeterminate = indeterminate ?? false
          }
        }}
        className="
          w-4 h-4 
          rounded border-2 border-neutral-surface-highlight
          text-primary-interactive 
          focus:ring-2 focus:ring-primary-surface focus:ring-offset-0
          checked:bg-primary-interactive checked:border-primary-interactive
          cursor-pointer
        "
        {...props}
      />
      {label && (
        <span className="text-sm text-neutral-text-high">{label}</span>
      )}
    </label>
  )
}

import { useState, ReactNode } from 'react'

interface DataCardProps {
  title: string
  subtitle?: string
  children: ReactNode
  footer?: ReactNode
  onOpenFullScreen?: () => void
  defaultExpanded?: boolean
}

// Expand icon (diagonal arrows)
function ExpandFullIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M10 2h4v4M6 14H2v-4M14 2L9 7M2 14l5-5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

// Chevron icon
function ChevronIcon({ className, direction = 'down' }: { className?: string; direction?: 'down' | 'right' }) {
  return (
    <svg 
      className={`${className} transition-transform duration-200 ${direction === 'right' ? '-rotate-90' : ''}`} 
      viewBox="0 0 16 16" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2"
    >
      <path d="M4 6l4 4 4-4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function DataCard({ 
  title, 
  subtitle,
  children, 
  footer,
  onOpenFullScreen,
  defaultExpanded = true 
}: DataCardProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded)

  return (
    <div className="bg-neutral-surface rounded-xl border border-neutral-surface-disabled overflow-hidden">
      {/* Header - clickable to expand/collapse */}
      <button 
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center gap-2 px-3 py-2 hover:bg-neutral-surface-highlight/30 transition-colors text-left"
      >
        <ChevronIcon 
          className="w-4 h-4 text-neutral-text-low flex-shrink-0" 
          direction={isExpanded ? 'down' : 'right'}
        />
        <div className="flex-1 min-w-0">
          <span className="text-sm font-medium text-neutral-text-high">{title}</span>
          {subtitle && !isExpanded && (
            <span className="text-xs text-neutral-text-low ml-2">{subtitle}</span>
          )}
        </div>
        {onOpenFullScreen && (
          <div 
            onClick={(e) => {
              e.stopPropagation()
              onOpenFullScreen()
            }}
            className="p-1 rounded hover:bg-neutral-surface-disabled transition-colors"
            title="Expandir"
          >
            <ExpandFullIcon className="w-3.5 h-3.5 text-neutral-text-low" />
          </div>
        )}
      </button>
      
      {/* Content - animated collapse */}
      <div 
        className={`overflow-hidden transition-all duration-200 ease-in-out ${
          isExpanded ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="bg-white border-t border-neutral-surface-disabled">
          {children}
        </div>
        
        {/* Footer */}
        {footer && (
          <div className="bg-white border-t border-neutral-surface-disabled">
            {footer}
          </div>
        )}
      </div>
    </div>
  )
}

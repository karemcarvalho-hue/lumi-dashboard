import { ReactNode } from 'react'
import {
  ThumbsUpIcon,
  ThumbsDownIcon,
  CopyIcon as NimbusCopyIcon,
  EllipsisIcon,
} from '@nimbus-ds/icons'

interface ChatMessageProps {
  type: 'user' | 'ai'
  children: ReactNode
  timestamp?: string
  showFeedback?: boolean
}

// AI Avatar sparkle - kept as custom SVG for gradient branding
function SparklesIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 12 12" fill="none">
      <path 
        d="M6 0.5L7.2 4.8L11.5 6L7.2 7.2L6 11.5L4.8 7.2L0.5 6L4.8 4.8L6 0.5Z" 
        fill="url(#sparkle-gradient)"
      />
      <path 
        d="M2.5 1.5L2.8 2.7L4 3L2.8 3.3L2.5 4.5L2.2 3.3L1 3L2.2 2.7L2.5 1.5Z" 
        fill="url(#sparkle-gradient)"
      />
      <defs>
        <linearGradient id="sparkle-gradient" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="16%" stopColor="#0050C3" />
          <stop offset="42%" stopColor="#4736B4" />
          <stop offset="83%" stopColor="#D8446E" />
        </linearGradient>
      </defs>
    </svg>
  )
}

export function ChatMessage({ type, children, timestamp, showFeedback = true }: ChatMessageProps) {
  if (type === 'user') {
    return (
      <div className="flex flex-col items-end gap-1">
        <div className="bg-primary-surface rounded-2xl rounded-br-md px-4 py-3 max-w-[85%]">
          <p className="text-sm text-neutral-text-high">{children}</p>
        </div>
        {timestamp && (
          <span className="text-xs text-neutral-text-disabled mr-1">{timestamp}</span>
        )}
      </div>
    )
  }

  return (
    <div className="flex gap-2">
      {/* AI Avatar - Subtle AI gradient with sparkle icon */}
      <div 
        className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
        style={{
          background: 'linear-gradient(72deg, rgba(0, 80, 195, 0.08) 16%, rgba(71, 54, 180, 0.08) 42%, rgba(216, 68, 110, 0.08) 83%)'
        }}
      >
        <SparklesIcon className="w-3 h-3" />
      </div>

      {/* Message content */}
      <div className="flex-1 min-w-0">
        {/* Lumi label */}
        <span className="text-sm font-semibold text-neutral-text-high block mb-1">Lumi</span>
        
        {/* Message content */}
        <div className="text-sm text-neutral-text-high leading-relaxed">
          {children}
        </div>

        {/* Feedback actions - matches Figma design */}
        {showFeedback && (
          <div className="flex items-center gap-4 mt-3">
            {/* Icon buttons group */}
            <div className="flex items-center gap-2">
              <button className="p-1.5 text-neutral-text-low hover:bg-neutral-surface rounded-lg transition-colors">
                <ThumbsUpIcon className="w-4 h-4" />
              </button>
              <button className="p-1.5 text-neutral-text-low hover:bg-neutral-surface rounded-lg transition-colors">
                <ThumbsDownIcon className="w-4 h-4" />
              </button>
              <button className="p-1.5 text-neutral-text-low hover:bg-neutral-surface rounded-lg transition-colors">
                <NimbusCopyIcon className="w-4 h-4" />
              </button>
              <button className="p-1.5 text-neutral-text-low hover:bg-neutral-surface rounded-lg transition-colors">
                <EllipsisIcon className="w-4 h-4" />
              </button>
            </div>
            {/* Timestamp - right aligned */}
            {timestamp && (
              <span className="flex-1 text-xs text-neutral-text-low text-right">{timestamp}</span>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

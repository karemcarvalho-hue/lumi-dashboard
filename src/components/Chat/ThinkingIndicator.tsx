import { useState, useEffect, useRef } from 'react'

export interface ThinkingStep {
  icon: 'sparkle' | 'search' | 'table'
  text: string
}

const DEFAULT_STEPS: ThinkingStep[] = [
  { icon: 'sparkle', text: 'Pensando...' },
  { icon: 'sparkle', text: 'Analisando...' },
  { icon: 'search', text: 'Buscando pedidos...' },
  { icon: 'table', text: 'Criando tabela....' },
]

interface ThinkingIndicatorProps {
  /** Custom steps to cycle through. Defaults to Pensando → Analisando → Buscando pedidos → Criando tabela */
  steps?: ThinkingStep[]
  /** Interval between step changes in ms. Default: 1500 */
  intervalMs?: number
  /** Called when all steps have been shown at least once */
  onComplete?: () => void
  /** If true, keeps cycling after all steps. If false, stays on last step. Default: false */
  loop?: boolean
}

// Sparkle icon (Lumi gradient)
function SparkleLoadingIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none">
      <path
        d="M8 0.5L9.8 5.8L15.5 6.5L11 10.2L12.4 15.5L8 12.5L3.6 15.5L5 10.2L0.5 6.5L6.2 5.8L8 0.5Z"
        fill="url(#thinking-sparkle-grad)"
      />
      <path
        d="M3 1L3.4 2.6L5 3L3.4 3.4L3 5L2.6 3.4L1 3L2.6 2.6L3 1Z"
        fill="url(#thinking-sparkle-grad)"
      />
      <defs>
        <linearGradient id="thinking-sparkle-grad" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="16%" stopColor="#0050C3" />
          <stop offset="42%" stopColor="#4736B4" />
          <stop offset="83%" stopColor="#D8446E" />
        </linearGradient>
      </defs>
    </svg>
  )
}

// Search sparkle icon (magnifying glass with sparkle, used for "Buscando pedidos...")
function SearchSparkleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none">
      <path
        d="M7 1C3.686 1 1 3.686 1 7s2.686 6 6 6c1.52 0 2.912-.567 3.975-1.5L13.5 14l1-1-2.525-2.525A5.972 5.972 0 0013 7c0-3.314-2.686-6-6-6z"
        stroke="url(#thinking-search-grad)"
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M7 4l.5 1.5L9 6l-1.5.5L7 8l-.5-1.5L5 6l1.5-.5L7 4z"
        fill="url(#thinking-search-grad)"
      />
      <defs>
        <linearGradient id="thinking-search-grad" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="16%" stopColor="#0050C3" />
          <stop offset="42%" stopColor="#4736B4" />
          <stop offset="83%" stopColor="#D8446E" />
        </linearGradient>
      </defs>
    </svg>
  )
}

// Table sparkle icon (used for "Criando tabela....")
function TableSparkleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none">
      <rect
        x="1.5"
        y="2.5"
        width="13"
        height="11"
        rx="1.5"
        stroke="url(#thinking-table-grad)"
        strokeWidth="1.25"
      />
      <path d="M1.5 6h13M1.5 10h13M6 6v6.5" stroke="url(#thinking-table-grad)" strokeWidth="1.25" />
      <path
        d="M12 1l.3 1 1 .3-1 .3L12 3.6l-.3-1-1-.3 1-.3L12 1z"
        fill="url(#thinking-table-grad)"
      />
      <defs>
        <linearGradient id="thinking-table-grad" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="16%" stopColor="#0050C3" />
          <stop offset="42%" stopColor="#4736B4" />
          <stop offset="83%" stopColor="#D8446E" />
        </linearGradient>
      </defs>
    </svg>
  )
}

function getStepIcon(icon: ThinkingStep['icon'], className?: string) {
  switch (icon) {
    case 'search':
      return <SearchSparkleIcon className={className} />
    case 'table':
      return <TableSparkleIcon className={className} />
    default:
      return <SparkleLoadingIcon className={className} />
  }
}

export function ThinkingIndicator({
  steps = DEFAULT_STEPS,
  intervalMs = 1500,
  onComplete,
  loop = false,
}: ThinkingIndicatorProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const completeFired = useRef(false)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentStep((prev) => {
        const next = prev + 1
        if (next >= steps.length) {
          if (!completeFired.current) {
            completeFired.current = true
            onComplete?.()
          }
          return loop ? 0 : prev
        }
        return next
      })
    }, intervalMs)

    return () => clearInterval(timer)
  }, [steps.length, intervalMs, onComplete, loop])

  const step = steps[currentStep]

  return (
    <div className="flex items-center gap-2.5">
      {/* Animated avatar circle */}
      <div
        className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 animate-pulse"
        style={{
          background:
            'linear-gradient(72deg, rgba(0, 80, 195, 0.08) 16%, rgba(71, 54, 180, 0.08) 42%, rgba(216, 68, 110, 0.08) 83%)',
        }}
      >
        {getStepIcon(step.icon, 'w-4 h-4')}
      </div>

      {/* Text with fade transition */}
      <span
        key={currentStep}
        className="text-sm text-neutral-text-low animate-fade-in"
        style={{
          animation: 'fadeSlideIn 0.3s ease-out',
        }}
      >
        {step.text}
      </span>

      {/* Inline keyframes */}
      <style>{`
        @keyframes fadeSlideIn {
          from {
            opacity: 0;
            transform: translateY(4px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  )
}

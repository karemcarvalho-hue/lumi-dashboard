import { ReactNode, useRef } from 'react'

interface CardsContainerProps {
  children: ReactNode
}

// Chevron left icon
function ChevronLeftIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M10 4l-4 4 4 4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

// Chevron right icon
function ChevronRightIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M6 4l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function CardsContainer({ children }: CardsContainerProps) {
  const scrollRef = useRef<HTMLDivElement>(null)

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 300
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      })
    }
  }

  return (
    <div className="relative mt-3">
      {/* Scroll buttons */}
      <button
        onClick={() => scroll('left')}
        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 z-10 w-6 h-6 bg-white rounded-full shadow-md flex items-center justify-center text-neutral-text-low hover:text-neutral-text-high transition-colors"
      >
        <ChevronLeftIcon className="w-4 h-4" />
      </button>
      
      <button
        onClick={() => scroll('right')}
        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 z-10 w-6 h-6 bg-white rounded-full shadow-md flex items-center justify-center text-neutral-text-low hover:text-neutral-text-high transition-colors"
      >
        <ChevronRightIcon className="w-4 h-4" />
      </button>

      {/* Scrollable container */}
      <div 
        ref={scrollRef}
        className="flex gap-3 overflow-x-auto scrollbar-hide pb-2 px-1"
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
      >
        {children}
      </div>
    </div>
  )
}

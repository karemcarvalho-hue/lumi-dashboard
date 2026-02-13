import { useState, KeyboardEvent, useRef, useEffect } from 'react'
import { ArrowupIcon, PlusIcon, MicrophoneIcon, StopFilledIcon } from '@nimbus-ds/icons'

interface ChatInputProps {
  onSend: (message: string) => void
  placeholder?: string
  disabled?: boolean
  /** When true, shows the thinking/working state with a stop button instead of the input */
  isThinking?: boolean
  /** Called when the user clicks the stop button during thinking */
  onStop?: () => void
}

export function ChatInput({
  onSend,
  placeholder = 'Peça a Lumi para...',
  disabled,
  isThinking = false,
  onStop,
}: ChatInputProps) {
  const [message, setMessage] = useState('')
  const [isFocused, setIsFocused] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const handleSend = () => {
    if (message.trim() && !disabled) {
      onSend(message.trim())
      setMessage('')
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto'
      }
    }
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  // Auto-grow textarea
  useEffect(() => {
    const textarea = textareaRef.current
    if (textarea) {
      textarea.style.height = 'auto'
      const maxHeight = 160
      textarea.style.height = `${Math.min(textarea.scrollHeight, maxHeight)}px`
    }
  }, [message])

  const hasMessage = message.trim().length > 0

  // Thinking / working state — show action bar with stop button
  if (isThinking) {
    return (
      <div className="bg-white border-t border-moon-light pt-4 pb-8 px-4">
        <div
          className="rounded-lg overflow-hidden bg-white flex items-center justify-between transition-all"
          style={{ border: '1px solid #b0b0b0' }}
        >
          {/* Left: Plus button */}
          <button
            type="button"
            className="flex items-center justify-center p-2 rounded-full text-neutral-text-low hover:bg-neutral-surface transition-colors"
            aria-label="Adicionar"
          >
            <PlusIcon className="w-4 h-4" />
          </button>

          {/* Right: Mic + Stop */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="flex items-center justify-center p-2 rounded-full text-neutral-text-low hover:bg-neutral-surface transition-colors"
              aria-label="Microfone"
            >
              <MicrophoneIcon className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={onStop}
              className="flex items-center justify-center p-2 rounded-full bg-neutral-surface border border-neutral-interactive text-neutral-text-high hover:bg-neutral-surface-disabled transition-colors"
              aria-label="Parar geração"
              title="Parar geração"
            >
              <StopFilledIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white border-t border-moon-light pt-4 pb-8 px-4">
      {/* Chat Input container - matches Figma Input with AI focus ring */}
      <div 
        className="rounded-lg overflow-hidden bg-white transition-all"
        style={{
          border: `1px solid ${isFocused ? '#0050c3' : '#0050c3'}`,
          boxShadow: isFocused ? '0px 0px 0px 3px #e2dcfa' : '0px 0px 0px 3px #e2dcfa',
        }}
      >
        {/* Textarea field with send button */}
        <div className="flex items-start justify-end p-2">
          <textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder={placeholder}
            disabled={disabled}
            rows={1}
            className="
              flex-1 px-1 pt-1 pb-0 resize-none
              text-[14px] leading-[20px] text-neutral-text-high
              placeholder:text-neutral-text-low
              focus:outline-none
              disabled:cursor-not-allowed disabled:opacity-50
              bg-transparent
              min-h-[48px]
            "
          />
        </div>

        {/* Send button - aligned bottom-right */}
        <div className="flex items-center justify-end px-2 pb-2">
          <button
            onClick={handleSend}
            disabled={!hasMessage || disabled}
            className="w-8 h-8 flex items-center justify-center rounded-full transition-all"
            style={{
              background: hasMessage 
                ? 'linear-gradient(17deg, #0050C3 28%, #4629BA 49%, #D8446E 83%)' 
                : '#e7e7e7',
              border: hasMessage ? 'none' : '1px solid #96c1fc',
              color: hasMessage ? 'white' : '#8C8C8C',
              cursor: hasMessage ? 'pointer' : 'not-allowed',
            }}
            title="Enviar"
          >
            <ArrowupIcon className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}

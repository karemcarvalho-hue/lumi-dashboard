import { useState, useRef, useEffect } from 'react'

// ============================================
// Protótipo Visual: 4 Opções de Interação
// ============================================

// Mock data for the table
const mockOrders = Array.from({ length: 12 }, (_, i) => ({
  id: String(10000 - i),
  customer: ['Ana Silva', 'Carlos Souza', 'Maria Santos', 'João Lima', 'Paula Costa', 'Pedro Oliveira'][i % 6],
  total: `R$ ${(Math.floor(Math.random() * 9000) + 100).toFixed(2).replace('.', ',')}`,
  products: `${Math.floor(Math.random() * 15) + 1} unid.`,
  paymentStatus: (['Recebido', 'Pendente', 'Recebido', 'Recebido', 'Pendente'] as const)[i % 5],
  shippingStatus: (['Enviada', 'Por embalar', 'Enviada', 'Por enviar'] as const)[i % 4],
}))

// Chat message type
interface ChatMsg {
  type: 'user' | 'ai'
  text: string
}

// Shared icons
function CloseIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M5 5l10 10M15 5L5 15" strokeLinecap="round" />
    </svg>
  )
}

function DownloadIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M8 2v8m0 0l-3-3m3 3l3-3M3 12v1a1 1 0 001 1h8a1 1 0 001-1v-1" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function SendIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 13V3M8 3l-4 4M8 3l4 4" />
    </svg>
  )
}

function ResizeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 6 20" fill="none">
      <circle cx="2" cy="6" r="1.5" fill="currentColor" />
      <circle cx="2" cy="10" r="1.5" fill="currentColor" />
      <circle cx="2" cy="14" r="1.5" fill="currentColor" />
    </svg>
  )
}

function MinimizeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M4 12l4-4 4 4M4 4h8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function MaximizeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M10 2h4v4M6 14H2v-4M14 2L9 7M2 14l5-5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

// Payment status badge
function PaymentBadge({ status }: { status: string }) {
  const isReceived = status === 'Recebido'
  const isPending = status === 'Pendente'
  return (
    <span className={`inline-flex items-center px-1.5 py-px text-[11px] font-medium rounded-full border whitespace-nowrap ${
      isReceived ? 'bg-success-surface text-success-text-low border-success-surface-highlight' :
      isPending ? 'bg-warning-surface text-warning-text-low border-warning-surface-highlight' :
      'bg-danger-surface text-danger-text-low border-danger-surface-highlight'
    }`}>
      {status}
    </span>
  )
}

// Shipping status badge
function ShippingBadge({ status }: { status: string }) {
  const isShipped = status === 'Enviada'
  return (
    <span className={`inline-flex items-center px-1.5 py-px text-[11px] font-medium rounded-full border whitespace-nowrap ${
      isShipped ? 'bg-success-surface text-success-text-low border-success-surface-highlight' :
      'bg-neutral-surface text-neutral-text-low border-neutral-surface-highlight'
    }`}>
      {status}
    </span>
  )
}

// Mini orders table
function MiniTable({ maxRows = 12, compact = false }: { maxRows?: number; compact?: boolean }) {
  const orders = mockOrders.slice(0, maxRows)
  const cellPad = compact ? 'px-2 py-1.5' : 'px-3 py-2.5'
  const textSize = compact ? 'text-[11px]' : 'text-sm'

  return (
    <div className="w-full overflow-x-auto">
      {/* Header */}
      <div className="flex bg-neutral-surface border-b border-neutral-surface-disabled">
        <div className={`${cellPad} min-w-[60px]`}><span className={`${textSize} font-medium text-neutral-text-high`}>Venda</span></div>
        <div className={`${cellPad} min-w-[100px] flex-1`}><span className={`${textSize} font-medium text-neutral-text-high`}>Cliente</span></div>
        <div className={`${cellPad} min-w-[80px]`}><span className={`${textSize} font-medium text-neutral-text-high`}>Total</span></div>
        <div className={`${cellPad} min-w-[55px]`}><span className={`${textSize} font-medium text-neutral-text-high`}>Produtos</span></div>
        <div className={`${cellPad} min-w-[80px]`}><span className={`${textSize} font-medium text-neutral-text-high`}>Pagamento</span></div>
        <div className={`${cellPad} min-w-[80px]`}><span className={`${textSize} font-medium text-neutral-text-high`}>Envio</span></div>
      </div>
      {/* Rows */}
      {orders.map((o, i) => (
        <div key={o.id} className={`flex border-b border-neutral-surface-disabled ${i % 2 === 1 ? 'bg-neutral-surface/50' : 'bg-white'}`}>
          <div className={`${cellPad} min-w-[60px]`}><span className={`${textSize} text-primary-interactive`}>#{o.id}</span></div>
          <div className={`${cellPad} min-w-[100px] flex-1`}><span className={`${textSize} text-neutral-text-high truncate`}>{o.customer}</span></div>
          <div className={`${cellPad} min-w-[80px]`}><span className={`${textSize} text-neutral-text-high`}>{o.total}</span></div>
          <div className={`${cellPad} min-w-[55px]`}><span className={`${textSize} text-neutral-text-high`}>{o.products}</span></div>
          <div className={`${cellPad} min-w-[80px]`}><PaymentBadge status={o.paymentStatus} /></div>
          <div className={`${cellPad} min-w-[80px]`}><ShippingBadge status={o.shippingStatus} /></div>
        </div>
      ))}
    </div>
  )
}

// Mini chat component
function MiniChat({ messages, onSend, compact = false, className = '' }: { messages: ChatMsg[]; onSend: (msg: string) => void; compact?: boolean; className?: string }) {
  const [input, setInput] = useState('')
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = () => {
    if (input.trim()) {
      onSend(input.trim())
      setInput('')
    }
  }

  return (
    <div className={`flex flex-col bg-white ${className}`}>
      {/* Chat header */}
      <div className="flex items-center justify-center gap-2 px-3 py-2.5 border-b border-neutral-surface-disabled">
        <span className="text-sm font-medium text-neutral-text-high">Lumi</span>
        <span className="px-1.5 py-0.5 text-[10px] font-normal bg-neutral-surface border border-neutral-surface-highlight rounded-full text-neutral-text-high">Beta</span>
      </div>
      {/* Messages */}
      <div className={`flex-1 overflow-y-auto px-3 py-3 space-y-2 ${compact ? 'text-xs' : 'text-sm'}`}>
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.type === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] px-3 py-2 rounded-lg ${
              m.type === 'user'
                ? 'bg-primary-surface text-neutral-text-high'
                : 'bg-neutral-surface text-neutral-text-high'
            }`}>
              {m.text}
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
      {/* Input */}
      <div className="px-3 py-2 border-t border-neutral-surface-disabled">
        <div className="flex items-center gap-2 border border-primary-interactive rounded-lg px-2 py-1.5" style={{ boxShadow: '0px 0px 0px 3px #e2dcfa' }}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Peça a Lumi..."
            className={`flex-1 bg-transparent outline-none ${compact ? 'text-xs' : 'text-sm'} text-neutral-text-high placeholder:text-neutral-text-low`}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim()}
            className="w-6 h-6 rounded-full flex items-center justify-center text-white flex-shrink-0"
            style={{ background: input.trim() ? 'linear-gradient(17deg, #0050C3 28%, #4629BA 49%, #D8446E 83%)' : '#e7e7e7' }}
          >
            <SendIcon className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  )
}


// ============================================
// OPTION 1: Side Panel (Painel lateral)
// ============================================
function Option1SidePanel() {
  const [panelOpen, setPanelOpen] = useState(true)
  const [panelWidth, setPanelWidth] = useState(62) // percentage
  const [messages, setMessages] = useState<ChatMsg[]>([
    { type: 'ai', text: 'Encontrei 847 pedidos pendentes.' },
    { type: 'user', text: 'Filtre apenas os com pagamento pendente' },
    { type: 'ai', text: 'Pronto! Filtrei 124 pedidos com pagamento pendente. A tabela foi atualizada.' },
  ])
  const isDragging = useRef(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const handleMouseDown = () => { isDragging.current = true }

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging.current || !containerRef.current) return
      const rect = containerRef.current.getBoundingClientRect()
      const pct = ((e.clientX - rect.left) / rect.width) * 100
      setPanelWidth(Math.max(25, Math.min(80, 100 - pct)))
    }
    const handleMouseUp = () => { isDragging.current = false }
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleMouseUp)
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [])

  const handleSend = (msg: string) => {
    setMessages((prev) => [
      ...prev,
      { type: 'user', text: msg },
    ])
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { type: 'ai', text: 'Tabela atualizada com as mudanças solicitadas.' },
      ])
    }, 800)
  }

  return (
    <div ref={containerRef} className="flex h-full bg-neutral-surface rounded-lg overflow-hidden border border-neutral-surface-disabled">
      {/* Chat area */}
      <div className="flex-shrink-0 border-r border-neutral-surface-disabled" style={{ width: `${100 - panelWidth}%` }}>
        <MiniChat messages={messages} onSend={handleSend} compact className="h-full" />
      </div>

      {/* Drag handle */}
      {panelOpen && (
        <div
          onMouseDown={handleMouseDown}
          className="w-3 flex-shrink-0 flex items-center justify-center cursor-col-resize hover:bg-primary-surface transition-colors bg-white border-r border-neutral-surface-disabled"
        >
          <ResizeIcon className="w-2 h-5 text-neutral-text-disabled" />
        </div>
      )}

      {/* Table panel */}
      {panelOpen && (
        <div className="flex-1 flex flex-col bg-white min-w-0" style={{ width: `${panelWidth}%` }}>
          {/* Panel header */}
          <div className="flex items-center justify-between px-4 py-2.5 border-b border-neutral-surface-disabled">
            <span className="text-sm font-semibold text-neutral-text-high">847 pedidos</span>
            <div className="flex items-center gap-2">
              <button className="flex items-center gap-1.5 px-2.5 py-1 text-xs text-neutral-text-high border border-neutral-surface-disabled rounded-md hover:bg-neutral-surface">
                <DownloadIcon className="w-3.5 h-3.5" />
                Exportar
              </button>
              <button onClick={() => setPanelOpen(false)} className="p-1 text-neutral-text-low hover:text-neutral-text-high rounded">
                <CloseIcon className="w-4 h-4" />
              </button>
            </div>
          </div>
          {/* Table */}
          <div className="flex-1 overflow-auto">
            <MiniTable maxRows={12} compact />
          </div>
        </div>
      )}

      {/* Collapsed state: button to reopen */}
      {!panelOpen && (
        <div className="flex items-center px-2">
          <button
            onClick={() => setPanelOpen(true)}
            className="p-2 text-neutral-text-low hover:text-neutral-text-high rounded-lg hover:bg-neutral-surface transition"
            title="Abrir tabela"
          >
            <MaximizeIcon className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  )
}


// ============================================
// OPTION 2: Split View (Layout dividido)
// ============================================
function Option2SplitView() {
  const [messages, setMessages] = useState<ChatMsg[]>([
    { type: 'ai', text: 'Encontrei 847 pedidos pendentes.' },
    { type: 'user', text: 'Mostre também o e-mail dos clientes' },
    { type: 'ai', text: 'Pronto! Adicionei a coluna de e-mail à tabela.' },
  ])

  const handleSend = (msg: string) => {
    setMessages((prev) => [
      ...prev,
      { type: 'user', text: msg },
    ])
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { type: 'ai', text: 'Tabela atualizada com as mudanças solicitadas.' },
      ])
    }, 800)
  }

  return (
    <div className="flex flex-col h-full bg-neutral-surface rounded-lg overflow-hidden border border-neutral-surface-disabled">
      {/* Top: Table */}
      <div className="flex-1 flex flex-col bg-white min-h-0">
        {/* Table header */}
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-neutral-surface-disabled flex-shrink-0">
          <span className="text-sm font-semibold text-neutral-text-high">847 pedidos</span>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-1.5 px-2.5 py-1 text-xs text-neutral-text-high border border-neutral-surface-disabled rounded-md hover:bg-neutral-surface">
              <DownloadIcon className="w-3.5 h-3.5" />
              Exportar
            </button>
            <button className="p-1 text-neutral-text-low hover:text-neutral-text-high rounded">
              <CloseIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
        {/* Table content */}
        <div className="flex-1 overflow-auto">
          <MiniTable maxRows={8} compact />
        </div>
      </div>

      {/* Divider */}
      <div className="h-1 bg-neutral-surface-disabled flex-shrink-0" />

      {/* Bottom: Chat */}
      <div className="h-[220px] flex-shrink-0">
        <MiniChat messages={messages} onSend={handleSend} compact className="h-full" />
      </div>
    </div>
  )
}


// ============================================
// OPTION 3: Modal with embedded mini-chat
// ============================================
function Option3ModalWithChat() {
  const [isOpen, setIsOpen] = useState(true)
  const [messages, setMessages] = useState<ChatMsg[]>([
    { type: 'ai', text: 'Tabela de pedidos aberta. O que deseja alterar?' },
  ])

  const handleSend = (msg: string) => {
    setMessages((prev) => [...prev, { type: 'user', text: msg }])
    setTimeout(() => {
      setMessages((prev) => [...prev, { type: 'ai', text: 'Pronto! Tabela atualizada.' }])
    }, 800)
  }

  if (!isOpen) {
    return (
      <div className="h-full flex items-center justify-center bg-neutral-surface rounded-lg border border-neutral-surface-disabled">
        <button
          onClick={() => setIsOpen(true)}
          className="px-4 py-2 text-sm font-medium text-white rounded-lg"
          style={{ background: 'linear-gradient(17deg, #0050C3 28%, #4629BA 49%, #D8446E 83%)' }}
        >
          Abrir modal com tabela
        </button>
      </div>
    )
  }

  return (
    <div className="h-full flex items-center justify-center bg-black/30 rounded-lg overflow-hidden relative">
      {/* Modal */}
      <div className="relative bg-white rounded-lg shadow-xl w-[94%] max-h-[94%] flex flex-col overflow-hidden">
        {/* Modal header */}
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-neutral-surface-disabled flex-shrink-0">
          <span className="text-sm font-semibold text-neutral-text-high">847 pedidos</span>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-1.5 px-2.5 py-1 text-xs text-neutral-text-high border border-neutral-surface-disabled rounded-md hover:bg-neutral-surface">
              <DownloadIcon className="w-3.5 h-3.5" />
              Exportar
            </button>
            <button onClick={() => setIsOpen(false)} className="p-1 text-neutral-text-low hover:text-neutral-text-high rounded">
              <CloseIcon className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="flex-1 overflow-auto min-h-0">
          <MiniTable maxRows={8} compact />
        </div>

        {/* Embedded mini-chat inside modal */}
        <div className="border-t-2 border-primary-surface-highlight bg-primary-surface/30 flex-shrink-0">
          <div className="px-3 pt-2 pb-1">
            <span className="text-[10px] font-medium text-primary-interactive flex items-center gap-1">
              <svg className="w-3 h-3" viewBox="0 0 16 16" fill="none">
                <path d="M8 0.5L9.8 5.8L15.5 6.5L11 10.2L12.4 15.5L8 12.5L3.6 15.5L5 10.2L0.5 6.5L6.2 5.8L8 0.5Z" fill="currentColor" />
              </svg>
              Peça mudanças à Lumi
            </span>
          </div>
          {/* Recent messages preview */}
          <div className="px-3 max-h-[60px] overflow-y-auto space-y-1">
            {messages.slice(-2).map((m, i) => (
              <div key={i} className={`text-[10px] ${m.type === 'user' ? 'text-right text-primary-text-low' : 'text-neutral-text-low'}`}>
                {m.text}
              </div>
            ))}
          </div>
          {/* Input */}
          <div className="px-3 py-2">
            <div className="flex items-center gap-2 border border-primary-interactive rounded-md px-2 py-1" style={{ boxShadow: '0px 0px 0px 2px #e2dcfa' }}>
              <input
                type="text"
                placeholder="Ex: Filtre por pagamento pendente..."
                className="flex-1 bg-transparent outline-none text-xs text-neutral-text-high placeholder:text-neutral-text-low"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && (e.target as HTMLInputElement).value.trim()) {
                    handleSend((e.target as HTMLInputElement).value.trim());
                    (e.target as HTMLInputElement).value = ''
                  }
                }}
              />
              <button className="w-5 h-5 rounded-full flex items-center justify-center text-white flex-shrink-0" style={{ background: 'linear-gradient(17deg, #0050C3 28%, #4629BA 49%, #D8446E 83%)' }}>
                <SendIcon className="w-2.5 h-2.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}


// ============================================
// OPTION 4: Minimizable / PiP
// ============================================
function Option4PiP() {
  const [mode, setMode] = useState<'full' | 'pip' | 'closed'>('full')
  const [messages, setMessages] = useState<ChatMsg[]>([
    { type: 'ai', text: 'Encontrei 847 pedidos pendentes.' },
    { type: 'user', text: 'Filtre por pagamento pendente' },
    { type: 'ai', text: 'Pronto! 124 pedidos filtrados.' },
  ])

  const handleSend = (msg: string) => {
    setMessages((prev) => [...prev, { type: 'user', text: msg }])
    setTimeout(() => {
      setMessages((prev) => [...prev, { type: 'ai', text: 'Tabela atualizada.' }])
    }, 800)
  }

  return (
    <div className="h-full flex bg-neutral-surface rounded-lg overflow-hidden border border-neutral-surface-disabled relative">
      {/* Chat (full area when PiP or closed) */}
      <div className={`flex-1 ${mode === 'full' ? 'hidden' : ''}`}>
        <MiniChat messages={messages} onSend={handleSend} compact className="h-full" />
      </div>

      {/* Full table modal */}
      {mode === 'full' && (
        <div className="absolute inset-0 bg-black/30 flex items-center justify-center z-10">
          <div className="bg-white rounded-lg shadow-xl w-[94%] max-h-[94%] flex flex-col overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-neutral-surface-disabled flex-shrink-0">
              <span className="text-sm font-semibold text-neutral-text-high">847 pedidos</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setMode('pip')}
                  className="flex items-center gap-1 px-2 py-1 text-xs text-neutral-text-high border border-neutral-surface-disabled rounded-md hover:bg-neutral-surface"
                  title="Minimizar para PiP"
                >
                  <MinimizeIcon className="w-3.5 h-3.5" />
                  Minimizar
                </button>
                <button className="flex items-center gap-1.5 px-2.5 py-1 text-xs text-neutral-text-high border border-neutral-surface-disabled rounded-md hover:bg-neutral-surface">
                  <DownloadIcon className="w-3.5 h-3.5" />
                  Exportar
                </button>
                <button onClick={() => setMode('closed')} className="p-1 text-neutral-text-low hover:text-neutral-text-high rounded">
                  <CloseIcon className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-auto">
              <MiniTable maxRows={10} compact />
            </div>
          </div>
        </div>
      )}

      {/* PiP floating thumbnail */}
      {mode === 'pip' && (
        <div
          onClick={() => setMode('full')}
          className="absolute bottom-3 right-3 w-[180px] bg-white rounded-lg shadow-lg border border-neutral-surface-disabled cursor-pointer hover:shadow-xl transition-shadow z-20 overflow-hidden"
        >
          {/* PiP header */}
          <div className="flex items-center justify-between px-2 py-1.5 bg-neutral-surface border-b border-neutral-surface-disabled">
            <span className="text-[9px] font-medium text-neutral-text-high">Pedidos</span>
            <div className="flex items-center gap-1">
              <button
                onClick={(e) => { e.stopPropagation(); setMode('full') }}
                className="p-0.5 text-neutral-text-low hover:text-neutral-text-high rounded"
                title="Expandir"
              >
                <MaximizeIcon className="w-3 h-3" />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); setMode('closed') }}
                className="p-0.5 text-neutral-text-low hover:text-neutral-text-high rounded"
              >
                <CloseIcon className="w-3 h-3" />
              </button>
            </div>
          </div>
          {/* Tiny table preview */}
          <div className="p-1.5 space-y-0.5 max-h-[80px] overflow-hidden">
            {mockOrders.slice(0, 4).map((o) => (
              <div key={o.id} className="flex items-center gap-1 text-[7px] text-neutral-text-low">
                <span className="text-primary-interactive">#{o.id}</span>
                <span className="flex-1 truncate">{o.customer}</span>
                <span>{o.total}</span>
              </div>
            ))}
            <div className="text-[7px] text-neutral-text-disabled text-center">
              Clique para expandir
            </div>
          </div>
        </div>
      )}

      {/* Closed: button to reopen */}
      {mode === 'closed' && (
        <div className="absolute bottom-3 right-3 z-20">
          <button
            onClick={() => setMode('full')}
            className="px-3 py-1.5 text-[10px] font-medium text-white rounded-full shadow-lg"
            style={{ background: 'linear-gradient(17deg, #0050C3 28%, #4629BA 49%, #D8446E 83%)' }}
          >
            Ver tabela
          </button>
        </div>
      )}
    </div>
  )
}


// ============================================
// Main Prototype Component
// ============================================
export function PrototipoInteracao() {
  const [activeOption, setActiveOption] = useState(1)

  const options = [
    {
      id: 1,
      title: 'Painel Lateral',
      subtitle: 'Side Panel',
      description: 'A tabela abre como painel ao lado do chat. Ambos ficam visíveis e o painel é redimensionável.',
      pros: ['Chat sempre acessível', 'Tabela atualiza em tempo real', 'Padrão consolidado (Notion, Linear)'],
      cons: ['Precisa de tela larga'],
      recommended: true,
    },
    {
      id: 2,
      title: 'Layout Dividido',
      subtitle: 'Split View',
      description: 'Tela dividida horizontalmente: tabela em cima, chat embaixo. Ambas as áreas sempre visíveis.',
      pros: ['Ambas áreas com espaço dedicado', 'Simples de entender'],
      cons: ['Ambas áreas ficam apertadas', 'Menos espaço para a tabela'],
      recommended: false,
    },
    {
      id: 3,
      title: 'Modal + Mini Chat',
      subtitle: 'Embedded Chat',
      description: 'Mantém o modal atual, mas adiciona um campo de chat integrado na parte inferior do modal.',
      pros: ['Mudança mínima no design atual', 'Contexto claro: chat se refere à tabela'],
      cons: ['Perde histórico completo do chat', 'Dois inputs de chat podem confundir'],
      recommended: false,
    },
    {
      id: 4,
      title: 'PiP (Picture-in-Picture)',
      subtitle: 'Minimizable Modal',
      description: 'O modal pode ser minimizado para um thumbnail flutuante. O usuário volta ao chat e expande quando precisa.',
      pros: ['Tabela acessível como referência rápida', 'Chat livre para interação'],
      cons: ['Mais complexo de implementar', 'Thumbnail tem pouca utilidade (dados pequenos)'],
      recommended: false,
    },
  ]

  const current = options.find((o) => o.id === activeOption)!

  return (
    <div className="h-screen flex flex-col bg-neutral-background overflow-hidden">
      {/* Top bar */}
      <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-neutral-surface-disabled flex-shrink-0">
        <div>
          <h1 className="text-lg font-semibold text-neutral-text-high">Protótipo de Interação</h1>
          <p className="text-xs text-neutral-text-low mt-0.5">4 opções para visualizar a tabela sem bloquear o chat</p>
        </div>
        {/* Option tabs */}
        <div className="flex items-center gap-1 bg-neutral-surface rounded-lg p-1">
          {options.map((opt) => (
            <button
              key={opt.id}
              onClick={() => setActiveOption(opt.id)}
              className={`relative px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                activeOption === opt.id
                  ? 'bg-white text-neutral-text-high shadow-sm'
                  : 'text-neutral-text-low hover:text-neutral-text-high'
              }`}
            >
              {opt.recommended && (
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-success-interactive rounded-full" />
              )}
              {opt.id}. {opt.title}
            </button>
          ))}
        </div>
      </div>

      {/* Content area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left: Interactive preview */}
        <div className="flex-1 p-4 overflow-hidden">
          <div className="h-full rounded-xl overflow-hidden shadow-lg">
            {activeOption === 1 && <Option1SidePanel />}
            {activeOption === 2 && <Option2SplitView />}
            {activeOption === 3 && <Option3ModalWithChat />}
            {activeOption === 4 && <Option4PiP />}
          </div>
        </div>

        {/* Right: Description */}
        <div className="w-[300px] flex-shrink-0 bg-white border-l border-neutral-surface-disabled p-5 overflow-y-auto">
          <div className="space-y-4">
            {/* Title */}
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-semibold text-neutral-text-high">{current.title}</h2>
                {current.recommended && (
                  <span className="px-2 py-0.5 text-[10px] font-medium bg-success-surface text-success-text-low border border-success-surface-highlight rounded-full">
                    Recomendada
                  </span>
                )}
              </div>
              <p className="text-xs text-neutral-text-low mt-0.5">{current.subtitle}</p>
            </div>

            {/* Description */}
            <p className="text-sm text-neutral-text-high leading-relaxed">{current.description}</p>

            {/* Pros */}
            <div>
              <h3 className="text-xs font-semibold text-success-text-low mb-1.5">Vantagens</h3>
              <ul className="space-y-1">
                {current.pros.map((pro, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-neutral-text-high">
                    <span className="text-success-interactive mt-0.5 flex-shrink-0">
                      <svg className="w-3 h-3" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M3 8l4 4 6-6" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                    {pro}
                  </li>
                ))}
              </ul>
            </div>

            {/* Cons */}
            <div>
              <h3 className="text-xs font-semibold text-danger-text-low mb-1.5">Desvantagens</h3>
              <ul className="space-y-1">
                {current.cons.map((con, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-neutral-text-high">
                    <span className="text-danger-interactive mt-0.5 flex-shrink-0">
                      <svg className="w-3 h-3" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M4 4l8 8M12 4L4 12" strokeLinecap="round" />
                      </svg>
                    </span>
                    {con}
                  </li>
                ))}
              </ul>
            </div>

            {/* Interaction hints */}
            <div className="pt-3 border-t border-neutral-surface-disabled">
              <h3 className="text-xs font-semibold text-neutral-text-high mb-2">Experimente</h3>
              <div className="space-y-1.5 text-[11px] text-neutral-text-low">
                {activeOption === 1 && (
                  <>
                    <p>- Arraste a borda entre chat e tabela para redimensionar</p>
                    <p>- Digite no chat para simular iterações</p>
                    <p>- Feche e reabra o painel</p>
                  </>
                )}
                {activeOption === 2 && (
                  <>
                    <p>- O chat fica sempre visível na parte inferior</p>
                    <p>- Digite para simular alterações na tabela</p>
                  </>
                )}
                {activeOption === 3 && (
                  <>
                    <p>- Veja o mini-chat integrado dentro do modal</p>
                    <p>- Digite uma solicitação no campo do modal</p>
                    <p>- Feche e reabra o modal</p>
                  </>
                )}
                {activeOption === 4 && (
                  <>
                    <p>- Clique "Minimizar" para ver o modo PiP</p>
                    <p>- No modo PiP, clique no thumbnail para expandir</p>
                    <p>- Feche completamente e reabra</p>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

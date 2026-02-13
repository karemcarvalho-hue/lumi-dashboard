import { useState, useRef, useEffect, useCallback } from 'react'
import { ExecutableAction, OrderItem as OrderItemType, getAvailableActions, actionConfigs, SuggestedAction } from './types'
import { InlineConfirmation } from './ActionConfirmation'
import { getSuggestedActionsForContext } from './SuggestedActions'
import { useExport } from '../../hooks/useExport'
import {
  CloseIcon as NimbusCloseIcon,
  EllipsisIcon,
  CheckIcon as NimbusCheckIcon,
  BoxPackedIcon,
  BoxUnpackedIcon,
  RepeatIcon,
  CashIcon as NimbusCashIcon,
  TruckIcon as NimbusTruckIcon,
  ChevronRightIcon,
  ChevronDownIcon as NimbusChevronDownIcon,
  DownloadIcon as NimbusDownloadIcon,
  InfoCircleIcon,
  ArrowsDiagonalOutIcon,
} from '@nimbus-ds/icons'
// ExportProgress / ExportJobConfig removed – modal now delegates export to parent card

/**
 * Play a magical, shimmery "Lumi" notification sound when the export is ready.
 * Layered design: warm pad + sparkle cascade + rising sweep + bell resolution.
 * Uses the Web Audio API — no external audio files needed.
 */
function playExportReadySound(): void {
  try {
    const AudioCtx = window.AudioContext ?? (window as unknown as Record<string, typeof AudioContext>).webkitAudioContext
    if (!AudioCtx) return

    const ctx = new AudioCtx()
    const now = ctx.currentTime

    // Master volume — keep it gentle
    const master = ctx.createGain()
    master.gain.value = 0.14
    master.connect(ctx.destination)

    // Helper: create a single note with smooth envelope
    const note = (
      freq: number,
      start: number,
      dur: number,
      vol: number,
      type: OscillatorType = 'sine',
      detune = 0,
    ) => {
      const osc = ctx.createOscillator()
      const g = ctx.createGain()
      osc.type = type
      osc.frequency.value = freq
      osc.detune.value = detune
      g.gain.setValueAtTime(0, now + start)
      g.gain.linearRampToValueAtTime(vol, now + start + 0.02)
      g.gain.exponentialRampToValueAtTime(0.001, now + start + dur)
      osc.connect(g)
      g.connect(master)
      osc.start(now + start)
      osc.stop(now + start + dur + 0.01)
    }

    // --- Layer 1: Warm ethereal pad (chorus via detuning) --- //
    // C5-E5-G5 major chord with ±6 cent detune for a shimmery chorus
    const padFreqs = [523.25, 659.25, 783.99]
    for (const f of padFreqs) {
      note(f, 0, 0.9, 0.22, 'sine', 0)
      note(f, 0, 0.9, 0.12, 'sine', 7)
      note(f, 0, 0.9, 0.12, 'sine', -7)
    }

    // --- Layer 2: Rising sparkle cascade (fairy dust) --- //
    const sparkles = [
      { f: 1046.50, t: 0.00 },  // C6
      { f: 1318.51, t: 0.05 },  // E6
      { f: 1567.98, t: 0.10 },  // G6
      { f: 2093.00, t: 0.16 },  // C7
      { f: 2637.02, t: 0.22 },  // E7
      { f: 3135.96, t: 0.28 },  // G7
    ]
    for (const s of sparkles) {
      note(s.f, s.t, 0.35, 0.10, 'sine')
      note(s.f * 2, s.t + 0.01, 0.20, 0.03, 'sine') // high harmonic overtone
    }

    // --- Layer 3: Magical rising sweep (shimmer whoosh) --- //
    const sweep = ctx.createOscillator()
    const sweepGain = ctx.createGain()
    sweep.type = 'triangle'
    sweep.frequency.setValueAtTime(600, now)
    sweep.frequency.exponentialRampToValueAtTime(3000, now + 0.35)
    sweepGain.gain.setValueAtTime(0, now)
    sweepGain.gain.linearRampToValueAtTime(0.06, now + 0.08)
    sweepGain.gain.exponentialRampToValueAtTime(0.001, now + 0.45)
    sweep.connect(sweepGain)
    sweepGain.connect(master)
    sweep.start(now)
    sweep.stop(now + 0.5)

    // --- Layer 4: Final bell resolution (the "ding" of completion) --- //
    note(1046.50, 0.30, 0.6, 0.16, 'triangle')       // C6 bell tone
    note(1046.50, 0.30, 0.6, 0.08, 'sine', 4)         // shimmer detune

    // Close the audio context after all sounds finish
    setTimeout(() => {
      ctx.close().catch(() => { /* ignore */ })
    }, 1500)
  } catch {
    // Silently ignore — sound is a nice-to-have, not critical
  }
}

interface OrderItem {
  id: string
  date: string
  time: string
  customer: string
  email: string
  phone: string
  total: string
  products: string
  payment: {
    status: 'received' | 'pending' | 'refused'
    method: string
  }
  shipping: {
    status: 'to_pack' | 'to_ship' | 'shipped' | 'archived' | 'cancelled'
    carrier: string
  }
}

interface OrdersTableProps {
  orders?: OrderItem[]
  onApplyFilter?: () => void
  onUndo?: () => void
  totalOrders?: number
  isFullscreen?: boolean
  /** Colunas exibidas na tabela; quando omitido usa o padrão. Definido pela Lumi conforme o usuário pede (ex.: e-mail, telefone). */
  visibleColumns?: OrderTableColumnId[]
  onOrderAction?: (action: ExecutableAction, orderIds: string[]) => void
  onNavigateToOrder?: (orderId: string) => void
  onSuggestedAction?: (actionId: string) => void
  showSuggestedActions?: boolean
  context?: 'orders_to_pack' | 'pending_payments' | 'sales_stats' | 'single_order' | 'action_complete'
  /** When false, hides the "Aplicar"/"Desfazer" button (e.g. when custom columns are shown). Defaults to true. */
  showApplyButton?: boolean
}

// Nimbus icon wrappers with local aliases for backward-compatible references
function CloseIcon({ className }: { className?: string }) {
  return <NimbusCloseIcon className={className} />
}

function MoreIcon({ className }: { className?: string }) {
  return <EllipsisIcon className={className} />
}

function CheckIcon({ className }: { className?: string }) {
  return <NimbusCheckIcon className={className} />
}

function PackageIcon({ className }: { className?: string }) {
  return <BoxPackedIcon className={className} />
}

function UnpackIcon({ className }: { className?: string }) {
  return <BoxUnpackedIcon className={className} />
}

function ReopenIcon({ className }: { className?: string }) {
  return <RepeatIcon className={className} />
}

// Payment status colors
const paymentStatusConfig = {
  received: { bg: 'bg-success-surface', text: 'text-success-text-low', border: 'border-success-surface-highlight', label: 'Recebido' },
  pending: { bg: 'bg-warning-surface', text: 'text-warning-text-low', border: 'border-warning-surface-highlight', label: 'Pendente' },
  refused: { bg: 'bg-danger-surface', text: 'text-danger-text-low', border: 'border-danger-surface-highlight', label: 'Recusado' },
}

// Shipping status colors
const shippingStatusConfig: Record<string, { bg: string; text: string; border: string; label: string }> = {
  to_pack: { bg: 'bg-neutral-surface', text: 'text-neutral-text-low', border: 'border-neutral-surface-highlight', label: 'Por embalar' },
  to_ship: { bg: 'bg-neutral-surface', text: 'text-neutral-text-low', border: 'border-neutral-surface-highlight', label: 'Por enviar' },
  shipped: { bg: 'bg-success-surface', text: 'text-success-text-low', border: 'border-success-surface-highlight', label: 'Enviada' },
  archived: { bg: 'bg-neutral-surface', text: 'text-neutral-text-low', border: 'border-neutral-surface-highlight', label: 'Arquivado' },
  cancelled: { bg: 'bg-danger-surface', text: 'text-danger-text-low', border: 'border-danger-surface-highlight', label: 'Cancelado' },
}

// Customer data: name, email, phone (dados do cliente em Orders)
const CUSTOMER_DATA: { name: string; email: string; phone: string }[] = [
  { name: 'Ana Silva', email: 'ana.silva@email.com', phone: '(11) 98765-4321' },
  { name: 'Carlos Souza', email: 'carlos.souza@email.com', phone: '(21) 99876-5432' },
  { name: 'Maria Santos', email: 'maria.santos@email.com', phone: '(31) 97654-3210' },
  { name: 'João Lima', email: 'joao.lima@email.com', phone: '(41) 96543-2109' },
  { name: 'Paula Costa', email: 'paula.costa@email.com', phone: '(51) 95432-1098' },
  { name: 'Pedro Oliveira', email: 'pedro.oliveira@email.com', phone: '(61) 94321-0987' },
  { name: 'Lucia Ferreira', email: 'lucia.ferreira@email.com', phone: '(71) 93210-9876' },
  { name: 'Bruno Alves', email: 'bruno.alves@email.com', phone: '(81) 92109-8765' },
  { name: 'Carla Mendes', email: 'carla.mendes@email.com', phone: '(11) 91098-7654' },
  { name: 'Rafael Gomes', email: 'rafael.gomes@email.com', phone: '(21) 90987-6543' },
  { name: 'Fernando Costa', email: 'fernando.costa@email.com', phone: '(31) 89876-5432' },
  { name: 'Juliana Martins', email: 'juliana.martins@email.com', phone: '(41) 88765-4321' },
  { name: 'Ricardo Nunes', email: 'ricardo.nunes@email.com', phone: '(51) 87654-3210' },
  { name: 'Amanda Ribeiro', email: 'amanda.ribeiro@email.com', phone: '(61) 86543-2109' },
  { name: 'Thiago Pereira', email: 'thiago.pereira@email.com', phone: '(71) 85432-1098' },
]

// Generate 1000 mock orders
function generateAllOrders(): OrderItem[] {
  const carriers = ['Correios SEDEX', 'Correios PAC', 'Jadlog', 'Total Express', 'Azul Cargo', 'Loggi', 'Melhor Envio']
  const paymentMethods = ['Cartão de Crédito', 'Pix', 'Boleto', 'Cartão de Débito', 'PayPal', 'Mercado Pago']
  const paymentStatuses: ('received' | 'pending' | 'refused')[] = ['received', 'received', 'received', 'pending', 'refused']
  const shippingStatuses: ('to_pack' | 'to_ship' | 'shipped')[] = ['to_pack', 'to_pack', 'to_ship', 'shipped']
  const months = ['jan', 'fev']

  return Array.from({ length: 1000 }, (_, i) => {
    const customer = CUSTOMER_DATA[Math.floor(Math.random() * CUSTOMER_DATA.length)]
    const month = months[Math.floor(Math.random() * months.length)]
    const day = String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')
    const hour = String(Math.floor(Math.random() * 24)).padStart(2, '0')
    const minute = String(Math.floor(Math.random() * 60)).padStart(2, '0')
    return {
      id: String(10000 - i),
      date: `${day} ${month}`,
      time: `${hour}:${minute}`,
      customer: customer.name,
      email: customer.email,
      phone: customer.phone,
      total: `R$ ${(Math.floor(Math.random() * 9000) + 100).toFixed(2).replace('.', ',')}`,
      products: `${Math.floor(Math.random() * 15) + 1} unid.`,
      payment: {
        status: paymentStatuses[Math.floor(Math.random() * paymentStatuses.length)],
        method: paymentMethods[Math.floor(Math.random() * paymentMethods.length)],
      },
      shipping: {
        status: shippingStatuses[Math.floor(Math.random() * shippingStatuses.length)],
        carrier: carriers[Math.floor(Math.random() * carriers.length)],
      },
    }
  })
}

// Cached orders to maintain consistency
const allOrders = generateAllOrders()

// Export allOrders for use in other components
export { allOrders }

// ============================================
// Dynamic Table Column System
// ============================================

// All available column ids
export const ORDER_TABLE_COLUMN_IDS = [
  'venda',
  'date',
  'time',
  'customer',
  'email',
  'phone',
  'total',
  'products',
  'payment',
  'paymentMethod',
  'shipping',
  'shippingCarrier',
  'actions',
] as const

export type OrderTableColumnId = (typeof ORDER_TABLE_COLUMN_IDS)[number]

const ORDER_TABLE_COLUMNS: Record<OrderTableColumnId, { label: string; minWidth: number; grow: number }> = {
  venda: { label: 'Venda', minWidth: 56, grow: 1 },
  date: { label: 'Data', minWidth: 50, grow: 1 },
  time: { label: 'Hora', minWidth: 44, grow: 1 },
  customer: { label: 'Cliente', minWidth: 80, grow: 2 },
  email: { label: 'E-mail', minWidth: 130, grow: 2 },
  phone: { label: 'Telefone', minWidth: 100, grow: 1.5 },
  total: { label: 'Total', minWidth: 72, grow: 1.5 },
  products: { label: 'Produtos', minWidth: 54, grow: 1 },
  payment: { label: 'Pagamento', minWidth: 90, grow: 2 },
  paymentMethod: { label: 'Forma de pagamento', minWidth: 100, grow: 1.5 },
  shipping: { label: 'Envio', minWidth: 90, grow: 2 },
  shippingCarrier: { label: 'Transportadora', minWidth: 100, grow: 1.5 },
  actions: { label: 'Ações', minWidth: 36, grow: 0 },
}

// Semantic grouping: each column belongs to a parent group.
// Extra columns appear right after their parent column.
export const COLUMN_GROUP: Record<OrderTableColumnId, OrderTableColumnId | null> = {
  venda: null,
  date: 'venda',
  time: 'venda',
  customer: null,
  email: 'customer',
  phone: 'customer',
  total: null,
  products: null,
  payment: null,
  paymentMethod: 'payment',
  shipping: null,
  shippingCarrier: 'shipping',
  actions: null,
}

const DEFAULT_VISIBLE_COLUMNS: OrderTableColumnId[] = [
  'venda',
  'customer',
  'total',
  'products',
  'payment',
  'shipping',
]

export { DEFAULT_VISIBLE_COLUMNS }

/**
 * Build the ordered column list, inserting extra columns right after their
 * semantic parent. `venda` is always included (structural).
 *
 * @param base - base columns (defaults or user-chosen subset)
 * @param extras - additional columns the user asked for
 */
export function buildOrderedColumns(
  base: OrderTableColumnId[],
  extras: OrderTableColumnId[] = [],
): OrderTableColumnId[] {
  const wanted = new Set<OrderTableColumnId>([...base, ...extras])
  // Always keep structural columns
  wanted.add('venda')

  // Start from the base order, inserting children right after their parent
  const result: OrderTableColumnId[] = []

  for (const col of base) {
    if (!wanted.has(col)) continue
    result.push(col)
    // Find children of this column that were requested
    const children = ORDER_TABLE_COLUMN_IDS.filter(
      (id) => COLUMN_GROUP[id] === col && wanted.has(id) && !result.includes(id),
    )
    result.push(...children)
  }

  // Any remaining requested columns not yet placed (e.g. new top-level columns)
  for (const col of ORDER_TABLE_COLUMN_IDS) {
    if (wanted.has(col) && !result.includes(col)) {
      result.push(col)
    }
  }

  return result
}

// Render a single cell by column id
function OrderTableCell({
  columnId,
  order,
  onOrderAction,
  onNavigateToOrder,
}: {
  columnId: OrderTableColumnId
  order: OrderItem
  onOrderAction?: (action: ExecutableAction, orderIds: string[]) => void
  onNavigateToOrder?: (orderId: string) => void
}) {
  switch (columnId) {
    case 'venda':
      return (
        <span
          className="text-sm text-primary-interactive cursor-pointer hover:underline whitespace-nowrap"
          onClick={() => onNavigateToOrder?.(order.id)}
        >
          #{order.id}
        </span>
      )
    case 'date':
      return <span className="text-sm text-neutral-text-high whitespace-nowrap">{order.date}</span>
    case 'time':
      return <span className="text-sm text-neutral-text-high whitespace-nowrap">{order.time}</span>
    case 'customer':
      return (
        <span className="text-sm text-neutral-text-high truncate whitespace-nowrap">
          {order.customer}
        </span>
      )
    case 'email':
      return (
        <span className="text-sm text-neutral-text-high truncate whitespace-nowrap" title={order.email}>
          {order.email}
        </span>
      )
    case 'phone':
      return (
        <span className="text-sm text-neutral-text-high whitespace-nowrap">
          {order.phone}
        </span>
      )
    case 'total':
      return <span className="text-sm text-neutral-text-high whitespace-nowrap">{order.total}</span>
    case 'products':
      return (
        <span className="text-sm text-neutral-text-high whitespace-nowrap">
          {order.products}
        </span>
      )
    case 'payment':
      return (
        <div className="flex flex-col justify-center gap-0.5 min-w-0 overflow-hidden">
          <StatusTag status={order.payment.status} type="payment" />
          <span className="text-[10px] text-neutral-text-low truncate">
            {order.payment.method}
          </span>
        </div>
      )
    case 'paymentMethod':
      return (
        <span className="text-xs text-neutral-text-low truncate whitespace-nowrap">
          {order.payment.method}
        </span>
      )
    case 'shipping':
      return (
        <div className="flex flex-col justify-center gap-0.5 min-w-0 overflow-hidden">
          <StatusTag status={order.shipping.status} type="shipping" />
          <span className="text-[10px] text-neutral-text-low truncate">
            {order.shipping.carrier}
          </span>
        </div>
      )
    case 'shippingCarrier':
      return (
        <span className="text-xs text-neutral-text-low truncate whitespace-nowrap">
          {order.shipping.carrier}
        </span>
      )
    case 'actions':
      return (
        <OrderActionMenu
          order={order}
          onAction={(action) => onOrderAction?.(action, [order.id])}
          onNavigate={() => onNavigateToOrder?.(order.id)}
        />
      )
    default:
      return null
  }
}

// Status Tag component
function StatusTag({ 
  status, 
  type 
}: { 
  status: string
  type: 'payment' | 'shipping' 
}) {
  const config = type === 'payment' 
    ? paymentStatusConfig[status as keyof typeof paymentStatusConfig]
    : shippingStatusConfig[status] || { bg: 'bg-neutral-surface', text: 'text-neutral-text-low', border: 'border-neutral-surface-highlight', label: status }
  
  return (
    <span className={`inline-flex items-center w-fit px-1.5 py-px text-[11px] leading-4 font-medium border rounded-full whitespace-nowrap ${config.bg} ${config.text} ${config.border}`}>
      {config.label}
    </span>
  )
}

// Action menu item config
const actionMenuConfig: Record<ExecutableAction, { label: string; Icon: typeof CheckIcon }> = {
  mark_payment_received: { label: 'Marcar pagamento recebido', Icon: CheckIcon },
  mark_packed: { label: 'Marcar como empaquetado', Icon: PackageIcon },
  unpack: { label: 'Desempaquetar', Icon: UnpackIcon },
  reopen_order: { label: 'Reabrir pedido', Icon: ReopenIcon },
}

// Order Action Menu component
function OrderActionMenu({ 
  order, 
  onAction,
  onNavigate
}: { 
  order: OrderItem
  onAction: (action: ExecutableAction) => void
  onNavigate: () => void
}) {
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  // Convert to OrderItemType for getAvailableActions
  const orderForActions: OrderItemType = {
    ...order,
    shipping: {
      ...order.shipping,
      status: order.shipping.status as OrderItemType['shipping']['status']
    }
  }
  const availableActions = getAvailableActions(orderForActions)

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={(e) => {
          e.stopPropagation()
          setIsOpen(!isOpen)
        }}
        className="p-1 rounded hover:bg-neutral-surface-disabled transition-colors"
      >
        <MoreIcon className="w-4 h-4 text-neutral-text-low" />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-1 z-50 bg-white rounded-lg shadow-lg border border-neutral-surface-disabled py-1 min-w-[180px]">
          {/* Navigate to order */}
          <button
            onClick={() => {
              onNavigate()
              setIsOpen(false)
            }}
            className="w-full px-3 py-2 text-left text-sm text-neutral-text-high hover:bg-neutral-surface flex items-center gap-2"
          >
            <ChevronRightIcon className="w-4 h-4" />
            Abrir pedido
          </button>

          {availableActions.length > 0 && (
            <div className="border-t border-neutral-surface-disabled my-1" />
          )}

          {/* Available actions */}
          {availableActions.map((action) => {
            const config = actionMenuConfig[action]
            const Icon = config.Icon
            return (
              <button
                key={action}
                onClick={() => {
                  onAction(action)
                  setIsOpen(false)
                }}
                className="w-full px-3 py-2 text-left text-sm text-neutral-text-high hover:bg-neutral-surface flex items-center gap-2"
              >
                <Icon className="w-4 h-4" />
                {config.label}
              </button>
            )
          })}

          {availableActions.length === 0 && (
            <div className="px-3 py-2 text-xs text-neutral-text-low">
              Nenhuma ação disponível
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// AI sparkle icon for tag
function AISparkleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="currentColor">
      <path d="M8 1l1.5 4.5L14 7l-4.5 1.5L8 13l-1.5-4.5L2 7l4.5-1.5L8 1z" />
      <path d="M12 10l.75 2.25L15 13l-2.25.75L12 16l-.75-2.25L9 13l2.25-.75L12 10z" opacity="0.7" />
    </svg>
  )
}

// Modal component for expanded table (dynamic columns)
function OrdersModal({ 
  isOpen, 
  onClose, 
  totalOrders,
  visibleColumns,
  onNavigateToOrder,
  onExportAndClose,
}: { 
  isOpen: boolean
  onClose: () => void
  totalOrders: number
  visibleColumns: OrderTableColumnId[]
  onOrderAction?: (action: ExecutableAction, orderIds: string[]) => void
  onNavigateToOrder?: (orderId: string) => void
  /** Called when user clicks "Exportar" inside the modal — parent handles the export + card collapse. */
  onExportAndClose?: () => void
}) {
  const modalRef = useRef<HTMLDivElement>(null)

  // Close on backdrop click
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      onClose()
    }
  }

  if (!isOpen) return null

  // Modal-specific columns (no actions column in modal view)
  const modalColumns = visibleColumns.filter(c => c !== 'actions')

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={handleBackdropClick}
    >
      <div 
        ref={modalRef}
        className="relative bg-white rounded-lg shadow-xl w-[95vw] max-w-[1240px] max-h-[82vh] flex flex-col"
        style={{ minHeight: '400px' }}
      >
        {/* Close button - top right */}
        <button 
          onClick={onClose}
          className="absolute top-3 right-3 z-10 p-2 text-neutral-text-low hover:text-neutral-text-high rounded-md transition-colors"
          aria-label="Fechar"
        >
          <CloseIcon className="w-4 h-4" />
        </button>

        {/* Modal content area */}
        <div className="flex flex-col flex-1 overflow-hidden px-4 pt-4 pb-4 gap-4">
          {/* Header: Title + AI Tag */}
          <div className="flex items-center gap-2 pr-12">
            <h2 className="text-xl font-semibold text-neutral-text-high leading-6">Pedidos</h2>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full border border-[#0050C3] text-xs text-neutral-text-high"
              style={{ backgroundColor: 'var(--ai-generative-surface, #f8f7fd)' }}
            >
              <AISparkleIcon className="w-4 h-4 text-[#0050C3]" />
              AI
            </span>
          </div>

          {/* Table area */}
          <div className="flex-1 overflow-hidden flex flex-col min-h-0">
            {/* Table header */}
            <div className="flex border-b border-neutral-surface bg-neutral-surface rounded-t">
              {modalColumns.map((id) => (
                <div
                  key={id}
                  className={`py-2 px-2 flex items-center ${id === 'venda' ? 'w-[160px] flex-shrink-0' : 'flex-1'}`}
                >
                  <span className="text-xs font-medium text-neutral-text-low">
                    {ORDER_TABLE_COLUMNS[id].label}
                  </span>
                </div>
              ))}
            </div>

            {/* Table body - scrollable */}
            <div className="flex-1 overflow-y-auto overflow-x-auto">
              {allOrders.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center border-b border-neutral-surface bg-white hover:bg-neutral-surface/30 transition-colors"
                  style={{ minHeight: '36px' }}
                >
                  {modalColumns.map((columnId) => (
                    <div
                      key={columnId}
                      className={`py-2 px-2 flex items-center overflow-hidden ${columnId === 'venda' ? 'w-[160px] flex-shrink-0' : 'flex-1'}`}
                    >
                      <ModalTableCell
                        columnId={columnId}
                        order={order}
                        onNavigateToOrder={onNavigateToOrder}
                      />
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* Footer buttons */}
          <div className="flex items-center justify-end gap-2 pt-0">
            <button
              onClick={onClose}
              className="px-3 py-1.5 text-sm font-medium text-neutral-text-high bg-neutral-surface border border-neutral-interactive rounded-lg hover:bg-neutral-surface-disabled transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={onExportAndClose}
              className="px-3 py-1.5 text-sm font-medium text-white bg-primary-interactive rounded-lg hover:bg-primary-interactive-hover transition-colors flex items-center gap-2"
            >
              <CardDownloadIcon className="w-4 h-4" />
              Exportar
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// Modal-specific cell renderer (no actions, simplified display matching Figma)
function ModalTableCell({
  columnId,
  order,
  onNavigateToOrder,
}: {
  columnId: OrderTableColumnId
  order: OrderItem
  onNavigateToOrder?: (orderId: string) => void
}) {
  switch (columnId) {
    case 'venda':
      return (
        <span
          className="text-sm text-primary-interactive cursor-pointer hover:underline whitespace-nowrap"
          onClick={() => onNavigateToOrder?.(order.id)}
        >
          #{order.id}
        </span>
      )
    case 'customer':
      return (
        <span className="text-sm text-neutral-text-high truncate whitespace-nowrap">
          {order.customer}
        </span>
      )
    case 'total':
      return <span className="text-sm text-neutral-text-high whitespace-nowrap">{order.total}</span>
    case 'products':
      return (
        <span className="text-sm text-primary-interactive whitespace-nowrap">
          {order.products}
        </span>
      )
    case 'payment':
      return <ModalStatusTag status={order.payment.status} type="payment" />
    case 'shipping':
      return <ModalStatusTag status={order.shipping.status} type="shipping" />
    case 'email':
      return (
        <span className="text-sm text-neutral-text-high truncate whitespace-nowrap" title={order.email}>
          {order.email}
        </span>
      )
    case 'phone':
      return (
        <span className="text-sm text-neutral-text-high whitespace-nowrap">
          {order.phone}
        </span>
      )
    case 'date':
      return <span className="text-sm text-neutral-text-high whitespace-nowrap">{order.date}</span>
    case 'time':
      return <span className="text-sm text-neutral-text-high whitespace-nowrap">{order.time}</span>
    case 'paymentMethod':
      return (
        <span className="text-sm text-neutral-text-low truncate whitespace-nowrap">
          {order.payment.method}
        </span>
      )
    case 'shippingCarrier':
      return (
        <span className="text-sm text-neutral-text-low truncate whitespace-nowrap">
          {order.shipping.carrier}
        </span>
      )
    default:
      return null
  }
}

// Payment icon for modal tags - using Nimbus CashIcon
function PaymentIcon({ className }: { className?: string }) {
  return <NimbusCashIcon className={className} />
}

// Truck icon for modal shipping tags - using Nimbus TruckIcon
function TruckIcon({ className }: { className?: string }) {
  return <NimbusTruckIcon className={className} />
}

// Status tag for modal (with icon, matching Figma design)
function ModalStatusTag({ status, type }: { status: string; type: 'payment' | 'shipping' }) {
  const config = type === 'payment' 
    ? paymentStatusConfig[status as keyof typeof paymentStatusConfig]
    : shippingStatusConfig[status] || { bg: 'bg-neutral-surface', text: 'text-neutral-text-low', border: 'border-neutral-surface-highlight', label: status }
  
  const Icon = type === 'payment' ? PaymentIcon : TruckIcon
  
  return (
    <span className={`inline-flex items-center gap-1 w-fit px-2 py-0.5 text-xs leading-4 font-normal border rounded-full whitespace-nowrap ${config.bg} ${config.text} ${config.border}`}>
      <Icon className="w-4 h-4" />
      {config.label}
    </span>
  )
}

// Compact table content for the card (dynamic columns)
function OrdersTableContent({ 
  isExpanded, 
  isFullscreen = false, 
  totalOrders = 1000,
  visibleColumns,
  onOrderAction,
  onNavigateToOrder
}: { 
  isExpanded: boolean
  isFullscreen?: boolean
  totalOrders?: number
  visibleColumns: OrderTableColumnId[]
  onOrderAction?: (action: ExecutableAction, orderIds: string[]) => void
  onNavigateToOrder?: (orderId: string) => void
}) {
  const maxInCard = 50
  const visibleOrders = isFullscreen 
    ? allOrders 
    : isExpanded 
      ? allOrders.slice(0, maxInCard) 
      : allOrders.slice(0, 5)

  const totalMinWidth = visibleColumns.reduce((sum, id) => sum + ORDER_TABLE_COLUMNS[id].minWidth, 0)

  const renderHeader = () => (
    <div className="flex bg-neutral-surface border-b border-neutral-surface">
      {visibleColumns.map((id) => {
        const col = ORDER_TABLE_COLUMNS[id]
        return (
          <div
            key={id}
            className="px-2 py-2 flex items-center min-w-0"
            style={{ flex: `${col.grow} 1 ${col.minWidth}px`, minWidth: col.minWidth }}
          >
            <span className="text-xs font-medium text-neutral-text-high truncate">
              {col.label}
            </span>
          </div>
        )
      })}
    </div>
  )

  const rowHeightClass = isFullscreen ? 'h-[48px]' : 'h-[44px]'
  const renderRow = (order: OrderItem, index: number) => (
    <div
      key={order.id}
      className={`flex ${rowHeightClass} ${index % 2 === 1 ? 'bg-neutral-surface' : 'bg-white'}`}
    >
      {visibleColumns.map((columnId) => {
        const col = ORDER_TABLE_COLUMNS[columnId]
        return (
          <div
            key={columnId}
            className="px-2 flex items-center overflow-hidden min-w-0"
            style={{ flex: `${col.grow} 1 ${col.minWidth}px`, minWidth: col.minWidth }}
          >
            <OrderTableCell
              columnId={columnId}
              order={order}
              onOrderAction={onOrderAction}
              onNavigateToOrder={onNavigateToOrder}
            />
          </div>
        )
      })}
    </div>
  )

  // Fullscreen mode
  if (isFullscreen) {
    return (
      <div className="w-full">
        {renderHeader()}
        <div>
          {visibleOrders.map((order, index) => renderRow(order, index))}
        </div>
      </div>
    )
  }

  // Normal mode: horizontal scroll only when needed
  return (
    <div 
      className="overflow-x-auto overflow-y-hidden"
      style={{ WebkitOverflowScrolling: 'touch' }}
    >
      <div style={{ minWidth: totalMinWidth }}>
        {renderHeader()}
        <div>
          {visibleOrders.map((order, index) => renderRow(order, index))}
        </div>
      </div>
    </div>
  )
}

// Chevron icon for expand button
function ChevronDownIcon({ className }: { className?: string }) {
  return <NimbusChevronDownIcon className={className} />
}

// Small download icon for card header
function CardDownloadIcon({ className }: { className?: string }) {
  return <NimbusDownloadIcon className={className} />
}

// Spinner for card header export button
function CardSpinnerIcon({ className }: { className?: string }) {
  return (
    <svg className={`animate-spin ${className ?? ''}`} viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="2" opacity="0.25" />
      <path d="M14 8a6 6 0 00-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

export function OrdersTable({ 
  onApplyFilter, 
  onUndo, 
  totalOrders = 1000, 
  isFullscreen = false,
  visibleColumns,
  onOrderAction,
  onNavigateToOrder,
  onSuggestedAction,
  showSuggestedActions = false,
  context = 'orders_to_pack',
  showApplyButton = true
}: OrdersTableProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isCardCollapsed, setIsCardCollapsed] = useState(true)
  const [isRowsExpanded, setIsRowsExpanded] = useState(false)
  const [isApplied, setIsApplied] = useState(false)
  const [isApplying, setIsApplying] = useState(false)
  const [pendingBulkAction, setPendingBulkAction] = useState<{ action: ExecutableAction; orderIds: string[] } | null>(null)
  const [cardExportError, setCardExportError] = useState<string | null>(null)
  const effectiveColumns = visibleColumns ?? DEFAULT_VISIBLE_COLUMNS

  // Export hook for the card-level export button
  const {
    jobs: exportJobs,
    canExport: canStartExport,
    startExport,
    downloadExport: triggerDownload,
    cancelExport: triggerCancel,
  } = useExport()

  // Find in-flight export job for orders (only active ones – not completed/failed)
  const cardExportJob = exportJobs.find(
    (j) =>
      j.config.entityType === 'orders' &&
      (j.status === 'validating' || j.status === 'queued' || j.status === 'processing'),
  ) ?? null

  // Track which job IDs we've already auto-downloaded so we don't re-trigger
  const downloadedJobIds = useRef<Set<string>>(new Set())

  // Auto-download the CSV file when an orders export job completes
  useEffect(() => {
    const completedJob = exportJobs.find(
      (j) =>
        j.config.entityType === 'orders' &&
        j.status === 'completed' &&
        j.downloadUrl &&
        !downloadedJobIds.current.has(j.id),
    )
    if (completedJob) {
      downloadedJobIds.current.add(completedJob.id)
      playExportReadySound()
      triggerDownload(completedJob.id)
    }
  }, [exportJobs, triggerDownload])

  // Handle export from card header
  const handleCardExport = useCallback(() => {
    setCardExportError(null)
    try {
      const columnsForExport = effectiveColumns.filter((c) => c !== 'actions')
      startExport({
        entityType: 'orders',
        columns: columnsForExport,
        totalRecords: totalOrders,
        format: 'csv',
      })
    } catch (err) {
      setCardExportError(err instanceof Error ? err.message : 'Erro ao exportar')
    }
  }, [effectiveColumns, totalOrders, startExport])

  // Clear error after 4 seconds
  useEffect(() => {
    if (cardExportError) {
      const timer = setTimeout(() => setCardExportError(null), 4000)
      return () => clearTimeout(timer)
    }
  }, [cardExportError])

  // Get suggested actions based on context - only if explicitly enabled
  const suggestedActions: SuggestedAction[] = showSuggestedActions 
    ? getSuggestedActionsForContext(context, totalOrders)
    : []

  const handleButtonClick = () => {
    if (isApplied) {
      // Undo action - call the undo callback
      if (onUndo) {
        onUndo()
      }
      setIsApplied(false)
    } else if (!isApplying) {
      // Start applying - show loading state
      setIsApplying(true)
      // Simulate a brief loading delay before applying the filter
      setTimeout(() => {
        if (onApplyFilter) {
          onApplyFilter()
        }
        setIsApplying(false)
        setIsApplied(true)
      }, 1500)
    }
  }

  // Handle bulk action with confirmation
  const handleBulkAction = (action: ExecutableAction) => {
    const visibleOrderIds = allOrders.slice(0, isRowsExpanded ? 50 : 5).map(o => o.id)
    setPendingBulkAction({ action, orderIds: visibleOrderIds })
  }

  // Confirm bulk action
  const handleConfirmBulkAction = () => {
    if (pendingBulkAction && onOrderAction) {
      onOrderAction(pendingBulkAction.action, pendingBulkAction.orderIds)
    }
    setPendingBulkAction(null)
  }

  // Cancel bulk action
  const handleCancelBulkAction = () => {
    setPendingBulkAction(null)
  }

  // Handle suggested action
  const handleSuggestedAction = (actionId: string) => {
    // Handle bulk actions from suggestions
    if (actionId === 'mark_all_packed') {
      handleBulkAction('mark_packed')
    } else if (actionId === 'mark_payments_received') {
      handleBulkAction('mark_payment_received')
    } else if (onSuggestedAction) {
      onSuggestedAction(actionId)
    }
  }

  return (
    <>
      {/* Card container - overflow-visible so tooltips are not clipped */}
      <div className="relative bg-white rounded-lg shadow-[0_0_2px_rgba(136,136,136,0.5)]">
        {/* Header - clickable to collapse/expand card */}
        <button 
          onClick={() => setIsCardCollapsed(!isCardCollapsed)}
          className="w-full flex items-center gap-2 px-2.5 py-2.5 hover:bg-neutral-surface/50 transition-colors text-left rounded-t-lg"
        >
          <ChevronDownIcon 
            className={`w-4 h-4 text-neutral-text-low flex-shrink-0 transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] ${isCardCollapsed ? '-rotate-90' : ''}`} 
          />
          <span className="text-sm font-semibold text-neutral-text-high">Pedidos</span>
          {/* Info icon with tooltip - only shown for large datasets (>1000 orders) */}
          {totalOrders > 1000 && (
            <div className="relative group/info">
              <div
                onClick={(e) => e.stopPropagation()}
                className="p-0.5 text-neutral-text-low cursor-help"
              >
                <InfoCircleIcon className="w-3.5 h-3.5" />
              </div>
              {/* Dark tooltip */}
              <div className="absolute left-1/2 -translate-x-1/2 top-full mt-1.5 px-3 py-2 bg-neutral-text-high text-white text-xs rounded-lg shadow-lg opacity-0 invisible group-hover/info:opacity-100 group-hover/info:visible transition-all duration-150 whitespace-nowrap z-50 pointer-events-none max-w-[200px] text-center" style={{ whiteSpace: 'normal' }}>
                Baixe ou visualize no modo expandido para ver a tabela completa.
                {/* Tooltip arrow */}
                <div className="absolute left-1/2 -translate-x-1/2 -top-1 w-2 h-2 bg-neutral-text-high rotate-45" />
              </div>
            </div>
          )}
          <span className="flex-1" />
          <span
            className={`text-xs text-neutral-text-low transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] ${
              isCardCollapsed
                ? 'opacity-100 max-w-[120px] ml-0'
                : 'opacity-0 max-w-0 overflow-hidden'
            }`}
          >
            {totalOrders.toLocaleString('pt-BR')} itens
          </span>
          {/* Export button in card header — collapses card automatically on click */}
          <div className="relative group/export">
            <div
              onClick={(e) => {
                e.stopPropagation()
                if (cardExportJob?.status === 'processing' || cardExportJob?.status === 'queued') {
                  triggerCancel(cardExportJob.id)
                } else {
                  handleCardExport()
                  // Auto-collapse the card when starting an export (per Figma spec)
                  setIsCardCollapsed(true)
                }
              }}
              className={`p-1 rounded transition-colors ${
                cardExportJob?.status === 'processing' || cardExportJob?.status === 'queued'
                  ? 'text-primary-interactive'
                  : 'hover:bg-neutral-surface-disabled text-neutral-text-low'
              }`}
            >
              {cardExportJob?.status === 'processing' || cardExportJob?.status === 'queued' || cardExportJob?.status === 'validating' ? (
                <CardSpinnerIcon className="w-4 h-4" />
              ) : (
                <CardDownloadIcon className="w-4 h-4" />
              )}
            </div>
            {/* Minimal tooltip for export status */}
            <div className="absolute left-1/2 -translate-x-1/2 top-full mt-1.5 px-2 py-1 bg-neutral-text-high text-white text-[11px] rounded-md shadow-lg opacity-0 invisible group-hover/export:opacity-100 group-hover/export:visible transition-all duration-150 z-50 pointer-events-none whitespace-nowrap">
              {(cardExportJob?.status === 'processing' || cardExportJob?.status === 'queued' || cardExportJob?.status === 'validating')
                ? 'Exportando...'
                : 'Exportar'}
            </div>
          </div>
          {/* Expand button — opens the full modal */}
          <div className="relative group/expand">
            <div
              onClick={(e) => {
                e.stopPropagation()
                setIsModalOpen(true)
              }}
              className="p-1 rounded hover:bg-neutral-surface-disabled transition-colors"
            >
              <ArrowsDiagonalOutIcon className="w-4 h-4 text-neutral-text-low" />
            </div>
            <div className="absolute left-1/2 -translate-x-1/2 top-full mt-1.5 px-2 py-1 bg-neutral-text-high text-white text-[11px] rounded-md shadow-lg opacity-0 invisible group-hover/expand:opacity-100 group-hover/expand:visible transition-all duration-150 z-50 pointer-events-none whitespace-nowrap">
              Expandir
            </div>
          </div>
        </button>
        {/* Card export error tooltip */}
        {cardExportError && (
          <div className="px-2.5 py-1.5 bg-danger-surface border-b border-danger-surface-highlight">
            <p className="text-xs text-danger-text-low">{cardExportError}</p>
          </div>
        )}

        {/* "Ver mais" button visible when card is collapsed — only way to expand */}
        {isCardCollapsed && (
          <div className="flex items-center px-2.5 py-2 border-t border-neutral-surface-disabled bg-white rounded-b-lg">
            <button
              onClick={() => setIsCardCollapsed(false)}
              className="flex items-center gap-1 py-1 text-xs text-neutral-text-low hover:text-neutral-text-high transition-colors"
            >
              <span>Ver mais</span>
              <ChevronDownIcon className="w-3 h-3" />
            </button>
          </div>
        )}

        {/* Collapsible content – CSS grid trick for smooth auto-height animation */}
        <div
          className={`grid transition-[grid-template-rows] duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] ${
            isCardCollapsed ? 'grid-rows-[0fr]' : 'grid-rows-[1fr]'
          }`}
        >
          <div
            className={`overflow-hidden transition-opacity duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] ${
              isCardCollapsed ? 'opacity-0' : 'opacity-100 delay-75'
            }`}
          >
            {/* Table Content - no vertical scroll, expands with "Ver mais" */}
            <OrdersTableContent 
              isExpanded={isRowsExpanded} 
              isFullscreen={isFullscreen} 
              totalOrders={totalOrders}
              visibleColumns={effectiveColumns}
              onOrderAction={onOrderAction}
              onNavigateToOrder={onNavigateToOrder}
            />

            {/* Pending bulk action confirmation */}
            {pendingBulkAction && (
              <div className="px-2.5 py-2">
                <InlineConfirmation
                  message={`${actionConfigs[pendingBulkAction.action].impact} Essa ação será aplicada a ${pendingBulkAction.orderIds.length} pedidos.`}
                  onConfirm={handleConfirmBulkAction}
                  onCancel={handleCancelBulkAction}
                />
              </div>
            )}

            {/* Footer with expand and filter buttons */}
            {isFullscreen ? (
              /* Fullscreen: same row layout */
              <div className={`flex items-center ${showApplyButton ? 'justify-between' : 'justify-start'} px-2.5 py-2 border-t border-neutral-surface-disabled bg-white`}>
                <button
                  onClick={() => setIsRowsExpanded(!isRowsExpanded)}
                  className="flex items-center gap-1 py-1 text-xs text-neutral-text-low hover:text-neutral-text-high transition-colors"
                >
                  <span>{isRowsExpanded ? 'Ver menos' : 'Ver mais'}</span>
                  <ChevronDownIcon className={`w-3 h-3 transition-transform duration-200 ${isRowsExpanded ? 'rotate-180' : ''}`} />
                </button>
                
                {showApplyButton && (
                  <button
                    onClick={handleButtonClick}
                    disabled={isApplying}
                    className={`py-1.5 px-4 text-sm font-medium rounded-md transition-all flex items-center justify-center gap-2 ${
                      isApplied 
                        ? 'bg-neutral-surface border border-neutral-surface-disabled text-neutral-text-high hover:bg-neutral-surface-disabled' 
                        : isApplying
                          ? 'bg-neutral-surface border border-neutral-surface-disabled text-neutral-text-high cursor-wait'
                          : 'text-white hover:opacity-90'
                    }`}
                    style={!isApplied && !isApplying ? {
                      background: 'linear-gradient(46deg, #0050C3 28%, #4629BA 49%, #D8446E 83%)'
                    } : undefined}
                  >
                    {isApplying && (
                      <svg className="w-4 h-4 animate-spin" viewBox="0 0 16 16" fill="none">
                        <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="2" opacity="0.25" />
                        <path d="M14 8a6 6 0 00-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                      </svg>
                    )}
                    {isApplied ? 'Desfazer' : 'Aplicar'}
                  </button>
                )}
              </div>
            ) : (
              /* Normal sidebar: stacked layout matching Figma design */
              <div className="flex flex-col items-center gap-2.5 px-2.5 py-2.5 border-t border-neutral-surface-disabled bg-white rounded-b-xl">
                {/* Ver mais / Ver menos - centered */}
                <button
                  onClick={() => setIsRowsExpanded(!isRowsExpanded)}
                  className="flex items-center gap-1 py-0.5 text-xs text-neutral-text-low hover:text-neutral-text-high transition-colors"
                >
                  <span>{isRowsExpanded ? 'Ver menos' : 'Ver mais'}</span>
                  <ChevronDownIcon className={`w-4 h-4 transition-transform duration-200 ${isRowsExpanded ? 'rotate-180' : ''}`} />
                </button>
                
                {/* Aplicar / Desfazer - full width */}
                {showApplyButton && (
                  <button
                    onClick={handleButtonClick}
                    disabled={isApplying}
                    className={`w-full py-1.5 px-3 text-sm font-medium rounded-lg transition-all flex items-center justify-center gap-2 ${
                      isApplied 
                        ? 'bg-neutral-surface border border-neutral-surface-disabled text-neutral-text-high hover:bg-neutral-surface-disabled' 
                        : isApplying
                          ? 'bg-neutral-surface border border-neutral-surface-disabled text-neutral-text-high cursor-wait'
                          : 'text-white hover:opacity-90'
                    }`}
                    style={!isApplied && !isApplying ? {
                      background: 'linear-gradient(46deg, #0050C3 28%, #4629BA 49%, #D8446E 83%)'
                    } : undefined}
                  >
                    {isApplying && (
                      <svg className="w-4 h-4 animate-spin" viewBox="0 0 16 16" fill="none">
                        <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="2" opacity="0.25" />
                        <path d="M14 8a6 6 0 00-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                      </svg>
                    )}
                    {isApplied ? 'Desfazer' : 'Aplicar'}
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Expanded Modal */}
      <OrdersModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        totalOrders={totalOrders}
        visibleColumns={effectiveColumns}
        onOrderAction={onOrderAction}
        onNavigateToOrder={onNavigateToOrder}
        onExportAndClose={() => {
          // 1. Close modal
          setIsModalOpen(false)
          // 2. Start the export (reuses the card-level export)
          handleCardExport()
          // 3. Collapse the card to show the loading spinner
          setIsCardCollapsed(true)
        }}
      />
    </>
  )
}

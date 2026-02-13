import { useState, useEffect, useRef, useCallback } from 'react'
import { ChatMessage } from './ChatMessage'
import { ChatInput } from './ChatInput'
import { OrdersTable, allOrders, DEFAULT_VISIBLE_COLUMNS, buildOrderedColumns, type OrderTableColumnId } from './OrdersTable'
import { StatsCard, StatsFilter, ChartData, generateMockStats } from './StatsCard'
import { ProductCard, ProductData, generateMockProduct } from './ProductCard'
import { InlineConfirmation } from './ActionConfirmation'
import { SuggestedActions } from './SuggestedActions'
import { ThinkingIndicator, type ThinkingStep } from './ThinkingIndicator'
import { 
  ExecutableAction, 
  GuidedAction, 
  PendingAction, 
  GuidanceResponse,
  SuggestedAction,
  guidanceResponses,
  actionConfigs,
} from './types'
import { useExport } from '../../hooks/useExport'
import {
  ArrowsDiagonalOutIcon,
  ArrowsDiagonalInIcon,
  CloseIcon as NimbusCloseIcon,
  HistoryIcon,
  PencilIcon,
  DownloadIcon,
  CheckCircleIcon,
} from '@nimbus-ds/icons'


export interface FilteredOrder {
  id: string
  customer: string
  email: string
  phone: string
}

interface LumiChatProps {
  onClose: () => void
  onApplyFilter?: (orderIds: string[]) => void
  onUndoFilter?: () => void
  onApplyStatsFilter?: (filters: StatsFilter[]) => void
  onUndoStatsFilter?: () => void
  onApplyProduct?: (product: ProductData) => void
  onUndoProduct?: () => void
  isFullscreen?: boolean
  onToggleFullscreen?: () => void
  // New action callbacks
  onOrderAction?: (action: ExecutableAction, orderIds: string[]) => void
  onNavigateToOrder?: (orderId: string) => void
}

// Expand / Collapse uses Nimbus diagonal arrow icons (v1.17.0)
function ExpandIcon({ className }: { className?: string }) {
  return <ArrowsDiagonalOutIcon className={className} />
}

function CollapseIcon({ className }: { className?: string }) {
  return <ArrowsDiagonalInIcon className={className} />
}

interface Message {
  id: string
  type: 'user' | 'ai'
  content: string
  bulletPoints?: string[]
  question?: string
  orders?: FilteredOrder[]
  stats?: ChartData[]
  product?: ProductData
  showApplyFilter?: boolean
  showStatsFilter?: boolean
  showProductCard?: boolean
  timestamp?: string
  hasImage?: boolean
  // New properties for advanced features
  pendingAction?: PendingAction
  suggestedActions?: SuggestedAction[]
  guidance?: GuidanceResponse
  salesContext?: 'paid_orders' | 'all_orders' | 'pending_orders'
  ordersContext?: 'orders_to_pack' | 'pending_payments' | 'sales_stats' | 'single_order' | 'action_complete' | 'all_orders' | 'not_shipped'
  actionCompleted?: { action: ExecutableAction; orderCount: number }
  /** Colunas da tabela de pedidos quando o usuário pede dados extras (ex.: e-mail, telefone). */
  orderColumns?: OrderTableColumnId[]
  /** Job ID for export messages – links the message to an ExportJob. */
  exportJobId?: string
  /** When set, shows a ThinkingIndicator that cycles through these steps before the response content. */
  thinkingSteps?: ThinkingStep[]
  /** If true, the thinking animation is still running. */
  isThinking?: boolean
  /** Optional follow-up text rendered after the card. */
  followUpText?: string
  /** Actual count of filtered orders for this response (used by OrdersTable totalOrders). */
  totalOrders?: number
}

const initialMessages: Message[] = [
  {
    id: '1',
    type: 'ai',
    content: 'Olá! Sou o Lumi, seu assistente. Como posso ajudar você hoje?',
    timestamp: '11:52',
    suggestedActions: [
      { id: 'quick_export', label: 'Exportar pedidos em CSV', icon: 'navigate', variant: 'primary' },
      { id: 'quick_orders', label: 'Ver pedidos pendentes', icon: 'navigate', variant: 'neutral' },
      { id: 'quick_stats', label: 'Ver estatísticas', icon: 'navigate', variant: 'neutral' },
    ],
  },
]

// ============================================
// Intent Detection Functions
// ============================================

// Helper function to detect statistics-related queries
function isStatisticsQuery(content: string): boolean {
  const statsKeywords = [
    'estatística', 'estatísticas', 'estatistica', 'estatisticas',
    'gráfico', 'gráficos', 'grafico', 'graficos',
    'análise', 'analise', 'análises', 'analises',
    'relatório', 'relatorio', 'relatórios', 'relatorios',
    'desempenho', 'performance',
    'vendas por', 'total de vendas', 'faturamento',
    'métricas', 'metricas', 'indicadores',
    'comparativo', 'evolução', 'evolucao',
    'taxa de', 'percentual', 'porcentagem',
    'resumo de vendas', 'dashboard', 'painel',
    'quanto vendi', 'quanto faturei', 'como estão as vendas',
    'como estao as vendas', 'números', 'numeros'
  ]
  
  const lowerContent = content.toLowerCase()
  return statsKeywords.some(keyword => lowerContent.includes(keyword))
}

// Helper function to detect product creation queries
function isProductQuery(content: string): boolean {
  const productKeywords = [
    'criar produto', 'novo produto', 'adicionar produto', 'cadastrar produto',
    'criar um produto', 'quero criar', 'quero adicionar', 'quero cadastrar',
    'produto novo', 'cadastro de produto', 'cadastrar um produto',
    'adicione esse produto', 'crie esse produto', 'cadastre esse produto',
    'foto do produto', 'imagem do produto', 'foto de produto',
    'analise essa foto', 'analise essa imagem', 'analise este produto',
    'esse produto', 'este produto', 'crie a partir', 'criar a partir',
    'cadastrar a partir', 'preencher produto', 'preencha os campos',
    'extraia os dados', 'extrair dados', 'reconhecer produto'
  ]
  
  const lowerContent = content.toLowerCase()
  return productKeywords.some(keyword => lowerContent.includes(keyword))
}

// Helper function to detect image attachment (simulated)
function hasImageAttachment(content: string): boolean {
  // In a real app, this would check for actual image attachments
  // For now, we simulate by detecting certain phrases
  const imageIndicators = [
    '[imagem]', '[foto]', '[image]', '[photo]',
    'enviei uma foto', 'enviei uma imagem', 'segue a foto',
    'segue a imagem', 'aqui está a foto', 'aqui está a imagem',
    'olha essa foto', 'olha essa imagem', 'veja essa foto',
    'veja essa imagem', 'essa é a foto', 'essa é a imagem'
  ]
  
  const lowerContent = content.toLowerCase()
  return imageIndicators.some(indicator => lowerContent.includes(indicator))
}

// NEW: Detect sales-related queries (vendas = paid orders)
function isSalesQuery(content: string): boolean {
  const salesKeywords = [
    'vendas', 'venda', 'vendeu', 'vendi',
    'faturamento', 'faturei', 'faturou',
    'quanto vendi', 'quantas vendas', 'total vendido',
    'minhas vendas', 'vendas do mês', 'vendas da semana',
    'vendas de hoje', 'vendas deste mês', 'vendas dessa semana',
    'quanto ganhei', 'quanto lucrei', 'receita'
  ]
  
  const lowerContent = content.toLowerCase()
  return salesKeywords.some(keyword => lowerContent.includes(keyword))
}

// NEW: Detect action requests (executable actions)
function isActionQuery(content: string): { isAction: boolean; action?: ExecutableAction; orderIds?: string[] } {
  const lowerContent = content.toLowerCase()
  
  // Mark payment as received
  const paymentKeywords = [
    'marcar pagamento', 'marcar como pago', 'confirmar pagamento',
    'pagamento recebido', 'marcar pago', 'confirmar pago',
    'receber pagamento', 'dar baixa no pagamento'
  ]
  if (paymentKeywords.some(k => lowerContent.includes(k))) {
    return { isAction: true, action: 'mark_payment_received' }
  }
  
  // Mark as packed
  const packKeywords = [
    'marcar como empaquetado', 'marcar empaquetado', 'embalar pedido',
    'marcar como embalado', 'embalar esses', 'empaquetado',
    'empaquetados', 'marcar embalado', 'embalar todos',
    'marcar esses como empaquetados', 'marcar esses pedidos como empaquetados'
  ]
  if (packKeywords.some(k => lowerContent.includes(k))) {
    return { isAction: true, action: 'mark_packed' }
  }
  
  // Unpack
  const unpackKeywords = [
    'desembalar', 'desempaquetar', 'tirar da embalagem',
    'voltar para embalar', 'desfazer embalagem'
  ]
  if (unpackKeywords.some(k => lowerContent.includes(k))) {
    return { isAction: true, action: 'unpack' }
  }
  
  // Reopen order
  const reopenKeywords = [
    'reabrir pedido', 'reabrir', 'abrir novamente',
    'desarquivar', 'tirar do arquivo', 'restaurar pedido'
  ]
  if (reopenKeywords.some(k => lowerContent.includes(k))) {
    return { isAction: true, action: 'reopen_order' }
  }
  
  return { isAction: false }
}

// NEW: Detect unsupported action requests (guided actions)
function isUnsupportedActionQuery(content: string): { isUnsupported: boolean; action?: GuidedAction } {
  const lowerContent = content.toLowerCase()
  
  // Cancel order
  const cancelKeywords = [
    'cancelar pedido', 'cancela esse pedido', 'cancelar esse',
    'cancele', 'quero cancelar', 'cancelamento'
  ]
  if (cancelKeywords.some(k => lowerContent.includes(k))) {
    return { isUnsupported: true, action: 'cancel_order' }
  }
  
  // Refund
  const refundKeywords = [
    'reembolsar', 'reembolso', 'devolver dinheiro',
    'estornar', 'estorno', 'devolver pagamento'
  ]
  if (refundKeywords.some(k => lowerContent.includes(k))) {
    return { isUnsupported: true, action: 'refund_payment' }
  }
  
  // Edit order
  const editKeywords = [
    'editar pedido', 'alterar pedido', 'mudar produto',
    'trocar produto', 'alterar desconto', 'mudar frete',
    'editar frete', 'alterar valor'
  ]
  if (editKeywords.some(k => lowerContent.includes(k))) {
    return { isUnsupported: true, action: 'edit_order' }
  }
  
  // Logistics issues
  const logisticsKeywords = [
    'loggi', 'transportadora', 'problema na entrega',
    'pedido parado', 'rastreamento', 'onde está o pedido',
    'entrega atrasada', 'não chegou', 'extraviado'
  ]
  if (logisticsKeywords.some(k => lowerContent.includes(k))) {
    return { isUnsupported: true, action: 'resolve_logistics' }
  }
  
  return { isUnsupported: false }
}

// NEW: Extract order IDs from content
function extractOrderIds(content: string): string[] {
  // Match #1234 or pedido 1234 patterns
  const hashPattern = /#(\d+)/g
  const pedidoPattern = /pedido\s*(\d+)/gi
  
  const ids: string[] = []
  
  let match
  while ((match = hashPattern.exec(content)) !== null) {
    ids.push(match[1])
  }
  while ((match = pedidoPattern.exec(content)) !== null) {
    ids.push(match[1])
  }
  
  return [...new Set(ids)] // Remove duplicates
}

// NEW: Detect order QUERY (consultation) - different from action
function isOrderQuery(content: string): boolean {
  const lowerContent = content.toLowerCase()
  
  // Query keywords - user wants to SEE/LIST orders
  const queryKeywords = [
    'quero ver', 'quero os', 'mostrar', 'mostra', 'lista', 'listar',
    'quais são', 'quais sao', 'quais pedidos', 'quantos pedidos',
    'me mostra', 'me mostre', 'ver pedidos', 'ver os pedidos',
    'pedidos que', 'pedidos não', 'pedidos nao', 'pedidos sem',
    'pedidos com', 'pedidos pendentes', 'pedidos para',
    'não foram', 'nao foram', 'ainda não', 'ainda nao',
    'faltam', 'falta enviar', 'por enviar', 'por embalar',
    'aguardando', 'esperando'
  ]
  
  return queryKeywords.some(keyword => lowerContent.includes(keyword))
}

// NEW: Get context for order query
interface OrderQueryContext {
  context: 'orders_to_pack' | 'pending_payments' | 'not_shipped' | 'all_orders'
  description: string
  filter: (order: typeof allOrders[0]) => boolean
}

function getOrderQueryContext(content: string): OrderQueryContext {
  const lowerContent = content.toLowerCase()
  
  // Not shipped / not sent
  if (lowerContent.includes('não enviado') || lowerContent.includes('nao enviado') ||
      lowerContent.includes('não foram enviados') || lowerContent.includes('nao foram enviados') ||
      lowerContent.includes('por enviar') || lowerContent.includes('falta enviar') ||
      lowerContent.includes('sem envio') || lowerContent.includes('não enviaram') ||
      lowerContent.includes('ainda não enviei') || lowerContent.includes('ainda nao enviei')) {
    return {
      context: 'not_shipped' as const,
      description: 'pedidos que ainda não foram enviados',
      filter: (o) => o.shipping.status === 'to_ship' || o.shipping.status === 'to_pack'
    }
  }
  
  // To pack / embalar
  if (lowerContent.includes('embalar') || lowerContent.includes('por embalar') ||
      lowerContent.includes('para embalar')) {
    return {
      context: 'orders_to_pack' as const,
      description: 'pedidos prontos para embalar',
      filter: (o) => o.shipping.status === 'to_pack'
    }
  }
  
  // Pending payments
  if (lowerContent.includes('pagamento pendente') || lowerContent.includes('aguardando pagamento') ||
      lowerContent.includes('não pagos') || lowerContent.includes('nao pagos') ||
      lowerContent.includes('sem pagamento')) {
    return {
      context: 'pending_payments' as const,
      description: 'pedidos com pagamento pendente',
      filter: (o) => o.payment.status === 'pending'
    }
  }
  
  // Default - all orders to pack/ship
  return {
    context: 'orders_to_pack' as const,
    description: 'pedidos pendentes',
    filter: (o) => o.shipping.status === 'to_pack' || o.shipping.status === 'to_ship'
  }
}

// NEW: Get filtered orders based on query context
function getFilteredOrdersForQuery(context: OrderQueryContext): typeof allOrders {
  return allOrders.filter(context.filter)
}

// ============================================
// Export Detection (conversational)
// ============================================

function isExportQuery(content: string): boolean {
  const exportKeywords = [
    'exportar', 'exportação', 'exportacao', 'export',
    'baixar csv', 'baixar planilha', 'gerar csv', 'gerar planilha',
    'gerar arquivo', 'gerar relatório', 'gerar relatorio',
    'download csv', 'download planilha',
    'exportar pedidos', 'exportar vendas', 'exportar lista',
    'quero exportar', 'quero um csv', 'quero uma planilha',
    'me dá um csv', 'me da um csv', 'extrair dados',
    'exportar dados', 'baixar dados', 'baixar arquivo',
    'planilha de pedidos', 'planilha de vendas',
    'csv dos pedidos', 'csv das vendas',
  ]

  const lowerContent = content.toLowerCase()
  return exportKeywords.some((keyword) => lowerContent.includes(keyword))
}

/** Detect column requests inside an export query (e.g. "exportar com e-mail e telefone"). */
function detectExportColumns(content: string): OrderTableColumnId[] {
  const lower = content.toLowerCase()
  const found: OrderTableColumnId[] = []
  for (const { pattern, column } of COLUMN_KEYWORD_MAP) {
    if (pattern.test(lower) && !found.includes(column)) {
      found.push(column)
    }
  }
  return found
}

// ============================================
// Column Detection (conversational)
// ============================================

// Maps user keywords → column ids
const COLUMN_KEYWORD_MAP: { pattern: RegExp; column: OrderTableColumnId }[] = [
  { pattern: /\b(e-?mail|email)\b/, column: 'email' },
  { pattern: /\b(telefone|phone|celular|fone)\b/, column: 'phone' },
  { pattern: /\b(data|datas)\b/, column: 'date' },
  { pattern: /\b(hora|horário|horario|horas)\b/, column: 'time' },
  { pattern: /\b(cliente|clientes|nome do cliente)\b/, column: 'customer' },
  { pattern: /\b(total|valor|valores)\b/, column: 'total' },
  { pattern: /\b(produto|produtos|itens|quantidade)\b/, column: 'products' },
  { pattern: /\b(pagamento|pagamentos)\b/, column: 'payment' },
  { pattern: /\b(forma de pagamento|método de pagamento|metodo de pagamento)\b/, column: 'paymentMethod' },
  { pattern: /\b(envio|envios|entrega)\b/, column: 'shipping' },
  { pattern: /\b(transportadora|transportadoras)\b/, column: 'shippingCarrier' },
]

/** Detecta colunas mencionadas pelo usuário no texto. */
function detectRequestedOrderColumns(content: string): OrderTableColumnId[] {
  const lower = content.toLowerCase()
  const found: OrderTableColumnId[] = []
  for (const { pattern, column } of COLUMN_KEYWORD_MAP) {
    if (pattern.test(lower) && !found.includes(column)) {
      found.push(column)
    }
  }
  return found
}

/** Detecta se o usuário quer ver SOMENTE certas colunas (modo exclusivo). */
function isOnlyColumnsRequest(content: string): boolean {
  const lower = content.toLowerCase()
  return (
    /\b(só|somente|apenas|s[oó] quero|quero ver só|mostr[ae] só|mostr[ae] apenas|mostr[ae] somente)\b/.test(lower) ||
    /\b(only|just)\b/.test(lower)
  )
}

/**
 * Monta as colunas da tabela baseado no que o usuário pediu.
 * - Modo aditivo (padrão): base + colunas extras, agrupadas semanticamente.
 * - Modo exclusivo ("só..."): somente as colunas pedidas (+ venda e ações).
 * @param base - colunas base (padrão ou herdadas da última tabela exibida)
 */
function resolveOrderColumns(
  content: string,
  base: OrderTableColumnId[] = DEFAULT_VISIBLE_COLUMNS,
): OrderTableColumnId[] | undefined {
  const requested = detectRequestedOrderColumns(content)
  if (requested.length === 0) return undefined // sem pedido especial, usa padrão

  if (isOnlyColumnsRequest(content)) {
    // Modo exclusivo: somente as colunas mencionadas
    return buildOrderedColumns(requested)
  }

  // Modo aditivo: base + extras, agrupadas semanticamente
  return buildOrderedColumns(base, requested)
}

/** Detecta se o usuário quer adicionar/remover/alterar colunas de uma tabela já exibida. */
function isColumnChangeRequest(content: string): boolean {
  const lower = content.toLowerCase()
  return (
    /\b(inclu[aí]|adicion[ae]|coloc[aoe]|agrega|mostr[ae] também|mostr[ae] tb|também|tb|tira|remov[ae]|escond[ae]|sem a coluna|com a coluna|inclui|adicione)\b/.test(lower) &&
    detectRequestedOrderColumns(content).length > 0
  )
}

/** Detecta se o usuario quer ver so colunas especificas (sem contexto de orders anterior). */
function isCustomColumnsViewRequest(content: string): boolean {
  const lower = content.toLowerCase()
  return (
    isOnlyColumnsRequest(content) &&
    detectRequestedOrderColumns(content).length > 0 &&
    (/\b(pedido|pedidos|ordem|ordens|venda|vendas)\b/.test(lower) || true)
  )
}

/**
 * Returns true when the resolved columns match the default set (no custom additions).
 * The "Aplicar" button should only be shown when this returns true.
 */
function isDefaultColumnsOnly(columns?: OrderTableColumnId[]): boolean {
  if (!columns) return true // undefined means default columns are used
  if (columns.length !== DEFAULT_VISIBLE_COLUMNS.length) return false
  return DEFAULT_VISIBLE_COLUMNS.every((col) => columns.includes(col))
}

// ============================================
// Response Generation Helpers
// ============================================

// Generate sales summary response
function generateSalesResponse(): { content: string; total: string; count: number } {
  // Filter paid orders (payment.status === 'received')
  const paidOrders = allOrders.filter(o => o.payment.status === 'received')
  const totalValue = paidOrders.reduce((sum, o) => {
    const value = parseFloat(o.total.replace('R$ ', '').replace('.', '').replace(',', '.'))
    return sum + value
  }, 0)
  
  const formattedTotal = `R$ ${totalValue.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
  
  return {
    content: `Você teve ${paidOrders.length} vendas com pagamento aprovado, totalizando ${formattedTotal}.`,
    total: formattedTotal,
    count: paidOrders.length
  }
}

// Generate action confirmation message
function generateActionConfirmationMessage(action: ExecutableAction, orderCount: number): string {
  const config = actionConfigs[action]
  const orderText = orderCount === 1 ? '1 pedido' : `${orderCount} pedidos`
  
  switch (action) {
    case 'mark_payment_received':
      return `Vou marcar o pagamento de ${orderText} como recebido.`
    case 'mark_packed':
      return `Vou marcar ${orderText} como empaquetados.`
    case 'unpack':
      return `Vou desempaquetar ${orderText}.`
    case 'reopen_order':
      return `Vou reabrir ${orderText}.`
    default:
      return `Vou executar a ação em ${orderText}.`
  }
}

// Generate action completed message
function generateActionCompletedMessage(action: ExecutableAction, orderCount: number): string {
  const orderText = orderCount === 1 ? '1 pedido' : `${orderCount} pedidos`
  
  switch (action) {
    case 'mark_payment_received':
      return `Pronto! Pagamento de ${orderText} marcado como recebido.`
    case 'mark_packed':
      return `Pronto! ${orderText} marcados como empaquetados.`
    case 'unpack':
      return `Pronto! ${orderText} desempaquetados.`
    case 'reopen_order':
      return `Pronto! ${orderText} reabertos.`
    default:
      return `Pronto! Ação executada em ${orderText}.`
  }
}

// Generate guidance message for unsupported actions
function generateGuidanceMessage(action: GuidedAction, orderId?: string): GuidanceResponse {
  const baseGuidance = guidanceResponses[action]
  return {
    action,
    ...baseGuidance,
    navigationTarget: orderId
  }
}

export function LumiChat({ 
  onClose, 
  onApplyFilter, 
  onUndoFilter, 
  onApplyStatsFilter, 
  onUndoStatsFilter, 
  onApplyProduct, 
  onUndoProduct, 
  isFullscreen = false, 
  onToggleFullscreen,
  onOrderAction,
  onNavigateToOrder
}: LumiChatProps) {
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [pendingAction, setPendingAction] = useState<PendingAction | null>(null)
  const [isEmptyState, setIsEmptyState] = useState(false)

  // Export system – conversational
  const {
    jobs: exportJobs,
    startExport,
    downloadExport,
  } = useExport()

  // Track which export job IDs we're watching so we can update the corresponding chat message
  const trackedExportIds = useRef<Set<string>>(new Set())

  // Scroll ref for auto-scrolling during export progress
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  // Track which export IDs have already auto-downloaded to avoid repeat triggers
  const autoDownloaded = useRef<Set<string>>(new Set())

  // Watch export jobs: auto-download on completion, update message text on failure
  useEffect(() => {
    for (const jobId of trackedExportIds.current) {
      const job = exportJobs.find((j) => j.id === jobId)
      if (!job) continue

      // Auto-download when the job completes (once)
      if (job.status === 'completed' && !autoDownloaded.current.has(jobId)) {
        autoDownloaded.current.add(jobId)
        downloadExport(jobId)
      }

      // Update the message text for terminal states
      setMessages((prev) => {
        const msgIndex = prev.findIndex((m) => m.exportJobId === jobId)
        if (msgIndex === -1) return prev
        const msg = prev[msgIndex]

        let newContent = msg.content
        if (job.status === 'completed') {
          newContent = 'Pronto! O download do arquivo CSV foi iniciado automaticamente.'
        } else if (job.status === 'failed') {
          newContent = job.error ?? 'Ocorreu um erro ao gerar o arquivo. Tente novamente.'
        } else if (job.status === 'expired') {
          newContent = 'O link de download expirou. Peça uma nova exportação se precisar.'
        }

        if (newContent === msg.content) return prev
        const updated = [...prev]
        updated[msgIndex] = { ...msg, content: newContent }
        return updated
      })
    }
    setTimeout(scrollToBottom, 100)
  }, [exportJobs, scrollToBottom, downloadExport])

  // Handle starting an export from chat
  const handleChatExport = useCallback(
    (content: string) => {
      const extraColumns = detectExportColumns(content)
      const baseColumns: OrderTableColumnId[] = ['venda', 'customer', 'total', 'products', 'payment', 'shipping']
      const columns = extraColumns.length > 0
        ? buildOrderedColumns(baseColumns, extraColumns)
        : baseColumns

      try {
        const jobId = startExport({
          entityType: 'orders',
          columns,
          totalRecords: allOrders.length,
          format: 'csv',
        })
        trackedExportIds.current.add(jobId)
        return jobId
      } catch (err) {
        return err instanceof Error ? err.message : 'Erro ao iniciar exportacao.'
      }
    },
    [startExport],
  )

  // Handle new conversation (empty state)
  const handleNewConversation = () => {
    setIsEmptyState(true)
    setMessages([])
    setPendingAction(null)
  }

  const handleSendMessage = (content: string, hasImage: boolean = false) => {
    // Exit empty state when sending a message
    if (isEmptyState) {
      setIsEmptyState(false)
    }

    const newUserMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content,
      hasImage: hasImage || hasImageAttachment(content),
      timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
    }

    setMessages((prev) => [...prev, newUserMessage])

    // ── Thinking animation steps used for ALL order-related queries ──
    const ORDER_THINKING_STEPS: ThinkingStep[] = [
      { icon: 'sparkle', text: 'Pensando...' },
      { icon: 'sparkle', text: 'Analisando...' },
      { icon: 'search', text: 'Buscando pedidos...' },
      { icon: 'table', text: 'Criando tabela....' },
    ]
    // 4 steps × 1500ms = 6000ms; add buffer
    const THINKING_DURATION_MS = 6500

    /**
     * Helper: show thinking animation, then resolve with the real message.
     * Used by every order/export/sales flow that produces an orders card.
     */
    const showThinkingThenResolve = (buildResponse: () => Message) => {
      const thinkingId = (Date.now() + 1).toString()
      setMessages((prev) => [
        ...prev,
        { id: thinkingId, type: 'ai' as const, content: '', isThinking: true, thinkingSteps: ORDER_THINKING_STEPS },
      ])
      setTimeout(scrollToBottom, 100)

      setTimeout(() => {
        const realResponse = buildResponse()
        setMessages((prev) => {
          const idx = prev.findIndex((m) => m.id === thinkingId)
          if (idx === -1) return prev
          const updated = [...prev]
          updated[idx] = { ...realResponse, id: thinkingId, isThinking: false, thinkingSteps: undefined }
          return updated
        })
        setTimeout(scrollToBottom, 150)
      }, THINKING_DURATION_MS)
    }

    // ── Detect which intent this message matches ──

    // 1. Product creation queries or image attachments — no thinking animation needed
    if (isProductQuery(content) || hasImageAttachment(content) || newUserMessage.hasImage) {
      setTimeout(() => {
        setMessages((prev) => [...prev, {
          id: (Date.now() + 1).toString(),
          type: 'ai',
          content: 'Analisei a imagem e preenchi os campos do produto automaticamente. Confira os dados e clique em "Criar produto" para adicionar à sua loja.',
          product: generateMockProduct(),
          showProductCard: true,
          timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
        }])
      }, 1000)
      return
    }

    // 2. Unsupported action requests (guidance) — no thinking animation
    if (isUnsupportedActionQuery(content).isUnsupported) {
      const { action } = isUnsupportedActionQuery(content)
      const orderIds = extractOrderIds(content)
      const guidance = generateGuidanceMessage(action!, orderIds[0])
      const responseContent = guidance.explanation + ' ' + guidance.nextStep
      const hasSuggestedAction = orderIds.length > 0

      setTimeout(() => {
        setMessages((prev) => [...prev, {
          id: (Date.now() + 1).toString(),
          type: 'ai',
          content: responseContent,
          guidance,
          timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
          suggestedActions: hasSuggestedAction ? [
            { id: `navigate_${orderIds[0]}`, label: `Abrir pedido #${orderIds[0]}`, icon: 'navigate' as const, variant: 'primary' as const }
          ] : undefined,
        }])
      }, 1000)
      return
    }

    // 3. Executable action requests — no card, just confirmation
    if (isActionQuery(content).isAction) {
      const { action } = isActionQuery(content)
      const orderIds = extractOrderIds(content)
      const targetOrderIds = orderIds.length > 0 ? orderIds : allOrders.slice(0, 5).map(o => o.id)
      const orderCount = targetOrderIds.length

      const newPendingAction: PendingAction = {
        type: action!,
        orderIds: targetOrderIds,
        description: generateActionConfirmationMessage(action!, orderCount),
      }
      setPendingAction(newPendingAction)

      setTimeout(() => {
        setMessages((prev) => [...prev, {
          id: (Date.now() + 1).toString(),
          type: 'ai',
          content: newPendingAction.description,
          pendingAction: newPendingAction,
          timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
        }])
      }, 1000)
      return
    }

    // 4. Export requests — ALWAYS show thinking animation, then card + export job
    if (isExportQuery(content)) {
      showThinkingThenResolve(() => {
        const result = handleChatExport(content)
        const isError = typeof result === 'string' && !result.startsWith('exp_')
        if (isError) {
          return {
            id: '',
            type: 'ai',
            content: typeof result === 'string' ? result : 'Erro ao iniciar exportação.',
            timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
          }
        }
        const queryContext = getOrderQueryContext(content)
        const filteredOrders = getFilteredOrdersForQuery(queryContext)
        const resolvedColumns = resolveOrderColumns(content)
        return {
          id: '',
          type: 'ai',
          content: `Encontrei ${filteredOrders.length} pedidos.\n\nVocê pode aplicar o filtro para visualizar na lista de vendas ou baixar aqui:`,
          followUpText: 'Se quiser, posso criar uma tabela separando por mês ou somando o faturamento total.',
          orders: filteredOrders.slice(0, 5).map((o) => ({
            id: o.id, customer: o.customer, email: o.email, phone: o.phone,
          })),
          showApplyFilter: isDefaultColumnsOnly(resolvedColumns),
          ordersContext: queryContext.context,
          orderColumns: resolvedColumns,
          totalOrders: filteredOrders.length,
          exportJobId: result as string,
          timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
        }
      })
      return
    }

    // 5. Statistics queries — checked BEFORE sales because "estatísticas de vendas" contains "vendas"
    if (isStatisticsQuery(content)) {
      setTimeout(() => {
        setMessages((prev) => [...prev, {
          id: (Date.now() + 1).toString(),
          type: 'ai',
          content: 'Aqui estão as estatísticas da sua loja nos últimos 7 dias.',
          stats: generateMockStats(),
          showStatsFilter: true,
          ordersContext: 'sales_stats',
          timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
        }])
      }, 1000)
      return
    }

    // 6. Sales-related queries — thinking animation when showing orders card
    if (isSalesQuery(content)) {
      const salesData = generateSalesResponse()
      const wantsToSeeOrders = content.toLowerCase().includes('mostrar') ||
                                content.toLowerCase().includes('ver') ||
                                content.toLowerCase().includes('lista')

      if (wantsToSeeOrders) {
        // Show thinking animation then card
        showThinkingThenResolve(() => {
          const paidOrders = allOrders.filter(o => o.payment.status === 'received')
          const resolvedColumns = resolveOrderColumns(content)
          return {
            id: '',
            type: 'ai',
            content: salesData.content,
            orders: paidOrders.slice(0, 5).map(o => ({
              id: o.id, customer: o.customer, email: o.email, phone: o.phone,
            })),
            showApplyFilter: isDefaultColumnsOnly(resolvedColumns),
            salesContext: 'paid_orders',
            ordersContext: 'pending_payments',
            orderColumns: resolvedColumns,
            totalOrders: paidOrders.length,
            timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
          }
        })
      } else {
        // No card — just a text response
        setTimeout(() => {
          setMessages((prev) => [...prev, {
            id: (Date.now() + 1).toString(),
            type: 'ai',
            content: salesData.content + '\n\nQuer ver os pedidos em detalhes?',
            salesContext: 'paid_orders',
            timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
          }])
        }, 1000)
      }
      return
    }

    // 7. Order queries — ALWAYS show thinking animation then card
    if (isOrderQuery(content)) {
      showThinkingThenResolve(() => {
        const queryContext = getOrderQueryContext(content)
        const filteredOrders = getFilteredOrdersForQuery(queryContext)
        const orderCount = filteredOrders.length
        const resolvedColumns = resolveOrderColumns(content)
        return {
          id: '',
          type: 'ai',
          content: `Encontrei ${orderCount} ${queryContext.description}.\n\nVocê pode aplicar o filtro para visualizar na lista de vendas ou baixar aqui:`,
          orders: filteredOrders.slice(0, 5).map((o) => ({
            id: o.id, customer: o.customer, email: o.email, phone: o.phone,
          })),
          showApplyFilter: isDefaultColumnsOnly(resolvedColumns),
          ordersContext: queryContext.context,
          orderColumns: resolvedColumns,
          totalOrders: orderCount,
          timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
        }
      })
      return
    }

    // 8. Column change / custom columns view — thinking animation then updated card
    if (isColumnChangeRequest(content) || isCustomColumnsViewRequest(content)) {
      showThinkingThenResolve(() => {
        // Find last message that had an orders card to inherit its context
        const lastOrdersMessage = [...messages].reverse().find((m) => m.orders && m.orders.length > 0)
        const previousColumns = lastOrdersMessage?.orderColumns ?? DEFAULT_VISIBLE_COLUMNS
        const previousContext = lastOrdersMessage?.ordersContext ?? 'orders_to_pack'

        const newColumns = resolveOrderColumns(content, previousColumns)
        const requestedNames = detectRequestedOrderColumns(content)
        const addedLabels = requestedNames
          .filter((c) => !previousColumns.includes(c))
          .map((c) => {
            const labels: Record<string, string> = {
              email: 'E-mail', phone: 'Telefone', date: 'Data', time: 'Hora',
              paymentMethod: 'Forma de pagamento', shippingCarrier: 'Transportadora',
              customer: 'Cliente', total: 'Total', products: 'Produtos',
              payment: 'Pagamento', shipping: 'Envio',
            }
            return labels[c] || c
          })

        const label = addedLabels.length > 0
          ? `Pronto! Adicionei ${addedLabels.join(', ')} à tabela.`
          : 'Pronto! Atualizei as colunas da tabela.'

        const queryContext = getOrderQueryContext(
          lastOrdersMessage ? lastOrdersMessage.content : 'pedidos para embalar',
        )
        const filteredOrders = getFilteredOrdersForQuery(queryContext)
        const effectiveColumns = newColumns ?? previousColumns

        return {
          id: '',
          type: 'ai',
          content: label,
          orders: filteredOrders.slice(0, 5).map((o) => ({
            id: o.id, customer: o.customer, email: o.email, phone: o.phone,
          })),
          // Custom columns → no Apply button
          showApplyFilter: isDefaultColumnsOnly(effectiveColumns),
          ordersContext: previousContext,
          orderColumns: effectiveColumns,
          totalOrders: filteredOrders.length,
          timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
        }
      })
      return
    }

    // 9. Generic conversational response — no thinking animation
    setTimeout(() => {
      setMessages((prev) => [...prev, {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: 'Posso te ajudar a ver seus pedidos, vendas, estatísticas, ou criar produtos. O que você precisa?',
        timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      }])
    }, 1000)
  }

  const handleApplyFilter = (orderIds: string[]) => {
    if (onApplyFilter) {
      onApplyFilter(orderIds)
    }
  }

  const handleApplyStatsFilter = (filters: StatsFilter[]) => {
    if (onApplyStatsFilter) {
      onApplyStatsFilter(filters)
    }
  }

  const handleApplyProduct = (product: ProductData) => {
    if (onApplyProduct) {
      onApplyProduct(product)
    }
  }

  // Handle order action from chat
  const handleOrderAction = (action: ExecutableAction, orderIds: string[]) => {
    if (onOrderAction) {
      onOrderAction(action, orderIds)
    }
    
    // Add conversational completion message without extra buttons
    const completionMessage: Message = {
      id: Date.now().toString(),
      type: 'ai',
      content: generateActionCompletedMessage(action, orderIds.length) + ' Precisa de mais alguma coisa?',
      actionCompleted: { action, orderCount: orderIds.length },
      ordersContext: 'action_complete',
      timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      // No buttons - conversational follow-up
    }
    
    setMessages((prev) => [...prev, completionMessage])
    setPendingAction(null)
  }

  // Handle pending action confirmation
  const handleConfirmPendingAction = () => {
    if (pendingAction) {
      handleOrderAction(pendingAction.type, pendingAction.orderIds)
    }
  }

  // Handle pending action cancellation
  const handleCancelPendingAction = () => {
    setPendingAction(null)
    
    const cancelMessage: Message = {
      id: Date.now().toString(),
      type: 'ai',
      content: 'Ação cancelada. O que mais posso fazer por você?',
      timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
    }
    
    setMessages((prev) => [...prev, cancelMessage])
  }

  // Handle suggested action clicks (minimal - only for essential actions)
  const handleSuggestedAction = (actionId: string) => {
    // Quick-action buttons (welcome message shortcuts)
    if (actionId === 'quick_export') {
      handleSendMessage('Exportar pedidos em CSV')
      return
    }
    if (actionId === 'quick_orders') {
      handleSendMessage('Mostrar pedidos por embalar')
      return
    }
    if (actionId === 'quick_stats') {
      handleSendMessage('Mostrar estatísticas de vendas')
      return
    }

    // Handle navigation actions - primary use case for buttons
    if (actionId.startsWith('navigate_')) {
      const orderId = actionId.replace('navigate_', '')
      if (onNavigateToOrder) {
        onNavigateToOrder(orderId)
      }
      return
    }

    // Handle bulk action from order card (only when explicitly triggered)
    switch (actionId) {
      case 'mark_all_packed':
        const packOrderIds = allOrders.slice(0, 5).map(o => o.id)
        setPendingAction({
          type: 'mark_packed',
          orderIds: packOrderIds,
          description: generateActionConfirmationMessage('mark_packed', packOrderIds.length)
        })
        const packMessage: Message = {
          id: Date.now().toString(),
          type: 'ai',
          content: generateActionConfirmationMessage('mark_packed', packOrderIds.length),
          pendingAction: {
            type: 'mark_packed',
            orderIds: packOrderIds,
            description: generateActionConfirmationMessage('mark_packed', packOrderIds.length)
          },
          timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
        }
        setMessages((prev) => [...prev, packMessage])
        break

      case 'mark_payments_received':
        const paymentOrderIds = allOrders.filter(o => o.payment.status === 'pending').slice(0, 5).map(o => o.id)
        setPendingAction({
          type: 'mark_payment_received',
          orderIds: paymentOrderIds,
          description: generateActionConfirmationMessage('mark_payment_received', paymentOrderIds.length)
        })
        const paymentMessage: Message = {
          id: Date.now().toString(),
          type: 'ai',
          content: generateActionConfirmationMessage('mark_payment_received', paymentOrderIds.length),
          pendingAction: {
            type: 'mark_payment_received',
            orderIds: paymentOrderIds,
            description: generateActionConfirmationMessage('mark_payment_received', paymentOrderIds.length)
          },
          timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
        }
        setMessages((prev) => [...prev, paymentMessage])
        break

      default:
        break
    }
  }

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header – matches Figma "Header" inside Chat iA card */}
      <div className="flex items-center gap-1 p-4 border-b border-moon-light bg-white shrink-0">
        {/* Left: History / navigation button */}
        <button className="p-1.5 text-neutral-text-low hover:text-neutral-text-high rounded-md shrink-0">
          <HistoryIcon className="w-4 h-4" />
        </button>

        {/* Center: Lumi title + Beta tag */}
        <div className="flex-1 flex items-center justify-center gap-2 min-w-0">
          <span className="text-[16px] leading-[20px] font-medium text-neutral-text-high whitespace-nowrap">Lumi</span>
          <span className="inline-flex items-center px-2 py-0.5 text-[12px] leading-[16px] font-normal bg-neutral-surface border border-neutral-surface-highlight rounded-full text-neutral-text-high whitespace-nowrap">
            Beta
          </span>
        </div>

        {/* Right: Action buttons */}
        <div className="flex items-center gap-1 shrink-0">
          {/* New conversation button (Edit / compose icon) */}
          <button 
            onClick={handleNewConversation}
            className="p-1.5 text-neutral-text-low hover:text-neutral-text-high rounded-md"
            title="Nova conversa"
          >
            <PencilIcon className="w-4 h-4" />
          </button>
          {/* Fullscreen toggle button */}
          {onToggleFullscreen && (
            <button 
              onClick={onToggleFullscreen}
              className="p-1.5 text-neutral-text-low hover:text-neutral-text-high rounded-md"
              title={isFullscreen ? 'Sair da tela cheia' : 'Tela cheia'}
            >
              {isFullscreen ? (
                <CollapseIcon className="w-4 h-4" />
              ) : (
                <ExpandIcon className="w-4 h-4" />
              )}
            </button>
          )}
          {/* Close button */}
          <button 
            onClick={onClose}
            className="p-1.5 text-neutral-text-low hover:text-neutral-text-high rounded-md"
          >
            <NimbusCloseIcon className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Messages / Content Area */}
      <div className={`flex-1 overflow-y-auto ${isEmptyState ? 'flex flex-col' : 'px-4 py-4 space-y-4'}`}>
        {/* Empty State - matches Figma "Chat iA (empty)" */}
        {isEmptyState && (
          <div className="h-full flex flex-col items-center justify-center text-center px-4">
            {/* Lumi Icon - subtle gradient circle with Nimbus GenerativeStars */}
            <div 
              className="w-10 h-10 rounded-full flex items-center justify-center mb-4"
              style={{
                background: 'linear-gradient(72deg, rgba(0, 80, 195, 0.05) 16%, rgba(71, 54, 180, 0.05) 42%, rgba(216, 68, 110, 0.05) 83%)'
              }}
            >
              <span style={{
                background: 'linear-gradient(143deg, #0050C3 16%, #4736B4 42%, #D8446E 83%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                display: 'inline-flex',
              }}>
                <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none">
                  <path d="M8 0.5L9.8 5.8L15.5 6.5L11 10.2L12.4 15.5L8 12.5L3.6 15.5L5 10.2L0.5 6.5L6.2 5.8L8 0.5Z" fill="url(#empty-sparkle-gradient)" />
                  <path d="M3 1L3.4 2.6L5 3L3.4 3.4L3 5L2.6 3.4L1 3L2.6 2.6L3 1Z" fill="url(#empty-sparkle-gradient)" />
                  <defs>
                    <linearGradient id="empty-sparkle-gradient" x1="0%" y1="100%" x2="100%" y2="0%">
                      <stop offset="16%" stopColor="#0050C3" />
                      <stop offset="42%" stopColor="#4736B4" />
                      <stop offset="83%" stopColor="#D8446E" />
                    </linearGradient>
                  </defs>
                </svg>
              </span>
            </div>

            {/* Welcome text */}
            <h2 className="text-[16px] leading-[20px] font-semibold text-neutral-text-high">
              Olá, loja
            </h2>
            <p className="text-[14px] leading-[20px] text-neutral-text-low mt-1">
              Sou seu assistente de IA.
            </p>
            <p 
              className="text-[14px] leading-[20px] font-semibold mt-1"
              style={{
                background: 'linear-gradient(9deg, #0050C3 28%, #4629BA 49%, #D8446E 83%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              O que vamos fazer?
            </p>
          </div>
        )}

        {/* Suggestion buttons - shown in empty state, below the main content area */}
        {isEmptyState && (
          <div className="px-4 py-2">
            <div className="flex flex-col gap-2 items-start">
              <button
                onClick={() => handleSendMessage('Exportar pedidos em CSV')}
                className="inline-flex items-center gap-1 px-2 py-1.5 text-[12px] leading-[16px] font-medium text-white rounded-md transition-colors"
                style={{
                  background: 'linear-gradient(17deg, #0050C3 28%, #4629BA 49%, #D8446E 83%)',
                }}
              >
                <DownloadIcon className="w-3.5 h-3.5" />
                Exportar pedidos em CSV
              </button>
              <button
                onClick={() => handleSendMessage('Adicionar novo produto')}
                className="inline-flex items-center gap-1 px-2 py-1.5 text-[12px] leading-[16px] font-medium text-neutral-text-high bg-neutral-surface border border-neutral-interactive rounded-md hover:bg-neutral-surface-disabled transition-colors"
              >
                Adicionar novo produto
              </button>
              <button
                onClick={() => handleSendMessage('Mostrar pedidos por embalar')}
                className="inline-flex items-center gap-1 px-2 py-1.5 text-[12px] leading-[16px] font-medium text-neutral-text-high bg-neutral-surface border border-neutral-interactive rounded-md hover:bg-neutral-surface-disabled transition-colors"
              >
                Ver pedidos pendentes
              </button>
            </div>
          </div>
        )}

        {/* Messages list */}
        {!isEmptyState && messages.map((message) => (
          <div key={message.id}>
            {message.type === 'user' ? (
              <ChatMessage type="user" timestamp={message.timestamp}>
                {message.content}
              </ChatMessage>
            ) : message.isThinking ? (
              /* Thinking animation – no ChatMessage wrapper, just the indicator */
              <div className="py-2">
                <ThinkingIndicator
                  steps={message.thinkingSteps}
                  intervalMs={1500}
                />
              </div>
            ) : (
              <ChatMessage
                type="ai"
                timestamp={message.timestamp}
                showFeedback={!message.isThinking}
              >
                {/* Main content text */}
                {message.content && (
                  <p style={{ whiteSpace: 'pre-line' }}>{message.content}</p>
                )}
                
                {/* Bullet points if present */}
                {message.bulletPoints && (
                  <>
                    <p className="mt-2">Posso ajudá-lo com:</p>
                    <ul className="mt-1 space-y-0.5">
                      {message.bulletPoints.map((point, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-neutral-text-low">•</span>
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </>
                )}

                {/* Follow-up question */}
                {message.question && (
                  <p className="mt-3">{message.question}</p>
                )}

                {/* Pending action confirmation */}
                {message.pendingAction && pendingAction && (
                  <InlineConfirmation
                    message={`${actionConfigs[message.pendingAction.type].impact} Confirma?`}
                    onConfirm={handleConfirmPendingAction}
                    onCancel={handleCancelPendingAction}
                  />
                )}

                {/* Guidance for unsupported actions */}
                {message.guidance && (
                  <div className="mt-3 p-3 bg-amber-50 rounded-lg border border-amber-200">
                    <p className="text-sm text-amber-800">
                      <strong>Dica:</strong> {message.guidance.suggestedAction || message.guidance.nextStep}
                    </p>
                  </div>
                )}

                {/* Orders card */}
                {message.orders && message.orders.length > 0 && (
                  <div className="mt-3">
                    <OrdersTable 
                      onApplyFilter={() => handleApplyFilter(message.orders!.map(o => o.id))}
                      onUndo={onUndoFilter}
                      totalOrders={message.totalOrders ?? 1000}
                      isFullscreen={isFullscreen}
                      visibleColumns={message.orderColumns}
                      onOrderAction={handleOrderAction}
                      onNavigateToOrder={onNavigateToOrder}
                      onSuggestedAction={handleSuggestedAction}
                      showSuggestedActions={false}
                      context={message.ordersContext || 'orders_to_pack'}
                      showApplyButton={message.showApplyFilter !== false}
                    />
                  </div>
                )}

                {/* Follow-up text after the card */}
                {message.followUpText && (
                  <p className="mt-3 text-sm text-neutral-text-high">{message.followUpText}</p>
                )}

                {/* Stats card */}
                {message.stats && message.stats.length > 0 && (
                  <div className="mt-3">
                    <StatsCard 
                      charts={message.stats}
                      onApplyFilter={handleApplyStatsFilter}
                      onUndo={onUndoStatsFilter}
                      title="Estatísticas"
                      isFullscreen={isFullscreen}
                    />
                  </div>
                )}

                {/* Product card */}
                {message.product && (
                  <div className="mt-3">
                    <ProductCard 
                      product={message.product}
                      onApply={handleApplyProduct}
                      onUndo={onUndoProduct}
                      isFullscreen={isFullscreen}
                    />
                  </div>
                )}

                {/* Suggested actions */}
                {message.suggestedActions && message.suggestedActions.length > 0 && !message.pendingAction && (
                  <SuggestedActions 
                    actions={message.suggestedActions}
                    onAction={handleSuggestedAction}
                  />
                )}

                {/* Action completed badge */}
                {message.actionCompleted && (
                  <div className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 bg-success-surface rounded-full">
                    <CheckCircleIcon className="w-4 h-4 text-success-text-low" />
                    <span className="text-sm font-medium text-success-text-low">
                      Ação concluída
                    </span>
                  </div>
                )}
              </ChatMessage>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <ChatInput
        onSend={handleSendMessage}
        isThinking={messages.some((m) => m.isThinking)}
        onStop={() => {
          // Cancel thinking — replace the thinking message with a cancelled notice
          setMessages((prev) =>
            prev.map((m) =>
              m.isThinking
                ? { ...m, isThinking: false, thinkingSteps: undefined, content: 'Geração interrompida.' }
                : m
            )
          )
        }}
      />
    </div>
  )
}

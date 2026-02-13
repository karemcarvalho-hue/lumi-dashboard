// ============================================
// Lumi Order Actions - Types and Interfaces
// ============================================

// Order status types
export type PaymentStatus = 'received' | 'pending' | 'refused'
export type ShippingStatus = 'to_pack' | 'to_ship' | 'shipped' | 'picked_up' | 'archived' | 'cancelled'

// Action types Lumi can execute
export type ExecutableAction = 
  | 'mark_payment_received'
  | 'mark_packed'
  | 'unpack'
  | 'reopen_order'

// Actions Lumi guides but cannot execute
export type GuidedAction = 
  | 'cancel_order'
  | 'refund_payment'
  | 'edit_order'
  | 'resolve_logistics'

// All action types
export type OrderAction = ExecutableAction | GuidedAction

// Pending action awaiting confirmation
export interface PendingAction {
  type: ExecutableAction
  orderIds: string[]
  description: string
}

// Guidance response for unsupported actions
export interface GuidanceResponse {
  action: GuidedAction
  explanation: string
  nextStep: string
  navigationTarget?: string // order ID to navigate to
}

// Suggested action for follow-up
export interface SuggestedAction {
  id: string
  label: string
  icon?: 'pack' | 'payment' | 'view' | 'stats' | 'navigate'
  variant: 'primary' | 'secondary'
}

// Action confirmation config
export interface ActionConfig {
  title: string
  description: string
  impact: string
  confirmLabel: string
  cancelLabel: string
}

// Action configurations with impact explanations
export const actionConfigs: Record<ExecutableAction, ActionConfig> = {
  mark_payment_received: {
    title: 'Marcar pagamento como recebido',
    description: 'Você está prestes a marcar o pagamento como recebido.',
    impact: 'O status de pagamento será alterado para "Recebido". Isso liberará o pedido para embalagem.',
    confirmLabel: 'Confirmar',
    cancelLabel: 'Cancelar'
  },
  mark_packed: {
    title: 'Marcar como empaquetado',
    description: 'Você está prestes a marcar os pedidos como empaquetados.',
    impact: 'Os pedidos serão marcados como empaquetados e ficarão prontos para envio.',
    confirmLabel: 'Confirmar',
    cancelLabel: 'Cancelar'
  },
  unpack: {
    title: 'Desempaquetar pedido',
    description: 'Você está prestes a desempaquetar os pedidos.',
    impact: 'Os pedidos voltarão para o status "Por embalar".',
    confirmLabel: 'Confirmar',
    cancelLabel: 'Cancelar'
  },
  reopen_order: {
    title: 'Reabrir pedido',
    description: 'Você está prestes a reabrir os pedidos.',
    impact: 'Os pedidos arquivados ou cancelados serão reabertos e voltarão ao fluxo normal.',
    confirmLabel: 'Confirmar',
    cancelLabel: 'Cancelar'
  }
}

// Guidance responses for unsupported actions
export const guidanceResponses: Record<GuidedAction, Omit<GuidanceResponse, 'action' | 'navigationTarget'>> = {
  cancel_order: {
    explanation: 'Não consigo cancelar pedidos diretamente por segurança.',
    nextStep: 'Posso te levar até esse pedido para você fazer o cancelamento.'
  },
  refund_payment: {
    explanation: 'Reembolsos precisam ser processados pelo gateway de pagamento.',
    nextStep: 'Vou te mostrar o pedido para você iniciar o reembolso por lá.'
  },
  edit_order: {
    explanation: 'Não consigo editar produtos, descontos ou frete diretamente.',
    nextStep: 'Posso te levar até o pedido para você fazer as alterações necessárias.'
  },
  resolve_logistics: {
    explanation: 'Questões de logística externa precisam ser resolvidas com a transportadora.',
    nextStep: 'Vou te mostrar o pedido com os detalhes de envio para você entrar em contato.'
  }
}

// ============================================
// Status Translation System
// ============================================

export interface StatusTranslation {
  human: string
  hasAction: boolean
  suggestedAction?: string
}

// Payment status translations
export const paymentStatusTranslations: Record<PaymentStatus, StatusTranslation> = {
  received: {
    human: 'O pagamento foi recebido com sucesso.',
    hasAction: false
  },
  pending: {
    human: 'O pagamento ainda está pendente. O cliente ainda não finalizou o pagamento.',
    hasAction: true,
    suggestedAction: 'Você pode aguardar ou entrar em contato com o cliente.'
  },
  refused: {
    human: 'O pagamento foi recusado. Houve um problema com a forma de pagamento.',
    hasAction: true,
    suggestedAction: 'Entre em contato com o cliente para tentar novamente.'
  }
}

// Shipping status translations (including logistics statuses)
export const shippingStatusTranslations: Record<string, StatusTranslation> = {
  to_pack: {
    human: 'O pedido está aguardando ser empaquetado.',
    hasAction: true,
    suggestedAction: 'Prepare o pedido e marque como empaquetado quando pronto.'
  },
  to_ship: {
    human: 'O pedido está empaquetado e pronto para envio.',
    hasAction: true,
    suggestedAction: 'Imprima a etiqueta e envie o pedido.'
  },
  shipped: {
    human: 'O pedido foi enviado e está a caminho do cliente.',
    hasAction: false
  },
  picked_up: {
    human: 'O cliente retirou o pedido.',
    hasAction: false
  },
  archived: {
    human: 'O pedido foi arquivado.',
    hasAction: true,
    suggestedAction: 'Você pode reabrir o pedido se necessário.'
  },
  cancelled: {
    human: 'O pedido foi cancelado.',
    hasAction: true,
    suggestedAction: 'Você pode reabrir o pedido se necessário.'
  },
  // Extended logistics statuses (from carriers)
  awaiting_sender_action: {
    human: 'Esse pedido precisa de uma ação sua para continuar a entrega.',
    hasAction: true,
    suggestedAction: 'Verifique se há etiqueta para imprimir ou coleta para agendar.'
  },
  in_transit: {
    human: 'O pedido está a caminho do cliente.',
    hasAction: false
  },
  out_for_delivery: {
    human: 'O pedido está saindo para entrega hoje.',
    hasAction: false
  },
  delivery_failed: {
    human: 'A entrega falhou. O cliente não estava disponível ou o endereço não foi encontrado.',
    hasAction: true,
    suggestedAction: 'Entre em contato com o cliente para confirmar o endereço.'
  },
  returning_to_sender: {
    human: 'O pedido está retornando para você.',
    hasAction: true,
    suggestedAction: 'Aguarde a devolução e entre em contato com o cliente.'
  },
  awaiting_pickup: {
    human: 'O pedido está aguardando retirada pelo cliente em um ponto de coleta.',
    hasAction: false
  }
}

// Helper function to get status translation
export function getStatusTranslation(
  statusType: 'payment' | 'shipping',
  status: string
): StatusTranslation {
  if (statusType === 'payment') {
    return paymentStatusTranslations[status as PaymentStatus] || {
      human: `Status de pagamento: ${status}`,
      hasAction: false
    }
  }
  
  return shippingStatusTranslations[status] || {
    human: `Status de envio: ${status}`,
    hasAction: false
  }
}

// ============================================
// Order Item Interface (extended)
// ============================================

export interface OrderItem {
  id: string
  date: string
  time: string
  customer: string
  email: string
  phone: string
  total: string
  products: string
  payment: {
    status: PaymentStatus
    method: string
  }
  shipping: {
    status: ShippingStatus | string
    carrier: string
  }
  // Extended properties for actions
  canMarkPaid?: boolean
  canPack?: boolean
  canUnpack?: boolean
  canReopen?: boolean
}

// Helper to determine available actions for an order
export function getAvailableActions(order: OrderItem): ExecutableAction[] {
  const actions: ExecutableAction[] = []
  
  // Can mark payment received if pending
  if (order.payment.status === 'pending') {
    actions.push('mark_payment_received')
  }
  
  // Can pack if payment received and status is to_pack
  if (order.payment.status === 'received' && order.shipping.status === 'to_pack') {
    actions.push('mark_packed')
  }
  
  // Can unpack if status is to_ship (already packed)
  if (order.shipping.status === 'to_ship') {
    actions.push('unpack')
  }
  
  // Can reopen if archived or cancelled
  if (order.shipping.status === 'archived' || order.shipping.status === 'cancelled') {
    actions.push('reopen_order')
  }
  
  return actions
}

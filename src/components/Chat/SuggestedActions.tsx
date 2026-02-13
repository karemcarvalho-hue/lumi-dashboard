import { SuggestedAction } from './types'
import {
  BoxPackedIcon,
  CashIcon,
  EyeIcon,
  StatsIcon as NimbusStatsIcon,
  ChevronRightIcon,
} from '@nimbus-ds/icons'

interface SuggestedActionsProps {
  actions: SuggestedAction[]
  onAction: (actionId: string) => void
}

// Map action icon names to Nimbus icon components
function PackIcon({ className }: { className?: string }) {
  return <BoxPackedIcon className={className} />
}

function PaymentIcon({ className }: { className?: string }) {
  return <CashIcon className={className} />
}

function ViewIcon({ className }: { className?: string }) {
  return <EyeIcon className={className} />
}

function StatsIcon({ className }: { className?: string }) {
  return <NimbusStatsIcon className={className} />
}

function NavigateIcon({ className }: { className?: string }) {
  return <ChevronRightIcon className={className} />
}

const iconMap = {
  pack: PackIcon,
  payment: PaymentIcon,
  view: ViewIcon,
  stats: StatsIcon,
  navigate: NavigateIcon,
}

export function SuggestedActions({ actions, onAction }: SuggestedActionsProps) {
  if (actions.length === 0) return null

  return (
    <div className="mt-3 flex flex-wrap gap-2">
      {actions.map((action) => {
        const Icon = action.icon ? iconMap[action.icon] : null
        const isPrimary = action.variant === 'primary'

        return (
          <button
            key={action.id}
            onClick={() => onAction(action.id)}
            className={`
              inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-full
              transition-all duration-200
              ${isPrimary 
                ? 'text-white hover:opacity-90' 
                : 'text-neutral-text-high bg-white border border-neutral-surface-disabled hover:bg-neutral-surface'
              }
            `}
            style={isPrimary ? {
              background: 'linear-gradient(17deg, #0050C3 28%, #4629BA 49%, #D8446E 83%)'
            } : undefined}
          >
            {Icon && <Icon className="w-4 h-4" />}
            {action.label}
          </button>
        )
      })}
    </div>
  )
}

// Pre-defined suggested actions for common scenarios
export const suggestedActionPresets = {
  afterOrdersToPack: [
    { id: 'mark_all_packed', label: 'Marcar como empaquetados', icon: 'pack' as const, variant: 'primary' as const },
    { id: 'view_pending_payments', label: 'Ver pagamentos pendentes', icon: 'payment' as const, variant: 'secondary' as const },
  ],
  afterPendingPayments: [
    { id: 'mark_payments_received', label: 'Marcar como recebidos', icon: 'payment' as const, variant: 'primary' as const },
    { id: 'view_to_pack', label: 'Ver pedidos para embalar', icon: 'pack' as const, variant: 'secondary' as const },
  ],
  afterSalesStats: [
    { id: 'view_by_period', label: 'Ver por período', icon: 'stats' as const, variant: 'secondary' as const },
    { id: 'view_pending_orders', label: 'Ver pedidos pendentes', icon: 'view' as const, variant: 'secondary' as const },
    { id: 'view_lost_sales', label: 'Ver onde estou perdendo vendas', icon: 'stats' as const, variant: 'secondary' as const },
  ],
  afterShowingOrder: [
    { id: 'open_order', label: 'Abrir pedido', icon: 'navigate' as const, variant: 'primary' as const },
    { id: 'view_similar', label: 'Ver pedidos similares', icon: 'view' as const, variant: 'secondary' as const },
  ],
  afterActionComplete: [
    { id: 'view_updated_orders', label: 'Ver pedidos atualizados', icon: 'view' as const, variant: 'secondary' as const },
    { id: 'more_actions', label: 'Fazer mais ações', icon: 'pack' as const, variant: 'secondary' as const },
  ],
}

// Helper to generate context-aware suggestions based on order data
export function getSuggestedActionsForContext(
  context: 'orders_to_pack' | 'pending_payments' | 'sales_stats' | 'single_order' | 'action_complete',
  orderCount?: number
): SuggestedAction[] {
  switch (context) {
    case 'orders_to_pack':
      return orderCount && orderCount > 0 
        ? suggestedActionPresets.afterOrdersToPack 
        : suggestedActionPresets.afterPendingPayments
    case 'pending_payments':
      return suggestedActionPresets.afterPendingPayments
    case 'sales_stats':
      return suggestedActionPresets.afterSalesStats
    case 'single_order':
      return suggestedActionPresets.afterShowingOrder
    case 'action_complete':
      return suggestedActionPresets.afterActionComplete
    default:
      return []
  }
}
